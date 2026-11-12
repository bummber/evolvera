// @vitest-environment node
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  acceptanceCollections,
  collectionKey,
  loadWorkContext,
  openCollection,
} from '../src/archive/reader';
import {
  profileSpecs,
  standardSpecs,
} from '../src/art/generator/acceptance-v3';
import { defaultProfile } from '../src/art/schema/profile';
import { indexPath, readArchive, workPath } from '../src/automation/archive';
import { acceptanceWorks } from '../src/preview/acceptance';

// EP-01 P7: the acceptance works of generator 0.3.0. Reproduction from the
// seeds is part of `npm run validate:data` (scripts/acceptance-fixtures.ts).
const expected = {
  'abnahme-traceable': { length: 20, mode: 'traceable' },
  'abnahme-free': { length: 20, mode: 'free' },
  'abnahme-ruhig': { length: 6, mode: 'traceable' },
  'abnahme-wild': { length: 6, mode: 'traceable' },
  'abnahme-reduziert': { length: 6, mode: 'traceable' },
} as const;

describe('Abnahmewerke für Generator 0.3.0', () => {
  it('umfasst 40 Werke im Standardprofil und drei kurze Profilketten', () => {
    expect(standardSpecs.map((spec) => spec.length)).toEqual([20, 20]);
    expect(standardSpecs.map((spec) => spec.mode)).toEqual([
      'traceable',
      'free',
    ]);
    for (const spec of standardSpecs) expect(spec.profile).toBe(defaultProfile);
    expect(profileSpecs.map((spec) => spec.key)).toEqual([
      'calm',
      'wild',
      'reduced',
    ]);
    for (const spec of profileSpecs)
      expect(spec.profile).not.toEqual(defaultProfile);
  });
  it('ist über die Sammlungsauswahl erreichbar', () => {
    for (const key of acceptanceCollections)
      expect(collectionKey(new URLSearchParams(`sammlung=${key}`))).toBe(key);
    expect(collectionKey(new URLSearchParams('sammlung=abnahme'))).toBeNull();
  });
  it.each(acceptanceCollections)(
    'prüft jedes Werk der Sammlung %s samt Eltern und voller Historie',
    async (key) => {
      const works = await acceptanceWorks(key);
      expect(works).toHaveLength(expected[key].length);
      for (const work of works) {
        expect(work.schemaVersion).toBe(3);
        expect(work.inheritanceMode).toBe(expected[key].mode);
        if (work.schemaVersion !== 3) continue;
        expect(work.generatorVersion).toBe('0.3.0');
        expect(work.rendererVersion).toBe('2');
        expect(work.novelty.minimumReached).toBe(true);
      }
      const reader = await openCollection(key);
      for (const row of reader.index.works) {
        const context = await loadWorkContext(reader, row.id);
        expect(context.work.title).toBe(row.title);
      }
      // The strict archive reader recomputes digest and distance of the
      // similarity window from the complete history.
      const files = new Map(
        works.map((work) => [workPath(work.id), JSON.stringify(work)]),
      );
      files.set(indexPath, '{}');
      expect(readArchive(files, '2000-01-01')).toHaveLength(works.length);
    },
    60_000,
  );
  it('speichert die Profile im Snapshot der Werke', async () => {
    const calm = (await acceptanceWorks('abnahme-ruhig'))[0]!;
    const wild = (await acceptanceWorks('abnahme-wild'))[0]!;
    const reduced = (await acceptanceWorks('abnahme-reduziert'))[0]!;
    if (
      calm.schemaVersion !== 3 ||
      wild.schemaVersion !== 3 ||
      reduced.schemaVersion !== 3
    )
      throw new Error('Schema 3 erwartet.');
    expect(calm.settings.variation.mutationStrength).toBe('calm');
    expect(calm.settings.composition.density).toBe('sparse');
    expect(wild.settings.experimental.mutationJumps).toBe(true);
    expect(wild.settings.features.gradients).toBe('often');
    expect(reduced.settings.composition.maxLayers).toBe(2);
    for (const work of await acceptanceWorks('abnahme-reduziert')) {
      if (work.schemaVersion !== 3) continue;
      for (const layer of Object.values(work.dna.layers))
        expect(['organic', 'color-field']).toContain(layer!.family);
      expect(Object.keys(work.dna.layers).length).toBeLessThanOrEqual(2);
    }
  });
  it('ist seit der Kunstabnahme vom 12.11.2026 eingefroren', () => {
    // Approved by the operator. A mismatch is a finding, not something to
    // update: changed works need a new art review.
    const frozen = {
      'fixtures/preview/ep01-review.json':
        '2d4e5f3eb7c43606edb054f5622e8462b305f61c6949941c20fec38b4f206784',
      'fixtures/preview/ep01-review-profiles.json':
        'e5aa7862d852a3571eae6037e0029b58bf5e36728e611bb6578fd07295f7ad7d',
    };
    for (const [file, digest] of Object.entries(frozen))
      expect(
        createHash('sha256').update(readFileSync(file)).digest('hex'),
      ).toBe(digest);
  });
  it('bleibt vom offiziellen Archiv getrennt', () => {
    expect(existsSync('public/artworks/2000')).toBe(false);
    for (const year of readdirSync('public/artworks', { withFileTypes: true }))
      if (year.isDirectory())
        for (const file of readdirSync(`public/artworks/${year.name}`))
          expect(file.startsWith('2000-')).toBe(false);
  });
});
