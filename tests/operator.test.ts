// @vitest-environment node
import { beforeAll, beforeEach, afterEach, expect, it, vi } from 'vitest';
import { createWorker } from '../workers/admin';
import { readyPolicy } from './fixtures/legal';
import type { Env } from '../workers/admin';
import { MemoryNamespace } from './fixtures/session-memory';
import { appJwt, base64url } from '../workers/admin/github';
import { defaultProfile } from '../src/art/schema/profile';
const config = {
  schemaVersion: 1,
  revision: 1,
  seriesStartDate: null,
  generationEnabled: false,
  timezone: 'Europe/Berlin',
  inheritanceMode: 'traceable',
};
const origin = 'https://admin.example.test';
const worker = createWorker(readyPolicy);
let env: Env,
  namespace: MemoryNamespace,
  privatePem: string,
  publicKey: CryptoKey;
let saved: unknown = structuredClone(config),
  putCount = 0,
  lastMessage = '',
  identity = 123,
  conflict = false,
  verifyFails = false;
let lastVerifier = '',
  challengeSent = '';
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
  publicKey = pair.publicKey;
  privatePem = `-----BEGIN PRIVATE KEY-----\n${btoa(String.fromCharCode(...new Uint8Array(await crypto.subtle.exportKey('pkcs8', pair.privateKey))))}\n-----END PRIVATE KEY-----`;
});
beforeEach(() => {
  namespace = new MemoryNamespace();
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
  saved = structuredClone(config);
  putCount = 0;
  lastMessage = '';
  identity = 123;
  conflict = false;
  verifyFails = false;
  lastVerifier = '';
  challengeSent = '';
  vi.stubGlobal(
    'fetch',
    vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = new URL(String(input));
      if (url.hostname === 'github.com') {
        const body = new URLSearchParams(String(init?.body));
        expect(body.get('client_secret')).toBe(env.GITHUB_CLIENT_SECRET);
        expect(body.get('redirect_uri')).toBe(origin + '/auth/callback');
        lastVerifier = body.get('code_verifier')!;
        return Response.json({
          access_token: 'synthetic-user-token',
          token_type: 'bearer',
        });
      }
      expect(url.origin).toBe('https://api.github.com');
      if (url.pathname === '/user')
        return Response.json({ id: identity, login: 'bummber' });
      if (url.pathname.endsWith('/installation'))
        return Response.json({ id: 7 });
      if (url.pathname === '/app/installations/7/access_tokens') {
        expect(JSON.parse(String(init?.body))).toEqual({
          repositories: ['evolvera'],
          permissions: { contents: 'write' },
        });
        return Response.json({ token: 'synthetic-installation-token' });
      }
      expect(url.pathname).toBe(
        '/repos/bummber/evolvera/contents/config/generation.json',
      );
      if (init?.method === 'PUT') {
        putCount++;
        if (conflict) return Response.json({}, { status: 409 });
        const body = JSON.parse(String(init.body));
        expect(body.sha).toBe('a'.repeat(40));
        expect(body.branch).toBe('main');
        lastMessage = body.message;
        saved = JSON.parse(
          Buffer.from(body.content, 'base64').toString('utf8'),
        );
        return Response.json({ commit: { sha: 'b'.repeat(40) } });
      }
      if (verifyFails && url.searchParams.get('ref') !== 'main')
        return Response.json({}, { status: 503 });
      return Response.json({
        type: 'file',
        encoding: 'base64',
        size: 300,
        sha: 'a'.repeat(40),
        content: Buffer.from(JSON.stringify(saved)).toString('base64'),
      });
    }),
  );
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});
const request = (
  path: string,
  cookie = '',
  body?: URLSearchParams,
  originHeader = origin,
) =>
  new Request(origin + path, {
    ...(body
      ? {
          method: 'POST',
          body,
          headers: { Cookie: cookie, Origin: originHeader },
        }
      : { headers: { Cookie: cookie } }),
  });
