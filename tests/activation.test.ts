// @vitest-environment node
import { createHash } from 'node:crypto';
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import generationRecord from '../config/generation.json';
import releaseRecord from '../config/release.json';
import type { ArtworkV3 } from '../src/art/schema/artwork-v3';
import { defaultProfile } from '../src/art/schema/profile';
import { indexPath, readArchive, readWorks } from '../src/automation/archive';
import {
  canonicalHistory,
  git,
  planAt,
  publishPlan,
} from '../src/automation/git';
import { prepareRun } from '../src/automation/plan';
import {
  generatorChangeDate,
  generatorVersionFor,
} from '../src/series/calendar';

// EP-01 P7: the dated generator change in the daily run, tested without
// activating it. The published change date stays `null`; the tests pass
// their own date. Real archive bytes are only read; all writes happen in
// isolated temporary repositories with a local bare remote.

const archive = new Map<string, string>();
for (const file of readdirSync('public/artworks', { recursive: true }))
  if (String(file).endsWith('.json'))
    archive.set(
      `public/artworks/${String(file)}`,
      readFileSync(`public/artworks/${String(file)}`, 'utf8'),
    );
const oldWorks = readWorks(archive, generationRecord.seriesStartDate);
const lastOld = oldWorks.at(-1)!.id;
const day = (id: string, offset: number) => {
  const date = new Date(`${id}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + offset);
  return date.toISOString().slice(0, 10);
};
/** Change date four days after the last archived work. */
const change = day(lastOld, 4);
const at = (id: string) => `${id}T08:00:00+01:00`;
const clock = (id: string) => () => `${id}T07:00:02Z`;
const sha = (text: string) => createHash('sha256').update(text).digest('hex');
/** Synthetic record of an art review; the real one comes with the activation. */
const reviewed = {
  ...releaseRecord,
  artReviewV3: {
    generatorVersion: '0.3.0',
    rendererVersion: '2',
    approvedOn: '2026-11-12',
    workCount: 40,
    statement: 'Synthetischer Testnachweis',
    fixtureSha256: { standard: 'a'.repeat(64), profiles: 'b'.repeat(64) },
  },
};
const input = (runDay: string, release: unknown = reviewed) => ({
  settings: generationRecord,
  release,
  current: archive,
  canonical: archive,
  runStartedAt: at(runDay),
});
const parse = (plan: { files: ReadonlyMap<string, string> }) =>
  readArchive(plan.files, generationRecord.seriesStartDate);
const expectOldBytes = (files: ReadonlyMap<string, string>) => {
  for (const [file, text] of archive)
    if (file !== indexPath) expect(sha(files.get(file)!)).toBe(sha(text));
};

describe('Datierter Generatorwechsel im Tageslauf (nicht aktiviert)', () => {
  it('ist im veröffentlichten Stand nicht gesetzt', () => {
    expect(generatorChangeDate).toBeNull();
    expect(generatorVersionFor('2099-01-01')).toBe('0.2.0');
    expect(generatorVersionFor(change, change)).toBe('0.3.0');
    expect(generatorVersionFor(day(change, -1), change)).toBe('0.2.0');
    // The real release record carries no review of generator 0.3.0 yet.
    expect('artReviewV3' in releaseRecord).toBe(false);
  });

  it('erzeugt ohne Wechseldatum weiter mit Generator 0.2.0 und lässt alte Bytes unberührt', () => {
    const runDay = day(lastOld, 6);
    const plan = prepareRun(input(runDay, releaseRecord), clock(runDay));
    const works = parse(plan);
    expect(plan.added).toHaveLength(6);
    expect(plan.restored).toEqual([]);
    for (const work of works.slice(oldWorks.length)) {
      expect(work.schemaVersion).toBe(2);
      expect(work.generatorVersion).toBe('0.2.0');
      expect(work.rendererVersion).toBe('1');
    }
    expectOldBytes(plan.files);
    // Same result as the reader of the running series: nothing of schema 3.
    expect(
      readWorks(plan.files, generationRecord.seriesStartDate),
    ).toHaveLength(works.length);
  });

  it('wechselt genau am Datum auf Generator 0.3.0, Schema 3 und Renderer 2', () => {
    const runDay = day(change, 2);
    const plan = prepareRun(input(runDay), clock(runDay), {
      generatorChangeDate: change,
    });
    const works = parse(plan);
    const added = works.slice(oldWorks.length);
    expect(added.map((work) => work.id)).toEqual(
      Array.from({ length: 6 }, (_, index) => day(lastOld, index + 1)),
    );
    expect(added.map((work) => work.generatorVersion)).toEqual([
      '0.2.0',
      '0.2.0',
      '0.2.0',
      '0.3.0',
      '0.3.0',
      '0.3.0',
    ]);
    const fresh = added.slice(3) as ArtworkV3[];
    for (const work of fresh) {
      expect(work.schemaVersion).toBe(3);
      expect(work.rendererVersion).toBe('2');
      expect(work.seed.startsWith(`evolvera:0.3.0:${work.id}:settings-`)).toBe(
        true,
      );
      // Standard profile from the schema 1 configuration, bound to its revision.
      expect(work.settings).toEqual({
        inheritanceMode: generationRecord.inheritanceMode,
        ...defaultProfile,
      });
      expect(work.settingsRevision).toBe(generationRecord.revision);
      expect(work.novelty.distance).not.toBeNull();
    }
    // Generations continue; the first new works have parents of schema 2.
    expect(fresh[0]!.generation).toBe(oldWorks.length + 4);
    expect(fresh[0]!.parentIds).toEqual([day(change, -2), day(change, -1)]);
    expect(fresh[1]!.parentIds).toEqual([day(change, -1), change]);
    expect(fresh[2]!.parentIds).toEqual([change, day(change, 1)]);
    expect(fresh.map((work) => work.isCatchUp)).toEqual([true, true, false]);
    expectOldBytes(plan.files);
    // Works before the date do not depend on the change date at all.
    const without = prepareRun(
      input(day(change, -1), releaseRecord),
      clock(runDay),
    );
    for (const work of added.slice(0, 3)) {
      const file = `public/artworks/${work.id.slice(0, 4)}/${work.id}.json`;
      expect(JSON.parse(plan.files.get(file)!).dna).toEqual(
        JSON.parse(without.files.get(file)!).dna,
      );
    }
  });

  it('holt über das Wechseldatum hinweg dieselben Werke nach wie pünktliche Tagesläufe', () => {
    const runDay = day(change, 2);
    const late = parse(
      prepareRun(input(runDay), clock(runDay), { generatorChangeDate: change }),
    );
    let files = new Map(archive);
    for (let offset = 1; offset <= 6; offset++) {
      const today = day(lastOld, offset);
      const plan = prepareRun(
        { ...input(today), current: files, canonical: files },
        clock(today),
        { generatorChangeDate: change },
      );
      expect(plan.added).toHaveLength(1);
      files = new Map(plan.files);
    }
    const daily = readArchive(files, generationRecord.seriesStartDate);
    expect(daily.map((work) => work.id)).toEqual(late.map((work) => work.id));
    daily.forEach((work, index) => {
      const other = late[index]!;
      expect(work.dna).toEqual(other.dna);
      expect(work.title).toBe(other.title);
      expect(work.seed).toBe(other.seed);
      if (work.schemaVersion === 3 && other.schemaVersion === 3)
        expect(work.novelty).toEqual(other.novelty);
    });
    // Only run metadata differs.
    expect(daily.slice(-3).map((work) => work.isCatchUp)).toEqual([
      false,
      false,
      false,
    ]);
  });

  it('stoppt ohne dokumentierte Kunstabnahme vor dem ersten Werk von Generator 0.3.0', () => {
    expect(() =>
      prepareRun(input(change, releaseRecord), clock(change), {
        generatorChangeDate: change,
      }),
    ).toThrow(/Kunstabnahme für Generator 0\.3\.0/);
    // Before the date the same record is sufficient.
    const before = day(change, -1);
    expect(
      prepareRun(input(before, releaseRecord), clock(before), {
        generatorChangeDate: change,
      }).added,
    ).toHaveLength(3);
  });

  it('lehnt Werke ab, die nicht zum Wechseldatum passen', () => {
    const runDay = day(change, 1);
    const plan = prepareRun(input(runDay), clock(runDay), {
      generatorChangeDate: change,
    });
    const next = day(runDay, 1);
    const rerun = (generatorChange: string | null) =>
      prepareRun(
        { ...input(next), current: plan.files, canonical: plan.files },
        clock(next),
        { generatorChangeDate: generatorChange },
      );
    expect(rerun(change).added).toHaveLength(1);
    // Schema 3 in the archive without a change date, or with a later one.
    expect(() => rerun(null)).toThrow(/Generatorwechsel/);
    expect(() => rerun(day(change, 1))).toThrow(/Generatorwechsel/);
    // A change date at or before an archived work of generator 0.2.0.
    expect(() => rerun(day(change, -1))).toThrow(/Generatorwechsel/);
    expect(() =>
      prepareRun(input(runDay), clock(runDay), {
        generatorChangeDate: lastOld,
      }),
    ).toThrow(/Generatorwechsel/);
  });

  it('reicht höchstens 30 Werke als geordneten Historienkontext weiter', () => {
    const settings = {
      ...generationRecord,
      seriesStartDate: '2000-01-01',
    };
    const runDay = '2000-02-05';
    const plan = prepareRun(
      {
        settings,
        release: reviewed,
        current: new Map(),
        canonical: new Map(),
        runStartedAt: `${runDay}T08:00:00+01:00`,
      },
      clock(runDay),
      { generatorChangeDate: '2000-01-01' },
    );
    // 36 works; the strict reader recomputes digest and distance of every
    // work from the 30 works before it.
    const works = readArchive(plan.files, '2000-01-01');
    expect(works).toHaveLength(36);
    expect(works.every((work) => work.schemaVersion === 3)).toBe(true);
    expect(works.slice(0, 2).map((work) => work.parentIds)).toEqual([[], []]);
  }, 120_000);
});

describe('Generatorwechsel in isolierten Git-Repositories', () => {
  const temp: string[] = [];
  afterEach(() => {
    temp
      .splice(0)
      .forEach((dir) => rmSync(dir, { recursive: true, force: true }));
  });
  function folder() {
    const root = mkdtempSync(path.join(tmpdir(), 'evolvera-activation-test-'));
    temp.push(root);
    return root;
  }
  function write(root: string, name: string, text: string) {
    const full = path.join(root, name);
    mkdirSync(path.dirname(full), { recursive: true });
    writeFileSync(full, text);
  }
  /** Copy of the real archive, committed work by work like the daily run. */
  function repo() {
    const root = folder();
    const remote = folder();
    git(remote, ['init', '--bare', '-b', 'main']);
    git(root, ['init', '-b', 'main']);
    git(root, ['config', 'user.name', 'Test']);
    git(root, ['config', 'user.email', 'test@example.invalid']);
    git(root, ['remote', 'add', 'origin', remote]);
    write(root, 'config/generation.json', JSON.stringify(generationRecord));
    write(root, 'config/release.json', JSON.stringify(reviewed));
    for (const [file, text] of archive) write(root, file, text);
    git(root, ['add', '.']);
    git(root, ['commit', '-m', 'Test copy of the archive']);
    git(root, ['push', 'origin', 'main']);
    return { root, base: git(root, ['rev-parse', 'HEAD']).trim() };
  }
  const blobs = (root: string, revision: string) =>
    git(root, ['ls-tree', '-r', revision, '--', 'public/artworks'])
      .trim()
      .split('\n');

  it('archiviert vor und nach dem Wechseldatum, ohne ein altes Werk zu berühren', () => {
    const { root, base } = repo();
    const options = { generatorChangeDate: change };
    const before = blobs(root, base);
    // Run on the last day before the change: generator 0.2.0 only.
    const eve = day(change, -1);
    const first = publishPlan(
      root,
      base,
      planAt(root, base, at(eve), clock(eve), options),
    );
    // Late run two days after the change: catch-up across the date.
    const runDay = day(change, 2);
    const plan = planAt(root, first, at(runDay), clock(runDay), options);
    expect(plan.added).toHaveLength(3);
    const second = publishPlan(root, first, plan);
    const changed = git(root, ['diff', '--name-status', base, second])
      .trim()
      .split('\n');
    expect(changed.filter((line) => line.startsWith('A'))).toHaveLength(6);
    expect(changed.filter((line) => !line.startsWith('A'))).toEqual([
      `M\t${indexPath}`,
    ]);
    // Every old blob is still there with the same object id.
    const after = blobs(root, second);
    for (const line of before)
      if (!line.endsWith(indexPath)) expect(after).toContain(line);
    for (const [file, text] of archive)
      if (file !== indexPath)
        expect(git(root, ['show', `${second}:${file}`])).toBe(text);
    const works = readArchive(
      canonicalHistory(root, second),
      generationRecord.seriesStartDate,
    );
    expect(works.slice(-6).map((work) => work.generatorVersion)).toEqual([
      '0.2.0',
      '0.2.0',
      '0.2.0',
      '0.3.0',
      '0.3.0',
      '0.3.0',
    ]);
    // Idempotent: the same run again archives nothing.
    const again = planAt(
      root,
      second,
      at(runDay),
      () => {
        throw new Error('Schon archiviert');
      },
      options,
    );
    expect(again.changes.size).toBe(0);
    // A deleted schema 3 work comes back from its first Git bytes.
    const lost = `public/artworks/${runDay.slice(0, 4)}/${runDay}.json`;
    const original = git(root, ['show', `${second}:${lost}`]);
    git(root, ['fetch', 'origin', 'main']);
    git(root, ['reset', '--hard', second]);
    git(root, ['rm', '-q', lost]);
    git(root, ['commit', '-m', 'Test damage']);
    const damaged = git(root, ['rev-parse', 'HEAD']).trim();
    const repair = planAt(
      root,
      damaged,
      at(runDay),
      () => {
        throw new Error('Keine Neuerzeugung');
      },
      options,
    );
    expect(repair.restored).toEqual([lost]);
    expect(repair.added).toEqual([]);
    expect(repair.files.get(lost)).toBe(original);
    // Many real git processes: exceeded the default 5 s on the CI runner.
  }, 120_000);
});
