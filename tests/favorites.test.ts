// @vitest-environment node
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import {
  changeFavorites,
  emptyFavorites,
  favoritesIndexSchema,
  favoritesText,
  generationOf,
  isFavoritesPath,
  parentsOf,
  requiredCopies,
} from '../src/archive/favorites';
import { checkFavorites } from '../src/automation/favorites';
import { git } from '../src/automation/git';

const series = '2000-01-01';
const entry = (id: string, title = `Werk ${id}`) => ({
  series,
  id,
  generation: generationOf(series, id),
  title,
});

describe('Favoriten: Datenmodell', () => {
  it('leitet Generation und direkte Eltern aus Serienstart und Datum ab', () => {
    expect(generationOf(series, '2000-01-01')).toBe(1);
    expect(generationOf(series, '2000-03-01')).toBe(61);
    expect(parentsOf(series, '2000-01-02')).toEqual([]);
    expect(parentsOf(series, '2000-01-03')).toEqual([
      '2000-01-01',
      '2000-01-02',
    ]);
    // Across a month and a year boundary.
    expect(parentsOf('1999-12-01', '2000-01-01')).toEqual([
      '1999-12-30',
      '1999-12-31',
    ]);
  });
  it('ordnet neu, ersetzt doppelte Markierungen und braucht jede Kopie nur einmal', () => {
    let index = changeFavorites(emptyFavorites, 'add', entry('2000-01-04'));
    index = changeFavorites(index, 'add', entry('2000-01-05'));
    index = changeFavorites(index, 'add', entry('2000-01-04'));
    expect(index.favorites.map((item) => item.id)).toEqual([
      '2000-01-05',
      '2000-01-04',
    ]);
    expect([...requiredCopies(index)].toSorted()).toEqual([
      'public/favorites/2000-01-01/2000-01-02.json',
      'public/favorites/2000-01-01/2000-01-03.json',
      'public/favorites/2000-01-01/2000-01-04.json',
      'public/favorites/2000-01-01/2000-01-05.json',
    ]);
    const removed = changeFavorites(index, 'remove', entry('2000-01-05'));
    expect([...requiredCopies(removed)].toSorted()).toEqual([
      'public/favorites/2000-01-01/2000-01-02.json',
      'public/favorites/2000-01-01/2000-01-03.json',
      'public/favorites/2000-01-01/2000-01-04.json',
    ]);
  });
  it('lehnt falsche Generation, Reihenfolge, Doppel und Zusatzfelder ab', () => {
    const one = entry('2000-01-04');
    for (const favorites of [
      [{ ...one, generation: 3 }],
      [one, entry('2000-01-05')],
      [one, one],
      [{ ...one, extra: true }],
    ])
      expect(
        favoritesIndexSchema.safeParse({ schemaVersion: 1, favorites }).success,
      ).toBe(false);
    expect(favoritesText(emptyFavorites)).toBe(
      '{\n  "schemaVersion": 1,\n  "favorites": []\n}\n',
    );
    expect(isFavoritesPath('public/favorites/index.json')).toBe(true);
    expect(isFavoritesPath('public/favorites/2000-01-01/2000-01-03.json')).toBe(
      true,
    );
    expect(isFavoritesPath('public/favorites/../config/generation.json')).toBe(
      false,
    );
  });
});

const temp: string[] = [];
afterEach(() => {
  temp
    .splice(0)
    .forEach((dir) => rmSync(dir, { recursive: true, force: true }));
});
function write(root: string, name: string, text: string) {
  const full = path.join(root, name);
  mkdirSync(path.dirname(full), { recursive: true });
  writeFileSync(full, text);
}
const work = (id: string) =>
  JSON.stringify(
    {
      id,
      generation: generationOf(series, id),
      title: `Werk ${id}`,
      parentIds: parentsOf(series, id),
    },
    null,
    2,
  ) + '\n';