async function begin() {
  const response = await worker.fetch(request('/login'), env);
  expect(response.status).toBe(303);
  const url = new URL(response.headers.get('Location')!);
  expect(url.origin).toBe('https://github.com');
  expect(url.searchParams.get('code_challenge_method')).toBe('S256');
  challengeSent = url.searchParams.get('code_challenge')!;
  return {
    cookie: response.headers.get('Set-Cookie')!.split(';')[0]!,
    state: url.searchParams.get('state')!,
    response,
  };
}
async function login() {
  const start = await begin();
  const response = await worker.fetch(
    request(`/auth/callback?state=${start.state}&code=valid`, start.cookie),
    env,
  );
  expect(response.status).toBe(303);
  const cookie = response.headers
    .get('Set-Cookie')!
    .match(/__Host-evolvera-session=([^;]+)/)![0];
  return { cookie, response, start };
}
async function settings(cookie: string) {
  const response = await worker.fetch(request('/api/settings', cookie), env);
  expect(response.status).toBe(200);
  const text = await response.text();
  const data = JSON.parse(text) as {
    revision: number;
    schemaVersion: number;
    rulesVersion: number;
    settings: Record<string, unknown>;
    csrf: string;
  };
  return { text, data, csrf: data.csrf };
}
/** Complete writable settings: the mode and every profile group. */
const standard = { inheritanceMode: 'traceable', ...defaultProfile };
const sparse = {
  ...standard,
  composition: { ...defaultProfile.composition, density: 'sparse' },
};
const save = (
  cookie: string,
  body: unknown,
  headers: Record<string, string> = {},
) =>
  worker.fetch(
    new Request(origin + '/api/settings', {
      method: 'POST',
      body: typeof body === 'string' ? body : JSON.stringify(body),
      headers: {
        Cookie: cookie,
        Origin: origin,
        'Content-Type': 'application/json',
        ...headers,
      },
    }),
    env,
  );
const contentReads = () =>
  (fetch as ReturnType<typeof vi.fn>).mock.calls.filter(([url]) =>
    String(url).includes('/contents/config/generation.json'),
  ).length;
