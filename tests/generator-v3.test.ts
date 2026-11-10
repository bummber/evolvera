import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { featuresOf, findAnchor } from '../src/art/generator/v3/checks';
import { frequencyChance } from '../src/art/generator/v3/compose';
import { generateOriginV3, MAX_RETRY } from '../src/art/generator/v3/index';
import { featureNames, mirror } from '../src/art/generator/v3/kit';
import {
  dnaV3Schema,
  layerNames,
  loadCounts,
  loadLimitsV3,
} from '../src/art/schema/artwork-v3';
import {
  originStudySchema,
  type SettingsSnapshot,
} from '../src/art/schema/preview-v3';
import {
  defaultProfile,
  familyKeys,
  paletteStrategySchema,
  type Profile,
} from '../src/art/schema/profile';

const standard: SettingsSnapshot = {
  inheritanceMode: 'traceable',
  ...structuredClone(defaultProfile),
};
const withProfile = (change: (profile: Profile) => void): SettingsSnapshot => {
  const settings = structuredClone(standard);
  change(settings);
  return settings;
};
const allFeatures = (level: 'off' | 'always') =>
  withProfile((profile) => {
    for (const name of featureNames) profile.features[name] = level;
    profile.composition.symmetry = level;
  });
const study = (seed: string, settings = standard) =>
  generateOriginV3({ seed, settings });

/** Every hard promise of one study. */
function expectValid(work: ReturnType<typeof study>) {
  expect(originStudySchema.safeParse(work).success).toBe(true);
  expect(dnaV3Schema.safeParse(work.dna).success).toBe(true);
  const counts = loadCounts(work.dna.elements);
  for (const key of Object.keys(loadLimitsV3) as (keyof typeof loadLimitsV3)[])
    expect(counts[key]).toBeLessThanOrEqual(loadLimitsV3[key]);
  expect(findAnchor(work.dna)).toBeGreaterThanOrEqual(0);
  const drawn = Object.fromEntries(
    featureNames.map((name) => [name, work.recipe.features[name]]),
  );
  expect(featuresOf(work.dna)).toEqual(drawn);
  expect(work.retry).toBeLessThanOrEqual(MAX_RETRY);
}

