import { z } from 'zod';
import { workDateSchema } from '../../src/art/schema/config';
import {
  changeFavorites,
  emptyFavorites,
  favoriteCopyPath,
  favoritesIndexPath,
  favoritesIndexSchema,
  favoritesText,
  generationOf,
  parentsOf,
  requiredCopies,
  workHeadSchema,
} from '../../src/archive/favorites';
import type { FavoritesIndex } from '../../src/archive/favorites';
import { nextRestart, runningSeries } from '../../src/series/restart';
import {
  archiveWorksAt,
  github,
  GitHubFailure,
  head,
  installationToken,
  readAt,
  readFile,
  repo,
} from './github';
import type { GitHubEnv } from './github';

// Package B: the operator marks or removes favourites. One atomic commit on
// top of the current main: the copies reuse the Git blobs of the archived
// works (byte-equal by construction) and the index is rewritten. The ref is
// only moved forward; a parallel commit yields a conflict, never an overwrite.

const sha = z.string().regex(/^[a-f0-9]{40}$/);
const workPath = (id: string) => `public/artworks/${id.slice(0, 4)}/${id}.json`;

async function favoritesAt(token: string, ref: string) {
  const file = await readFile(token, favoritesIndexPath, ref);
  return file
    ? favoritesIndexSchema.parse(JSON.parse(file.text))
    : emptyFavorites;
}
async function viewAt(token: string, ref: string) {
  const [{ config }, works, favorites] = await Promise.all([
    readAt(token, ref),
    archiveWorksAt(token, ref),
    favoritesAt(token, ref),
  ]);
  // Package C: the running series starts with its first archived work.
  const running = runningSeries(
    works.map((work) => work.id),
    config.seriesStartDate,
  );
  return {
    series: running.start,
    works: running.start ? works : [],
    favorites,
    restart: nextRestart(running, config.restartAfterDays),
  };
}
export type FavoritesView = Awaited<ReturnType<typeof viewAt>>;

export async function readFavorites(env: GitHubEnv) {
  const token = await installationToken(env);
  return viewAt(token, await head(token));
}

export const favoriteRequest = z.strictObject({
  csrf: z.string().max(64),
  action: z.enum(['add', 'remove']),
  series: workDateSchema,
  id: workDateSchema,
});

/** A copy of an archived work: its blob and the fields the index records. */
async function archivedWork(
  token: string,
  ref: string,
  series: string,
  id: string,
) {
  const file = await readFile(token, workPath(id), ref);
  if (!file) throw new GitHubFailure(400);
  const work = workHeadSchema.parse(JSON.parse(file.text));
  if (
    work.id !== id ||
    work.generation !== generationOf(series, id) ||
    JSON.stringify(work.parentIds) !== JSON.stringify(parentsOf(series, id))
  )
    throw new GitHubFailure(502);
  return { sha: file.sha, work };
}

export async function changeFavorite(
  env: GitHubEnv,
  input: Omit<z.infer<typeof favoriteRequest>, 'csrf'>,
) {
  const token = await installationToken(env);
  const base = await head(token);
  const before = await viewAt(token, base);
  const { action, series, id } = input;
  const listed = before.favorites.favorites.find(
    (entry) => entry.series === series && entry.id === id,
  );
  if (action === 'add' ? listed : !listed)
    return { view: before, changed: false };
  let entries: { path: string; sha: string | null }[];
  let next: FavoritesIndex;
  if (action === 'add') {
    // Only works of the running series can be marked.
    if (series !== before.series || id < series) throw new GitHubFailure(400);
    const marked = await archivedWork(token, base, series, id);
    next = changeFavorites(before.favorites, 'add', {
      series,
      id,
      generation: marked.work.generation,
      title: marked.work.title,
    });
    const present = requiredCopies(before.favorites);
    const copies = [marked];
    for (const parent of marked.work.parentIds)
      if (!present.has(favoriteCopyPath(series, parent)))
        copies.push(await archivedWork(token, base, series, parent));
    entries = copies
      .filter(({ work }) => !present.has(favoriteCopyPath(series, work.id)))
      .map(({ sha, work }) => ({
        path: favoriteCopyPath(series, work.id),
        sha,
      }));
  } else {
    next = changeFavorites(before.favorites, 'remove', listed!);
    const kept = requiredCopies(next);
    entries = [...requiredCopies(before.favorites)]
      .filter((path) => !kept.has(path))
      .map((path) => ({ path, sha: null }));
  }
  const text = favoritesText(next);
  const commit = z
    .object({ tree: z.object({ sha }) })
    .parse(await github(`${repo}/git/commits/${base}`, token));
  const tree = z.object({ sha }).parse(
    await github(`${repo}/git/trees`, token, 'POST', {
      base_tree: commit.tree.sha,
      tree: [
        ...entries.map((entry) => ({
          path: entry.path,
          mode: '100644',
          type: 'blob',
          sha: entry.sha,
        })),
        {
          path: favoritesIndexPath,
          mode: '100644',
          type: 'blob',
          content: text,
        },
      ],
    }),
  );
  const created = z.object({ sha }).parse(
    await github(`${repo}/git/commits`, token, 'POST', {
      message: 'Update favourite works',
      tree: tree.sha,
      parents: [base],
    }),
  );
  try {
    await github(`${repo}/git/refs/heads/main`, token, 'PATCH', {
      sha: created.sha,
      force: false,
    });
  } catch (error) {
    // Not a fast-forward: main moved in between. Nothing was overwritten.
    if (error instanceof GitHubFailure && error.status === 422)
      throw new GitHubFailure(409);
    throw error;
  }
  const verified = await readFile(token, favoritesIndexPath, created.sha);
  if (verified?.text !== text) throw new GitHubFailure(502);
  return { view: { ...before, favorites: next }, changed: true };
}
