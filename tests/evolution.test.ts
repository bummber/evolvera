import { describe, expect, it } from 'vitest';
import raw from '../fixtures/preview/phase-2.json';
import {
  createPreviewChain,
  validatePreviewChain,
} from '../src/art/generator/preview-chain';
import { generateArtwork } from '../src/art/generator/evolve';
import {
  isExposed,
  replayRecipe,
  validateEvolution,
} from '../src/art/generator/provenance';
import {
  artworkSchema,
  artworkV1Schema,
  artworkV2Schema,
} from '../src/art/schema/artwork';
import type { Artwork } from '../src/art/schema/artwork';
import { snapshotSettings } from '../src/operator/settings';
import { generateTitle } from '../src/art/titles/generate';
import { origin } from './fixtures/artworks';

const saved = raw.chains.map(validatePreviewChain);
// Snapshot invariants use fixed test data, independent of operator mode commits.
const fixtureSettings = snapshotSettings({
  schemaVersion: 1,
  revision: 1,
  seriesStartDate: null,
  generationEnabled: false,
  timezone: 'Europe/Berlin',
  inheritanceMode: 'traceable',
});
function inputFor(
  work = saved[0]!.works[2]!,
  parents: readonly Artwork[] = saved[0]!.works.slice(0, 2),
) {
  return {
    generation: work.generation,
    workDate: work.id,
    seed: work.seed,
    parents,
    scheduledFor: work.scheduledFor,
    runStartedAt: work.runStartedAt,
    settings: {
      ...fixtureSettings,
      inheritanceMode: work.inheritanceMode,
      revision: work.settingsRevision,
    },
    usedTitles: parents.map((parent) => parent.title),
  };
}
function freezeDeep<T>(value: T): T {
  if (value && typeof value === 'object') {
    Object.freeze(value);
    Object.values(value).forEach(freezeDeep);
  }
  return value;
}

describe('Beide Modi und Generationenintegrität', () => {
  it.each(['traceable', 'free'] as const)(
    'prüft 365 fortlaufende Tage in %s einschließlich beider Zeitumstellungen',
    (mode) => {
      const chain = createPreviewChain(mode, 365, '2000-01-01', 'long-chain');
      const signatures = new Set<string>();
      expect(chain.works).toHaveLength(365);
      chain.works.forEach((work, index) => {
        expect(artworkSchema.safeParse(work).success).toBe(true);
        expect(work.generation).toBe(index + 1);
        expect(work.parentIds).toEqual(
          index < 2
            ? []
            : chain.works.slice(index - 2, index).map((parent) => parent.id),
        );
        expect(work.dna.elements.length).toBeLessThanOrEqual(62);
        const parents = index < 2 ? [] : chain.works.slice(index - 2, index);
        expect(
          replayRecipe(work.evolution.recipe, parents, work.dna.family),
        ).toEqual(work.dna);
        if (index < 2) {
          expect(work.evolution.decisions).toEqual([]);
          expect(work.titleDna.parentFragments).toEqual([]);
          expect(work.evolution.recipe.base.source).toBe('new');
        } else if (mode === 'traceable') {
          for (const parent of parents)
            expect(
              work.evolution.decisions.some(
                (decision) => decision.parentId === parent.id,
              ),
            ).toBe(true);
        }
        signatures.add(JSON.stringify(work.dna));
      });
      expect(signatures.size).toBe(365);
      expect(
        new Set(chain.works.map((work) => work.dna.background)).size,
      ).toBeGreaterThan(20);
      expect(
        chain.works.some((work) => work.scheduledFor.endsWith('+02:00')),
      ).toBe(true);
      expect(
        chain.works.some((work) => work.scheduledFor.endsWith('+01:00')),
      ).toBe(true);
    },
    30000,
  );
  it('hält V1 nutzbar und trennt vollständige V2-Daten', () => {
    expect(artworkV1Schema.safeParse(origin()).success).toBe(true);
    expect(artworkSchema.safeParse(origin()).success).toBe(true);
    expect(
      artworkV2Schema.safeParse({ ...origin(), schemaVersion: 2 }).success,
    ).toBe(false);
  });
  it('reproduziert beide gespeicherten Zehnerketten exakt', () => {
    for (const chain of saved)
      expect(createPreviewChain(chain.inheritanceMode)).toEqual(chain);
  });
  it('lässt im freien Modus vollständige Brüche zu und behauptet dabei keine Übernahme', () => {
    const chain = createPreviewChain('free', 40);
    const fresh = chain.works
      .slice(2)
      .filter(
        (work) =>
          work.evolution.recipe.base.source === 'new' &&
          work.evolution.decisions.length === 0,
      );
    expect(fresh.length).toBeGreaterThan(0);
    expect(
      fresh.every((work) => work.evolution.evaluatedParentIds.length === 2),
    ).toBe(true);
  });
  it('beweist sichtbare Merkmale nach allen Änderungen und lässt variable Beiträge zu', () => {
    const chain = createPreviewChain('traceable', 50);
    expect(
      new Set(
        chain.works.slice(2).map((work) => work.evolution.decisions.length),
      ).size,
    ).toBeGreaterThan(2);
    for (const work of chain.works.slice(2)) {
      for (const decision of work.evolution.decisions) {
        expect(
          isExposed(work.dna, Number(decision.target.path.split('.')[1])),
        ).toBe(true);
      }
    }
  });
});