it('bleibt ohne Einrichtung gesperrt und zeigt keine Scheinspeicherung', async () => {
  const response = await worker.fetch(request('/settings'), {
    ...env,
    ENABLED: 'false',
    ADMIN_ORIGIN: '',
  });
  expect(response.status).toBe(503);
  expect(await response.text()).toContain('Noch nicht eingerichtet');
  expect(fetch).not.toHaveBeenCalled();
});
it('bindet Login an State, PKCE und sicheren Cookie; Sitzung enthält keine GitHub-Tokens', async () => {
  const { cookie, response } = await login();
  expect(response.headers.get('Location')).toBe('/settings');
  expect(response.headers.get('Set-Cookie')).toContain(
    'Secure; HttpOnly; SameSite=Lax',
  );
  const digest = base64url(
    new Uint8Array(
      await crypto.subtle.digest(
        'SHA-256',
        new TextEncoder().encode(lastVerifier),
      ),
    ),
  );
  expect(digest).toBe(challengeSent);
  const text = (await settings(cookie)).text;
  expect(text).not.toContain(env.GITHUB_CLIENT_SECRET);
  expect(text).not.toContain('synthetic-user-token');
  expect(text).not.toContain(privatePem);
  for (const storage of namespace.stores.values())
    expect(JSON.stringify([...storage.data.values()])).not.toMatch(
      /synthetic-user-token|synthetic-installation-token|BEGIN PRIVATE KEY/,
    );
});
it('akzeptiert genau die numerische Betreiber-ID, auch wenn ein Fremdkonto denselben Login-Namen behauptet', async () => {
  identity = 999;
  const start = await begin();
  const response = await worker.fetch(
    request(`/auth/callback?state=${start.state}&code=valid`, start.cookie),
    env,
  );
  expect(response.status).toBe(403);
  expect(response.headers.get('Set-Cookie')).toBeNull();
});
it('verweigert gefälschten State, fehlende Browserbindung und wiederholten Callback', async () => {
  const start = await begin();
  expect(
    (
      await worker.fetch(
        request(
          `/auth/callback?state=${'x'.repeat(43)}&code=valid`,
          start.cookie,
        ),
        env,
      )
    ).status,
  ).toBe(403);
  expect(
    (
      await worker.fetch(
        request(`/auth/callback?state=${start.state}&code=valid`),
        env,
      )
    ).status,
  ).toBe(403);
  const responses = await Promise.all(
    [1, 2].map(() =>
      worker.fetch(
        request(`/auth/callback?state=${start.state}&code=valid`, start.cookie),
        env,
      ),
    ),
  );
  expect(responses.map((response) => response.status).sort()).toEqual([
    303, 403,
  ]);
  expect(
    (fetch as ReturnType<typeof vi.fn>).mock.calls.filter(([url]) =>
      String(url).includes('/login/oauth/access_token'),
    ),
  ).toHaveLength(1);
});
it('weist abgelaufene Logintransaktionen und Sitzungen ab', async () => {
  const start = await begin();
  vi.useFakeTimers();
  vi.setSystemTime(Date.now() + 601000);
  expect(
    (
      await worker.fetch(
        request(`/auth/callback?state=${start.state}&code=valid`, start.cookie),
        env,
      )
    ).status,
  ).toBe(403);
  vi.useRealTimers();
  const { cookie } = await login();
  vi.useFakeTimers();
  vi.setSystemTime(Date.now() + 3601000);
  const response = await worker.fetch(request('/settings', cookie), env);
  expect(await response.text()).toContain('Mit GitHub anmelden');
});
it('liefert die Seite nur mit Sitzung, ohne Inline-Code und mit strenger CSP', async () => {
  const anonymous = await worker.fetch(request('/settings'), env);
  expect(await anonymous.text()).toContain('Mit GitHub anmelden');
  const { cookie } = await login();
  const response = await worker.fetch(request('/settings', cookie), env);
  expect(response.status).toBe(200);
  const csp = response.headers.get('Content-Security-Policy')!;
  expect(csp).toBe(
    "default-src 'none'; script-src 'self'; style-src 'self'; connect-src 'self'; form-action 'self'; frame-ancestors 'none'; base-uri 'none'",
  );
  const text = await response.text();
  expect(text).toContain('<script type="module" src="/assets/admin.js">');
  expect(text).toContain('<link rel="stylesheet" href="/assets/admin.css">');
  expect(text).not.toMatch(/<style|style=|nonce|csrf/);
  expect(response.headers.get('Access-Control-Allow-Origin')).toBeNull();
});
it('liefert nur die gebauten Seitendateien aus und sonst nichts', async () => {
  const served: string[] = [];
  env.ASSETS = {
    fetch: async (input: Request) => {
      served.push(new URL(input.url).pathname);
      return new Response('export {};', { status: 200 });
    },
  };
  const script = await worker.fetch(request('/assets/admin.js'), env);
  expect(script.status).toBe(200);
  expect(script.headers.get('Content-Type')).toBe(
    'text/javascript; charset=utf-8',
  );
  expect(script.headers.get('X-Content-Type-Options')).toBe('nosniff');
  expect(await script.text()).toBe('export {};');
  const { cookie } = await login();
  expect(
    (await worker.fetch(request('/assets/other.js', cookie), env)).status,
  ).toBe(404);
  expect(served).toEqual(['/assets/admin.js']);
  delete env.ASSETS;
  expect((await worker.fetch(request('/assets/admin.css'), env)).status).toBe(
    404,
  );
});
it('liest Schema 1 als Standardprofil und Schema 2 vollständig', async () => {
  const { cookie } = await login();
  const first = await settings(cookie);
  expect(first.data).toMatchObject({
    schemaVersion: 1,
    revision: 1,
    rulesVersion: 2,
    settings: standard,
  });
  saved = {
    ...config,
    schemaVersion: 2,
    revision: 4,
    ...structuredClone(sparse),
  };
  const second = await settings(cookie);
  expect(second.data).toMatchObject({
    schemaVersion: 2,
    revision: 4,
    settings: sparse,
  });
});
it('speichert Modus und vollständiges Profil als Schema 2, prüft den Commit und bestätigt erst danach', async () => {
  const { cookie } = await login();
  const { csrf } = await settings(cookie);
  const response = await save(cookie, { csrf, revision: 1, settings: sparse });
  expect(response.status).toBe(200);
  expect(await response.json()).toMatchObject({
    changed: true,
    schemaVersion: 2,
    revision: 2,
    settings: sparse,
  });
  // Start date, generation switch and time zone stay exactly as stored.
  expect(saved).toEqual({
    schemaVersion: 2,
    revision: 2,
    seriesStartDate: null,
    generationEnabled: false,
    timezone: 'Europe/Berlin',
    ...sparse,
  });
  expect(Object.keys(saved as object)).toEqual([
    'schemaVersion',
    'revision',
    'seriesStartDate',
    'generationEnabled',
    'timezone',
    'inheritanceMode',
    'variation',
    'features',
    'palette',
    'families',
    'composition',
    'motion',
    'experimental',
  ]);
  expect(putCount).toBe(1);
  expect(lastMessage).toBe('Update future generation settings');
});
it('schreibt ohne Änderung nichts und erhöht die Revision nicht', async () => {
  const { cookie } = await login();
  const { csrf } = await settings(cookie);
  const response = await save(cookie, {
    csrf,
    revision: 1,
    settings: standard,
  });
  expect(response.status).toBe(200);
  expect(await response.json()).toMatchObject({ changed: false, revision: 1 });
  expect(putCount).toBe(0);
  expect(saved).toEqual(config);
});
it('lehnt unmögliche Kombinationen verständlich ab, ohne Git zu lesen (A-32)', async () => {
  const { cookie } = await login();
  const { csrf } = await settings(cookie);
  const reads = contentReads();
  const oneLayer = await save(cookie, {
    csrf,
    revision: 1,
    settings: {
      ...standard,
      composition: { ...defaultProfile.composition, maxLayers: 1 },
    },
  });
  expect(oneLayer.status).toBe(422);
  expect(await oneLayer.json()).toEqual({
    error: 'Einstellungen abgelehnt.',
    issues: [
      {
        path: 'composition.maxLayers',
        message:
          'Nachvollziehbare Vererbung braucht mindestens 2 Ebenen. Mit nur einer Ebene findet der Generator nicht immer ein gültiges Werk, und der Tageslauf bliebe ohne Werk.',
      },
    ],
  });
  const noFamily = await save(cookie, {
    csrf,
    revision: 1,
    settings: {
      ...standard,
      families: Object.fromEntries(
        Object.keys(defaultProfile.families).map((name) => [name, false]),
      ),
    },
  });
  expect(noFamily.status).toBe(422);
  expect(JSON.stringify(await noFamily.json())).toContain(
    'Mindestens eine Kompositionsfamilie muss aktiv bleiben.',
  );
  expect(contentReads()).toBe(reads);
  expect(putCount).toBe(0);
  // In the mode `free`, one layer stays possible.
  const free = await save(cookie, {
    csrf,
    revision: 1,
    settings: {
      ...standard,
      inheritanceMode: 'free',
      composition: { ...defaultProfile.composition, maxLayers: 1 },
    },
  });
  expect(free.status).toBe(200);
  expect(putCount).toBe(1);
});
it.each([
  {
    label: 'Startdatum',
    settings: { ...standard, seriesStartDate: '2026-11-18' },
  },
  { label: 'Generierung', settings: { ...standard, generationEnabled: false } },
  { label: 'Revision', settings: { ...standard, revision: 9 } },
  { label: 'fehlende Gruppe', settings: { inheritanceMode: 'traceable' } },
  {
    label: 'unbekannter Wert',
    settings: {
      ...standard,
      features: { ...defaultProfile.features, gradients: 'sometimes' },
    },
  },
  {
    label: 'unbekannter Schlüssel',
    settings: {
      ...standard,
      features: { ...defaultProfile.features, glitter: 'normal' },
    },
  },
])(
  'schreibt nur Modus und Profil: $label wird abgewiesen',
  async ({ settings: body }) => {
    const { cookie } = await login();
    const { csrf } = await settings(cookie);
    const response = await save(cookie, { csrf, revision: 1, settings: body });
    expect(response.status).toBe(400);
    expect(putCount).toBe(0);
  },
);
it('erlaubt weder fremde Schreibpfade noch zusätzliche Anfragefelder', async () => {
  const { cookie } = await login();
  const { csrf } = await settings(cookie);
  expect(
    (
      await save(cookie, {
        csrf,
        revision: 1,
        settings: sparse,
        path: 'public/artworks/index.json',
      })
    ).status,
  ).toBe(400);
  expect(
    (
      await worker.fetch(
        request(
          '/arbitrary',
          cookie,
          new URLSearchParams({ csrf, path: 'public/artworks/index.json' }),
        ),
        env,
      )
    ).status,
  ).toBe(404);
  expect(
    (
      await worker.fetch(
        request(
          '/settings/mode',
          cookie,
          new URLSearchParams({ csrf, mode: 'free', revision: '1' }),
        ),
        env,
      )
    ).status,
  ).toBe(404);
  expect(putCount).toBe(0);
});
it('schreibt ohne Sitzung, CSRF, exakte Origin oder JSON nicht', async () => {
  const anonymous = await save('', {
    csrf: 'fake',
    revision: 1,
    settings: sparse,
  });
  expect(anonymous.status).toBe(401);
  expect(await anonymous.json()).toEqual({ error: 'Nicht angemeldet.' });
  expect((await worker.fetch(request('/api/settings'), env)).status).toBe(401);
  const { cookie } = await login();
  const { csrf } = await settings(cookie);
  const body = { csrf, revision: 1, settings: sparse };
  for (const headers of [
    { Origin: 'https://attacker.test' } as Record<string, string>,
    { Origin: 'null' },
    {
      Origin: 'null',
      'Sec-Fetch-Site': 'same-origin',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Dest': 'document',
    },
  ])
    expect((await save(cookie, body, headers)).status).toBe(403);
  const withoutOrigin = new Request(origin + '/api/settings', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { Cookie: cookie, 'Content-Type': 'application/json' },
  });
  expect((await worker.fetch(withoutOrigin, env)).status).toBe(403);
  expect((await save(cookie, { ...body, csrf: 'fake' })).status).toBe(403);
  expect(
    (
      await save(cookie, JSON.stringify(body), {
        'Content-Type': 'application/x-www-form-urlencoded',
      })
    ).status,
  ).toBe(415);
  expect((await save(cookie, '{"csrf":')).status).toBe(400);
  expect(
    (await save(cookie, { ...body, padding: 'x'.repeat(9000) })).status,
  ).toBe(413);
  expect(putCount).toBe(0);
});
it('verweigert veraltete Revisionen und Git-Konflikte ohne blindes Wiederholen', async () => {
  const { cookie } = await login();
  const { csrf } = await settings(cookie);
  const stale = await save(cookie, { csrf, revision: 2, settings: sparse });
  expect(stale.status).toBe(409);
  expect((await stale.json()).error).toContain('Speicherkonflikt');
  expect(putCount).toBe(0);
  conflict = true;
  const response = await save(cookie, { csrf, revision: 1, settings: sparse });
  expect(response.status).toBe(409);
  expect(putCount).toBe(1);
  expect(saved).toEqual(config);
});
it('speichert einen Stand einmal und meldet bei erneutem Absenden einen Konflikt', async () => {
  const { cookie } = await login();
  const { csrf } = await settings(cookie);
  const body = { csrf, revision: 1, settings: sparse };
  expect((await save(cookie, body)).status).toBe(200);
  expect(putCount).toBe(1);
  expect((await save(cookie, body)).status).toBe(409);
  expect(putCount).toBe(1);
  expect((await settings(cookie)).data).toMatchObject({
    revision: 2,
    settings: sparse,
  });
});
it('meldet bei unbestätigtem Commit keinen Speichererfolg', async () => {
  const { cookie } = await login();
  const { csrf } = await settings(cookie);
  verifyFails = true;
  const response = await save(cookie, { csrf, revision: 1, settings: sparse });
  expect(response.status).toBe(502);
  expect(await response.json()).toEqual({
    error: 'Vorgang nicht bestätigt. Es wird kein Erfolg behauptet.',
  });
});
it('beendet die Sitzung serverseitig; alte Cookies können danach nicht speichern', async () => {
  const { cookie } = await login();
  const { csrf } = await settings(cookie);
  const response = await worker.fetch(
    request('/logout', cookie, new URLSearchParams({ csrf })),
    env,
  );
  expect(response.status).toBe(303);
  expect(response.headers.get('Set-Cookie')).toContain('Max-Age=0');
  expect(
    (await save(cookie, { csrf, revision: 1, settings: sparse })).status,
  ).toBe(401);
  expect(putCount).toBe(0);
});
it('akzeptiert das native no-referrer-Abmeldeformular nur mit Same-Origin-Navigationsnachweis und CSRF', async () => {
  const { cookie } = await login();
  const { csrf } = await settings(cookie);
  function nativeForm(path: string, body: URLSearchParams) {
    const value = request(path, cookie, body, 'null');
    value.headers.set('Sec-Fetch-Site', 'same-origin');
    value.headers.set('Sec-Fetch-Mode', 'navigate');
    value.headers.set('Sec-Fetch-Dest', 'document');
    return value;
  }
  const invalidCsrf = await worker.fetch(
    nativeForm('/logout', new URLSearchParams({ csrf: 'wrong' })),
    env,
  );
  expect(invalidCsrf.status).toBe(403);
  expect((await settings(cookie)).data.revision).toBe(1);
  const logout = await worker.fetch(
    nativeForm('/logout', new URLSearchParams({ csrf })),
    env,
  );
  expect(logout.status).toBe(303);
  expect(logout.headers.get('Set-Cookie')).toContain('Max-Age=0');
  expect(
    await (await worker.fetch(request('/settings', cookie), env)).text(),
  ).toContain('Mit GitHub anmelden');
  expect(putCount).toBe(0);
});
it.each([
  { origin: 'null' },
  {
    origin: undefined,
    site: 'same-origin',
    mode: 'navigate',
    dest: 'document',
  },
  { origin: 'null', site: 'cross-site', mode: 'navigate', dest: 'document' },
  { origin: 'null', site: 'same-site', mode: 'navigate', dest: 'document' },
  { origin: 'null', site: 'none', mode: 'navigate', dest: 'document' },
  { origin: 'null', site: 'same-origin', mode: 'cors', dest: 'document' },
  { origin: 'null', site: 'same-origin', mode: 'navigate', dest: 'iframe' },
  { origin: 'null', site: 'same-origin' },
  {
    origin: 'https://attacker.test',
    site: 'same-origin',
    mode: 'navigate',
    dest: 'document',
  },
])(
  'verweigert unsichere Herkunft $origin/$site/$mode/$dest vor Widerruf und Git-Schreiben',
  async ({ origin: requestOrigin, site, mode, dest }) => {
    const { cookie } = await login();
    const { csrf } = await settings(cookie);
    const requests = [
      request('/logout', cookie, new URLSearchParams({ csrf })),
      new Request(origin + '/api/settings', {
        method: 'POST',
        body: JSON.stringify({ csrf, revision: 1, settings: sparse }),
        headers: { Cookie: cookie, 'Content-Type': 'application/json' },
      }),
    ];
    for (const value of requests) {
      value.headers.delete('Origin');
      for (const [key, header] of Object.entries({
        Origin: requestOrigin,
        'Sec-Fetch-Site': site,
        'Sec-Fetch-Mode': mode,
        'Sec-Fetch-Dest': dest,
      }))
        if (header !== undefined) value.headers.set(key, header);
      expect((await worker.fetch(value, env)).status).toBe(403);
    }
    expect(putCount).toBe(0);
    expect((await settings(cookie)).data.revision).toBe(1);
  },
);
it('signiert kurzlebige App-JWTs korrekt und liefert Schutzheader ohne CORS-Freigabe', async () => {
  const jwt = await appJwt(env);
  const [header, payload, signature] = jwt.split('.');
  const bytes = Uint8Array.from(Buffer.from(signature!, 'base64url'));
  expect(
    await crypto.subtle.verify(
      'RSASSA-PKCS1-v1_5',
      publicKey,
      bytes,
      new TextEncoder().encode(`${header}.${payload}`),
    ),
  ).toBe(true);
  const claims = JSON.parse(
    Buffer.from(payload!, 'base64url').toString('utf8'),
  );
  expect(claims.exp - claims.iat).toBe(600);
  expect(claims.iss).toBe('55');
  const response = await worker.fetch(request('/settings'), env);
  expect(response.headers.get('Cache-Control')).toBe('no-store');
  expect(response.headers.get('Content-Security-Policy')).toContain(
    "frame-ancestors 'none'",
  );
  expect(response.headers.get('Access-Control-Allow-Origin')).toBeNull();
});
it('bereinigt abgelaufenen Object-Speicher per Alarm', async () => {
  const { cookie } = await login();
  const key = cookie.split('=')[1]!;
  const object = namespace.get(key);
  await object.alarm();
  expect(namespace.stores.get(key)!.data.size).toBe(0);
});

