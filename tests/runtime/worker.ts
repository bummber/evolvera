import { z } from 'zod';
import production, { createWorker } from '../../workers/admin';
import type { Env } from '../../workers/admin';
import { recordCall, Sessions } from '../../workers/admin/store';
import type { SessionNamespace } from '../../workers/admin/store';
import { readyPolicy } from '../fixtures/legal';
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
      privacyGateClosed:
        loginAttempt.status === 503 &&
        loginAttempt.headers.get('Set-Cookie') === null,
    });
  },
};
