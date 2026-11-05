import { cycleDate } from '../series/calendar';
import { artworkSchema, validateArtwork } from '../art/schema/artwork';
import type { Artwork } from '../art/schema/artwork';
import { validateEvolution } from '../art/generator/provenance';
import { workDateSchema } from '../art/schema/config';
import { archiveIndexSchema, dataPath, loadArchiveIndex } from './index';
import type { ArchiveIndex } from './index';

export type CollectionKey = 'official' | 'traceable' | 'free';
export type ArchiveReader = {
  key: CollectionKey;
  index: ArchiveIndex;
  read: (id: string, signal?: AbortSignal) => Promise<Artwork>;
};
export function collectionKey(search: URLSearchParams): CollectionKey | null {
  const values = search.getAll('sammlung');
  if (values.length === 0) return 'official';
  return values.length === 1 && ['traceable', 'free'].includes(values[0]!)
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
  const cache = new Map<string, Artwork>();
  return {
    key,
    index,
    async read(id, signal) {
      workDateSchema.parse(id);
      signal?.throwIfAborted();
      const row = rows.get(id);
      if (!row) throw new Error('Werk ist nicht im Index verzeichnet.');
      if (cache.has(id)) return cache.get(id)!;
      const work = artworkSchema.parse(await load(id, signal));
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
  if (key !== 'official') {
    const { previewReader } = await import('../preview/review');
    signal?.throwIfAborted();
    return previewReader(key);
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
  if (work.schemaVersion === 2) validateEvolution(work, parents);
  else validateArtwork(work, parents);
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
