// @vitest-environment node
import { afterEach, beforeAll, beforeEach, expect, it, vi } from 'vitest';
import { createWorker } from '../workers/admin';
import type { Env } from '../workers/admin';
import { recordCall } from '../workers/admin/store';
import { readyPolicy } from './fixtures/legal';
import { MemoryNamespace } from './fixtures/session-memory';
import { MemoryGitHub, seriesFiles } from './fixtures/github-memory';
import { favoritesText } from '../src/archive/favorites';

// Package B: favourites written by the operator worker as one fast-forward
// commit through the Git data API. Synthetic GitHub in memory, no network.

const origin = 'https://admin.example.test';
const worker = createWorker(readyPolicy);
const session = 's'.repeat(43);
const csrf = 'c'.repeat(43);
const cookie = `__Host-evolvera-session=${session}`;
let env: Env, hub: MemoryGitHub, privatePem: string;
beforeAll(async () => {
  const pair = (await crypto.subtle.generateKey(
    {
      name: 'RSASSA-PKCS1-v1_5',
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: 'SHA-256',
    },
    true,
    ['sign', 'verify'],
  )) as CryptoKeyPair;
  privatePem = `-----BEGIN PRIVATE KEY-----\n${Buffer.from(await crypto.subtle.exportKey('pkcs8', pair.privateKey)).toString('base64')}\n-----END PRIVATE KEY-----`;
});
beforeEach(async () => {
  const namespace = new MemoryNamespace();
  env = {
    ENABLED: 'true',
    ADMIN_ORIGIN: origin,
    OWNER_ID: '123',
    GITHUB_CLIENT_ID: 'test-client',
    GITHUB_CLIENT_SECRET: 'synthetic-client-secret',
    GITHUB_APP_ID: '55',
    GITHUB_INSTALLATION_ID: '7',
    GITHUB_PRIVATE_KEY_PKCS8: privatePem,
    SESSIONS: namespace,
  };
  await recordCall(namespace, session, {
    operation: 'issue',
    record: {
      kind: 'session',
      ownerId: '123',
      csrf,
      expires: Date.now() + 1e6,
    },
  });
  hub = new MemoryGitHub(seriesFiles());
  vi.stubGlobal(
    'fetch',
    vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = new URL(String(input));
      expect(url.origin).toBe('https://api.github.com');
      const response = await hub.handle(url, init);
      if (!response) throw new Error(`Unerwarteter Aufruf ${url.pathname}`);
      return response;
    }),
  );
});
afterEach(() => vi.unstubAllGlobals());

const load = () =>
  worker.fetch(
    new Request(`${origin}/api/favorites`, { headers: { Cookie: cookie } }),
    env,
  );
const change = (
  body: Record<string, unknown>,
  headers: Record<string, string> = {},
) =>
  worker.fetch(
    new Request(`${origin}/api/favorites`, {
      method: 'POST',
      body: JSON.stringify({ csrf, series: '2026-11-19', ...body }),
      headers: {
        Cookie: cookie,
        Origin: origin,
        'Content-Type': 'application/json',
        ...headers,
      },
    }),
    env,
  );
type View = {
  series: string | null;
  works: { id: string }[];
  favorites: { favorites: { id: string; title: string }[] };
  changed?: boolean;
  csrf?: string;
};
const copies = (prefix = 'public/favorites/2026-11-19/') =>
  [...hub.files().keys()].filter((path) => path.startsWith(prefix)).toSorted();

it('liefert Serie, Werke und Favoriten nur mit Sitzung; die Seite ist geschützt', async () => {
  const anonymous = await worker.fetch(
    new Request(`${origin}/api/favorites`),
    env,
  );
  expect(anonymous.status).toBe(401);
  const page = await worker.fetch(
    new Request(`${origin}/favorites`, { headers: { Cookie: cookie } }),
    env,
  );
  expect(page.status).toBe(200);
  expect(await page.text()).toContain('/assets/admin.js');
  const response = await load();
  expect(response.status).toBe(200);
  const view = (await response.json()) as View;
  expect(view.series).toBe('2026-11-19');
  expect(view.works.map((work) => work.id)).toEqual([
    '2026-11-21',
    '2026-11-20',
    '2026-11-19',
  ]);
  expect(view.favorites.favorites).toEqual([]);
  expect(view.csrf).toBe(csrf);
});

