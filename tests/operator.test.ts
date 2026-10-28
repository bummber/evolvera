// @vitest-environment node
import { beforeAll, beforeEach, afterEach, expect, it, vi } from 'vitest';
import worker from '../workers/admin';
import type { Env } from '../workers/admin';
import { Sessions } from '../workers/admin/store';
import type { Storage } from '../workers/admin/store';
import { appJwt, base64url } from '../workers/admin/github';
const config = {
  schemaVersion: 1,
  revision: 1,
  seriesStartDate: null,
  generationEnabled: false,
  timezone: 'Europe/Berlin',
  inheritanceMode: 'traceable',
};
class MemoryStorage implements Storage {
  data = new Map<string, unknown>();
  tail: Promise<unknown> = Promise.resolve();
  alarm = 0;
  async get<T>(key: string) {
    return this.data.get(key) as T | undefined;
  }
  async put(key: string, value: unknown) {
    this.data.set(key, value);
  }
  async delete(key: string) {
    return this.data.delete(key);
  }
  async deleteAll() {
    this.data.clear();
  }
  async setAlarm(time: number) {
    this.alarm = time;
  }
  transaction<T>(callback: (txn: Storage) => Promise<T>): Promise<T> {
    const pending = this.tail.then(() => callback(this));
    this.tail = pending.catch(() => {});
    return pending;
  }
}
class MemoryNamespace {
  stores = new Map<string, MemoryStorage>();
  objects = new Map<string, Sessions>();
  idFromName(name: string) {
    return name;
  }
  get(id: unknown) {
    const key = String(id);
    if (!this.objects.has(key)) {
      const storage = new MemoryStorage();
      this.stores.set(key, storage);
      this.objects.set(key, new Sessions({ storage }));
    }
    return this.objects.get(key)!;
  }
}
const origin = 'https://admin.example.test';
let env: Env,
  namespace: MemoryNamespace,
  privatePem: string,
  publicKey: CryptoKey;
let saved = structuredClone(config),
  putCount = 0,
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
  const response = await worker.fetch(request('/settings', cookie), env);
  expect(response.status).toBe(200);
  const text = await response.text();
  return {
    text,
    csrf: text.match(/name="csrf" value="([A-Za-z0-9_-]+)"/)![1]!,
  };
}
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
it('speichert ausschließlich Modus und Revision, prüft den Commit und bestätigt erst danach', async () => {
  const { cookie } = await login();
  const { csrf } = await settings(cookie);
  const response = await worker.fetch(
    request(
      '/settings/mode',
      cookie,
      new URLSearchParams({ csrf, revision: '1', mode: 'free' }),
    ),
    env,
  );
  expect(response.status).toBe(200);
  expect(await response.text()).toContain(
    'In Git gespeichert. Ab dem nächsten',
  );
  expect(saved).toEqual({ ...config, inheritanceMode: 'free', revision: 2 });
  expect(putCount).toBe(1);
});
it('schreibt ohne Betreiber-Sitzung, CSRF oder exakte Origin nicht', async () => {
  expect(
    (
      await worker.fetch(
        request(
          '/settings/mode',
          '',
          new URLSearchParams({ mode: 'free', revision: '1', csrf: 'fake' }),
        ),
        env,
      )
    ).status,
  ).toBe(401);
  const { cookie } = await login();
  const { csrf } = await settings(cookie);
  expect(
    (
      await worker.fetch(
        request(
          '/settings/mode',
          cookie,
          new URLSearchParams({ csrf, mode: 'free', revision: '1' }),
          'https://attacker.test',
        ),
        env,
      )
    ).status,
  ).toBe(403);
  expect(
    (
      await worker.fetch(
        request(
          '/settings/mode',
          cookie,
          new URLSearchParams({ csrf: 'fake', mode: 'free', revision: '1' }),
        ),
        env,
      )
    ).status,
  ).toBe(403);
  expect(putCount).toBe(0);
});
it('erlaubt weder fremde Schreibpfade noch zusätzliche Konfigurationsfelder', async () => {
  const { cookie } = await login();
  const { csrf } = await settings(cookie);
  expect(
    (
      await worker.fetch(
        request(
          '/settings/mode',
          cookie,
          new URLSearchParams({
            csrf,
            mode: 'free',
            revision: '1',
            generationEnabled: 'true',
          }),
        ),
        env,
      )
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
  expect(putCount).toBe(0);
});
it('verweigert veraltete Revisionen und Git-Konflikte ohne blindes Wiederholen', async () => {
  const { cookie } = await login();
  const { csrf } = await settings(cookie);
  expect(
    (
      await worker.fetch(
        request(
          '/settings/mode',
          cookie,
          new URLSearchParams({ csrf, mode: 'free', revision: '2' }),
        ),
        env,
      )
    ).status,
  ).toBe(409);
  expect(putCount).toBe(0);
  conflict = true;
  const response = await worker.fetch(
    request(
      '/settings/mode',
      cookie,
      new URLSearchParams({ csrf, mode: 'free', revision: '1' }),
    ),
    env,
  );
  expect(response.status).toBe(409);
  expect(await response.text()).toContain('Speicherkonflikt');
  expect(putCount).toBe(1);
  expect(saved).toEqual(config);
});
it('meldet bei unbestätigtem Commit keinen Speichererfolg', async () => {
  const { cookie } = await login();
  const { csrf } = await settings(cookie);
  verifyFails = true;
  const response = await worker.fetch(
    request(
      '/settings/mode',
      cookie,
      new URLSearchParams({ csrf, mode: 'free', revision: '1' }),
    ),
    env,
  );
  expect(response.status).toBe(502);
  expect(await response.text()).not.toContain('In Git gespeichert.');
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
  ).toBe(401);
  expect(putCount).toBe(0);
});
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
