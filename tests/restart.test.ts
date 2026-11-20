// @vitest-environment node
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import releaseRecord from '../config/release.json';
import { configV3Schema, readGenerationConfig } from '../src/art/schema/config';
import { defaultProfile } from '../src/art/schema/profile';
import {
  favoriteCopyPath,
  favoritesIndexPath,
  favoritesText,
} from '../src/archive/favorites';
import {
  archiveStart,
  indexPath,
  isWorkPath,
  readArchive,
  workPath,
} from '../src/automation/archive';
import { checkFavorites } from '../src/automation/favorites';
import { git, planAt, publishPlan } from '../src/automation/git';
import { prepareRun } from '../src/automation/plan';
import {
  nextRestart,
  restartDate,
  restartFor,
  runningSeries,
} from '../src/series/restart';

// Package C (operator decision of 2026-11-20): the series restarts after a
// number of days. Synthetic series from 2000-01-01 with generator 0.3.0;
// the restart rule does not depend on the generator version.

const v3 = (restartAfterDays: number | null, revision = 4) => ({
  schemaVersion: 3,
  revision,
  seriesStartDate: '2000-01-01',
  generationEnabled: true,
  timezone: 'Europe/Berlin',
  inheritanceMode: 'traceable',
  ...structuredClone(defaultProfile),
  restartAfterDays,
});
const release = { ...releaseRecord, seriesAuthorized: true };
const options = { generatorChangeDate: '2000-01-01' };
const day = (value: number) => `2000-01-${String(value).padStart(2, '0')}`;
/** A run that starts at 08:00 Berlin on `value`, as the late scheduled runs do. */
const run = (
  settings: unknown,
  value: number,
  current: ReadonlyMap<string, string> = new Map(),
) =>
  prepareRun(
    {
      settings,
      release,
      current,
      canonical: current,
      runStartedAt: `${day(value)}T08:00:00+01:00`,
    },
    () => `${day(value)}T07:00:02Z`,
    options,
  );
const ids = (files: ReadonlyMap<string, string>) =>
  [...files.keys()]
    .filter(isWorkPath)
    .map((file) => file.slice(-15, -5))
    .sort();
const series = (files: ReadonlyMap<string, string>) =>
  readArchive(files, archiveStart(files, '2000-01-01'));

describe('Neustartregel (Paket C)', () => {
  it('rechnet den ersten echten Neustart auf den 19.12.2026', () => {
    const running = runningSeries(['2026-11-20', '2026-11-19'], '2026-11-19');
    expect(running).toEqual({ start: '2026-11-19', last: '2026-11-20' });
    expect(nextRestart(running, 30)).toBe('2026-12-19');
    expect(nextRestart(running, null)).toBeNull();
    // Without archived works the series starts at the configured date.
    expect(nextRestart(runningSeries([], '2026-11-19'), 30)).toBe('2026-12-19');
    expect(nextRestart(runningSeries([], null), 30)).toBeNull();
  });

  it('greift nie vor das nächste Werkdatum zurück', () => {
    expect(restartDate('2026-11-19', '2026-11-21', 30)).toBe('2026-12-19');
    // A shorter setting after 13 works: the next run begins the new series.
    expect(restartDate('2026-11-19', '2026-12-02', 10)).toBe('2026-12-02');
  });

  it('überspringt ganze Serien ohne Lauf statt sie nachzuholen', () => {
    expect(restartFor(day(1), day(3), 3, day(3))).toBeNull();
    expect(restartFor(day(1), day(4), 3, day(4))).toBe(day(4));
    expect(restartFor(day(1), day(3), 3, day(6))).toBe(day(4));
    expect(restartFor(day(1), day(3), 3, day(12))).toBe(day(10));
  });
});

describe('Konfigurationsschema 3 (Paket C)', () => {
  it('liest den Neustart in Tagen und vor Schema 3 keinen Neustart', () => {
    expect(readGenerationConfig(v3(30)).restartAfterDays).toBe(30);
    expect(readGenerationConfig(v3(null)).restartAfterDays).toBeNull();
    const { restartAfterDays, ...rest } = v3(null);
    expect(restartAfterDays).toBeNull();
    expect(
      readGenerationConfig({ ...rest, schemaVersion: 2 }).restartAfterDays,
    ).toBeNull();
    // Schema 3 is always written complete.
    expect(configV3Schema.safeParse(rest).success).toBe(false);
  });

  it.each([2, 366, 1.5, '30', 0])('lehnt %s Tage ab', (value) => {
    expect(() => readGenerationConfig(v3(value as number))).toThrow();
  });
});

