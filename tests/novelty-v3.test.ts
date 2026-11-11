import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  extremeProfiles,
  simulateNovelty,
} from '../src/art/generator/novelty-simulation';
import { createPreviewChainV3 } from '../src/art/generator/preview-chain-v3';
import { featuresOf, findAnchor } from '../src/art/generator/v3/checks';
import {
  contextDigest,
  distance,
  distanceParts,
  DISTANCE_WEIGHTS,
  distanceToWindow,
  hexToOklab,
  NOVELTY_MINIMUM,
  noveltyWindow,
  signatureOf,
  signatureOfDna,
} from '../src/art/generator/v3/distance';
import {
  generateArtworkV3,
  MAX_RETRY_V3,
} from '../src/art/generator/v3/evolve';
import { featureNames } from '../src/art/generator/v3/kit';
import { validateEvolutionV3 } from '../src/art/generator/v3/provenance';
import { artworkSchema } from '../src/art/schema/artwork';
import {
  loadCounts,
  loadLimitsV3,
  type AnyArtwork,
  type ArtworkV3,
} from '../src/art/schema/artwork-v3';
import { chainCollectionV3Schema } from '../src/art/schema/chains-v3';
import { defaultProfile, type Profile } from '../src/art/schema/profile';
import { scheduledFor } from '../src/series/calendar';

const stored = chainCollectionV3Schema.parse(
  JSON.parse(readFileSync('fixtures/preview/ep01-chains.json', 'utf8')),
);
const [traceable, free, transition] = stored.chains as [
  (typeof stored.chains)[number],
  (typeof stored.chains)[number],
  (typeof stored.chains)[number],
];
const legacy = (
  JSON.parse(readFileSync('fixtures/preview/phase-2.json', 'utf8')) as {
    chains: { works: unknown[] }[];
  }
).chains[0]!.works.map((work) => artworkSchema.parse(work));

/** Input that reproduces work `index` of a stored chain. */
function inputAt(chain: { works: ArtworkV3[] }, index: number) {
  const work = chain.works[index]!;
  const before = chain.works.slice(0, index);
  return {
    generation: work.generation,
    workDate: work.id,
    seed: work.seed.replace(/:settings-[\da-f]{64}$/, ''),
    settings: work.settings,
    settingsRevision: work.settingsRevision,
    parents: work.generation <= 2 ? [] : before.slice(-2),
    history: before as AnyArtwork[],
    scheduledFor: work.scheduledFor,
    runStartedAt: work.runStartedAt,
    usedTitles: before.map((entry) => entry.title),
  };
}

