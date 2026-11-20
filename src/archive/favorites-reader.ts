import { anyArtworkSchema } from '../art/schema/artwork-v3';
import type { AnyArtwork } from '../art/schema/artwork-v3';
import { dataPath } from './index';
import { favoritesIndexSchema, parentsOf } from './favorites';
import type { Favorite, FavoritesIndex } from './favorites';

// Package B: the public favourites gallery reads only the copies below
// `favorites/`, never the series archive, so it survives a series restart.

async function json(relative: string, signal?: AbortSignal) {
  const response = await fetch(dataPath(relative), {
    signal,
    cache: 'no-cache',
  });
  if (!response.ok)
    throw new Error(`Favoriten nicht erreichbar (HTTP ${response.status}).`);
  return response.json() as Promise<unknown>;
}
export async function loadFavorites(
  signal?: AbortSignal,
): Promise<FavoritesIndex> {
  return favoritesIndexSchema.parse(await json('favorites/index.json', signal));
}
async function copy(series: string, id: string, signal?: AbortSignal) {
  const work = anyArtworkSchema.parse(
    await json(`favorites/${series}/${id}.json`, signal),
  );
  if (
    work.id !== id ||
    JSON.stringify(work.parentIds) !== JSON.stringify(parentsOf(series, id))
  )
    throw new Error('Favoritenkopie widerspricht ihrem Pfad oder Eltern.');
  return work;
}
/** A favourite with its direct parents, oldest parent first. */
export async function loadFavorite(
  entry: Favorite,
  signal?: AbortSignal,
): Promise<{ work: AnyArtwork; parents: AnyArtwork[] }> {
  const [work, ...parents] = await Promise.all(
    [entry.id, ...parentsOf(entry.series, entry.id)].map((id) =>
      copy(entry.series, id, signal),
    ),
  );
  if (work!.title !== entry.title || work!.generation !== entry.generation)
    throw new Error('Favoritenindex widerspricht der Werkkopie.');
  return { work: work!, parents };
}