it('markiert ein Werk in einem Commit samt direkten Eltern als byte-gleiche Kopien', async () => {
  const before = hub.main;
  const response = await change({ action: 'add', id: '2026-11-21' });
  expect(response.status).toBe(200);
  const view = (await response.json()) as View;
  expect(view.changed).toBe(true);
  expect(view.favorites.favorites).toEqual([
    {
      series: '2026-11-19',
      id: '2026-11-21',
      generation: 3,
      title: 'Samtflechten / Leuchtfieber',
    },
  ]);
  const commit = hub.commits.get(hub.main)!;
  expect(commit.parents).toEqual([before]);
  expect(commit.message).toBe('Update favourite works');
  expect(copies()).toEqual([
    'public/favorites/2026-11-19/2026-11-19.json',
    'public/favorites/2026-11-19/2026-11-20.json',
    'public/favorites/2026-11-19/2026-11-21.json',
  ]);
  for (const id of ['2026-11-19', '2026-11-20', '2026-11-21'])
    expect(hub.blobAt(`public/favorites/2026-11-19/${id}.json`)).toBe(
      hub.blobAt(`public/artworks/2026/${id}.json`),
    );
  expect(hub.files().get('public/favorites/index.json')).toBe(
    favoritesText(view.favorites as never),
  );
  // The archive and everything else stay untouched.
  for (const [path, text] of hub.files(before))
    if (path !== 'public/favorites/index.json')
      expect(hub.files().get(path)).toBe(text);
  // Marking again writes nothing.
  const writes = hub.writes;
  const again = (await (
    await change({ action: 'add', id: '2026-11-21' })
  ).json()) as View;
  expect(again.changed).toBe(false);
  expect(hub.writes).toBe(writes);
});

it('entfernt nur Kopien, die kein anderer Favorit mehr braucht', async () => {
  await change({ action: 'add', id: '2026-11-21' });
  await change({ action: 'add', id: '2026-11-20' });
  expect(copies()).toHaveLength(3);
  const response = await change({ action: 'remove', id: '2026-11-21' });
  expect(((await response.json()) as View).changed).toBe(true);
  expect(copies()).toEqual(['public/favorites/2026-11-19/2026-11-20.json']);
  const last = (await (
    await change({ action: 'remove', id: '2026-11-20' })
  ).json()) as View;
  expect(last.favorites.favorites).toEqual([]);
  expect(copies('public/favorites/')).toEqual(['public/favorites/index.json']);
  const writes = hub.writes;
  const absent = (await (
    await change({ action: 'remove', id: '2026-11-20' })
  ).json()) as View;
  expect(absent.changed).toBe(false);
  expect(hub.writes).toBe(writes);
});

it('markiert nur archivierte Werke der laufenden Serie', async () => {
  const main = hub.main;
  for (const body of [
    { action: 'add', id: '2026-11-22' },
    { action: 'add', id: '2026-11-18' },
    { action: 'add', id: '2026-11-21', series: '2026-11-04' },
  ])
    expect((await change(body)).status).toBe(400);
  hub.push({ 'config/generation.json': '{"schemaVersion":1}' });
  expect((await change({ action: 'add', id: '2026-11-21' })).status).toBe(503);
  expect(hub.commits.get(hub.main)!.parents).toEqual([main]);
});

it('überschreibt keinen parallelen Commit und meldet einen Konflikt', async () => {
  hub.beforeRefUpdate = () =>
    hub.push({ 'public/artworks/2026/2026-11-22.json': '{}\n' }, 'Archive');
  const response = await change({ action: 'add', id: '2026-11-21' });
  expect(response.status).toBe(409);
  expect(hub.commits.get(hub.main)!.message).toBe('Archive');
  expect(copies()).toEqual([]);
});

it('verweigert Schreiben ohne CSRF, exakte Origin, JSON oder mit Zusatzfeldern', async () => {
  const cases: [Record<string, unknown>, Record<string, string>, number][] = [
    [{ action: 'add', id: '2026-11-21', csrf: 'x'.repeat(43) }, {}, 403],
    [{ action: 'add', id: '2026-11-21' }, { Origin: 'https://evil.test' }, 403],
    [
      { action: 'add', id: '2026-11-21' },
      { 'Content-Type': 'text/plain' },
      415,
    ],
    [{ action: 'add', id: '2026-11-21', path: 'config' }, {}, 400],
    [{ action: 'delete', id: '2026-11-21' }, {}, 400],
    [{ action: 'add', id: '../config' }, {}, 400],
  ];
  for (const [body, headers, status] of cases)
    expect((await change(body, headers)).status).toBe(status);
  expect(hub.writes).toBe(0);
});

it('meldet widersprüchliche Archivdaten, statt sie zu kopieren', async () => {
  hub.push({
    'public/artworks/2026/2026-11-21.json':
      JSON.stringify({
        id: '2026-11-21',
        generation: 3,
        title: 'Falsche Eltern',
        parentIds: [],
      }) + '\n',
  });
  expect((await change({ action: 'add', id: '2026-11-21' })).status).toBe(502);
  expect(hub.writes).toBe(0);
});