describe('Tageslauf mit Serienneustart (Paket C)', () => {
  it('löscht am Neustarttag die alte Serie und beginnt mit Generation 1 im selben Lauf', () => {
    const third = run(v3(3), 3);
    expect(ids(third.files)).toEqual([day(1), day(2), day(3)]);
    expect(third.removed).toEqual([]);

    const fourth = run(v3(3), 4, third.files);
    expect(fourth.removed).toEqual([1, 2, 3].map((n) => workPath(day(n))));
    expect(fourth.added).toEqual([workPath(day(4))]);
    expect(ids(fourth.files)).toEqual([day(4)]);
    for (const n of [1, 2, 3])
      expect(fourth.changes.get(workPath(day(n)))).toBeNull();
    const [first] = series(fourth.files);
    expect(first).toMatchObject({ id: day(4), generation: 1, parentIds: [] });
    expect(JSON.parse(fourth.files.get(indexPath)!).works).toEqual([
      { id: day(4), generation: 1, title: first!.title },
    ]);

    // The new series grows as usual and restarts again after three days.
    const sixth = run(v3(3), 6, fourth.files);
    expect(sixth.removed).toEqual([]);
    expect(series(sixth.files).map((work) => work.parentIds)).toEqual([
      [],
      [],
      [day(4), day(5)],
    ]);
    const seventh = run(v3(3), 7, sixth.files);
    expect(ids(seventh.files)).toEqual([day(7)]);
  });

  it('holt verpasste Läufe nicht nach', () => {
    const second = run(v3(3), 2);
    // The old series never gets its third day; the new one starts on time.
    const fifth = run(v3(3), 5, second.files);
    expect(fifth.removed).toEqual([workPath(day(1)), workPath(day(2))]);
    expect(ids(fifth.files)).toEqual([day(4), day(5)]);
    expect(series(fifth.files).map((work) => work.generation)).toEqual([1, 2]);
    // Whole series without any run are skipped.
    const twelfth = run(v3(3), 12, second.files);
    expect(ids(twelfth.files)).toEqual([day(10), day(11), day(12)]);
  });

  it('eine kürzere Einstellung beginnt mit dem nächsten Lauf, ohne gemachte Tage zu ersetzen', () => {
    const fourth = run(v3(30), 4);
    expect(ids(fourth.files)).toEqual([1, 2, 3, 4].map(day));
    const fifth = run(v3(3, 5), 5, fourth.files);
    expect(fifth.removed).toHaveLength(4);
    expect(ids(fifth.files)).toEqual([day(5)]);
  });

  it('ohne Neustartwert oder bei pausierter Generierung bleibt die Serie', () => {
    const third = run(v3(3), 3);
    const v2: Record<string, unknown> = { ...v3(null), schemaVersion: 2 };
    delete v2.restartAfterDays;
    for (const settings of [v3(null), v2]) {
      const fourth = run(settings, 4, third.files);
      expect(fourth.removed).toEqual([]);
      expect(ids(fourth.files)).toEqual([1, 2, 3, 4].map(day));
    }
    const paused = run({ ...v3(3), generationEnabled: false }, 4, third.files);
    expect(paused.changes.size).toBe(0);
  });

  it('lehnt ein Archiv ab, das vor dem Serienstart beginnt', () => {
    const third = run(v3(3), 3);
    expect(() => archiveStart(third.files, day(2))).toThrow(
      'Archiv beginnt vor dem Serienstart.',
    );
    expect(() => archiveStart(third.files, null)).toThrow();
    expect(archiveStart(new Map(), day(2))).toBe(day(2));
  });
});

const temp: string[] = [];
afterEach(() => {
  temp
    .splice(0)
    .forEach((dir) => rmSync(dir, { recursive: true, force: true }));
});
function folder() {
  const root = mkdtempSync(path.join(tmpdir(), 'evolvera-restart-test-'));
  temp.push(root);
  return root;
}
function write(root: string, name: string, text: string) {
  const full = path.join(root, name);
  mkdirSync(path.dirname(full), { recursive: true });
  writeFileSync(full, text);
}

describe('Neustart in Git (Paket C)', () => {
  it('committet das Löschen per Fast-forward und lässt die Favoriten unberührt', () => {
    const root = folder(),
      remote = folder();
    git(remote, ['init', '--bare', '-b', 'main']);
    git(root, ['init', '-b', 'main']);
    git(root, ['config', 'user.name', 'Test']);
    git(root, ['config', 'user.email', 'test@example.invalid']);
    git(root, ['remote', 'add', 'origin', remote]);
    const third = run(v3(3), 3);
    write(
      root,
      'config/generation.json',
      JSON.stringify(v3(3), null, 2) + '\n',
    );
    write(root, 'config/release.json', JSON.stringify(release, null, 2) + '\n');
    for (const [file, text] of third.files) write(root, file, text);
    // The work of 2000-01-02 is a favourite, copied byte for byte.
    const [, favourite] = series(third.files);
    write(
      root,
      favoriteCopyPath(day(1), day(2)),
      third.files.get(workPath(day(2)))!,
    );
    write(
      root,
      favoritesIndexPath,
      favoritesText({
        schemaVersion: 1,
        favorites: [
          {
            series: day(1),
            id: day(2),
            generation: 2,
            title: favourite!.title,
          },
        ],
      }),
    );
    git(root, ['add', '.']);
    git(root, ['commit', '-m', 'Test series of three days']);
    git(root, ['push', 'origin', 'main']);
    const base = git(root, ['rev-parse', 'HEAD']).trim();

    const plan = planAt(
      root,
      base,
      `${day(4)}T08:00:00+01:00`,
      () => `${day(4)}T07:00:02Z`,
      options,
    );
    const commit = publishPlan(root, base, plan);
    expect(git(remote, ['rev-parse', 'main']).trim()).toBe(commit);
    expect(git(root, ['rev-parse', `${commit}^`]).trim()).toBe(base);
    expect(
      git(root, ['diff', '--name-status', '--no-renames', base, commit])
        .trim()
        .split('\n'),
    ).toEqual([
      `D\t${workPath(day(1))}`,
      `D\t${workPath(day(2))}`,
      `D\t${workPath(day(3))}`,
      `A\t${workPath(day(4))}`,
      `M\t${indexPath}`,
    ]);
    // The favourite and its copy stay exactly as they were and still pass
    // the check against Git, although the archived original is gone.
    const favourites = new Map(
      [favoritesIndexPath, favoriteCopyPath(day(1), day(2))].map((file) => [
        file,
        git(root, ['show', `${commit}:${file}`]),
      ]),
    );
    expect(checkFavorites(root, commit, favourites).favorites).toHaveLength(1);
    // A second run on the same day changes nothing.
    expect(
      planAt(
        root,
        commit,
        `${day(4)}T09:00:00+01:00`,
        () => `${day(4)}T08:00:02Z`,
        options,
      ).changes.size,
    ).toBe(0);
  });
});
