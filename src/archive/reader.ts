import { cycleDate } from '../series/calendar';
import { validateArtwork } from '../art/schema/artwork';
import type { Artwork } from '../art/schema/artwork';
import { anyArtworkSchema } from '../art/schema/artwork-v3';
import type { AnyArtwork } from '../art/schema/artwork-v3';
import { validateEvolution } from '../art/generator/provenance';
import { workDateSchema } from '../art/schema/config';
import { archiveIndexSchema, dataPath, loadArchiveIndex } from './index';
import type { ArchiveIndex } from './index';

// EP-01 P6: preview collections of generator 0.3.0 next to the two reviewed
// test collections. `ep01-transition` mixes schema 2 and schema 3.
export const ep01Collections = [
  'ep01-traceable',
  'ep01-free',
  'ep01-transition',
  'ep01-constraints',
] as const;
export type Ep01Collection = (typeof ep01Collections)[number];
// EP-01 P7: the works presented for the art review of generator 0.3.0.
export const acceptanceCollections = [
  'abnahme-traceable',
  'abnahme-free',
  'abnahme-ruhig',
  'abnahme-wild',
  'abnahme-reduziert',
] as const;
export type AcceptanceCollection = (typeof acceptanceCollections)[number];
export type CollectionKey =
  'official' | 'traceable' | 'free' | Ep01Collection | AcceptanceCollection;
