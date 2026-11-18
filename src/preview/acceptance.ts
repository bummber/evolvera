import type { AnyArtwork } from '../art/schema/artwork-v3';
import {
  acceptanceCollectionV3Schema,
  acceptanceCollectionV4Schema,
} from '../art/schema/chains-v3';
import { createReader } from '../archive/reader';
import type { AcceptanceCollection } from '../archive/reader';

// EP-01 P7: the stored acceptance works of generator 0.3.0 as read-only
// collections for gallery, today, evolution and detail view. Nothing is
// generated here and nothing reaches the official archive. Each fixture file
// is its own chunk and only loaded when one of its collections is opened.
const sources: Record<
  AcceptanceCollection,
  { load: () => Promise<{ default: unknown }>; chain: string }
> = {
  'abnahme-traceable': {
    load: () => import('../../fixtures/preview/ep01-review.json'),
    chain: 'traceable',
  },
  'abnahme-free': {
    load: () => import('../../fixtures/preview/ep01-review.json'),
    chain: 'free',
  },
  'abnahme-ruhig': {
    load: () => import('../../fixtures/preview/ep01-review-profiles.json'),
    chain: 'calm',
  },
  'abnahme-wild': {
    load: () => import('../../fixtures/preview/ep01-review-profiles.json'),
    chain: 'wild',
  },
  'abnahme-reduziert': {
    load: () => import('../../fixtures/preview/ep01-review-profiles.json'),
    chain: 'reduced',
  },
  'abnahme-v4-traceable': {
    load: () => import('../../fixtures/preview/review-v4.json'),
    chain: 'traceable',
  },
  'abnahme-v4-free': {
    load: () => import('../../fixtures/preview/review-v4.json'),
    chain: 'free',
  },
};

export async function acceptanceWorks(
  key: AcceptanceCollection,
): Promise<readonly AnyArtwork[]> {
  const { load, chain } = sources[key];
  const raw = (await load()).default;
  const found = (
    key.startsWith('abnahme-v4-')
      ? acceptanceCollectionV4Schema.parse(raw)
      : acceptanceCollectionV3Schema.parse(raw)
  ).chains.find((candidate) => candidate.key === chain);
  if (!found) throw new Error(`Abnahmekette ${chain} fehlt.`);
  return found.works;
}
export async function acceptanceReader(key: AcceptanceCollection) {
  const works = await acceptanceWorks(key);
  const byId = new Map(works.map((work) => [work.id, work]));
  return createReader(
    key,
    {
      schemaVersion: 1,
      works: works
        .toReversed()
        .map(({ id, generation, title }) => ({ id, generation, title })),
    },
    async (id) => byId.get(id),
  );
}