it('weist eine leere Origin auch am Health-Endpunkt ohne Parserausnahme ab', async () => {
  const response = await worker.fetch(request('/health'), {
    ...env,
    ADMIN_ORIGIN: '',
  });
  expect(response.status).toBe(503);
  expect(await response.json()).toEqual({ configurationReady: false });
});

it('liefert rechtliche Hinweise vor Login und auch deaktiviert ohne Cookie, Sitzung oder GitHub-Aufruf', async () => {
  for (const path of ['/privacy', '/imprint']) {
    const response = await worker.fetch(request(path), {
      ...env,
      ENABLED: 'false',
      ADMIN_ORIGIN: '',
    });
    expect(response.status).toBe(200);
    expect(response.headers.get('Set-Cookie')).toBeNull();
    expect(response.headers.get('Cache-Control')).toBe('no-store');
    const text = await response.text();
    expect(text).toContain('Testperson Beispiel');
    expect(text).toContain('href="/privacy"');
    expect(text).toContain('href="/imprint"');
    expect(text).not.toContain('href="/login"');
    expect(text).not.toContain(env.GITHUB_CLIENT_SECRET);
    expect(text).not.toContain(privatePem);
  }
  expect(namespace.stores.size).toBe(0);
  expect(fetch).not.toHaveBeenCalled();
  const response = await worker.fetch(
    new Request(origin + '/privacy', { method: 'HEAD' }),
    env,
  );
  expect(response.status).toBe(200);
  expect(await response.text()).toBe('');
});

