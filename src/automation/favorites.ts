import { workPath } from './archive';
import { git } from './git';
import {
  favoriteCopyPath,
  favoritesIndexPath,
  favoritesIndexSchema,
  favoritesText,
  isFavoriteCopyPath,
  parentsOf,
  requiredCopies,
  workHeadSchema,
} from '../archive/favorites';

/**
 * Package B: checks the favourites against Git. `files` holds every file
 * below `public/favorites`. Each copy must be committed, unchanged since it
 * was added and byte-equal to the archived work in that same commit; the
 * index must describe exactly the copies that exist.
 */
export function checkFavorites(
  root: string,
  revision: string,
  files: ReadonlyMap<string, string>,
) {
  for (const path of files.keys())
    if (path !== favoritesIndexPath && !isFavoriteCopyPath(path))
      throw new Error('Unerwarteter Pfad unter public/favorites.');
  const text = files.get(favoritesIndexPath);
  if (text === undefined) throw new Error('Favoritenindex fehlt.');
  const index = favoritesIndexSchema.parse(JSON.parse(text));
  if (text !== favoritesText(index))
    throw new Error('Favoritenindex ist nicht kanonisch geschrieben.');
  const required = requiredCopies(index);
  const copies = [...files.keys()].filter(isFavoriteCopyPath);
  if (
    copies.length !== required.size ||
    copies.some((path) => !required.has(path))
  )
    throw new Error('Favoritenkopien passen nicht zum Favoritenindex.');
  const heads = new Map(
    copies.map((path) => {
      const [, series, id] = path.match(
        /^public\/favorites\/([^/]+)\/([^/]+)\.json$/,
      )!;
      const head = workHeadSchema.parse(JSON.parse(files.get(path)!));
      if (
        head.id !== id ||
        JSON.stringify(head.parentIds) !==
          JSON.stringify(parentsOf(series!, id!))
      )
        throw new Error('Favoritenkopie widerspricht ihrem Pfad oder Eltern.');
      return [path, head];
    }),
  );
  for (const entry of index.favorites) {
    const head = heads.get(favoriteCopyPath(entry.series, entry.id))!;
    if (head.title !== entry.title || head.generation !== entry.generation)
      throw new Error('Favoritenindex widerspricht der Werkkopie.');
  }
  for (const path of copies) {
    const added = git(root, [
      'log',
      '--diff-filter=A',
      '--format=%H',
      revision,
      '--',
      path,
    ])
      .trim()
      .split('\n')[0];
    if (!added)
      throw new Error('Favoritenkopie noch nicht sicher in Git archiviert.');
    for (const at of [added, revision])
      if (!git(root, ['ls-tree', at, '--', path]).startsWith('100644 blob '))
        throw new Error('Favoritenkopien dürfen keine Links sein.');
    const source = workPath(heads.get(path)!.id);
    if (
      git(root, ['show', `${added}:${path}`]) !== files.get(path) ||
      git(root, ['show', `${added}:${source}`]) !== files.get(path)
    )
      throw new Error(
        'Favoritenkopie ist nicht byte-gleich mit dem archivierten Werk.',
      );
  }
  return index;
}
