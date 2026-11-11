import { isDeepStrictEqual } from './equal';
import rawChains from '../../fixtures/preview/ep01-chains.json';
import rawConstraints from '../../fixtures/preview/ep01-constraints.json';
import type { AnyArtwork } from '../art/schema/artwork-v3';
import {
  chainCollectionV3Schema,
  constraintPreviewSchema,
} from '../art/schema/chains-v3';
import { createReader } from '../archive/reader';
import type { Ep01Collection } from '../archive/reader';
import { reviewChains } from './review';

// EP-01 P6: the stored preview chains of generator 0.3.0 as read-only test
// collections for gallery, today, evolution and detail view. Preview only:
// nothing is generated here and nothing reaches the official archive.
const chains = chainCollectionV3Schema.parse(rawChains).chains;
const chain = (key: string) => {
  const found = chains.find((candidate) => candidate.key === key);
  if (!found) throw new Error(`Probekette ${key} fehlt.`);
  return found;
};

/** Ten reviewed schema 2 works followed by their four schema 3 descendants. */
function transitionWorks(): AnyArtwork[] {
  const transition = chain('transition');
  const old = reviewChains
    .find((candidate) => candidate.inheritanceMode === 'traceable')!
    .works.slice(0, 10);
  if (!isDeepStrictEqual(old.slice(-2), transition.legacyParents))
    throw new Error(
      'Übergangskette passt nicht zu den gespeicherten alten Elternwerken.',
    );
  return [...old, ...transition.works];
}

const sources: Record<Ep01Collection, () => readonly AnyArtwork[]> = {
  'ep01-traceable': () => chain('traceable').works,
  'ep01-free': () => chain('free').works,
  'ep01-transition': transitionWorks,
  'ep01-constraints': () =>
    constraintPreviewSchema.parse(rawConstraints).chain.works,
};

export function ep01Works(key: Ep01Collection): readonly AnyArtwork[] {
  return sources[key]();
}
export function ep01Reader(key: Ep01Collection) {
  const works = ep01Works(key);
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
