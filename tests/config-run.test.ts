// @vitest-environment node
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import releaseRecord from '../config/release.json';
import type { ArtworkV3 } from '../src/art/schema/artwork-v3';
import { defaultProfile, type Profile } from '../src/art/schema/profile';
import { indexPath, readArchive } from '../src/automation/archive';
import { git, planAt, publishPlan } from '../src/automation/git';
import { prepareRun } from '../src/automation/plan';

// EP-01 P8: the daily run reads configuration schema 1 and 2. Every run
// takes one immutable snapshot at its start; a change applies only from the
// next run that has not started yet and never touches an archived work.
// Synthetic series from 2000-01-01, generator 0.3.0 from its first day.

const core = {
  revision: 3,
  seriesStartDate: '2000-01-01',
  generationEnabled: true,
  timezone: 'Europe/Berlin',
  inheritanceMode: 'traceable',
} as const;
const v1 = { schemaVersion: 1, ...core } as const;
const v2 = (profile: Profile, revision = 4) => ({
  schemaVersion: 2,
  ...core,
  revision,
  ...structuredClone(profile),
});
const sparse: Profile = {
  ...structuredClone(defaultProfile),
  composition: { ...defaultProfile.composition, density: 'sparse' },
};
const release = { ...releaseRecord, seriesAuthorized: true };
const options = { generatorChangeDate: '2000-01-01' };
const clock = () => '2000-01-03T07:00:02Z';
const run = (settings: unknown, current = new Map<string, string>()) =>
  prepareRun(
    {
      settings,
      release,
      current,
      canonical: current,
      runStartedAt: '2000-01-03T08:00:00+01:00',
    },
    clock,
    options,
  );
const works = (files: ReadonlyMap<string, string>) =>
  readArchive(files, '2000-01-01') as ArtworkV3[];

describe('Konfigurationsschema 2 im Tageslauf (EP-01 P8)', () => {
  it('erzeugt mit vollständigem Standardprofil dieselben Bytes wie Schema 1', () => {
    const before = run(v1);
    const after = run(v2(defaultProfile, core.revision));
    expect(before.added).toHaveLength(3);
    expect([...after.files]).toEqual([...before.files]);
  });

  it('übernimmt Profil und Revision in jedes Werk', () => {
    const plan = run(v2(sparse));
    expect(plan.settings.schemaVersion).toBe(2);
    for (const work of works(plan.files)) {
      expect(work.settings).toEqual({
        inheritanceMode: 'traceable',
        ...sparse,
      });
      expect(work.settingsRevision).toBe(4);
    }
  });

  it('hält den Snapshot eines Nachhollaufs, auch wenn sich die Eingabe ändert', () => {
    const mutable = v2(sparse);
    let calls = 0;
    const plan = prepareRun(
      {
        settings: mutable,
        release,
        current: new Map(),
        canonical: new Map(),
        runStartedAt: '2000-01-03T08:00:00+01:00',
      },
      () => {
        calls++;
        mutable.revision = 5;
        mutable.composition.density = 'dense';
        mutable.inheritanceMode = 'free' as never;
        return clock();
      },
      options,
    );
    expect(calls).toBe(3);
    expect(Object.isFrozen(plan.settings)).toBe(true);
    for (const work of works(plan.files)) {
      expect(work.settings.composition.density).toBe('sparse');
      expect(work.inheritanceMode).toBe('traceable');
      expect(work.settingsRevision).toBe(4);
    }
  });

  it('ändert beim nächsten Lauf kein archiviertes Werk', () => {
    const first = run(v1);
    const next = prepareRun(
      {
        settings: v2(sparse),
        release,
        current: first.files,
        canonical: first.files,
        runStartedAt: '2000-01-05T08:00:00+01:00',
      },
      () => '2000-01-05T07:00:02Z',
      options,
    );
    expect(next.restored).toEqual([]);
    for (const [file, text] of first.files)
      if (file !== indexPath) expect(next.files.get(file)).toBe(text);
    const added = works(next.files).slice(3);
    expect(added.map((work) => work.id)).toEqual(['2000-01-04', '2000-01-05']);
    expect(added.map((work) => work.settings.composition.density)).toEqual([
      'sparse',
      'sparse',
    ]);
  });

  it('stoppt bei einer unmöglichen Kombination vor jedem Werk', () => {
    const impossible = v2({
      ...structuredClone(defaultProfile),
      composition: { ...defaultProfile.composition, maxLayers: 1 },
    });
    expect(() => run(impossible)).toThrow(/mindestens 2 Ebenen/);
    expect(run({ ...impossible, inheritanceMode: 'free' }).added).toHaveLength(
      3,
    );
  });

  it('erzeugt Werke von Generator 0.2.0 nur mit Schema 1', () => {
    expect(() =>
      prepareRun(
        {
          settings: v2(defaultProfile),
          release,
          current: new Map(),
          canonical: new Map(),
          runStartedAt: '2000-01-03T08:00:00+01:00',
        },
        clock,
        { generatorChangeDate: null },
      ),
    ).toThrow('Werke vor dem Generatorwechsel entstehen nur mit');
  });
});

