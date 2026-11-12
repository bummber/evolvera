import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { isWorkPath, indexPath } from './archive';
import { prepareRun } from './plan';
import { configSchema } from '../art/schema/config';

export function git(
  root: string,
  args: string[],
  input?: string,
  env: NodeJS.ProcessEnv = {},
) {
  return execFileSync('git', args, {
    cwd: root,
    encoding: 'utf8',
    input,
    env: { ...process.env, ...env },
    stdio: ['pipe', 'pipe', 'pipe'],
  });
}
const sha = (value: string) => {
  const result = value.trim();
  if (!/^[a-f0-9]{40}$/.test(result))
    throw new Error('Ungültige Git-Revision.');
  return result;
};
export function archiveAt(root: string, revision: string) {
  const files = new Map<string, string>();
  const paths = git(root, [
    'ls-tree',
    '-r',
    '--name-only',
    revision,
    '--',
    'public/artworks',
  ])
    .trim()
    .split('\n')
    .filter(Boolean);
  for (const file of paths) {
    if (file !== indexPath && !isWorkPath(file))
      throw new Error('Unerwarteter versionierter Archivpfad.');
    const entry = git(root, ['ls-tree', revision, '--', file]);
    if (!entry.startsWith('100644 blob '))
      throw new Error(
        'Archivdateien dürfen keine Links oder ausführbaren Dateien sein.',
      );
    files.set(file, git(root, ['show', `${revision}:${file}`]));
  }
  return files;
}
export function canonicalHistory(root: string, revision: string) {
  if (git(root, ['rev-parse', '--is-shallow-repository']).trim() !== 'false')
    throw new Error('Vollständige Git-Historie erforderlich.');
  const files = new Map<string, string>();
  const paths = new Set(
    git(root, [
      'log',
      revision,
      '--format=',
      '--name-only',
      '--',
      'public/artworks',
    ])
      .split('\n')
      .filter(Boolean),
  );
  for (const file of paths) {
    if (file === indexPath) continue;
    if (!isWorkPath(file))
      throw new Error('Unbekannter historischer Archivpfad.');
    const first = git(root, [
      'log',
      '--reverse',
      '--diff-filter=A',
      '--format=%H',
      revision,
      '--',
      file,
    ])
      .trim()
      .split('\n')[0];
    if (!first) throw new Error('Keine sichere erste Archivversion.');
    const entry = git(root, ['ls-tree', first, '--', file]);
    if (!entry.startsWith('100644 blob '))
      throw new Error('Unsichere historische Archivdatei.');
    files.set(file, git(root, ['show', `${first}:${file}`]));
  }
  return files;
}
export function commitPlan(
  root: string,
  base: string,
  changes: ReadonlyMap<string, string>,
) {
  const folder = mkdtempSync(path.join(tmpdir(), 'evolvera-index-'));
  const env = {
    GIT_INDEX_FILE: path.join(folder, 'index'),
    GIT_AUTHOR_NAME: 'Evolvera',
    GIT_AUTHOR_EMAIL: 'evolvera@users.noreply.github.com',
    GIT_COMMITTER_NAME: 'Evolvera',
    GIT_COMMITTER_EMAIL: 'evolvera@users.noreply.github.com',
  };
  try {
    git(root, ['read-tree', base], undefined, env);
    for (const [file, text] of changes) {
      if (file !== indexPath && !isWorkPath(file))
        throw new Error('Schreibpfad außerhalb des Archivs.');
      const blob = sha(git(root, ['hash-object', '-w', '--stdin'], text));
      git(
        root,
        ['update-index', '--add', '--cacheinfo', `100644,${blob},${file}`],
        undefined,
        env,
      );
    }
    const tree = sha(git(root, ['write-tree'], undefined, env));
    return sha(
      git(
        root,
        ['commit-tree', tree, '-p', base],
        'Archive validated daily artworks\n',
        env,
      ),
    );
  } finally {
    rmSync(folder, { recursive: true, force: true });
  }
}
export function planAt(
  root: string,
  revision: string,
  runStartedAt: string,
  clock: () => string,
  /** Tests only; see `prepareRun`. */
  options?: Parameters<typeof prepareRun>[2],
) {
  return prepareRun(
    {
      settings: JSON.parse(
        git(root, ['show', `${revision}:config/generation.json`]),
      ),
      release: JSON.parse(
        git(root, ['show', `${revision}:config/release.json`]),
      ),
      current: archiveAt(root, revision),
      canonical: canonicalHistory(root, revision),
      runStartedAt,
    },
    clock,
    options,
  );
}
/** Called only by the separately gated CI entrypoint. Fast-forward-only push; one config-only retry. */
export function publishPlan(
  root: string,
  base: string,
  plan: ReturnType<typeof prepareRun>,
  beforePush?: () => void,
) {
  let parent = base;
  for (let attempt = 0; attempt < 2; attempt++) {
    const commit = plan.changes.size
      ? commitPlan(root, parent, plan.changes)
      : parent;
    beforePush?.();
    beforePush = undefined;
    try {
      git(root, ['push', 'origin', `${commit}:refs/heads/main`]);
      return commit;
    } catch {
      git(root, ['fetch', 'origin', 'main']);
      const fresh = sha(git(root, ['rev-parse', 'FETCH_HEAD']));
      if (fresh === commit) return commit; // Push response lost, but exact commit verified on remote.
      if (attempt > 0)
        throw new Error(
          'Git-Konflikt nach einem kontrollierten Wiederholungsversuch.',
        );
      const changed = git(root, ['diff', '--name-only', parent, fresh])
        .trim()
        .split('\n')
        .filter(Boolean);
      if (changed.length !== 1 || changed[0] !== 'config/generation.json')
        throw new Error(
          'Parallele Code-/Archivänderung: kontrolliert stoppen.',
        );
      const config = configSchema.parse(
        JSON.parse(git(root, ['show', `${fresh}:config/generation.json`])),
      );
      if (
        config.seriesStartDate !== plan.settings.seriesStartDate ||
        config.generationEnabled !== plan.settings.generationEnabled ||
        config.timezone !== plan.settings.timezone ||
        config.revision <= plan.settings.revision
      )
        throw new Error('Unerwartete parallele Konfigurationsänderung.');
      parent = fresh;
    }
  }
  throw new Error('Nicht erreichbarer Git-Zustand.');
}