// Thousands of works per test: far above the default limit on slow runners.
describe('Generator 0.3.0: Ursprungswerke', { timeout: 120_000 }, () => {
  it('ist deterministisch und unterscheidet Seeds', () => {
    for (let index = 0; index < 40; index++) {
      const seed = `determinism:${index}`;
      expect(study(seed)).toEqual(study(seed));
      // Byte-identical, including the order of keys.
      expect(JSON.stringify(study(seed))).toBe(JSON.stringify(study(seed)));
    }
    expect(study('a').dna).not.toEqual(study('b').dna);
    expect(JSON.stringify(study('zero')).includes('-0')).toBe(false);
  });

  it('schreibt den vollständigen Einstellungssnapshot ins Werk', () => {
    const work = study('snapshot');
    expect(work.settings).toEqual(standard);
    expect(work.generatorVersion).toBe('0.3.0');
    expect(work.rendererVersion).toBe('2');
    const calm = withProfile((profile) => {
      profile.composition.density = 'sparse';
    });
    expect(study('snapshot', calm).settings).toEqual(calm);
  });

  it('hält über 1500 Seeds Schema, Lastgrenzen, Anker und Merkmale ein', () => {
    const seen = {
      families: new Set<string>(),
      strategies: new Set<string>(),
      layers: new Set<number>(),
      kinds: new Set<string>(),
      fills: new Set<string>(),
      anchors: new Set<string>(),
    };
    for (let index = 0; index < 1500; index++) {
      const work = study(`standard:${index}`);
      expectValid(work);
      const used = layerNames.filter((name) => work.dna.layers[name]);
      seen.layers.add(used.length);
      for (const name of used) seen.families.add(work.dna.layers[name]!.family);
      seen.strategies.add(work.recipe.paletteStrategy);
      seen.anchors.add(work.recipe.anchor);
      for (const element of work.dna.elements) {
        seen.kinds.add(element.kind);
        seen.fills.add(
          element.fill.kind === 'pattern'
            ? element.fill.pattern
            : element.fill.kind,
        );
      }
    }
    expect([...seen.families].sort()).toEqual([...familyKeys].sort());
    expect([...seen.strategies].sort()).toEqual(
      [...paletteStrategySchema.options].sort(),
    );
    expect([...seen.layers].sort()).toEqual([1, 2, 3]);
    expect([...seen.kinds].sort()).toEqual(
      [
        'arc',
        'blob',
        'circle',
        'ellipse',
        'line',
        'path',
        'polygon',
        'rectangle',
        'ring',
      ].sort(),
    );
    expect([...seen.fills].sort()).toEqual(
      [
        'checker',
        'conic',
        'dots',
        'grid',
        'linear',
        'radial',
        'rings',
        'solid',
        'stripes',
        'truchet',
      ].sort(),
    );
  });

  it('trifft die Häufigkeitsstufen 15 % / 40 % / 70 % im Richtbereich', () => {
    expect(frequencyChance).toEqual({
      off: 0,
      rare: 0.15,
      normal: 0.4,
      often: 0.7,
      always: 1,
    });
    const total = 2000;
    const count = (settings: SettingsSnapshot, prefix: string) => {
      const hits: Record<string, number> = {};
      for (let index = 0; index < total; index++)
        for (const [name, drawn] of Object.entries(
          study(`${prefix}:${index}`, settings).recipe.features,
        ))
          if (drawn) hits[name] = (hits[name] ?? 0) + 1;
      return hits;
    };
    const hits = count(standard, 'frequency');
    // Guide ranges of EP-01 section 4: rare 10–20 %, normal 35–50 %.
    for (const name of ['masks', 'blendModes', 'blurShadow', 'curves'])
      expect(hits[name]! / total, name).toBeGreaterThan(0.1);
    for (const name of [
      'masks',
      'blendModes',
      'blurShadow',
      'curves',
      'generativeShapes',
    ])
      expect(hits[name]! / total, name).toBeLessThan(0.2);
    for (const name of [
      'gradients',
      'patterns',
      'lines',
      'animation',
      'symmetry',
    ]) {
      expect(hits[name]! / total, name).toBeGreaterThan(0.35);
      expect(hits[name]! / total, name).toBeLessThan(0.5);
    }
    const often = count(
      withProfile((profile) => {
        profile.features.gradients = 'often';
      }),
      'frequency',
    );
    expect(often.gradients! / total).toBeGreaterThan(0.65);
    expect(often.gradients! / total).toBeLessThan(0.8);
  });

  it('schließt mit „off“ jedes Merkmal aus und erzwingt es mit „always“', () => {
    for (let index = 0; index < 300; index++) {
      const none = study(`off:${index}`, allFeatures('off'));
      expectValid(none);
      expect(Object.values(none.recipe.features).some(Boolean)).toBe(false);
      expect(
        none.dna.elements.every(
          (element) =>
            ['rectangle', 'circle', 'ellipse', 'blob'].includes(element.kind) &&
            element.fill.kind === 'solid' &&
            element.effects === undefined &&
            element.motion.kind === 'static',
        ),
      ).toBe(true);
      const all = study(`always:${index}`, allFeatures('always'));
      expectValid(all);
      expect(Object.values(all.recipe.features).every(Boolean)).toBe(true);
    }
  });

  it.each(familyKeys)('erzeugt Werke nur aus der Familie %s', (family) => {
    const settings = withProfile((profile) => {
      for (const key of familyKeys) profile.families[key] = key === family;
    });
    for (let index = 0; index < 150; index++) {
      const work = study(`family:${index}`, settings);
      expectValid(work);
      for (const name of layerNames)
        if (work.dna.layers[name])
          expect(work.dna.layers[name].family).toBe(family);
    }
  });

  it('beachtet Ebenenzahl, Palettenstrategie, Dichte und Bewegung', () => {
    const single = withProfile((profile) => {
      profile.composition.maxLayers = 1;
      profile.palette.strategies = ['monochrome'];
    });
    const size = (density: 'sparse' | 'dense') => {
      let elements = 0;
      for (let index = 0; index < 200; index++)
        elements += study(
          `density:${index}`,
          withProfile((profile) => {
            profile.composition.density = density;
          }),
        ).dna.elements.length;
      return elements;
    };
    for (let index = 0; index < 100; index++) {
      const work = study(`single:${index}`, single);
      expect(Object.keys(work.dna.layers)).toEqual(['structure']);
      expect(work.recipe.paletteStrategy).toBe('monochrome');
    }
    expect(size('dense')).toBeGreaterThan(size('sparse') * 1.3);
    const amplitude = (intensity: 'subtle' | 'strong') => {
      const values = Array.from({ length: 100 }, (_, index) =>
        study(
          `motion:${index}`,
          withProfile((profile) => {
            profile.features.animation = 'always';
            profile.motion.intensity = intensity;
          }),
        ),
      ).flatMap((work) =>
        work.dna.elements
          .filter((element) => element.motion.kind !== 'static')
          .map((element) => element.motion.amplitude),
      );
      return Math.max(...values);
    };
    expect(amplitude('subtle')).toBeLessThanOrEqual(0.025);
    expect(amplitude('strong')).toBeGreaterThan(0.04);
  });

  it('spiegelt symmetrische Werke an der senkrechten Mittelachse', () => {
    const settings = withProfile((profile) => {
      profile.composition.symmetry = 'always';
      profile.composition.maxLayers = 1;
    });
    for (let index = 0; index < 100; index++) {
      const work = study(`symmetry:${index}`, settings);
      expect(work.recipe.features.symmetry).toBe(true);
      // Apart from a single anchor on the axis, every element has a twin or
      // sits centred on the axis.
      const unmatched = work.dna.elements.filter((element) => {
        const twin = mirror(element);
        return !work.dna.elements.some(
          (other) =>
            other.kind === twin.kind &&
            Math.abs(other.x - twin.x) < 1e-4 &&
            other.y === twin.y &&
            other.width === twin.width,
        );
      });
      expect(unmatched).toEqual([]);
    }
  });

  it('spiegelt jede Elementart umkehrbar', () => {
    const work = study('always:1', allFeatures('always'));
    for (const element of work.dna.elements)
      expect(mirror(mirror(element))).toEqual(element);
  });

  it('lehnt unvollständige und unmögliche Einstellungen ab', () => {
    expect(() => generateOriginV3({ seed: 'x' })).toThrow();
    expect(() =>
      study(
        'x',
        withProfile((profile) => {
          for (const key of familyKeys) profile.families[key] = false;
        }),
      ),
    ).toThrow();
    expect(() =>
      study(
        'x',
        withProfile((profile) => {
          profile.palette.strategies = [];
        }),
      ),
    ).toThrow();
  });

  it('bleibt frei von React-, Browser- und Zeitabhängigkeiten', () => {
    const directory = join(process.cwd(), 'src/art/generator/v3');
    for (const file of readdirSync(directory)) {
      const source = readFileSync(join(directory, file), 'utf8');
      expect(source, file).not.toMatch(
        /from 'react|document\.|window\.|Math\.random|Date\.|new Date/,
      );
    }
  });
});
