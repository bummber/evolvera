// @vitest-environment node
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import releaseRecord from '../config/release.json';
import {
  createAcceptanceChain,
  standardSpecs,
} from '../src/art/generator/acceptance-v3';
import { validatePreviewChainV3 } from '../src/art/generator/preview-chain-v3';
import { layerShows } from '../src/art/generator/v3/checks';
import {
  artworkV3Schema,
  MAX_INHERITED_PER_PARENT,
  type ArtworkV3,
  type RecipeV4,
} from '../src/art/schema/artwork-v3';
import { acceptanceCollectionV4Schema } from '../src/art/schema/chains-v3';
import { readArchive } from '../src/automation/archive';
import { prepareRun } from '../src/automation/plan';
import {
  acceptanceCollectionsV4,
  collectionKey,
  openCollection,
} from '../src/archive/reader';
import { acceptanceWorks } from '../src/preview/acceptance';
import { generatorV4Date, generatorVersionFor } from '../src/series/calendar';

// Generator 0.4.0 (operator decision of 2026-11-18): children take single
// properties of their two parents instead of whole layers, at most three
// per parent; the family of a layer counts. The series restarts with it.

const collection = acceptanceCollectionV4Schema.parse(
  JSON.parse(readFileSync('fixtures/preview/review-v4.json', 'utf8')),
);
const recipe = (work: ArtworkV3) => work.evolution.recipe as RecipeV4;
const children = collection.chains.flatMap((chain) =>
  chain.works.filter((work) => work.generation > 2),
);

describe('Generator 0.4.0: Vererbung einzelner Eigenschaften', () => {
  it('liefert je Modus eine gültige Abnahmekette mit 20 Werken', () => {
    expect(collection.chains.map((chain) => chain.key)).toEqual([
      'traceable',
      'free',
    ]);
    for (const chain of collection.chains) {
      expect(chain.works).toHaveLength(20);
      validatePreviewChainV3(chain);
      for (const work of chain.works) {
        expect(work.generatorVersion).toBe('0.4.0');
        expect(work.rendererVersion).toBe('2');
      }
    }
  });

  it('übernimmt höchstens drei Eigenschaften je Elternteil', () => {
    for (const work of children)
      for (const parent of ['parentA', 'parentB'] as const) {
        const count = recipe(work).inherited.filter(
          (entry) => entry.parent === parent,
        ).length;
        expect(count).toBeLessThanOrEqual(MAX_INHERITED_PER_PARENT);
        if (work.inheritanceMode === 'traceable')
          expect(count).toBeGreaterThanOrEqual(1);
      }
  });

  it('nutzt Farbe, Form und Familie und lässt in free auch Neuanfänge zu', () => {
    const used = new Set(
      children.flatMap((work) =>
        recipe(work).inherited.map((entry) => entry.property),
      ),
    );
    expect([...used].sort()).toEqual(['color', 'family', 'form']);
    const free = collection.chains.find((chain) => chain.key === 'free')!;
    expect(
      free.works.slice(2).some((work) => recipe(work).inherited.length === 0),
    ).toBe(true);
  });

  it('übernimmt keine ganzen Ebenen mehr', () => {
    // Forms that repeat a parent form exactly: at most the inherited ones.
    for (const chain of collection.chains)
      chain.works.slice(2).forEach((work, offset) => {
        const index = offset + 2;
        const parents = [chain.works[index - 2]!, chain.works[index - 1]!];
        const key = (e: ArtworkV3['dna']['elements'][number]) =>
          `${e.kind}:${e.x}:${e.y}:${e.width}:${e.height}`;
        const known = new Set(
          parents.flatMap((parent) => parent.dna.elements.map(key)),
        );
        const repeated = work.dna.elements.filter((e) =>
          known.has(key(e)),
        ).length;
        const forms = recipe(work).inherited.filter(
          (entry) => entry.property === 'form',
        ).length;
        expect(repeated).toBeLessThanOrEqual(forms);
      });
  });

  it('belegt übernommene Familien an einer sichtbaren Ebene', () => {
    let families = 0;
    for (const work of children)
      for (const decision of work.evolution.decisions) {
        const match = /^layers\.(\w+)\.family$/.exec(decision.target.path);
        if (!match) continue;
        families++;
        expect(layerShows(work.dna, match[1] as 'background')).toBe(true);
      }
    expect(families).toBeGreaterThan(0);
  });

  it('reproduziert die Abnahmewerke deterministisch', () => {
    const again = createAcceptanceChain(
      standardSpecs[0]!,
      undefined,
      undefined,
      '0.4.0',
    );
    expect(again.works).toEqual(collection.chains[0]!.works);
  });
});

