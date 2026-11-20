import { expect, test } from '../fixtures/browser';
import { tsImport } from 'tsx/esm/api';
import { execFileSync } from 'node:child_process';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { createServer } from 'node:https';
import { tmpdir } from 'node:os';
import path from 'node:path';
import type { Env } from '../../workers/admin';

test.use({ ignoreHTTPSErrors: true }); // Ephemeral local test certificate only.

// Package B: the operator marks and removes favourites on the built operator
// page, served by the real worker over HTTPS. GitHub is an in-memory stand-in;
// the session is issued directly (the login itself is covered elsewhere).
test('Betreiber markiert und entfernt Favoriten mit Bestätigung, ohne fremde Stände zu überschreiben', async ({
  page,
}) => {
  const {
    createWorker,
    recordCall,
    MemoryNamespace,
    readyPolicy,
    MemoryGitHub,
    seriesFiles,
  } = (await tsImport(
    '../fixtures/operator-browser.ts',
    import.meta.url,
  )) as typeof import('../fixtures/operator-browser');
  const namespace = new MemoryNamespace();
  const hub = new MemoryGitHub(seriesFiles());
  const pair = await crypto.subtle.generateKey(
    {
      name: 'RSASSA-PKCS1-v1_5',
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: 'SHA-256',
    },
    true,
    ['sign', 'verify'],
  );
  const pem = Buffer.from(
    await crypto.subtle.exportKey('pkcs8', pair.privateKey),
  ).toString('base64');
  const env: Env = {
    SESSIONS: namespace,
    ENABLED: 'true',
    ADMIN_ORIGIN: '',
    OWNER_ID: '123',
    GITHUB_CLIENT_ID: 'synthetic-client',
    GITHUB_CLIENT_SECRET: 'synthetic-secret',
    GITHUB_APP_ID: '55',
    GITHUB_INSTALLATION_ID: '7',
    GITHUB_PRIVATE_KEY_PKCS8: `-----BEGIN PRIVATE KEY-----\n${pem}\n-----END PRIVATE KEY-----`,
    ASSETS: {
      fetch: async (request: Request) => {
        const name = new URL(request.url).pathname.replace(/^\/assets\//, '');
        if (!/^admin\.(js|css)$/.test(name))
          return new Response(null, { status: 404 });
        return new Response(
          await readFile(path.join('.admin-build', 'assets', name)),
        );
      },
    },
  };
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (input, init) => {
    const url = new URL(String(input));
    const response =
      url.origin === 'https://api.github.com'
        ? await hub.handle(url, init)
        : null;
    if (!response) throw new Error(`Unerwarteter Aufruf ${url.href}`);
    return response;
  };
  const temp = await mkdtemp(
    path.join(tmpdir(), 'evolvera-favorites-browser-'),
  );
  const keyFile = path.join(temp, 'key.pem');
  const certFile = path.join(temp, 'cert.pem');
  execFileSync(
    'openssl',
    [
      'req',
      '-x509',
      '-newkey',
      'rsa:2048',
      '-nodes',
      '-keyout',
      keyFile,
      '-out',
      certFile,
      '-subj',
      '/CN=localhost',
      '-days',
      '1',
    ],
    { stdio: 'ignore' },
  );
  let origin = '';
  let worker: ReturnType<typeof createWorker> | null = null;
  const server = createServer(
    { key: await readFile(keyFile), cert: await readFile(certFile) },
    async (request, result) => {
      const headers = new Headers();
      for (const [key, value] of Object.entries(request.headers))
        if (value !== undefined)
          headers.set(key, Array.isArray(value) ? value.join(', ') : value);
      let body = '';
      for await (const chunk of request) body += String(chunk);
      const response = await worker!.fetch(
        new Request(origin + request.url, {
          method: request.method,
          headers,
          ...(body ? { body } : {}),
        }),
        env,
      );
      result.writeHead(response.status, Object.fromEntries(response.headers));
      result.end(Buffer.from(await response.arrayBuffer()));
    },
  );
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  try {
    const address = server.address();
    if (!address || typeof address === 'string')
      throw new Error('Local test socket unavailable');
    origin = `https://127.0.0.1:${address.port}`;
    env.ADMIN_ORIGIN = origin;
    worker = createWorker({
      ...readyPolicy,
      review: { ...readyPolicy.review, adminOrigin: origin },
    });
    const session = 'b'.repeat(43);
    await recordCall(namespace, session, {
      operation: 'issue',
      record: {
        kind: 'session',
        ownerId: '123',
        csrf: 'c'.repeat(43),
        expires: Date.now() + 3600000,
      },
    });
    await page.context().addCookies([
      {
        name: '__Host-evolvera-session',
        value: session,
        url: origin,
        secure: true,
        httpOnly: true,
        sameSite: 'Lax',
      },
    ]);
    const external: string[] = [];
    await page.context().route('**/*', (route) => {
      if (new URL(route.request().url()).origin === origin)
        return route.continue();
      external.push(route.request().url());
      return route.abort();
    });
    const problems: string[] = [];
    page.on('console', (message) => {
      if (
        message.type() === 'error' &&
        !message.text().startsWith('Failed to load resource')
      )
        problems.push(message.text());
    });
    page.on('pageerror', (error) => problems.push(error.message));

    await page.goto(origin + '/favorites');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Favoriten.',
    );
    await expect(
      page.getByRole('navigation', { name: 'Betreiberbereich' }),
    ).toContainText('Einstellungen');
    await expect(page.getByRole('heading', { level: 2 }).first()).toHaveText(
      'Favoriten (0)',
    );
    await expect(
      page.getByRole('button', { name: /als Favorit markieren$/ }),
    ).toHaveCount(3);

    await page
      .getByRole('button', {
        name: '„Samtflechten / Leuchtfieber“ als Favorit markieren',
      })
      .click();
    await expect(page.getByRole('status')).toContainText(
      'In Git gespeichert und bestätigt. „Samtflechten / Leuchtfieber“ ist Favorit und mit seinen direkten Eltern gesichert.',
    );
    await expect(page.getByRole('heading', { level: 2 }).first()).toHaveText(
      'Favoriten (1)',
    );
    await expect(
      page.getByText('Mit Eltern vom 19.11.2026 und 20.11.2026.'),
    ).toBeVisible();
    expect(
      [...hub.files().keys()].filter((file) =>
        file.startsWith('public/favorites/2026-11-19/'),
      ),
    ).toHaveLength(3);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);

    // Removing needs a confirmation; cancelling writes nothing.
    const remove = page.getByRole('button', {
      name: '„Samtflechten / Leuchtfieber“ als Favorit entfernen',
    });
    const writes = hub.writes;
    await remove.click();
    await page.getByRole('button', { name: 'Abbrechen' }).click();
    expect(hub.writes).toBe(writes);
    await remove.click();
    await page.getByRole('button', { name: 'Ja, entfernen' }).click();
    await expect(page.getByRole('status')).toContainText(
      '„Samtflechten / Leuchtfieber“ ist kein Favorit mehr.',
    );
    await expect(page.getByText('Noch keine Favoriten.')).toBeVisible();
    expect(
      [...hub.files().keys()].filter((file) =>
        file.startsWith('public/favorites/2026-11-19/'),
      ),
    ).toEqual([]);

    // A parallel commit (e.g. the daily run) is never overwritten.
    hub.beforeRefUpdate = () =>
      hub.push({ 'public/artworks/2026/2026-11-22.json': '{}\n' }, 'Archive');
    await page
      .getByRole('button', {
        name: '„Traumfieber im Stillstand“ als Favorit markieren',
      })
      .click();
    await expect(page.getByRole('alert')).toContainText('Speicherkonflikt');
    expect(hub.commits.get(hub.main)!.message).toBe('Archive');

    expect(problems).toEqual([]);
    expect(external).toEqual([]);
  } finally {
    globalThis.fetch = originalFetch;
    try {
      await page.context().unrouteAll({ behavior: 'wait' });
    } finally {
      server.closeAllConnections();
      await new Promise<void>((resolve) => server.close(() => resolve()));
      await rm(temp, { recursive: true, force: true });
    }
  }
});
