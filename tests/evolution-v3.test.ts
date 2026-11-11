import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  createPreviewChainV3,
  validatePreviewChainV3,
} from '../src/art/generator/preview-chain-v3';
import { featuresOf, isAnchor } from '../src/art/generator/v3/checks';
import {
  boundSeed,
  generateArtworkV3,
  MAX_RETRY_V3,
  settingsDigest,
} from '../src/art/generator/v3/evolve';
import { featureNames } from '../src/art/generator/v3/kit';
import { validateEvolutionV3 } from '../src/art/generator/v3/provenance';
import { canonicalJson, sha256 } from '../src/art/generator/v3/sha256';
import { artworkSchema, type Artwork } from '../src/art/schema/artwork';
import {
  artworkV3Schema,
  loadCounts,
  loadLimitsV3,
  type AnyArtwork,
  type ArtworkV3,
} from '../src/art/schema/artwork-v3';
import { chainCollectionV3Schema } from '../src/art/schema/chains-v3';
import type { SettingsSnapshot } from '../src/art/schema/preview-v3';
import { defaultProfile, type Profile } from '../src/art/schema/profile';
import { generateTitle } from '../src/art/titles/generate';

const stored = chainCollectionV3Schema.parse(
  JSON.parse(readFileSync('fixtures/preview/ep01-chains.json', 'utf8')),
);
const legacyParents = (
  JSON.parse(readFileSync('fixtures/preview/phase-2.json', 'utf8')) as {
    chains: { works: unknown[] }[];
  }
).chains[0]!.works.slice(-2).map((work) => artworkSchema.parse(work));

const profileWith = (change: (profile: Profile) => void): Profile => {
  const profile = structuredClone(defaultProfile) as Profile;
  change(profile);
  return profile;
};
const allFeatures = (level: 'off' | 'always') =>
  profileWith((profile) => {
    for (const name of featureNames) profile.features[name] = level;
  });
function freezeDeep<T>(value: T): T {
  if (value && typeof value === 'object') {
    Object.freeze(value);
    Object.values(value).forEach(freezeDeep);
  }
  return value;
}
/** Input that reproduces a stored chain work from its parents. */
function inputFor(
  work: ArtworkV3,
  parents: readonly AnyArtwork[],
  usedTitles: readonly string[],
  settings: SettingsSnapshot = work.settings,
  /** Ordered history context; the parents alone are the shortest valid one. */
  history: readonly AnyArtwork[] = parents,
) {
  return {
    generation: work.generation,
    workDate: work.id,
    seed: work.seed.replace(/:settings-[\da-f]{64}$/, ''),
    settings,
    settingsRevision: work.settingsRevision,
    parents: [...parents],
    history: [...history],
    scheduledFor: work.scheduledFor,
    runStartedAt: work.runStartedAt,
    usedTitles: [...usedTitles],
  };
}
const contributions = (work: ArtworkV3) =>
  work.evolution.decisions.filter(
    (decision) => decision.operation.kind !== 'constrained',
  );
/** A child of two works of a chain under other settings. */
function childOf(
  chain: { works: ArtworkV3[] },
  index: number,
  profile: Profile,
  mode: 'traceable' | 'free' = 'traceable',
) {
  const parents = chain.works.slice(index - 2, index);
  const model = chain.works[index]!;
  return {
    parents,
    child: generateArtworkV3(
      inputFor(
        model,
        parents,
        chain.works.slice(0, index).map((work) => work.title),
        { inheritanceMode: mode, ...profile },
      ),
      () => model.generatedAt,
    ),
  };
}