describe('Abstandsmaß Version 1', () => {
  const works = [...traceable.works, ...free.works];
  const signatures = works.map(signatureOf);

  it('gewichtet sechs Merkmale zu einem Abstand zwischen 0 und 1', () => {
    expect(
      Object.values(DISTANCE_WEIGHTS).reduce((sum, weight) => sum + weight, 0),
    ).toBeCloseTo(1, 12);
    for (const a of signatures) {
      expect(distance(a, a)).toBe(0);
      for (const b of signatures) {
        const value = distance(a, b);
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThanOrEqual(1);
        expect(value).toBe(distance(b, a));
        for (const part of Object.values(distanceParts(a, b))) {
          expect(part).toBeGreaterThanOrEqual(0);
          expect(part).toBeLessThanOrEqual(1);
        }
      }
    }
  });

  it('rechnet Farben in OKLab um', () => {
    const white = hexToOklab('#ffffff');
    const black = hexToOklab('#000000');
    const red = hexToOklab('#ff0000');
    expect(white[0]).toBeCloseTo(1, 4);
    expect(white[1]).toBeCloseTo(0, 4);
    expect(black[0]).toBe(0);
    // Reference values of OKLab for sRGB red.
    expect(red[0]).toBeCloseTo(0.628, 3);
    expect(red[1]).toBeCloseTo(0.2249, 3);
    expect(red[2]).toBeCloseTo(0.1258, 3);
  });

  it('reagiert auf jedes Merkmal einzeln', () => {
    const work = traceable.works.find(
      (entry) =>
        entry.dna.elements.length >= 4 &&
        entry.dna.elements.length <= 60 &&
        entry.dna.elements.some((element) => element.fill.kind === 'solid'),
    )!;
    const own = signatureOfDna(work.dna);
    const changed = (change: (dna: ArtworkV3['dna']) => void) => {
      const dna = structuredClone(work.dna);
      change(dna);
      return distanceParts(own, signatureOfDna(dna));
    };
    const only = (
      parts: ReturnType<typeof distanceParts>,
      names: (keyof typeof DISTANCE_WEIGHTS)[],
    ) => {
      for (const [name, value] of Object.entries(parts))
        if (names.includes(name as keyof typeof DISTANCE_WEIGHTS))
          expect(value, name).toBeGreaterThan(0);
        else expect(value, name).toBe(0);
    };
    only(
      changed((dna) => {
        const name = Object.keys(dna.layers)[0] as keyof typeof dna.layers;
        dna.layers[name] = {
          family: dna.layers[name]!.family === 'mosaic' ? 'organic' : 'mosaic',
        };
      }),
      ['families'],
    );
    only(
      changed((dna) => {
        dna.background = dna.background === '#ffffff' ? '#000000' : '#ffffff';
      }),
      ['palette'],
    );
    only(
      changed((dna) => {
        const element = dna.elements.find(
          (entry) => entry.kind === 'rectangle' || entry.kind === 'circle',
        )!;
        element.kind = element.kind === 'circle' ? 'rectangle' : 'circle';
      }),
      ['kinds'],
    );
    only(
      changed((dna) => {
        dna.elements.push(
          ...structuredClone(dna.elements),
          ...structuredClone(dna.elements),
        );
      }),
      ['density'],
    );
    only(
      changed((dna) => {
        const element = dna.elements[0]!;
        element.motion.kind =
          element.motion.kind === 'static' ? 'float' : 'static';
      }),
      ['motion'],
    );
    const fills = changed((dna) => {
      const element = dna.elements.find(
        (entry) => entry.fill.kind === 'solid',
      )!;
      const color = (element.fill as { color: string }).color;
      element.fill = {
        kind: 'pattern',
        pattern: 'dots',
        angle: 0,
        period: 0.2,
        foreground: color,
        background: color,
      };
    });
    expect(fills.fills).toBeGreaterThan(0);
    expect(fills.kinds).toBe(0);
  });

  it('misst auch Werke im Schema 2, ohne sie zu verändern', () => {
    const before = JSON.stringify(legacy);
    const old = legacy.map(signatureOf);
    for (const signature of old) {
      expect(Object.keys(signature.families)).toEqual(['structure']);
      for (const other of signatures) {
        const value = distance(signature, other);
        expect(value).toBeGreaterThan(0);
        expect(value).toBeLessThanOrEqual(1);
      }
    }
    expect(distance(old[0]!, old[0]!)).toBe(0);
    expect(JSON.stringify(legacy)).toBe(before);
    // The transition chain measures its first works against old parents.
    expect(transition.works[0]!.novelty.distance).toBe(
      distanceToWindow(
        signatureOf(transition.works[0]!),
        transition.legacyParents.map(signatureOf),
      ),
    );
  });
});

