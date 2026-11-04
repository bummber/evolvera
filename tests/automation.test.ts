// @vitest-environment node
import {
  mkdtempSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  rmSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { afterEach, describe, expect, it } from 'vitest';
import releaseRecord from '../config/release.json';
const release = { ...releaseRecord, seriesAuthorized: false };
import { prepareRun } from '../src/automation/plan';
import { cycleDate, scheduledFor } from '../src/automation/calendar';
import {
  canonicalHistory,
  commitPlan,
  git,
  planAt,
  publishPlan,
} from '../src/automation/git';
import { indexPath, indexText, readWorks } from '../src/automation/archive';
const settings = {
  schemaVersion: 1,
  revision: 1,
  seriesStartDate: '2000-01-01',
  generationEnabled: true,
  timezone: 'Europe/Berlin',
  inheritanceMode: 'traceable',
} as const;
const enabled = { ...release, seriesAuthorized: true };
const start = {
  settings,
  release: enabled,
  current: new Map<string, string>(),
  canonical: new Map<string, string>(),
  runStartedAt: '2000-01-03T04:00:00+01:00',
};
const clock = () => '2000-01-03T03:00:02Z';
const temp: string[] = [];
afterEach(() => {
  temp
    .splice(0)
    .forEach((dir) => rmSync(dir, { recursive: true, force: true }));
});
function folder() {
  const root = mkdtempSync(path.join(tmpdir(), 'evolvera-run-test-'));
  temp.push(root);
  return root;
}
function file(root: string, name: string, value: unknown) {
  const full = path.join(root, name);
  mkdirSync(path.dirname(full), { recursive: true });
  writeFileSync(
    full,
    typeof value === 'string' ? value : JSON.stringify(value, null, 2) + '\n',
  );
}
function repo() {
  const root = folder(),
    remote = folder();
  git(remote, ['init', '--bare', '-b', 'main']);
  git(root, ['init', '-b', 'main']);
  git(root, ['config', 'user.name', 'Test']);
  git(root, ['config', 'user.email', 'test@example.invalid']);
  git(root, ['remote', 'add', 'origin', remote]);
  file(root, 'config/generation.json', settings);
  file(root, 'config/release.json', enabled);
  file(root, indexPath, { schemaVersion: 1, works: [] });
  git(root, ['add', '.']);
  git(root, ['commit', '-m', 'Test initial state']);
  git(root, ['push', 'origin', 'main']);
  return { root, remote, base: git(root, ['rev-parse', 'HEAD']).trim() };
}
describe('Tageslauf ohne Datei-/Netzwerkzugriff', () => {
  it('erzeugt chronologisch drei Tage mit zwei unabhängigen Ursprüngen und Nachholmetadaten', () => {
    const plan = prepareRun(start, clock);
    const works = readWorks(plan.files, settings.seriesStartDate);
    expect(works.map((work) => work.generation)).toEqual([1, 2, 3]);
    expect(works.map((work) => work.parentIds)).toEqual([
      [],
      [],
      ['2000-01-01', '2000-01-02'],
    ]);
    expect(works.map((work) => work.isCatchUp)).toEqual([true, true, false]);
    expect(works.map((work) => work.generatedAt)).toEqual([
      clock(),
      clock(),
      clock(),
    ]);
    expect(plan.added).toHaveLength(3);
    expect(Object.isFrozen(plan.settings)).toBe(true);
  });
  it('zieht Generation 2 am ersten Serientag nicht vor und generiert vor 04:00 keine Zukunft', () => {
    expect(
      prepareRun(
        { ...start, runStartedAt: '2000-01-01T04:00:00+01:00' },
        () => '2000-01-01T03:00:02Z',
      ).added,
    ).toHaveLength(1);
    expect(
      prepareRun({ ...start, runStartedAt: '2000-01-01T03:59:59+01:00' }, clock)
        .added,
    ).toHaveLength(0);
    expect(
      prepareRun({ ...start, runStartedAt: '2000-01-03T03:59:59+01:00' }, clock)
        .added,
    ).toHaveLength(2);
  });
  it('bleibt idempotent, stellt fehlendes Serienende und gültig manipulierte Daten bytegenau wieder her', () => {
    const plan = prepareRun(start, clock),
      canonical = new Map(
        [...plan.files].filter(([name]) => name !== indexPath),
      );
    expect(
      prepareRun({ ...start, current: plan.files, canonical }, clock).changes
        .size,
    ).toBe(0);
    const damaged = new Map(plan.files);
    damaged.delete(plan.added[2]!);
    damaged.set(
      plan.added[0]!,
      plan.files.get(plan.added[0]!)!.replace('Hintergrund', 'anderer Text'),
    );
    damaged.set(
      plan.added[0]!,
      JSON.stringify({
        ...JSON.parse(damaged.get(plan.added[0]!)!),
        title: 'Manipulierter Titel',
      }),
    );
    damaged.set(indexPath, 'kaputt');
    const repaired = prepareRun(
      { ...start, current: damaged, canonical },
      () => {
        throw new Error('Keine Neugenerierung erlaubt');
      },
    );
    expect(repaired.added).toHaveLength(0);
    expect(repaired.restored).toHaveLength(2);
    expect(repaired.files).toEqual(plan.files);
  });
  it('stoppt bei fehlender sicherer Historie oder kaputtem ersten Archivstand vor Generierung', () => {
    const plan = prepareRun(start, clock);
    expect(() => prepareRun({ ...start, current: plan.files }, clock)).toThrow(
      /Git-Herkunft/,
    );
    const damaged = new Map([[plan.added[0]!, 'invalid']]);
    expect(() =>
      prepareRun({ ...start, current: damaged, canonical: damaged }, clock),
    ).toThrow();
  });
  it('hält einen Snapshot trotz Konfigurationswechsel während der Erstellung', () => {
    const mutable = { ...settings };
    let calls = 0;
    const plan = prepareRun({ ...start, settings: mutable }, () => {
      calls++;
      Object.assign(mutable, { inheritanceMode: 'free', revision: 2 });
      return clock();
    });
    expect(calls).toBe(3);
    expect(
      readWorks(plan.files, settings.seriesStartDate).every(
        (work) =>
          work.settingsRevision === 1 && work.inheritanceMode === 'traceable',
      ),
    ).toBe(true);
  });
  it('schreibt bei einem Erzeugungsfehler keinen Teilstand in Eingabedaten', () => {
    const current = new Map<string, string>();
    let calls = 0;
    expect(() =>
      prepareRun({ ...start, current }, () => {
        if (++calls === 2) throw new Error('Uhr ausgefallen');
        return clock();
      }),
    ).toThrow();
    expect(current.size).toBe(0);
  });
  it('erzwingt Kunstabnahme plus separate Serienfreigabe und respektiert deaktivierten Modus', () => {
    expect(() => prepareRun({ ...start, release }, clock)).toThrow(
      /Serienfreigabe/,
    );
    expect(() =>
      prepareRun(
        {
          ...start,
          release: {
            ...enabled,
            artReview: { ...enabled.artReview, status: 'pending' },
          },
        },
        clock,
      ),
    ).toThrow();
    const off = {
      ...settings,
      seriesStartDate: null,
      generationEnabled: false,
    };
    expect(
      prepareRun({ ...start, settings: off, release }, clock).added,
    ).toHaveLength(0);
  });
  it.each([
    ['2026-03-29T01:59:59Z', '2026-03-28'],
    ['2026-03-29T02:00:00Z', '2026-03-29'],
    ['2026-10-25T02:59:59Z', '2026-10-24'],
    ['2026-10-25T03:00:00Z', '2026-10-25'],
  ])('beachtet Berlin bei %s', (now, date) =>
    expect(cycleDate(now)).toBe(date),
  );
  it('plant 04:00 mit passendem Sommer-/Winteroffset', () => {
    expect(scheduledFor('2026-03-29')).toBe('2026-03-29T04:00:00+02:00');
    expect(scheduledFor('2026-10-25')).toBe('2026-10-25T04:00:00+01:00');
  });
});
describe('Echte isolierte lokale Git-Repositories ohne GitHub-Zugriff', () => {
  it('schützt kanonische Werkbytes vor Formatierung und prüft sonstige JSON-Dateien weiter', () => {
    const { root } = repo();
    const plan = prepareRun(
      { ...start, runStartedAt: '2000-01-01T04:00:00+01:00' },
      () => '2000-01-01T03:00:01Z',
    );
    for (const [name, bytes] of plan.files) file(root, name, bytes);
    file(
      root,
      '.prettierignore',
      readFileSync(new URL('../.prettierignore', import.meta.url), 'utf8'),
    );
    const checkFormat = () =>
      spawnSync(
        process.execPath,
        [
          fileURLToPath(
            new URL(
              '../node_modules/prettier/bin/prettier.cjs',
              import.meta.url,
            ),
          ),
          '--check',
          '.',
        ],
        { cwd: root, encoding: 'utf8' },
      );
    const valid = checkFormat();
    expect(valid.status, valid.stdout + valid.stderr).toBe(0);
    file(root, 'config/format-control.json', '{"needs":"formatting"}');
    const control = checkFormat();
    expect(control.status).toBe(1);
    expect(control.stdout + control.stderr).toContain(
      'config/format-control.json',
    );
    for (const [name, bytes] of plan.files)
      expect(readFileSync(path.join(root, name), 'utf8')).toBe(bytes);
  });
  it('archiviert atomar, erkennt Historie und erzeugt nach Deployfehler dieselben Werke nicht erneut', () => {
    const { root, base } = repo();
    const plan = planAt(root, base, start.runStartedAt, clock);
    const committed = publishPlan(root, base, plan);
    expect(git(root, ['rev-parse', 'HEAD']).trim()).toBe(base);
    expect(git(root, ['status', '--porcelain']).trim()).toBe('');
    const again = planAt(root, committed, start.runStartedAt, () => {
      throw new Error('Schon archiviert');
    });
    expect(again.changes.size).toBe(0);
    expect(again.added).toHaveLength(0);
    expect(canonicalHistory(root, committed).size).toBe(3);
    expect(
      JSON.parse(git(root, ['show', `${committed}:${indexPath}`])).works,
    ).toHaveLength(3);
  });
  it('integriert einen parallelen Moduscommit einmal ohne Snapshot-/Archivänderung', () => {
    const { root, remote, base } = repo();
    const plan = planAt(root, base, start.runStartedAt, clock);
    const clone = folder();
    git(clone, ['clone', remote, '.']);
    git(clone, ['config', 'user.name', 'Test']);
    git(clone, ['config', 'user.email', 'test@example.invalid']);
    const committed = publishPlan(root, base, plan, () => {
      file(clone, 'config/generation.json', {
        ...settings,
        inheritanceMode: 'free',
        revision: 2,
      });
      git(clone, ['add', '.']);
      git(clone, ['commit', '-m', 'Mode during run']);
      git(clone, ['push', 'origin', 'main']);
    });
    expect(
      JSON.parse(git(root, ['show', `${committed}:config/generation.json`]))
        .revision,
    ).toBe(2);
    const work = JSON.parse(
      git(root, ['show', `${committed}:${plan.added[2]}`]),
    );
    expect(work.inheritanceMode).toBe('traceable');
    expect(work.settingsRevision).toBe(1);
  });
  it('stoppt bei parallelem Codecommit statt fremden Stand zu überschreiben', () => {
    const { root, remote, base } = repo();
    const plan = planAt(root, base, start.runStartedAt, clock);
    const clone = folder();
    git(clone, ['clone', remote, '.']);
    git(clone, ['config', 'user.name', 'Test']);
    git(clone, ['config', 'user.email', 'test@example.invalid']);
    expect(() =>
      publishPlan(root, base, plan, () => {
        file(clone, 'new-code.ts', 'export const changed=true;');
        git(clone, ['add', '.']);
        git(clone, ['commit', '-m', 'Parallel code']);
        git(clone, ['push', 'origin', 'main']);
      }),
    ).toThrow(/Code-/);
    expect(git(remote, ['show', 'main:new-code.ts'])).toContain('changed=true');
    expect(git(remote, ['ls-tree', '-r', '--name-only', 'main'])).not.toContain(
      '2000-01-03',
    );
  });
  it('behebt einen später gelöschten letzten Tag anhand seiner ersten Git-Bytes', () => {
    const { root, base } = repo();
    const plan = planAt(root, base, start.runStartedAt, clock);
    const committed = commitPlan(root, base, plan.changes);
    git(root, ['checkout', '--detach', committed]);
    const deleted = plan.added[2]!;
    git(root, ['rm', deleted]);
    git(root, ['commit', '-m', 'Simulated archive damage']);
    const repaired = planAt(
      root,
      git(root, ['rev-parse', 'HEAD']).trim(),
      start.runStartedAt,
      () => {
        throw new Error('Nicht neu würfeln');
      },
    );
    expect(repaired.restored).toEqual([deleted]);
    expect(repaired.changes.get(deleted)).toBe(plan.files.get(deleted));
    expect(repaired.added).toHaveLength(0);
    expect(indexText(readWorks(plan.files, settings.seriesStartDate))).toBe(
      plan.files.get(indexPath),
    );
  });
});

it('lässt bei zwei vorbereiteten gleichzeitigen Läufen höchstens einen Archivstand passieren', () => {
  const { root, remote, base } = repo();
  const first = planAt(root, base, start.runStartedAt, clock);
  const second = planAt(
    root,
    base,
    '2000-01-03T04:00:01+01:00',
    () => '2000-01-03T03:00:03Z',
  );
  const committed = publishPlan(root, base, first);
  expect(() => publishPlan(root, base, second)).toThrow(/Code-/);
  expect(git(remote, ['rev-parse', 'main']).trim()).toBe(committed);
  expect(
    JSON.parse(git(remote, ['show', `main:${indexPath}`])).works,
  ).toHaveLength(3);
});