function repo() {
  const root = mkdtempSync(path.join(tmpdir(), 'evolvera-favorites-test-'));
  temp.push(root);
  git(root, ['init', '-b', 'main']);
  git(root, ['config', 'user.name', 'Test']);
  git(root, ['config', 'user.email', 'test@example.invalid']);
  for (const id of ['2000-01-01', '2000-01-02', '2000-01-03'])
    write(root, `public/artworks/2000/${id}.json`, work(id));
  write(root, 'public/favorites/index.json', favoritesText(emptyFavorites));
  commit(root, 'Archive');
  return root;
}
function commit(root: string, message: string) {
  git(root, ['add', '-A']);
  git(root, ['commit', '-q', '-m', message]);
  return git(root, ['rev-parse', 'HEAD']).trim();
}
/** What the worker commits: copies of the archived bytes and the index. */
function mark(root: string, id: string) {
  for (const copy of [id, ...parentsOf(series, id)])
    write(
      root,
      `public/favorites/${series}/${copy}.json`,
      readFileSync(
        path.join(root, `public/artworks/2000/${copy}.json`),
        'utf8',
      ),
    );
  write(
    root,
    'public/favorites/index.json',
    favoritesText(changeFavorites(emptyFavorites, 'add', entry(id))),
  );
}
function files(root: string) {
  const result = new Map<string, string>();
  const base = path.join(root, 'public/favorites');
  for (const file of readdirSync(base, { recursive: true }) as string[])
    if (!statSync(path.join(base, file)).isDirectory())
      result.set(
        `public/favorites/${file}`,
        readFileSync(path.join(base, file), 'utf8'),
      );
  return result;
}
const check = (root: string) =>
  checkFavorites(root, git(root, ['rev-parse', 'HEAD']).trim(), files(root));

describe('Favoriten: Prüfung gegen Git', () => {
  it('akzeptiert byte-gleiche Kopien samt Eltern, auch nach Löschen des Serienarchivs', () => {
    const root = repo();
    expect(check(root).favorites).toHaveLength(0);
    mark(root, '2000-01-03');
    commit(root, 'Update favourite works');
    expect(check(root).favorites).toHaveLength(1);
    // Restart of the series: the archive goes, the favourites stay valid.
    rmSync(path.join(root, 'public/artworks'), { recursive: true });
    commit(root, 'Restart');
    expect(check(root).favorites[0]?.id).toBe('2000-01-03');
  });
  it('verlangt committete Kopien', () => {
    const root = repo();
    mark(root, '2000-01-03');
    expect(() => check(root)).toThrow(/nicht sicher in Git/);
  });
  it('erkennt veränderte Kopien, auch wenn sie so committet wurden', () => {
    const root = repo();
    mark(root, '2000-01-03');
    const copy = 'public/favorites/2000-01-01/2000-01-01.json';
    write(root, copy, work('2000-01-01').replace('Werk', 'Wrk'));
    commit(root, 'Changed copy');
    expect(() => check(root)).toThrow(/byte-gleich|widerspricht/);
    const later = repo();
    mark(later, '2000-01-03');
    commit(later, 'Update favourite works');
    write(later, copy, work('2000-01-01') + '\n');
    commit(later, 'Edited later');
    expect(() => check(later)).toThrow(/byte-gleich/);
  });
  it('lehnt fehlende, übrige und fremde Dateien sowie freie Formatierung ab', () => {
    const missing = repo();
    mark(missing, '2000-01-03');
    rmSync(path.join(missing, 'public/favorites/2000-01-01/2000-01-02.json'));
    commit(missing, 'Missing parent');
    expect(() => check(missing)).toThrow(/passen nicht/);
    const orphan = repo();
    write(
      orphan,
      'public/favorites/2000-01-01/2000-01-01.json',
      work('2000-01-01'),
    );
    commit(orphan, 'Orphan');
    expect(() => check(orphan)).toThrow(/passen nicht/);
    const foreign = repo();
    write(foreign, 'public/favorites/notes.json', '{}\n');
    commit(foreign, 'Foreign');
    expect(() => check(foreign)).toThrow(/Unerwarteter Pfad/);
    const loose = repo();
    write(
      loose,
      'public/favorites/index.json',
      JSON.stringify(emptyFavorites) + '\n',
    );
    expect(() => check(loose)).toThrow(/kanonisch/);
  });
});
