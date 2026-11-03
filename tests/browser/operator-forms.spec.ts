import { expect, test } from '@playwright/test';
import { tsImport } from 'tsx/esm/api';
import { execFileSync } from 'node:child_process';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { createServer } from 'node:https';
import { tmpdir } from 'node:os';
import path from 'node:path';
import type { Env } from '../../workers/admin';

test.use({ ignoreHTTPSErrors: true }); // Ephemeral local test certificate only.

test('Native Betreiberformulare widerrufen Sitzungen und speichern nur synthetische Modi', async ({
  page,
}) => {
  // Use the installed TypeScript loader for the Worker's existing JSON imports.
  const { createWorker, recordCall, MemoryNamespace, readyPolicy } =
    (await tsImport(
      '../fixtures/operator-browser.ts',
      import.meta.url,
    )) as typeof import('../fixtures/operator-browser');
  let origin = '';
  const namespace = new MemoryNamespace();
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
    ADMIN_ORIGIN: origin,
    OWNER_ID: '123',
    GITHUB_CLIENT_ID: 'synthetic-client',
    GITHUB_CLIENT_SECRET: 'synthetic-secret',
    GITHUB_APP_ID: '55',
    GITHUB_INSTALLATION_ID: '7',
    GITHUB_PRIVATE_KEY_PKCS8: `-----BEGIN PRIVATE KEY-----\n${pem}\n-----END PRIVATE KEY-----`,
  };
  let config = {
    schemaVersion: 1,
    revision: 1,
    seriesStartDate: null,
    generationEnabled: false,
    timezone: 'Europe/Berlin',
    inheritanceMode: 'traceable',
  };
  let writes = 0;
  const originalFetch = globalThis.fetch;
  // No real GitHub, repository, credentials or network: all outbound calls fail
  // except these synthetic installation/configuration responses in this process.
  globalThis.fetch = async (input, init) => {
    const url = new URL(String(input));
    expect(url.origin).toBe('https://api.github.com');
    if (url.pathname.endsWith('/installation')) return Response.json({ id: 7 });
    if (url.pathname === '/app/installations/7/access_tokens')
      return Response.json({ token: 'synthetic-installation-token' });
    expect(url.pathname).toBe(
      '/repos/bummber/evolvera/contents/config/generation.json',
    );
    if (init?.method === 'PUT') {
      const body = JSON.parse(String(init.body));
      config = JSON.parse(Buffer.from(body.content, 'base64').toString());
      writes++;
      return Response.json({ commit: { sha: 'b'.repeat(40) } });
    }
    return Response.json({
      type: 'file',
      encoding: 'base64',
      size: 300,
      sha: 'a'.repeat(40),
      content: Buffer.from(JSON.stringify(config)).toString('base64'),
    });
  };
  const posts: { origin?: string; site?: string; referrer?: string }[] = [];
  const temp = await mkdtemp(path.join(tmpdir(), 'evolvera-form-browser-'));
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
  // A real HTTPS socket is necessary: Chromium adds Sec-Fetch-* after the
  // interception stage, so route.fulfill() alone cannot reproduce this contract.
  const server = createServer(
    { key: await readFile(keyFile), cert: await readFile(certFile) },
    async (request, result) => {
      const headers = new Headers();
      for (const [key, value] of Object.entries(request.headers))
        if (value !== undefined)
          headers.set(key, Array.isArray(value) ? value.join(', ') : value);
      if (request.method === 'POST')
        posts.push({
          origin: headers.get('Origin') ?? undefined,
          site: headers.get('Sec-Fetch-Site') ?? undefined,
          referrer: headers.get('Referer') ?? undefined,
        });
      let body = '';
      for await (const chunk of request) body += String(chunk);
      const response = await worker.fetch(
        new Request(origin + request.url, {
          method: request.method,
          headers,
          ...(body ? { body } : {}),
        }),
        env,
      );
      result.writeHead(response.status, Object.fromEntries(response.headers));
      result.end(await response.text());
    },
  );
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  if (!address || typeof address === 'string')
    throw new Error('Local test socket unavailable');
  origin = `https://127.0.0.1:${address.port}`;
  env.ADMIN_ORIGIN = origin;
  const worker = createWorker({
    ...readyPolicy,
    review: { ...readyPolicy.review, adminOrigin: origin },
  });
  await page.route('**/*', (route) => {
    // Continue through the real socket; abort any unexpected external request.
    return new URL(route.request().url()).origin === origin
      ? route.continue()
      : route.abort();
  });
  async function syntheticSession(key: string) {
    await recordCall(namespace, key, {
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
        value: key,
        url: origin,
        secure: true,
        httpOnly: true,
        sameSite: 'Lax',
      },
    ]);
    const response = await page.goto(origin + '/settings');
    expect(response?.headers()['referrer-policy']).toBe('no-referrer');
    await expect(page.getByRole('button', { name: 'Abmelden' })).toBeVisible();
  }
  try {
    const oldKey = 'a'.repeat(43);
    await syntheticSession(oldKey);
    await page.getByRole('button', { name: 'Abmelden' }).click();
    expect(posts[0]).toEqual({
      origin: 'null',
      site: 'same-origin',
      referrer: undefined,
    });
    await expect(
      page.getByRole('link', { name: 'Mit GitHub anmelden' }),
    ).toBeVisible();
    expect(await page.context().cookies()).toEqual([]);
    expect(
      await recordCall(namespace, oldKey, { operation: 'read' }),
    ).toBeNull();
    await page.reload();
    await expect(
      page.getByRole('button', { name: 'Modus speichern' }),
    ).toHaveCount(0);
    expect(writes).toBe(0);

    await syntheticSession('d'.repeat(43));
    await page.getByLabel('Vererbungsmodus').selectOption('free');
    await page.getByRole('button', { name: 'Modus speichern' }).click();
    await expect(page.getByRole('status')).toContainText('In Git gespeichert.');
    expect(config.inheritanceMode).toBe('free');
    expect(config.revision).toBe(2);
    await page.getByLabel('Vererbungsmodus').selectOption('traceable');
    await page.getByRole('button', { name: 'Modus speichern' }).click();
    await expect(page.getByRole('status')).toContainText('In Git gespeichert.');
    expect(config.inheritanceMode).toBe('traceable');
    expect(config.revision).toBe(3);
    expect(config.generationEnabled).toBe(false);
    expect(config.seriesStartDate).toBeNull();
    expect(writes).toBe(2);
    expect(posts).toHaveLength(3);
    for (const post of posts)
      expect(post).toEqual({
        origin: 'null',
        site: 'same-origin',
        referrer: undefined,
      });
  } finally {
    globalThis.fetch = originalFetch;
    await page.unrouteAll({ behavior: 'wait' });
    server.closeAllConnections();
    await new Promise<void>((resolve) => server.close(() => resolve()));
    await rm(temp, { recursive: true, force: true });
  }
});