// Hundreds of works per test: far above the default limit on slow runners.
describe('Generator 0.3.0: Evolution und Belege', { timeout: 120_000 }, () => {
  const [traceable, free, transition] = stored.chains as [
    (typeof stored.chains)[number],
    (typeof stored.chains)[number],
    (typeof stored.chains)[number],
  ];

  it('rechnet SHA-256 wie Node und kanonisches JSON unabhängig von der Schlüsselfolge', () => {
    for (const text of ['', 'abc', 'ä€😀', 'x'.repeat(55), 'y'.repeat(4000)])
      expect(sha256(text)).toBe(
        createHash('sha256').update(text).digest('hex'),
      );
    expect(canonicalJson({ b: 1, a: [{ d: 2, c: 3 }] })).toBe(
      '{"a":[{"c":3,"d":2}],"b":1}',
    );
  });

  it('reproduziert die gespeicherten Probeketten exakt und prüft sie streng', () => {
    expect(stored.chains.map((chain) => chain.key)).toEqual([
      'traceable',
      'free',
      'transition',
    ]);
    stored.chains.forEach(validatePreviewChainV3);
    expect(
      createPreviewChainV3({ key: 'traceable', mode: 'traceable' }),
    ).toEqual(traceable);
    expect(createPreviewChainV3({ key: 'free', mode: 'free' })).toEqual(free);
    expect(
      createPreviewChainV3({
        key: 'transition',
        mode: 'traceable',
        length: 4,
        legacyParents,
      }),
    ).toEqual(transition);
  });

  it('belegt über lange Ketten im Modus traceable jeden Elternteil sichtbar', () => {
    const heritages = new Set<string>();
    for (let index = 0; index < 8; index++) {
      const chain = createPreviewChainV3({
        key: 'traceable',
        mode: 'traceable',
        length: 25,
        prefix: `test:long:${index}`,
      });
      for (const work of chain.works) {
        expect(artworkV3Schema.safeParse(work).success).toBe(true);
        const counts = loadCounts(work.dna.elements);
        for (const key of Object.keys(
          loadLimitsV3,
        ) as (keyof typeof loadLimitsV3)[])
          expect(counts[key]).toBeLessThanOrEqual(loadLimitsV3[key]);
        expect(work.evolution.recipe.retry).toBeLessThanOrEqual(MAX_RETRY_V3);
        if (work.generation <= 2) {
          expect(work.evolution.decisions).toEqual([]);
          continue;
        }
        for (const id of work.parentIds)
          expect(
            contributions(work).some((decision) => decision.parentId === id),
          ).toBe(true);
        for (const decision of contributions(work))
          expect(
            isAnchor(work.dna, Number(decision.target.path.split('.')[1])),
          ).toBe(true);
        heritages.add(work.evolution.recipe.palette);
        for (const heritage of Object.values(work.evolution.recipe.layers))
          heritages.add(heritage);
      }
    }
    // Take over, mix and build anew all occur.
    expect([...heritages].sort()).toEqual([
      'mixed',
      'new',
      'parentA',
      'parentB',
    ]);
  });

  it('verlangt im Modus free keine Übernahme und behauptet dann auch keine', () => {
    let without = 0;
    let withEvidence = 0;
    let breaks = 0;
    for (let index = 0; index < 6; index++) {
      const chain = createPreviewChainV3({
        key: 'free',
        mode: 'free',
        length: 25,
        prefix: `test:long:${index}`,
      });
      for (const work of chain.works.slice(2)) {
        if (contributions(work).length) withEvidence++;
        else without++;
        const { recipe } = work.evolution;
        if (
          recipe.palette === 'new' &&
          Object.values(recipe.layers).every((heritage) => heritage === 'new')
        ) {
          breaks++;
          expect(contributions(work)).toEqual([]);
        }
      }
    }
    expect(without).toBeGreaterThan(0);
    expect(withEvidence).toBeGreaterThan(0);
    expect(breaks).toBeGreaterThan(0);
  });

  it('ist deterministisch, lässt Eingaben unverändert und trennt die Uhrzeit ab', () => {
    for (const chain of [traceable, free]) {
      const index = 5;
      const work = chain.works[index]!;
      const input = freezeDeep(
        structuredClone(
          inputFor(
            work,
            chain.works.slice(index - 2, index),
            chain.works.slice(0, index).map((entry) => entry.title),
            work.settings,
            chain.works.slice(0, index),
          ),
        ),
      );
      const first = generateArtworkV3(input, () => work.generatedAt);
      expect(JSON.stringify(first)).toBe(JSON.stringify(work));
      const later = generateArtworkV3(input, () => '2031-05-05T10:00:00Z');
      expect({ ...later, generatedAt: work.generatedAt }).toEqual(work);
      expect(JSON.stringify(first).includes('-0,')).toBe(false);
    }
  });

  it('bindet den Seed an den vollständigen Einstellungssnapshot (A-29)', () => {
    const index = 4;
    const work = traceable.works[index]!;
    const parents = traceable.works.slice(index - 2, index);
    const titles = traceable.works.slice(0, index).map((entry) => entry.title);
    const digest = settingsDigest(work.settings, work.settingsRevision);
    expect(work.seed).toBe(
      boundSeed(`evolvera:ep01:chain:traceable:${work.generation}`, digest),
    );
    // One changed switch that the revision does not show: another work.
    const changed = structuredClone(work.settings);
    changed.composition.density = 'dense';
    const other = generateArtworkV3(
      inputFor(work, parents, titles, changed),
      () => work.generatedAt,
    );
    expect(other.seed).not.toBe(work.seed);
    expect(other.dna).not.toEqual(work.dna);
    expect(other.settings).toEqual(changed);
    // The same settings under another revision also count as another run.
    expect(settingsDigest(work.settings, 2)).not.toBe(digest);
    // A snapshot edited after the fact no longer fits the seed.
    const forged = structuredClone(work);
    forged.settings.variation.mutationStrength = 'wild';
    expect(() => validateEvolutionV3(forged, parents)).toThrow(
      'Seed und Einstellungssnapshot gehören nicht zusammen.',
    );
  });

  it('erzeugt das vollständige Werk mit Titelgenerator und Ähnlichkeitsvermerk', () => {
    const index = 3;
    const work = traceable.works[index]!;
    const parents = traceable.works.slice(index - 2, index);
    expect(work.schemaVersion).toBe(3);
    expect(work.generatorVersion).toBe('0.3.0');
    expect(work.rendererVersion).toBe('2');
    expect(work.lexiconVersion).toBe('0.2.0');
    expect(work.settings).toEqual({
      inheritanceMode: 'traceable',
      ...defaultProfile,
    });
    // The first work of a chain has an empty window: no distance to claim.
    expect(traceable.works[0]!.novelty).toEqual({
      distanceVersion: 1,
      contextDigest: sha256('{"distanceVersion":1,"window":[]}'),
      distance: null,
      minimumReached: true,
    });
    expect(work.novelty.distance).toBeGreaterThanOrEqual(0);
    const title = generateTitle({
      seed: `evolvera:ep01:chain:traceable:${work.generation}:${work.generation}`,
      lexiconVersion: '0.2.0',
      parents: parents.map(({ id, title }) => ({ id, title })),
      usedTitles: traceable.works.slice(0, index).map((entry) => entry.title),
    });
    expect(work.title).toBe(title.title);
    expect(work.titleDna.parentFragments).toEqual(title.parentFragments);
    expect(traceable.works[0]!.evolution.type).toBe('origin');
    expect(traceable.works[0]!.evolution.recipe.palette).toBe('new');
  });

  it('verwirft fehlende, vertauschte und falsche Eltern', () => {
    const work = traceable.works[4]!;
    const parents = traceable.works.slice(2, 4);
    const titles = traceable.works.slice(0, 4).map((entry) => entry.title);
    const clock = () => work.generatedAt;
    expect(() =>
      generateArtworkV3(inputFor(work, [parents[0]!], titles), clock),
    ).toThrow();
    expect(() =>
      generateArtworkV3(inputFor(work, [...parents].reverse(), titles), clock),
    ).toThrow();
    expect(() =>
      generateArtworkV3(
        inputFor(work, traceable.works.slice(1, 3), titles),
        clock,
      ),
    ).toThrow();
    expect(() => validateEvolutionV3(work, [...parents].reverse())).toThrow();
    expect(() =>
      validateEvolutionV3(work, traceable.works.slice(1, 3)),
    ).toThrow();
  });

  it('erkennt erfundene Quellen, falsche Operatoren und fehlende Beiträge', () => {
    const work = traceable.works[5]!;
    const parents = traceable.works.slice(3, 5);
    expect(validateEvolutionV3(work, parents)).toEqual(work);
    const invented = structuredClone(work);
    const first = invented.evolution.decisions[0]!;
    first.source.value =
      typeof first.source.value === 'number' ? 0.123456 : '#123456';
    expect(() => validateEvolutionV3(invented, parents)).toThrow();
    const foreign = structuredClone(work);
    foreign.evolution.decisions[0]!.source.path = 'elements.999.width';
    expect(() => validateEvolutionV3(foreign, parents)).toThrow();
    const offset = structuredClone(work);
    const numeric = offset.evolution.decisions.find(
      (decision) => typeof decision.target.value === 'number',
    )!;
    numeric.operation = { kind: 'offset', amount: 0.5 };
    expect(() => validateEvolutionV3(offset, parents)).toThrow(
      'Numerischer Mutationsoperator belegt den Zielwert nicht.',
    );
    const missing = structuredClone(work);
    missing.evolution.decisions = missing.evolution.decisions.filter(
      (decision) => decision.parentId !== work.parentIds[1],
    );
    expect(() => validateEvolutionV3(missing, parents)).toThrow();
    // Kerngene allein beweisen nichts: a layer family is no contribution.
    const core = structuredClone(work);
    const layer = Object.keys(core.dna.layers)[0]!;
    const family = core.dna.layers[layer as 'structure']!.family;
    core.evolution.decisions = work.parentIds.map((parentId) => ({
      parentId,
      source: { path: `layers.${layer}.family`, value: family },
      target: { path: `layers.${layer}.family`, value: family },
      operation: { kind: 'copy' as const },
    }));
    expect(() => validateEvolutionV3(core, parents)).toThrow();
  });

  it('erkennt überdeckte und unsichtbar gemachte Beiträge', () => {
    const work = traceable.works[5]!;
    const parents = traceable.works.slice(3, 5);
    const target = Number(contributions(work)[0]!.target.path.split('.')[1]);
    const carrier = work.dna.elements[target]!;
    const covered = structuredClone(work);
    covered.dna.elements.push({
      kind: 'rectangle',
      layer: covered.dna.elements.at(-1)!.layer,
      x: carrier.x,
      y: carrier.y,
      width: carrier.width,
      height: carrier.height,
      rotation: 0,
      opacity: 1,
      fill: { kind: 'solid', color: covered.dna.background },
      motion: { kind: 'static', durationSeconds: 30, amplitude: 0 },
    });
    expect(isAnchor(covered.dna, target)).toBe(false);
    expect(() => validateEvolutionV3(covered, parents)).toThrow(/sichtbar/);
    for (const change of [
      (element: Record<string, unknown>) => (element.rotation = 20),
      (element: Record<string, unknown>) =>
        (element.effects = { blend: 'multiply' }),
      (element: Record<string, unknown>) =>
        (element.motion = {
          kind: 'float',
          durationSeconds: 30,
          amplitude: 0.05,
        }),
    ]) {
      const hidden = structuredClone(work);
      change(hidden.dna.elements[target] as Record<string, unknown>);
      expect(() => validateEvolutionV3(hidden, parents)).toThrow(/sichtbar/);
    }
  });

  it('wandelt mit „off“ geerbte Merkmale um und belegt das mit constrained (A-30)', () => {
    let converted = 0;
    const rules = new Set<string>();
    for (const chain of [traceable, free])
      for (let index = 2; index < chain.works.length; index++) {
        const { child, parents } = childOf(chain, index, allFeatures('off'));
        expect(validateEvolutionV3(child, parents)).toEqual(child);
        expect(Object.values(featuresOf(child.dna)).some(Boolean)).toBe(false);
        expect(
          child.dna.elements.every((element) =>
            ['rectangle', 'circle', 'ellipse', 'blob'].includes(element.kind),
          ),
        ).toBe(true);
        // Even under the strictest profile both parents contribute visibly.
        for (const id of child.parentIds)
          expect(
            contributions(child).some((decision) => decision.parentId === id),
          ).toBe(true);
        for (const decision of child.evolution.decisions) {
          if (decision.operation.kind !== 'constrained') continue;
          converted++;
          rules.add(decision.operation.rule);
          expect(decision.operation.rule).toMatch(/^features\.\w+=off$/);
          expect(decision.source.value).not.toBe(decision.target.value);
        }
      }
    expect(converted).toBeGreaterThan(0);
    expect(rules.has('features.gradients=off')).toBe(true);
    // A conversion that cites a rule which does not hold is rejected.
    const { child, parents } = childOf(traceable, 4, allFeatures('off'));
    const forged = structuredClone(child);
    forged.settings.features.lines = 'normal';
    forged.seed = boundSeed(
      forged.seed.replace(/:settings-[\da-f]{64}$/, ''),
      settingsDigest(forged.settings, forged.settingsRevision),
    );
    const cited = forged.evolution.decisions.find(
      (decision) => decision.operation.kind === 'constrained',
    );
    if (cited && cited.operation.kind === 'constrained') {
      cited.operation.rule = 'features.lines=off';
      expect(() => validateEvolutionV3(forged, parents)).toThrow(
        'Umwandlung beruft sich auf eine Regel, die nicht gilt.',
      );
    }
  });

  it('erzwingt mit „always“ jedes Merkmal auch im Kind (A-30)', () => {
    for (const chain of [traceable, free])
      for (let index = 2; index < chain.works.length; index++) {
        const { child, parents } = childOf(chain, index, allFeatures('always'));
        expect(validateEvolutionV3(child, parents)).toEqual(child);
        expect(Object.values(featuresOf(child.dna)).every(Boolean)).toBe(true);
      }
    // A work that lacks a demanded feature is rejected.
    const work = structuredClone(traceable.works[0]!);
    const missing = featureNames.find((name) => !featuresOf(work.dna)[name])!;
    work.settings.features[missing] = 'always';
    work.seed = boundSeed(
      work.seed.replace(/:settings-[\da-f]{64}$/, ''),
      settingsDigest(work.settings, work.settingsRevision),
    );
    expect(() => validateEvolutionV3(work, [])).toThrow(/Verlangtes Merkmal/);
  });

  it('beachtet Familien und Ebenenzahl der Einstellungen bei geerbten Ebenen', () => {
    const only = profileWith((profile) => {
      for (const key of Object.keys(
        profile.families,
      ) as (keyof Profile['families'])[])
        profile.families[key] = key === 'mosaic';
      profile.composition.maxLayers = 1;
    });
    for (let index = 2; index < traceable.works.length; index++) {
      const { child, parents } = childOf(traceable, index, only);
      expect(validateEvolutionV3(child, parents)).toEqual(child);
      expect(child.dna.layers).toEqual({ structure: { family: 'mosaic' } });
    }
  });

  it('liest alte Eltern im Schema 2 nur im Speicher und belegt ihre alten Pfade', () => {
    const before = JSON.stringify(legacyParents);
    const chain = createPreviewChainV3({
      key: 'transition',
      mode: 'traceable',
      length: 4,
      legacyParents: freezeDeep(structuredClone(legacyParents)) as Artwork[],
    });
    expect(JSON.stringify(legacyParents)).toBe(before);
    const [first, second, third] = chain.works;
    expect(first!.generation).toBe(legacyParents[1]!.generation + 1);
    expect(first!.parentIds).toEqual(legacyParents.map((parent) => parent.id));
    // Both old parents, then one old and one new, then two new ones.
    expect(second!.parentIds).toEqual([legacyParents[1]!.id, first!.id]);
    expect(third!.parentIds).toEqual([first!.id, second!.id]);
    for (const decision of contributions(first!))
      expect(decision.source.path).toMatch(
        /^elements\.\d+\.(color|x|y|width|height)$/,
      );
    for (const id of first!.parentIds)
      expect(
        contributions(first!).some((decision) => decision.parentId === id),
      ).toBe(true);
    // No padding of the old evidence blocks is carried over.
    expect(
      first!.dna.elements.some(
        (element) =>
          element.fill.kind === 'solid' &&
          element.fill.color === first!.dna.background,
      ),
    ).toBe(false);
    // The same works in the mode free.
    expect(() =>
      createPreviewChainV3({
        key: 'transition',
        mode: 'free',
        length: 4,
        legacyParents,
      }),
    ).not.toThrow();
  });

  it('verändert mit höherer Mutationsstärke mehr und springt nur auf Wunsch', () => {
    const kept = (strength: Profile['variation']['mutationStrength']) => {
      let same = 0;
      let total = 0;
      for (let index = 0; index < 6; index++) {
        const chain = createPreviewChainV3({
          key: 'traceable',
          mode: 'traceable',
          length: 12,
          prefix: `test:strength:${index}`,
          profile: profileWith((profile) => {
            profile.variation.mutationStrength = strength;
          }),
        });
        chain.works.slice(2).forEach((work, offset) => {
          const boxes = new Set(
            chain.works
              .slice(offset, offset + 2)
              .flatMap((parent) => parent.dna.elements)
              .map((e) => `${e.x}:${e.y}:${e.width}:${e.height}`),
          );
          const inheritedLayers = Object.entries(work.evolution.recipe.layers)
            .filter(([, heritage]) => heritage !== 'new')
            .map(([name]) => name);
          for (const e of work.dna.elements) {
            if (!inheritedLayers.includes(e.layer)) continue;
            total++;
            if (boxes.has(`${e.x}:${e.y}:${e.width}:${e.height}`)) same++;
          }
        });
      }
      return same / total;
    };
    expect(kept('calm')).toBeGreaterThan(kept('wild') + 0.2);

    const jumps = (mutationJumps: boolean) => {
      let count = 0;
      for (let index = 0; index < 5; index++)
        for (const work of createPreviewChainV3({
          key: 'traceable',
          mode: 'traceable',
          length: 25,
          prefix: `test:jump:${index}`,
          profile: profileWith((profile) => {
            profile.experimental.mutationJumps = mutationJumps;
          }),
        }).works)
          if (work.evolution.recipe.mutationJump) {
            count++;
            expect(work.evolution.recipe.palette).toBe('new');
          }
      return count;
    };
    expect(jumps(false)).toBe(0);
    expect(jumps(true)).toBeGreaterThan(0);
  });
});