// Hundreds of works per test: far above the default limit on slow runners.
describe('Ähnlichkeitsfenster', { timeout: 300_000 }, () => {
  it('nimmt die letzten N Werke der Kette, bei kürzeren Ketten alle', () => {
    expect(noveltyWindow(traceable.works, 7)).toEqual(traceable.works.slice(3));
    expect(noveltyWindow(traceable.works.slice(0, 3), 7)).toHaveLength(3);
    expect(noveltyWindow([], 7)).toEqual([]);
    for (const chain of [traceable, free])
      chain.works.forEach((work, index) => {
        const window = noveltyWindow(
          chain.works.slice(0, index),
          work.settings.variation.noveltyWindow,
        );
        expect(window.length).toBe(Math.min(index, 7));
        expect(work.novelty.contextDigest).toBe(contextDigest(window));
        expect(work.novelty.distance).toBe(
          distanceToWindow(signatureOf(work), window.map(signatureOf)),
        );
        expect(work.novelty.minimumReached).toBe(
          index === 0 || work.novelty.distance! >= NOVELTY_MINIMUM,
        );
      });
    // A smaller window in the profile looks at fewer works.
    const narrow = createPreviewChainV3({
      key: 'traceable',
      mode: 'traceable',
      length: 6,
      profile: {
        ...structuredClone(defaultProfile),
        variation: { mutationStrength: 'medium', noveltyWindow: 2 },
      } as Profile,
    });
    expect(narrow.works[5]!.novelty.contextDigest).toBe(
      contextDigest(narrow.works.slice(3, 5)),
    );
  });

  it('bindet den Digest an Reihenfolge, Kennung und DNA der Fensterwerke', () => {
    const window = traceable.works.slice(0, 3);
    const digest = contextDigest(window);
    expect(contextDigest(structuredClone(window))).toBe(digest);
    expect(contextDigest([...window].reverse())).not.toBe(digest);
    expect(contextDigest(window.slice(1))).not.toBe(digest);
    const touched = structuredClone(window);
    touched[1]!.dna.elements[0]!.opacity = 0.123456;
    expect(contextDigest(touched)).not.toBe(digest);
    // Metadata outside the DNA is no part of the context.
    const renamed = structuredClone(window);
    renamed[1]!.title = 'Anderer Titel';
    expect(contextDigest(renamed)).toBe(digest);
  });

  it('ist mit Historienkontext deterministisch; neue Historie ändert den Digest, alte Werke nicht', () => {
    for (const chain of [traceable, free]) {
      const index = 8;
      const work = chain.works[index]!;
      const input = inputAt(chain, index);
      const frozen = JSON.stringify(input);
      const again = generateArtworkV3(input, () => work.generatedAt);
      expect(JSON.stringify(again)).toBe(JSON.stringify(work));
      expect(JSON.stringify(input)).toBe(frozen);

      // Works archived later do not reach back: every earlier work is still
      // reproduced from its own, shorter history.
      for (let earlier = 0; earlier < index; earlier++)
        expect(
          generateArtworkV3(
            inputAt(chain, earlier),
            () => chain.works[earlier]!.generatedAt,
          ),
        ).toEqual(chain.works[earlier]);

      // Another history of the same parents: another digest. The work is
      // still one of the same deterministic candidates.
      const short = generateArtworkV3(
        { ...input, history: input.parents },
        () => work.generatedAt,
      );
      expect(short.novelty.contextDigest).toBe(contextDigest(input.parents));
      expect(short.novelty.contextDigest).not.toBe(work.novelty.contextDigest);
      expect(short.seed).toBe(work.seed);
      expect(short.title).toBe(work.title);
      const retries: number[] = [];
      generateArtworkV3(input, () => work.generatedAt, {
        minimum: 2,
        observe: ({ retry }) => retries.push(retry),
      });
      expect(retries).toContain(short.evolution.recipe.retry);
      if (short.evolution.recipe.retry === work.evolution.recipe.retry)
        expect(short.dna).toEqual(work.dna);
    }
  });

  it('prüft den Vermerk streng gegen die Historie', () => {
    const index = 6;
    const work = traceable.works[index]!;
    const before = traceable.works.slice(0, index);
    const parents = before.slice(-2);
    expect(validateEvolutionV3(work, parents, before)).toEqual(work);
    // Without history only the consistency of the record can be checked.
    expect(validateEvolutionV3(work, parents)).toEqual(work);
    expect(() => validateEvolutionV3(work, parents, parents)).toThrow(
      'Kontextdigest passt nicht zum Historienkontext.',
    );
    expect(() =>
      validateEvolutionV3(work, parents, before.slice(0, -1)),
    ).toThrow(/Historienkontext/);
    expect(() =>
      validateEvolutionV3(work, parents, [...before].reverse()),
    ).toThrow(/Historienkontext/);
    const closer = structuredClone(work);
    closer.novelty.distance = work.novelty.distance! + 0.1;
    expect(() => validateEvolutionV3(closer, parents, before)).toThrow(
      'Gespeicherter Abstand passt nicht zum Historienkontext.',
    );
    const hidden = structuredClone(work);
    hidden.novelty.minimumReached = false;
    expect(() => validateEvolutionV3(hidden, parents)).toThrow(
      'Vermerk zum Mindestabstand passt nicht zum gespeicherten Abstand.',
    );
    const claimed = structuredClone(work);
    claimed.novelty.distance = 0.001;
    expect(() => validateEvolutionV3(claimed, parents)).toThrow(
      'Vermerk zum Mindestabstand',
    );
  });

  it('verlangt eine lückenlose, geordnete Historie, die mit den Eltern endet', () => {
    const index = 6;
    const work = traceable.works[index]!;
    const input = inputAt(traceable, index);
    const clock = () => work.generatedAt;
    expect(() => generateArtworkV3({ ...input, history: [] }, clock)).toThrow(
      'Historienkontext endet nicht mit den beiden Eltern.',
    );
    expect(() =>
      generateArtworkV3(
        { ...input, history: [...input.history].reverse() },
        clock,
      ),
    ).toThrow(/lückenlose, geordnete Folge/);
    expect(() =>
      generateArtworkV3(
        {
          ...input,
          history: [...input.history.slice(0, 2), ...input.history.slice(3)],
        },
        clock,
      ),
    ).toThrow(/lückenlose, geordnete Folge/);
    const foreign = [...input.history];
    foreign[foreign.length - 1] = {
      ...free.works[index - 1]!,
      id: input.parents[1]!.id,
    };
    expect(() =>
      generateArtworkV3({ ...input, history: foreign }, clock),
    ).toThrow('Historienkontext endet nicht mit den beiden Eltern.');
    expect(() =>
      generateArtworkV3(
        { ...input, history: Array(31).fill(input.history[0]) },
        clock,
      ),
    ).toThrow();
  });

  it('hält die Retry-Grenze ein und vermerkt einen verfehlten Mindestabstand', () => {
    for (const chain of [traceable, free]) {
      const index = 7;
      const work = chain.works[index]!;
      const input = inputAt(chain, index);
      const clock = () => work.generatedAt;
      // An unreachable minimum: every attempt is tried, none is skipped,
      // and the farthest valid candidate is taken without a stop.
      const seen: { retry: number; distance: number | null }[] = [];
      const missed = generateArtworkV3(input, clock, {
        minimum: 2,
        observe: (candidate) => seen.push(candidate),
      });
      expect(seen.length).toBeGreaterThan(1);
      expect(seen.length).toBeLessThanOrEqual(MAX_RETRY_V3 + 1);
      expect(seen.map(({ retry }) => retry)).toEqual(
        [...seen.map(({ retry }) => retry)].sort((a, b) => a - b),
      );
      expect(seen.at(-1)!.retry).toBeLessThanOrEqual(MAX_RETRY_V3);
      const best = Math.max(...seen.map(({ distance }) => distance!));
      expect(missed.novelty).toEqual({
        distanceVersion: 1,
        contextDigest: work.novelty.contextDigest,
        distance: best,
        minimumReached: false,
      });
      expect(missed.evolution.recipe.retry).toBe(
        seen.find(({ distance }) => distance === best)!.retry,
      );
      // All hard conditions still hold for the recorded work.
      expect(
        validateEvolutionV3(missed, input.parents, input.history, 2),
      ).toEqual(missed);
      expect(findAnchor(missed.dna)).toBeGreaterThanOrEqual(0);
      if (chain === traceable)
        for (const id of missed.parentIds)
          expect(
            missed.evolution.decisions.some(
              (decision) =>
                decision.parentId === id &&
                decision.operation.kind !== 'constrained',
            ),
          ).toBe(true);
      // Under the real minimum such a record does not pass as reached.
      expect(() =>
        validateEvolutionV3(missed, input.parents, input.history),
      ).toThrow('Vermerk zum Mindestabstand');

      // Without a minimum the first valid candidate is taken.
      const first: number[] = [];
      const open = generateArtworkV3(input, clock, {
        minimum: 0,
        observe: ({ retry }) => first.push(retry),
      });
      expect(first).toHaveLength(1);
      expect(open.evolution.recipe.retry).toBe(seen[0]!.retry);
      expect(open.novelty.distance).toBe(seen[0]!.distance);
      expect(open.novelty.minimumReached).toBe(true);
    }
  });

  it('erweitert den Kontext bei einer Nachholung chronologisch', () => {
    // Three due days are generated in one late run, oldest first.
    const due = [5, 6, 7];
    const lateRun = new Date(
      Date.parse(scheduledFor(traceable.works[8]!.id)) + 5000,
    ).toISOString();
    const history: AnyArtwork[] = traceable.works.slice(0, due[0]);
    const caughtUp: ArtworkV3[] = [];
    for (const index of due) {
      const model = traceable.works[index]!;
      const work = generateArtworkV3(
        {
          ...inputAt(traceable, index),
          parents: history.slice(-2),
          history: [...history],
          usedTitles: history.map((entry) => entry.title),
          runStartedAt: lateRun,
        },
        () => lateRun,
      );
      expect(work.isCatchUp).toBe(true);
      // The work of the day before, made in the same run, is in the window.
      expect(work.novelty.contextDigest).toBe(
        contextDigest(noveltyWindow(history, 7)),
      );
      expect(noveltyWindow(history, 7).at(-1)!.id).toBe(
        traceable.works[index - 1]!.id,
      );
      // Apart from the times of the run it is the work of a punctual run.
      expect({
        ...work,
        runStartedAt: model.runStartedAt,
        generatedAt: model.generatedAt,
        isCatchUp: false,
      }).toEqual(model);
      caughtUp.push(work);
      history.push(work);
    }
    expect(
      new Set(caughtUp.map((work) => work.novelty.contextDigest)).size,
    ).toBe(3);
  });

  it('verwirft über 365 Testtage je Modus höchstens etwa jeden zehnten Kandidaten', () => {
    for (const mode of ['traceable', 'free'] as const) {
      // Every work is validated strictly against parents and history.
      const result = simulateNovelty({
        mode,
        minimum: NOVELTY_MINIMUM,
        chains: 1,
        days: 365,
        prefix: 'test:novelty',
      });
      expect(result.works).toBe(364);
      expect(result.candidates).toBe(result.works + result.rejected);
      expect(result.rejected / result.candidates).toBeLessThanOrEqual(0.13);
      expect(result.missed).toBe(0);
      expect(result.workDistances[0]).toBeGreaterThanOrEqual(NOVELTY_MINIMUM);
      expect(result.maxRetry).toBeLessThanOrEqual(MAX_RETRY_V3);
      if (mode === 'traceable') expect(result.rejected).toBeGreaterThan(0);
    }
  });
});