describe('Determinismus, Snapshot und reale Uhr', () => {
  it('lässt Eingabedaten unverändert und trennt DNA/Titel von der tatsächlichen Uhrzeit', () => {
    const request = freezeDeep(structuredClone(inputFor()));
    const before = JSON.stringify(request);
    const a = generateArtwork(request, () => '2000-01-03T03:00:02Z');
    const b = generateArtwork(request, () => '2000-01-03T15:00:00Z');
    expect(a.dna).toEqual(b.dna);
    expect(a.title).toBe(b.title);
    expect(a.titleDna).toEqual(b.titleDna);
    expect(a.generatedAt).not.toBe(b.generatedAt);
    expect(JSON.stringify(request)).toBe(before);
    expect(a.generatedAt).toBe('2000-01-03T03:00:02Z');
  });
  it('verwendet bei Nachholung denselben Einstellungssnapshot und zeigt den Laufstart korrekt', () => {
    const config = { ...fixtureSettings };
    const snapshot = snapshotSettings(config);
    config.inheritanceMode = 'free';
    config.revision = 2;
    const request = {
      ...inputFor(),
      settings: snapshot,
      runStartedAt: '2000-01-05T03:00:00Z',
    };
    const work = generateArtwork(request, () => '2000-01-05T03:00:01Z');
    expect(work.inheritanceMode).toBe('traceable');
    expect(work.settingsRevision).toBe(1);
    expect(work.isCatchUp).toBe(true);
    expect(work.id).toBe('2000-01-03');
    expect(work.dna).toEqual(
      generateArtwork(inputFor(), () => '2000-01-03T03:00:02Z').dna,
    );
    expect(fixtureSettings).toMatchObject({
      generationEnabled: false,
      seriesStartDate: null,
      inheritanceMode: 'traceable',
      revision: 1,
    });
  });
  it('ein Moduswechsel ändert weder Eltern noch historische Werke oder Generationen', () => {
    const chain = saved[0]!;
    const before = JSON.stringify(chain);
    const work = chain.works[9]!;
    const parents = chain.works.slice(8, 10);
    const request = {
      ...inputFor(work, parents),
      workDate: '2000-01-11',
      generation: 11,
      scheduledFor: '2000-01-11T04:00:00+01:00',
      runStartedAt: '2000-01-11T03:00:01Z',
      settings: { ...fixtureSettings, inheritanceMode: 'free', revision: 2 },
    };
    const next = generateArtwork(request, () => '2000-01-11T03:00:02Z');
    expect(next.parentIds).toEqual(parents.map((parent) => parent.id));
    expect(next.generation).toBe(11);
    expect(next.inheritanceMode).toBe('free');
    expect(JSON.stringify(chain)).toBe(before);
  });
});

