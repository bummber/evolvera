import { createHash } from 'node:crypto';

// Package B tests: an in-memory stand-in for the parts of the GitHub REST API
// the operator worker uses (installation token, contents, Git refs, commits,
// trees). No network, no real repository, no credentials.

type Tree = Map<string, string>; // path -> blob sha
const hash = (text: string) => createHash('sha1').update(text).digest('hex');

export class MemoryGitHub {
  blobs = new Map<string, string>();
  trees = new Map<string, Tree>();
  commits = new Map<
    string,
    { tree: string; parents: string[]; message: string }
  >();
  main = '';
  writes = 0;
  /** Runs once right before the next ref update (e.g. a parallel commit). */
  beforeRefUpdate: (() => void) | null = null;

  constructor(files: Record<string, string>) {
    this.main = this.commit(this.tree(new Map(), files), [], 'Initial');
  }
  tree(base: Tree, files: Record<string, string | null>) {
    const tree = new Map(base);
    for (const [path, text] of Object.entries(files)) {
      if (text === null) tree.delete(path);
      else {
        this.blobs.set(hash(text), text);
        tree.set(path, hash(text));
      }
    }
    const sha = hash(JSON.stringify([...tree].toSorted()) + Math.random());
    this.trees.set(sha, tree);
    return sha;
  }
  commit(tree: string, parents: string[], message: string) {
    const sha = hash(`${tree}${parents.join()}${message}${Math.random()}`);
    this.commits.set(sha, { tree, parents, message });
    return sha;
  }
  /** A commit on main by someone else, e.g. the daily run. */
  push(files: Record<string, string | null>, message = 'Parallel') {
    const base = this.trees.get(this.commits.get(this.main)!.tree)!;
    this.main = this.commit(this.tree(base, files), [this.main], message);
  }
  files(ref = this.main) {
    const tree = this.trees.get(this.commits.get(ref)!.tree)!;
    return new Map(
      [...tree].map(([path, sha]) => [path, this.blobs.get(sha)!]),
    );
  }
  blobAt(path: string, ref = this.main) {
    return this.trees.get(this.commits.get(ref)!.tree)!.get(path);
  }

  /** Handles a request to api.github.com; null for anything else. */
  async handle(url: URL, init?: RequestInit): Promise<Response | null> {
    const method = init?.method ?? 'GET';
    const body = init?.body ? JSON.parse(String(init.body)) : undefined;
    const repo = '/repos/bummber/evolvera';
    if (url.pathname === `${repo}/installation`)
      return Response.json({ id: 7 });
    if (url.pathname === '/app/installations/7/access_tokens')
      return Response.json({ token: 'synthetic-installation-token' });
    if (url.pathname === `${repo}/git/ref/heads/main` && method === 'GET')
      return Response.json({ object: { type: 'commit', sha: this.main } });
    const commit = url.pathname.match(/\/git\/commits\/([a-f0-9]{40})$/);
    if (commit && method === 'GET') {
      const found = this.commits.get(commit[1]!);
      return found
        ? Response.json({ sha: commit[1], tree: { sha: found.tree } })
        : Response.json({}, { status: 404 });
    }
    if (url.pathname.startsWith(`${repo}/contents/`) && method === 'GET') {
      const path = decodeURIComponent(
        url.pathname.slice(`${repo}/contents/`.length),
      );
      const ref = url.searchParams.get('ref') ?? 'main';
      const sha = this.blobAt(path, ref === 'main' ? this.main : ref);
      if (!sha) return Response.json({}, { status: 404 });
      const text = this.blobs.get(sha)!;
      return Response.json({
        type: 'file',
        encoding: 'base64',
        sha,
        size: Buffer.byteLength(text),
        content: Buffer.from(text).toString('base64'),
      });
    }
    if (url.pathname === `${repo}/git/trees` && method === 'POST') {
      this.writes++;
      const base = this.trees.get(body.base_tree);
      if (!base) return Response.json({}, { status: 422 });
      const tree = new Map(base);
      for (const entry of body.tree as {
        path: string;
        mode: string;
        type: string;
        sha?: string | null;
        content?: string;
      }[]) {
        if (entry.mode !== '100644' || entry.type !== 'blob')
          return Response.json({}, { status: 422 });
        if (entry.content !== undefined) {
          this.blobs.set(hash(entry.content), entry.content);
          tree.set(entry.path, hash(entry.content));
        } else if (entry.sha === null) tree.delete(entry.path);
        else if (this.blobs.has(entry.sha!)) tree.set(entry.path, entry.sha!);
        else return Response.json({}, { status: 422 });
      }
      const sha = hash(JSON.stringify([...tree]) + Math.random());
      this.trees.set(sha, tree);
      return Response.json({ sha }, { status: 201 });
    }
    if (url.pathname === `${repo}/git/commits` && method === 'POST') {
      this.writes++;
      if (!this.trees.has(body.tree)) return Response.json({}, { status: 422 });
      const sha = this.commit(body.tree, body.parents, body.message);
      return Response.json({ sha }, { status: 201 });
    }
    if (url.pathname === `${repo}/git/refs/heads/main` && method === 'PATCH') {
      this.writes++;
      this.beforeRefUpdate?.();
      this.beforeRefUpdate = null;
      const next = this.commits.get(body.sha);
      if (!next || body.force !== false || !next.parents.includes(this.main))
        return Response.json(
          { message: 'Update is not a fast forward' },
          { status: 422 },
        );
      this.main = body.sha;
      return Response.json({ object: { sha: body.sha } });
    }
    return null;
  }
}

/** A small series of three works starting on 2026-11-19 and its archive. */
export function seriesFiles(seriesStartDate = '2026-11-19') {
  const works = [
    ['2026-11-19', 1, 'Falterkristall im Zwischenraum', []],
    ['2026-11-20', 2, 'Traumfieber im Stillstand', []],
    [
      '2026-11-21',
      3,
      'Samtflechten / Leuchtfieber',
      ['2026-11-19', '2026-11-20'],
    ],
  ] as const;
  const files: Record<string, string> = {
    'config/generation.json':
      JSON.stringify(
        {
          schemaVersion: 1,
          revision: 1,
          seriesStartDate,
          generationEnabled: true,
          timezone: 'Europe/Berlin',
          inheritanceMode: 'traceable',
        },
        null,
        2,
      ) + '\n',
    'public/artworks/index.json':
      JSON.stringify(
        {
          schemaVersion: 1,
          works: works
            .map(([id, generation, title]) => ({ id, generation, title }))
            .toReversed(),
        },
        null,
        2,
      ) + '\n',
    'public/favorites/index.json':
      '{\n  "schemaVersion": 1,\n  "favorites": []\n}\n',
  };
  for (const [id, generation, title, parentIds] of works)
    files[`public/artworks/2026/${id}.json`] =
      JSON.stringify({ id, generation, title, parentIds, dna: id }, null, 2) +
      '\n';
  return files;
}
