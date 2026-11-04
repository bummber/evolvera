import { expect, test } from '../fixtures/browser';
import { tsImport } from 'tsx/esm/api';
import { execFileSync } from 'node:child_process';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { createServer } from 'node:https';
import { tmpdir } from 'node:os';
import path from 'node:path';
import type { Env } from '../../workers/admin';

test.use({ ignoreHTTPSErrors: true }); // Ephemeral local test certificate only.

test('Synthetischer Top-Level-Login, Widerruf und veraltete Betreiberformulare bleiben sicher', async ({
  page,
}) => {
  // Use the installed TypeScript loader for the Worker's existing JSON imports.
  const { createWorker, recordCall, MemoryNamespace, readyPolicy } =
    (await tsImport(
      '../fixtures/operator-browser.ts',
      import.meta.url,
    )) as typeof import('../fixtures/operator-browser');
  let origin = '';
  let providerOrigin = '';
  let challenge = '';
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
    if (url.origin === 'https://github.com') {
      expect(url.pathname).toBe('/login/oauth/access_token');
      const verifier = new URLSearchParams(String(init?.body)).get(
        'code_verifier',
      )!;
      expect(
        Buffer.from(
          await crypto.subtle.digest(
            'SHA-256',
            new TextEncoder().encode(verifier),
          ),
        ).toString('base64url'),
      ).toBe(challenge);
      return Response.json({
        access_token: 'synthetic-user-token',
        token_type: 'bearer',
      });
    }
    expect(url.origin).toBe('https://api.github.com');
    if (url.pathname === '/user') return Response.json({ id: 123 });
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
  const external: string[] = [];
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
      if (request.headers.host === new URL(providerOrigin).host) {
        const providerUrl = new URL(request.url!, providerOrigin);
        const callback = new URL('/auth/callback', origin);
        callback.search = new URLSearchParams({
          state: providerUrl.searchParams.get('state')!,
          code: 'synthetic-code',
        }).toString();
        result.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        result.end(
          `<a href="${callback.href}">Synthetische Anmeldung bestätigen</a>`,
        );
        return;
      }
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
      const responseHeaders = Object.fromEntries(response.headers);
      // Rewrite the Worker's external authorization redirect before it reaches
      // the socket. Browser routing does not intercept every redirect-chain hop.
      if (responseHeaders.location?.startsWith('https://github.com/')) {
        const authorize = new URL(responseHeaders.location);
        expect(authorize.pathname).toBe('/login/oauth/authorize');
        challenge = authorize.searchParams.get('code_challenge')!;
        expect(authorize.searchParams.get('code_challenge_method')).toBe(
          'S256',
        );
        expect(authorize.searchParams.get('redirect_uri')).toBe(
          origin + '/auth/callback',
        );
        responseHeaders.location = `${providerOrigin}/authorize?${authorize.searchParams}`;
      }
      result.writeHead(response.status, {
        ...responseHeaders,
        'set-cookie': response.headers.getSetCookie(),
      });
      result.end(await response.text());
    },
  );
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  if (!address || typeof address === 'string')
    throw new Error('Local test socket unavailable');
  origin = `https://127.0.0.1:${address.port}`;
  providerOrigin = `https://localhost:${address.port}`;
  env.ADMIN_ORIGIN = origin;
  const worker = createWorker({
    ...readyPolicy,
    review: { ...readyPolicy.review, adminOrigin: origin },
  });
  await page.context().route('**/*', (route) => {
    const url = new URL(route.request().url());
    // Continue through the real socket; abort any unexpected external request.
    return [origin, providerOrigin].includes(url.origin)
      ? route.continue()
      : route.abort();
  });
  page.context().on('request', (request) => {
    if (![origin, providerOrigin].includes(new URL(request.url()).origin))
      external.push(new URL(request.url()).origin);
  });
  async function syntheticLogin() {
    await page.goto(origin + '/settings');
    await page.getByRole('link', { name: 'Mit GitHub anmelden' }).click();
    await expect(page).toHaveURL(new RegExp(`^${providerOrigin}/authorize`));
    const loginCookie = (await page.context().cookies(origin)).find(
      (cookie) => cookie.name === '__Host-evolvera-login',
    );
    expect(loginCookie).toMatchObject({
      secure: true,
      httpOnly: true,
      sameSite: 'Lax',
    });
    await page
      .getByRole('link', { name: 'Synthetische Anmeldung bestätigen' })
      .click();
    const response = await page.goto(origin + '/settings');
    expect(response?.headers()['referrer-policy']).toBe('no-referrer');
    await expect(page.getByRole('button', { name: 'Abmelden' })).toBeVisible();
    const cookies = await page.context().cookies(origin);
    expect(
      cookies.some((cookie) => cookie.name === '__Host-evolvera-login'),
    ).toBe(false);
    const sessionCookie = cookies.find(
      (cookie) => cookie.name === '__Host-evolvera-session',
    )!;
    expect(sessionCookie).toMatchObject({
      secure: true,
      httpOnly: true,
      sameSite: 'Lax',
    });
    return sessionCookie.value;
  }
  function expectSafePost(post: (typeof posts)[number]) {
    expect([origin, 'null']).toContain(post.origin);
    if (post.origin === 'null') expect(post.site).toBe('same-origin');
    expect(post.referrer).toBeUndefined();
  }
  try {
    const oldKey = await syntheticLogin();
    await page.getByRole('button', { name: 'Abmelden' }).click();
    expectSafePost(posts[0]!);
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

    const currentKey = await syntheticLogin();
    const stale = await page.context().newPage();
    await stale.goto(origin + '/settings');
    await page.getByLabel('Vererbungsmodus').selectOption('free');
    await page.getByRole('button', { name: 'Modus speichern' }).click();
    await expect(page.getByRole('status')).toContainText('In Git gespeichert.');
    expect(config.inheritanceMode).toBe('free');
    expect(config.revision).toBe(2);
    await stale.getByRole('button', { name: 'Modus speichern' }).click();
    await expect(
      stale.getByRole('heading', { name: 'Speicherkonflikt.' }),
    ).toBeVisible();
    expect(writes).toBe(1);
    expect(config.inheritanceMode).toBe('free');
    await stale.getByRole('link', { name: 'Einstellungen neu laden' }).click();
    await expect(stale.locator('main')).toContainText('Revision 2');
    await stale.close();
    await page.getByLabel('Vererbungsmodus').selectOption('traceable');
    await page.getByRole('button', { name: 'Modus speichern' }).click();
    await expect(page.getByRole('status')).toContainText('In Git gespeichert.');
    expect(config.inheritanceMode).toBe('traceable');
    expect(config.revision).toBe(3);
    expect(config.generationEnabled).toBe(false);
    expect(config.seriesStartDate).toBeNull();
    expect(writes).toBe(2);
    expect(posts).toHaveLength(4);
    for (const post of posts) expectSafePost(post);
    const store = namespace.stores.get(currentKey)!;
    const session = await store.get<{ expires: number }>('record');
    await store.put('record', { ...session, expires: Date.now() - 1 });
    await page.getByRole('button', { name: 'Modus speichern' }).click();
    await expect(
      page.getByRole('link', { name: 'Mit GitHub anmelden' }),
    ).toBeVisible();
    expect(writes).toBe(2);
    expect(config.revision).toBe(3);
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