describe('Manipulationen an Quellen, Rezept und sichtbaren Beiträgen', () => {
  it('verwirft fehlende, vertauschte und falsche unmittelbare Eltern', () => {
    const request = inputFor();
    for (const parents of [
      [],
      request.parents.toReversed(),
      [saved[0]!.works[0]!, saved[0]!.works[2]!],
    ]) {
      expect(() =>
        generateArtwork({ ...request, parents }, () => '2000-01-03T03:00:02Z'),
      ).toThrow();
    }
    expect(() =>
      generateArtwork(
        { ...request, generation: 2 },
        () => '2000-01-03T03:00:02Z',
      ),
    ).toThrow();
  });
  it('erkennt Lücken und doppelte Titel in der Kette', () => {
    const chain = structuredClone(saved[0]!);
    chain.works.splice(4, 1);
    expect(() => validatePreviewChain(chain)).toThrow();
    const other = structuredClone(saved[0]!);
    other.works[1]!.title = other.works[0]!.title;
    expect(() => validatePreviewChain(other)).toThrow();
  });
  it('erkennt erfundene Quellen und falsch protokollierte Mutationen', () => {
    const work = structuredClone(saved[0]!.works[2]!);
    const parents = saved[0]!.works.slice(0, 2);
    work.evolution.decisions[0]!.source.value = '#000000';
    expect(() => validateEvolution(work, parents)).toThrow();
    const other = structuredClone(saved[0]!.works[2]!);
    other.evolution.recipe.base.seed = 'gefälscht';
    if (other.evolution.recipe.base.source === 'new')
      expect(() => validateEvolution(other, parents)).toThrow();
    else {
      other.evolution.recipe.additions[1]!.color = '#000000';
      expect(() => validateEvolution(other, parents)).toThrow();
    }
  });
  it('erkennt unsichtbar gemachte und überdeckte Beiträge selbst bei passenden Rezepten', () => {
    const parents = saved[0]!.works.slice(0, 2);
    const work = structuredClone(saved[0]!.works[2]!);
    const index = Number(
      work.evolution.decisions[0]!.target.path.split('.')[1],
    );
    const additionIndex =
      index -
      (work.dna.elements.length - work.evolution.recipe.additions.length);
    work.dna.elements[index]!.opacity = 0.05;
    work.evolution.recipe.additions[additionIndex]!.opacity = 0.05;
    expect(() => validateEvolution(work, parents)).toThrow(/sichtbar/);
    const covered = structuredClone(saved[0]!.works[2]!);
    const target =
      covered.dna.elements[
        Number(covered.evolution.decisions[0]!.target.path.split('.')[1])
      ]!;
    const overlay = {
      ...structuredClone(target),
      color: covered.dna.background,
    };
    covered.dna.elements.push(overlay);
    covered.evolution.recipe.additions.push(overlay);
    expect(() => validateEvolution(covered, parents)).toThrow();
  });
});

describe('Poetische Titel und Elternfragmente', () => {
  it('arbeitet deterministisch mit Unicode und prüft Wiederholungen ohne neue Zeitquelle', () => {
    const request = {
      seed: 'Äther und Öl',
      lexiconVersion: '0.1.0',
      parents: [
        { id: '2000-01-01', title: 'Ätherfaltung' },
        { id: '2000-01-02', title: 'Ölschimmer' },
      ],
    };
    const first = generateTitle(request);
    expect(generateTitle(request)).toEqual(first);
    const second = generateTitle({ ...request, usedTitles: [first.title] });
    expect(second.title.toLocaleLowerCase('de-DE')).not.toBe(
      first.title.toLocaleLowerCase('de-DE'),
    );
    for (const fragment of first.parentFragments) {
      expect(
        request.parents.find((parent) => parent.id === fragment.parentId)!
          .title,
      ).toContain(fragment.fragment);
      expect(first.title.toLocaleLowerCase('de-DE')).toContain(
        fragment.fragment.toLocaleLowerCase('de-DE'),
      );
    }
  });
  it('liefert abwechslungsreiche Namen und hält beide Eltern als mögliche Wortquellen', () => {
    const fragments = new Set<string>(),
      titles = new Set<string>(),
      patterns = new Set<string>();
    const parents = [
      { id: '2000-01-01', title: 'Luminofuge' },
      { id: '2000-01-02', title: 'Chromasaum' },
    ];
    for (let index = 0; index < 100; index++) {
      const result = generateTitle({
        seed: `sprache-${index}`,
        lexiconVersion: '0.1.0',
        parents,
        usedTitles: [...titles],
      });
      titles.add(result.title);
      patterns.add(result.pattern);
      result.parentFragments.forEach((part) => fragments.add(part.parentId));
    }
    expect(titles.size).toBe(100);
    expect(patterns.size).toBe(3);
    expect(fragments.size).toBe(2);
    expect(() =>
      generateTitle({ seed: 'x', lexiconVersion: '999', parents: [] }),
    ).toThrow();
  });
});
