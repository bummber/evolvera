import { z } from 'zod';
import production from '../../workers/admin';
import type { Env } from '../../workers/admin';
import { recordCall, Sessions } from '../../workers/admin/store';
import type { SessionNamespace } from '../../workers/admin/store';
export { Sessions };
z.config({ jitless: true });
/** Local test entry only; not referenced by the deployable Worker configuration. */
export default {
  async fetch(_request: Request, env: { SESSIONS: SessionNamespace }) {
    const health = await production.fetch(
      new Request('https://unconfigured.example.test/health'),
      { ...env, ENABLED: 'false', ADMIN_ORIGIN: '' } as Env,
    );
    const disabled = (await health.json()) as { configurationReady: boolean };
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
    return Response.json({
      disabledCorrectly:
        health.status === 503 && disabled.configurationReady === false,
      atomicConsumeCount: responses.filter(Boolean).length,
      sessionSeen: !!seen,
      sessionRevoked: gone === null,
    });
  },
};
