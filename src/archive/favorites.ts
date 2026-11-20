import { z } from 'zod';
import { workDateSchema } from '../art/schema/config';

// Package B (operator decision of 2026-11-20): favourites gallery.
//
// Only the operator marks a work of the running series as a favourite, in the
// operator area. The operator worker then copies the work and its direct
// parents byte for byte (the same Git blobs) to
// `public/favorites/<series start>/<work id>.json`, outside the series
// archive, so deleting or restarting the series never touches them. The data
// validation checks every copy against Git. Shared by worker, validation and
// gallery: no Node, browser or React dependencies.

export const favoritesIndexPath = 'public/favorites/index.json';
const copyPattern =
  /^public\/favorites\/(\d{4}-\d{2}-\d{2})\/(\d{4}-\d{2}-\d{2})\.json$/;
export const favoriteCopyPath = (series: string, id: string) =>
  `public/favorites/${series}/${id}.json`;
export const isFavoriteCopyPath = (path: string) => copyPattern.test(path);
export const isFavoritesPath = (path: string) =>
  path === favoritesIndexPath || isFavoriteCopyPath(path);

const day = 86400000;
const time = (id: string) =>
  Date.parse(`${workDateSchema.parse(id)}T12:00:00Z`);
const shift = (id: string, days: number) =>
  new Date(time(id) + days * day).toISOString().slice(0, 10);
/** Generation of a work in a gap-free series that started on `series`. */
export const generationOf = (series: string, id: string) =>
  Math.round((time(id) - time(series)) / day) + 1;
/** Direct parents in a gap-free series: the two previous works from Gen. 3 on. */
export const parentsOf = (series: string, id: string): string[] =>
  generationOf(series, id) < 3 ? [] : [shift(id, -2), shift(id, -1)];

export const favoriteSchema = z
  .strictObject({
    series: workDateSchema,
    id: workDateSchema,
    generation: z.number().int().positive(),
    title: z.string().trim().min(1).max(160),
  })
  .refine(
    (entry) => entry.generation === generationOf(entry.series, entry.id),
    {
      message: 'Generation passt nicht zu Serienstart und Werkdatum.',
    },
  );
export type Favorite = z.infer<typeof favoriteSchema>;
/** Newest series first, newest work first. */
export const favoriteOrder = (a: Favorite, b: Favorite) =>
  b.series.localeCompare(a.series) || b.id.localeCompare(a.id);
export const favoritesIndexSchema = z
  .strictObject({
    schemaVersion: z.literal(1),
    favorites: z.array(favoriteSchema).max(1000),
  })
  .superRefine(({ favorites }, ctx) => {
    favorites.forEach((entry, position) => {
      const next = favorites[position + 1];
      if (next && favoriteOrder(entry, next) >= 0)
        ctx.addIssue({
          code: 'custom',
          message: 'Favoriten doppelt oder nicht absteigend geordnet.',
        });
    });
  });
export type FavoritesIndex = z.infer<typeof favoritesIndexSchema>;
export const emptyFavorites: FavoritesIndex = {
  schemaVersion: 1,
  favorites: [],
};
export const favoritesText = (index: FavoritesIndex) =>
  JSON.stringify(favoritesIndexSchema.parse(index), null, 2) + '\n';

/** The fields of a stored work this package relies on. */
export const workHeadSchema = z.object({
  id: workDateSchema,
  generation: z.number().int().positive(),
  title: z.string().trim().min(1).max(160),
  parentIds: z.array(workDateSchema).max(2),
});
export type WorkHead = z.infer<typeof workHeadSchema>;

/** Every copy the favourites need: each favourite and its direct parents. */
export function requiredCopies(index: FavoritesIndex): Set<string> {
  const paths = new Set<string>();
  for (const { series, id } of index.favorites)
    for (const work of [id, ...parentsOf(series, id)])
      paths.add(favoriteCopyPath(series, work));
  return paths;
}

/** Index after marking or removing one favourite; the input stays unchanged. */
export function changeFavorites(
  index: FavoritesIndex,
  action: 'add' | 'remove',
  entry: Favorite,
): FavoritesIndex {
  const others = index.favorites.filter(
    (item) => item.series !== entry.series || item.id !== entry.id,
  );
  return favoritesIndexSchema.parse({
    schemaVersion: 1,
    favorites:
      action === 'add' ? [...others, entry].toSorted(favoriteOrder) : others,
  });
}