it.each([
  {
    ...readyPolicy,
    legal: { ...readyPolicy.legal, privacyScope: 'pages-only' as const },
  },
  { ...readyPolicy, review: { ...readyPolicy.review, reviewedOn: null } },
  {
    ...readyPolicy,
    review: { ...readyPolicy.review, reviewedVersion: 'older' },
  },
  {
    ...readyPolicy,
    review: {
      ...readyPolicy.review,
      adminOrigin: 'https://other.example.test',
    },
  },
  {
    ...readyPolicy,
    review: { ...readyPolicy.review, providerReviewedOn: null },
  },
])(
  'sperrt direkte Aktivierung ohne passende Datenschutzdurchsicht auch ohne Galerie-Link',
  async (policy) => {
    const draftWorker = createWorker(policy);
    const health = await draftWorker.fetch(request('/health'), env);
    expect(health.status).toBe(503);
    expect(await health.json()).toEqual({ configurationReady: false });
    const response = await draftWorker.fetch(request('/login'), env);
    expect(response.status).toBe(503);
    expect(response.headers.get('Set-Cookie')).toBeNull();
    const privacy = await draftWorker.fetch(request('/privacy'), env);
    expect(privacy.status).toBe(200);
    expect(await privacy.text()).toContain(
      'Entwurf · noch nicht zur Veröffentlichung freigegeben',
    );
    expect(namespace.stores.size).toBe(0);
    expect(fetch).not.toHaveBeenCalled();
  },
);

it('escaped Kontaktdaten und setzt aktive Inhalte nicht als HTML ein', async () => {
  const safeWorker = createWorker({
    ...readyPolicy,
    legal: { ...readyPolicy.legal, fullName: '<img src=x onerror=alert(1)>' },
  });
  const text = await (await safeWorker.fetch(request('/imprint'), env)).text();
  expect(text).toContain('&lt;img');
  expect(text).not.toContain('<img');
});