const previewKeys: readonly string[] = [
  'traceable',
  'free',
  ...ep01Collections,
  ...acceptanceCollections,
];
export type ArchiveReader = {
  key: CollectionKey;
  index: ArchiveIndex;
  read: (id: string, signal?: AbortSignal) => Promise<AnyArtwork>;
};
export function collectionKey(search: URLSearchParams): CollectionKey | null {
  const values = search.getAll('sammlung');
  if (values.length === 0) return 'official';
  return values.length === 1 && previewKeys.includes(values[0]!)
    ? (values[0] as CollectionKey)
    : null;
}
export function collectionLink(
  path: string,
  key: CollectionKey,
  params: Record<string, string> = {},
): string {
  const search = new URLSearchParams(params);
  if (key !== 'official') search.set('sammlung', key);
  return `${path}${search.size ? `?${search}` : ''}`;
}
export function orderedIndex(input: unknown): ArchiveIndex {
  const index = archiveIndexSchema.parse(input);
  index.works.forEach((work, position) => {
    const older = index.works[position + 1];
    if (
      work.generation !== index.works.length - position ||
      (older && older.id >= work.id)
    )
      throw new Error(
        'Archivindex ist nicht lückenlos und absteigend geordnet.',
      );
  });
  return index;
}
/** Small successful-result cache; failed/aborted requests never poison later visits. */
export function createReader(
  key: CollectionKey,
  input: unknown,
  load: (id: string, signal?: AbortSignal) => Promise<unknown>,
): ArchiveReader {
  const index = orderedIndex(input);
  const rows = new Map(index.works.map((row) => [row.id, row]));
  const generations = new Map(
    index.works.map((row) => [row.generation, row.id]),
  );
  const cache = new Map<string, AnyArtwork>();
  return {
    key,
    index,
    async read(id, signal) {
      workDateSchema.parse(id);
      signal?.throwIfAborted();
      const row = rows.get(id);
      if (!row) throw new Error('Werk ist nicht im Index verzeichnet.');
      if (cache.has(id)) return cache.get(id)!;
      const work = anyArtworkSchema.parse(await load(id, signal));
      signal?.throwIfAborted();
      const expectedParents =
        work.generation < 3
          ? []
          : [
              generations.get(work.generation - 2),
              generations.get(work.generation - 1),
            ];
      if (
        work.id !== row.id ||
        work.title !== row.title ||
        work.generation !== row.generation ||
        JSON.stringify(work.parentIds) !== JSON.stringify(expectedParents)
      )
        throw new Error(
          'Werk, Index oder unmittelbare Eltern widersprechen sich.',
        );
      if (cache.size >= 48) cache.delete(cache.keys().next().value!);
      cache.set(id, work);
      return work;
    },
  };
}
export async function openCollection(
  key: CollectionKey,
  signal?: AbortSignal,
): Promise<ArchiveReader> {
  if (key === 'traceable' || key === 'free') {
    const { previewReader } = await import('../preview/review');
    signal?.throwIfAborted();
    return previewReader(key);
  }
  if ((acceptanceCollections as readonly string[]).includes(key)) {
    const { acceptanceReader } = await import('../preview/acceptance');
    signal?.throwIfAborted();
    return acceptanceReader(key as AcceptanceCollection);
  }
  if (key !== 'official') {
    const { ep01Reader } = await import('../preview/ep01');
    signal?.throwIfAborted();
    return ep01Reader(key as Ep01Collection);
  }
  return createReader(
    key,
    visibleIndex(await loadArchiveIndex(signal), new Date()),
    async (id, requestSignal) => {
      const response = await fetch(
        dataPath(`artworks/${id.slice(0, 4)}/${id}.json`),
        { signal: requestSignal },
      );
      if (!response.ok)
        throw new Error(`Werk nicht erreichbar (HTTP ${response.status}).`);
      return response.json() as Promise<unknown>;
    },
  );
}
export async function loadWorkContext(
  reader: ArchiveReader,
  id: string,
  signal?: AbortSignal,
) {
  const work = await reader.read(id, signal);
  const parents = await Promise.all(
    work.parentIds.map((parent) => reader.read(parent, signal)),
  );
  if (work.schemaVersion === 3) {
    // Loaded on demand: the official archive holds no schema 3 work yet.
    // Without the history context the digest and distance of the similarity
    // window are not recomputed here; the data validation does that.
    const { validateEvolutionV3 } =
      await import('../art/generator/v3/provenance');
    signal?.throwIfAborted();
    validateEvolutionV3(work, parents);
  } else {
    const legacy = parents.filter(
      (parent): parent is Artwork => parent.schemaVersion !== 3,
    );
    if (legacy.length !== parents.length)
      throw new Error(
        'Ein älteres Werk kann kein Elternwerk im Schema 3 haben.',
      );
    if (work.schemaVersion === 2) validateEvolution(work, legacy);
    else validateArtwork(work, legacy);
  }
  const candidates = reader.index.works
    .filter(
      (row) =>
        row.generation > work.generation &&
        row.generation <= work.generation + 2,
    )
    .toReversed();
  const following = await Promise.all(
    candidates.map((row) => reader.read(row.id, signal)),
  );
  // References decide the relation. Gen. 2 is never a child of Gen. 1.
  const successors = following.filter((candidate) =>
    candidate.parentIds.includes(work.id),
  );
  return { work, parents, successors };
}
export type WorkContext = Awaited<ReturnType<typeof loadWorkContext>>;
export function pageOf(
  index: ArchiveIndex,
  query: string,
  page: number,
  size = 12,
) {
  if (!Number.isSafeInteger(page) || page < 1)
    throw new Error('Ungültige Galerieseite.');
  const term = query.trim().normalize('NFC').toLocaleLowerCase('de-DE');
  const matches = index.works.filter((row) =>
    `${row.title} ${row.id}`
      .normalize('NFC')
      .toLocaleLowerCase('de-DE')
      .includes(term),
  );
  const pages = Math.max(1, Math.ceil(matches.length / size));
  return {
    rows: matches.slice((page - 1) * size, page * size),
    pages,
    total: matches.length,
    outOfRange: page > pages,
  };
}
/** Display clock only. No scheduling, generation or archive mutation. */
export function berlinCycleDate(now: Date): string {
  return cycleDate(now.toISOString());
}

export function visibleIndex(input: unknown, now: Date): ArchiveIndex {
  const index = orderedIndex(input);
  const cycle = berlinCycleDate(now);
  return { ...index, works: index.works.filter((work) => work.id <= cycle) };
}