describe('Schema 3 mit Generator 0.4.0', () => {
  const work = children.find(
    (candidate) =>
      recipe(candidate).inherited.filter((entry) => entry.parent === 'parentA')
        .length === 1,
  )!;
  const errors = (input: unknown) => {
    const result = artworkV3Schema.safeParse(input);
    return result.success
      ? []
      : result.error.issues.map((issue) => issue.message);
  };

  it('lehnt mehr als drei Eigenschaften eines Elternteils ab', () => {
    const tampered = structuredClone(work);
    recipe(tampered).inherited.push(
      ...Array.from({ length: 3 }, () => ({
        parent: 'parentA' as const,
        property: 'color' as const,
      })),
    );
    expect(errors(tampered)).toContain(
      'Höchstens drei vererbte Eigenschaften je Elternteil.',
    );
  });

  it('lehnt Rezepte ab, die nicht zu den Belegen passen', () => {
    const tampered = structuredClone(work);
    const own = recipe(tampered).inherited.find(
      (entry) => entry.parent === 'parentA',
    )!;
    own.property = own.property === 'color' ? 'form' : 'color';
    expect(errors(tampered)).toContain(
      'Rezept und Belege nennen unterschiedliche Eigenschaften.',
    );
  });

  it('lehnt ein Rezept von 0.3.0 unter Generator 0.4.0 ab', () => {
    const tampered = structuredClone(work) as unknown as {
      evolution: { recipe: Record<string, unknown> };
    };
    const { inherited: _, ...rest } = tampered.evolution.recipe;
    void _;
    tampered.evolution.recipe = {
      ...rest,
      palette: 'new',
      layers: Object.fromEntries(
        Object.keys(work.dna.layers).map((name) => [name, 'new']),
      ),
    };
    expect(errors(tampered)).toContain(
      'Rezept passt nicht zur Generatorversion.',
    );
  });
});

describe('Neustart der Serie mit Generator 0.4.0', () => {
  const settings = {
    schemaVersion: 1,
    revision: 7,
    seriesStartDate: generatorV4Date,
    generationEnabled: true,
    timezone: 'Europe/Berlin',
    inheritanceMode: 'traceable',
  } as const;
  const reviewed = {
    ...releaseRecord,
    artReviewV4: {
      generatorVersion: '0.4.0',
      rendererVersion: '2',
      approvedOn: '2026-11-18',
      workCount: 40,
      statement: 'Synthetischer Testnachweis',
      fixtureSha256: { standard: 'c'.repeat(64) },
    },
  };
  const { artReviewV4: _, ...unreviewed } = reviewed;
  void _;
  const run = (release: unknown) =>
    prepareRun(
      {
        settings,
        release,
        current: new Map(),
        canonical: new Map(),
        runStartedAt: '2026-11-22T08:00:00+01:00',
      },
      () => '2026-11-22T07:00:02Z',
    );

  it('erzeugt ab dem Neustart jedes Werk mit Generator 0.4.0', () => {
    expect(generatorV4Date).toBe('2026-11-19');
    expect(generatorVersionFor('2026-11-18')).toBe('0.3.0');
    expect(generatorVersionFor('2026-11-19')).toBe('0.4.0');
    const plan = run(reviewed);
    expect(plan.added).toHaveLength(4);
    const works = readArchive(plan.files, settings.seriesStartDate);
    expect(works.map((work) => work.generatorVersion)).toEqual([
      '0.4.0',
      '0.4.0',
      '0.4.0',
      '0.4.0',
    ]);
    expect(works.map((work) => work.generation)).toEqual([1, 2, 3, 4]);
  });

  it('stoppt ohne dokumentierte Abnahme von Generator 0.4.0', () => {
    expect(() => run(unreviewed)).toThrow(/Kunstabnahme für Generator 0\.4\.0/);
  });
});

describe('Abnahmesammlungen von Generator 0.4.0', () => {
  it('sind über die Sammlungsauswahl erreichbar und lesbar', async () => {
    for (const key of acceptanceCollectionsV4) {
      expect(collectionKey(new URLSearchParams(`sammlung=${key}`))).toBe(key);
      const works = await acceptanceWorks(key);
      expect(works).toHaveLength(20);
      // The gallery opens the collection through the shared reader.
      const reader = await openCollection(key);
      expect(reader.index.works).toHaveLength(20);
      expect((await reader.read(works.at(-1)!.id)).generatorVersion).toBe(
        '0.4.0',
      );
    }
  });
});