describe('Paralleles Speichern in isolierten Git-Repositories', () => {
  const temp: string[] = [];
  afterEach(() => {
    temp
      .splice(0)
      .forEach((dir) => rmSync(dir, { recursive: true, force: true }));
  });
  const folder = () => {
    const dir = mkdtempSync(path.join(tmpdir(), 'evolvera-config-test-'));
    temp.push(dir);
    return dir;
  };
  const write = (root: string, name: string, value: unknown) => {
    const full = path.join(root, name);
    mkdirSync(path.dirname(full), { recursive: true });
    writeFileSync(full, JSON.stringify(value, null, 2) + '\n');
  };
  const repo = () => {
    const root = folder();
    const remote = folder();
    git(remote, ['init', '--bare', '-b', 'main']);
    git(root, ['init', '-b', 'main']);
    git(root, ['config', 'user.name', 'Test']);
    git(root, ['config', 'user.email', 'test@example.invalid']);
    git(root, ['remote', 'add', 'origin', remote]);
    write(root, 'config/generation.json', v1);
    write(root, 'config/release.json', release);
    write(root, indexPath, { schemaVersion: 1, works: [] });
    git(root, ['add', '.']);
    git(root, ['commit', '-m', 'Test initial state']);
    git(root, ['push', 'origin', 'main']);
    return { root, remote, base: git(root, ['rev-parse', 'HEAD']).trim() };
  };

  it('nimmt ein während des Laufs gespeichertes Schema 2 auf, ohne den Snapshot zu ändern', () => {
    const { root, remote, base } = repo();
    const plan = planAt(
      root,
      base,
      '2000-01-03T08:00:00+01:00',
      clock,
      options,
    );
    const clone = folder();
    git(clone, ['clone', remote, '.']);
    git(clone, ['config', 'user.name', 'Test']);
    git(clone, ['config', 'user.email', 'test@example.invalid']);
    const saved = v2(sparse);
    const committed = publishPlan(root, base, plan, () => {
      write(clone, 'config/generation.json', saved);
      git(clone, ['add', '.']);
      git(clone, ['commit', '-m', 'Update future generation settings']);
      git(clone, ['push', 'origin', 'main']);
    });
    expect(
      JSON.parse(git(root, ['show', `${committed}:config/generation.json`])),
    ).toEqual(saved);
    for (const file of plan.added) {
      const work = JSON.parse(
        git(root, ['show', `${committed}:${file}`]),
      ) as ArtworkV3;
      expect(work.settings).toEqual({
        inheritanceMode: 'traceable',
        ...defaultProfile,
      });
      expect(work.settingsRevision).toBe(3);
    }
    // The next run reads the saved profile.
    const next = planAt(
      root,
      committed,
      '2000-01-04T08:00:00+01:00',
      () => '2000-01-04T07:00:02Z',
      options,
    );
    expect(next.added).toHaveLength(1);
    const work = JSON.parse(next.files.get(next.added[0]!)!) as ArtworkV3;
    expect(work.settings.composition.density).toBe('sparse');
    expect(work.settingsRevision).toBe(4);
  });
});