describe('Extremprofile (A-35)', { timeout: 300_000 }, () => {
  it('umfasst alles off, alles always, jede Familie allein und wild', () => {
    expect(extremeProfiles.map(([name]) => name)).toEqual([
      'alles off',
      'alles always',
      'nur geometric',
      'nur color-field',
      'nur mosaic',
      'nur organic',
      'nur generative',
      'nur chaotic',
      'wild',
    ]);
  });

  for (const [name, profile] of extremeProfiles)
    for (const mode of ['traceable', 'free'] as const)
      it(`${name}, ${mode}: 52 Werke halten Last, Sichtbarkeit, Elternbeiträge und Ähnlichkeitsregeln`, () => {
        // Creation validates every work strictly with its history.
        const chain = createPreviewChainV3({
          key: 'extreme',
          mode,
          length: 52,
          prefix: `test:extreme:${name}`,
          profile,
        });
        expect(chain.works).toHaveLength(52);
        chain.works.forEach((work, index) => {
          const counts = loadCounts(work.dna.elements);
          for (const key of Object.keys(
            loadLimitsV3,
          ) as (keyof typeof loadLimitsV3)[])
            expect(counts[key]).toBeLessThanOrEqual(loadLimitsV3[key]);
          expect(findAnchor(work.dna)).toBeGreaterThanOrEqual(0);
          const census = featuresOf(work.dna);
          for (const feature of featureNames) {
            if (profile.features[feature] === 'off')
              expect(census[feature], feature).toBe(false);
            if (profile.features[feature] === 'always')
              expect(census[feature], feature).toBe(true);
          }
          for (const layer of Object.values(work.dna.layers))
            expect(profile.families[layer.family]).toBe(true);
          if (mode === 'traceable' && index >= 2)
            for (const id of work.parentIds)
              expect(
                work.evolution.decisions.some(
                  (decision) =>
                    decision.parentId === id &&
                    decision.operation.kind !== 'constrained',
                ),
              ).toBe(true);
          if (index > 0) {
            expect(work.novelty.distance).not.toBeNull();
            expect(work.novelty.minimumReached).toBe(
              work.novelty.distance! >= NOVELTY_MINIMUM,
            );
          }
        });
      });

  it('lehnt unmögliche Profile verständlich ab, ohne stillen Fallback', () => {
    const request = (change: (profile: Profile) => void) => {
      const profile = structuredClone(defaultProfile) as Profile;
      change(profile);
      return () =>
        createPreviewChainV3({
          key: 'extreme',
          mode: 'traceable',
          length: 3,
          profile,
        });
    };
    expect(
      request((profile) => {
        for (const key of Object.keys(profile.families))
          profile.families[key as keyof Profile['families']] = false;
      }),
    ).toThrow('Mindestens eine Kompositionsfamilie muss aktiv bleiben.');
    expect(
      request((profile) => {
        profile.palette.strategies = [];
      }),
    ).toThrow('Mindestens eine Palettenstrategie muss aktiv bleiben.');
    expect(
      request((profile) => {
        profile.variation.noveltyWindow = 31;
      }),
    ).toThrow();
  });
});
