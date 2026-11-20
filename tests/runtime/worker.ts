import { z } from 'zod';
import production, { createWorker } from '../../workers/admin';
import type { Env } from '../../workers/admin';
import { recordCall, Sessions } from '../../workers/admin/store';
import type { SessionNamespace } from '../../workers/admin/store';
import { readyPolicy } from '../fixtures/legal';
import { readGenerationConfig } from '../../src/art/schema/config';
import { defaultProfile } from '../../src/art/schema/profile';
export { Sessions };
z.config({ jitless: true });
/** Local test entry only; not referenced by the deployable Worker configuration. */
export default {
  async fetch(request: Request, env: { SESSIONS: SessionNamespace }) {
    const health = await production.fetch(
      new Request('https://unconfigured.example.test/health'),
      { ...env, ENABLED: 'false', ADMIN_ORIGIN: '' } as Env,
    );
    const disabled = (await health.json()) as { configurationReady: boolean };
    const draft = createWorker({
      ...readyPolicy,
      review: { ...readyPolicy.review, reviewedOn: null },
    });
    const draftEnv: Env = {
      ...env,
      ENABLED: 'true',
      ADMIN_ORIGIN: readyPolicy.review.adminOrigin,
      OWNER_ID: '123',
      GITHUB_CLIENT_ID: 'synthetic-client',
      GITHUB_CLIENT_SECRET: 'synthetic-secret',
      GITHUB_APP_ID: '55',
      GITHUB_INSTALLATION_ID: '7',
      GITHUB_PRIVATE_KEY_PKCS8: '-----BEGIN PRIVATE KEY-----synthetic',
    };
    if (
      ['/privacy', '/imprint', '/settings'].includes(
        new URL(request.url).pathname,
      )
    )
      return draft.fetch(request, draftEnv);
    const privacy = await draft.fetch(
      new Request(readyPolicy.review.adminOrigin + '/privacy'),
      draftEnv,
    );
    const privacyText = await privacy.text();
    const imprint = await draft.fetch(
      new Request(readyPolicy.review.adminOrigin + '/imprint'),
      draftEnv,
    );
    const loginAttempt = await draft.fetch(
      new Request(readyPolicy.review.adminOrigin + '/login'),
      draftEnv,
    );
    const nonce = () => crypto.randomUUID();
    const login = nonce();
    const state = 's'.repeat(43);
    await recordCall(env.SESSIONS, login, {
      operation: 'issue',
      record: {
        kind: 'login',
        state,
        verifier: 'v'.repeat(43),
        expires: Date.now() + 600000,
      },
    });
    const responses = await Promise.all([
      recordCall(env.SESSIONS, login, { operation: 'consume', state }),
      recordCall(env.SESSIONS, login, { operation: 'consume', state }),
    ]);
    const session = nonce();
    await recordCall(env.SESSIONS, session, {
      operation: 'issue',
      record: {
        kind: 'session',
        ownerId: '123',
        csrf: 'c'.repeat(43),
        expires: Date.now() + 3600000,
      },
    });
    const seen = await recordCall(env.SESSIONS, session, { operation: 'read' });
    await recordCall(env.SESSIONS, session, { operation: 'revoke' });
    const gone = await recordCall(env.SESSIONS, session, { operation: 'read' });
    const independent = nonce();
    await recordCall(env.SESSIONS, independent, {
      operation: 'issue',
      record: {
        kind: 'session',
        ownerId: '456',
        csrf: 'i'.repeat(43),
        expires: Date.now() + 3600000,
      },
    });
    const other = await recordCall(env.SESSIONS, independent, {
      operation: 'read',
    });
    const revokedAfterOther = await recordCall(env.SESSIONS, session, {
      operation: 'read',
    });
    const expires = Date.now() + 1000;
    const expiringSession = nonce();
    const expiringLogin = nonce();
    await recordCall(env.SESSIONS, expiringSession, {
      operation: 'issue',
      record: {
        kind: 'session',
        ownerId: '123',
        csrf: 'e'.repeat(43),
        expires,
      },
    });
    await recordCall(env.SESSIONS, expiringLogin, {
      operation: 'issue',
      record: { kind: 'login', state, verifier: 'v'.repeat(43), expires },
    });
    const readBeforeExpiry = await recordCall(env.SESSIONS, expiringSession, {
      operation: 'read',
    });
    // Exercise expiry in real workerd/SQLite; Node fake timers do not reach this runtime.
    await new Promise((resolve) =>
      setTimeout(resolve, Math.max(0, expires - Date.now() + 25)),
    );
    const expiredSession = await recordCall(env.SESSIONS, expiringSession, {
      operation: 'read',
    });
    const expiredLogin = await recordCall(env.SESSIONS, expiringLogin, {
      operation: 'consume',
      state,
    });
    const ready = createWorker(readyPolicy);
    const browserSession = 'b'.repeat(43);
    const csrf = 'c'.repeat(43);
    await recordCall(env.SESSIONS, browserSession, {
      operation: 'issue',
      record: {
        kind: 'session',
        ownerId: '123',
        csrf,
        expires: Date.now() + 3600000,
      },
    });
    const logoutRequest = (site: string) =>
      new Request(readyPolicy.review.adminOrigin + '/logout', {
        method: 'POST',
        body: new URLSearchParams({ csrf }),
        headers: {
          Cookie: `__Host-evolvera-session=${browserSession}`,
          Origin: 'null',
          'Sec-Fetch-Site': site,
          'Sec-Fetch-Mode': 'navigate',
          'Sec-Fetch-Dest': 'document',
        },
      });
    // EP-01 P8: page shell, settings API and the shared rules in workerd.
    // Only requests that end before any GitHub call; no network.
    const sessionCookie = `__Host-evolvera-session=${browserSession}`;
    const shell = await ready.fetch(
      new Request(readyPolicy.review.adminOrigin + '/settings', {
        headers: { Cookie: sessionCookie },
      }),
      draftEnv,
    );
    const shellText = await shell.text();
    const anonymousApi = await ready.fetch(
      new Request(readyPolicy.review.adminOrigin + '/api/settings'),
      draftEnv,
    );
    // Package B: favourites page and API behind the same session rules.
    const favoritesShell = await ready.fetch(
      new Request(readyPolicy.review.adminOrigin + '/favorites', {
        headers: { Cookie: sessionCookie },
      }),
      draftEnv,
    );
    const anonymousFavorites = await ready.fetch(
      new Request(readyPolicy.review.adminOrigin + '/api/favorites'),
      draftEnv,
    );
    const foreignFavorite = await ready.fetch(
      new Request(readyPolicy.review.adminOrigin + '/api/favorites', {
        method: 'POST',
        body: JSON.stringify({
          csrf,
          action: 'add',
          series: '2026-11-19',
          id: '2026-11-21',
        }),
        headers: {
          Cookie: sessionCookie,
          Origin: 'https://attacker.test',
          'Content-Type': 'application/json',
        },
      }),
      draftEnv,
    );
    const save = (body: unknown, origin = readyPolicy.review.adminOrigin) =>
      ready.fetch(
        new Request(readyPolicy.review.adminOrigin + '/api/settings', {
          method: 'POST',
          body: JSON.stringify(body),
          headers: {
            Cookie: sessionCookie,
            Origin: origin,
            'Content-Type': 'application/json',
          },
        }),
        draftEnv,
      );
    const oneLayer = {
      inheritanceMode: 'traceable',
      ...defaultProfile,
      composition: { ...defaultProfile.composition, maxLayers: 1 },
    };
    const rejected = await save({ csrf, revision: 1, settings: oneLayer });
    const rejectedBody = (await rejected.json()) as {
      issues: { path: string }[];
    };
    const foreign = await save(
      { csrf, revision: 1, settings: oneLayer },
      'https://attacker.test',
    );
    const schema2 = readGenerationConfig({
      schemaVersion: 2,
      revision: 7,
      seriesStartDate: '2026-11-04',
      generationEnabled: true,
      timezone: 'Europe/Berlin',
      inheritanceMode: 'traceable',
      ...defaultProfile,
      composition: { ...defaultProfile.composition, density: 'sparse' },
    });
    const unsafeLogout = await ready.fetch(
      logoutRequest('cross-site'),
      draftEnv,
    );
    const stillThere = await recordCall(env.SESSIONS, browserSession, {
      operation: 'read',
    });
    const browserLogout = await ready.fetch(
      logoutRequest('same-origin'),
      draftEnv,
    );
    const browserGone = await recordCall(env.SESSIONS, browserSession, {
      operation: 'read',
    });
    return Response.json({
      disabledCorrectly:
        health.status === 503 && disabled.configurationReady === false,
      atomicConsumeCount: responses.filter(Boolean).length,
      sessionSeen: !!seen,
      sessionRevoked: gone === null,
      objectIsolation:
        z.object({ ownerId: z.literal('456') }).safeParse(other).success &&
        revokedAfterOther === null,
      absoluteExpiry: z
        .object({ expires: z.literal(expires) })
        .safeParse(readBeforeExpiry).success,
      expiredSessionDenied: expiredSession === null,
      expiredLoginDenied: expiredLogin === null,
      browserFormLogout:
        browserLogout.status === 303 &&
        browserGone === null &&
        browserLogout.headers.get('Set-Cookie')?.includes('Max-Age=0') === true,
      unsafeFormRejected: unsafeLogout.status === 403 && !!stillThere,
      legalWithoutSession:
        privacy.status === 200 &&
        privacy.headers.get('Set-Cookie') === null &&
        privacyText.includes('Testperson Beispiel') &&
        privacyText.includes('__Host-evolvera-login') &&
        imprint.status === 200,
      settingsPage:
        shell.status === 200 &&
        shell.headers
          .get('Content-Security-Policy')
          ?.includes("script-src 'self'") === true &&
        shellText.includes('/assets/admin.js') &&
        !shellText.includes('<style'),
      settingsApiClosed: anonymousApi.status === 401,
      favoritesClosed:
        favoritesShell.status === 200 &&
        anonymousFavorites.status === 401 &&
        foreignFavorite.status === 403,
      impossibleRejected:
        rejected.status === 422 &&
        rejectedBody.issues[0]?.path === 'composition.maxLayers',
      foreignOriginRejected: foreign.status === 403,
      schema2Readable: schema2.profile.composition.density === 'sparse',
      privacyGateClosed:
        loginAttempt.status === 503 &&
        loginAttempt.headers.get('Set-Cookie') === null,
    });
  },
};
