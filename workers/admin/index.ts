import './validation';
import { z } from 'zod';
import { modeLabels } from '../../src/art/schema/config';
import type { GenerationConfig } from '../../src/art/schema/config';
import {
  challenge,
  GitHubFailure,
  randomToken,
  readConfig,
  saveMode,
  userIdentity,
} from './github';
import type { GitHubEnv } from './github';
import { loginRecord, recordCall, sessionRecord } from './store';
import type { SessionNamespace } from './store';
import { legalDetails, legalSchema } from '../../src/site/legal';
import {
  operatorPrivacy,
  operatorPrivacySchema,
} from '../../src/site/operator-privacy';
import {
  escapeHtml as escape,
  legalPage,
  workerPublicationIssues,
} from './legal';
import type { PrivacyPolicy } from './legal';
export { Sessions } from './store';
export type Env = GitHubEnv & {
  ENABLED: string;
  OWNER_ID: string;
  SESSIONS: SessionNamespace;
};
const id = z.string().regex(/^[1-9]\d*$/);
const origin = z
  .string()
  .url()
  .refine((value) => {
    try {
      const url = new URL(value);
      return url.protocol === 'https:' && url.origin === value;
    } catch {
      return false;
    }
  });
const setup = z.object({
  ENABLED: z.literal('true'),
  OWNER_ID: id,
  ADMIN_ORIGIN: origin,
  GITHUB_CLIENT_ID: z.string().min(1),
  GITHUB_CLIENT_SECRET: z.string().min(1),
  GITHUB_APP_ID: id,
  GITHUB_INSTALLATION_ID: id,
  GITHUB_PRIVATE_KEY_PKCS8: z
    .string()
    .startsWith('-----BEGIN PRIVATE KEY-----'),
});
const tokenPattern = /^[A-Za-z0-9_-]{43}$/;
const loginCookie = '__Host-evolvera-login';
const sessionCookie = '__Host-evolvera-session';
const cookie = (name: string, value: string, seconds: number) =>
  `${name}=${value}; Max-Age=${seconds}; Path=/; Secure; HttpOnly; SameSite=Lax`;
function readCookie(request: Request, name: string) {
  const values = (request.headers.get('Cookie') ?? '')
    .split(';')
    .map((value) => value.trim())
    .filter((value) => value.startsWith(name + '='))
    .map((value) => value.slice(name.length + 1));
  return values.length === 1 && tokenPattern.test(values[0]!)
    ? values[0]
    : undefined;
}
const headers = (extra: HeadersInit = {}) =>
  new Headers({
    'Cache-Control': 'no-store',
    'Referrer-Policy': 'no-referrer',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Strict-Transport-Security': 'max-age=31536000',
    ...extra,
  });
const redirect = (where: string, setCookie?: string) =>
  new Response(null, {
    status: 303,
    headers: headers({
      Location: where,
      ...(setCookie ? { 'Set-Cookie': setCookie } : {}),
    }),
  });
function html(body: string, status = 200, setCookie?: string) {
  const nonce = randomToken();
  const result = headers({
    'Content-Type': 'text/html; charset=utf-8',
    'Content-Security-Policy': `default-src 'none'; style-src 'nonce-${nonce}'; form-action 'self'; frame-ancestors 'none'; base-uri 'none'`,
  });
  if (setCookie) result.set('Set-Cookie', setCookie);
  return new Response(
    `<!doctype html><html lang="de"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Evolvera · Betreiber</title><style nonce="${nonce}">body{margin:0;background:#eeeae2;color:#181919;font:16px/1.6 Arial,sans-serif}main{max-width:640px;padding:32px 20px;margin:auto}h1{font-size:clamp(2rem,8vw,4rem);line-height:1;letter-spacing:-.05em}label{display:block;margin-top:24px}select,button{font:inherit;max-width:100%;padding:12px;min-height:44px;margin:12px 0}button{cursor:pointer;background:#181919;color:#eeeae2;border:1px solid}a{color:inherit}p,li,address{overflow-wrap:anywhere}h2{line-height:1.25;margin-top:32px}address{font-style:normal}nav a{display:inline-block;padding:8px 12px 8px 0}a:focus-visible,button:focus-visible,select:focus-visible{outline:3px solid #c83920;outline-offset:3px}.notice{border-top:2px solid #c83920;padding:16px 0}</style><main><p>EVOLVERA / BETREIBER</p>${body}<nav aria-label="Rechtliche Informationen"><a href="/privacy">Datenschutz</a> <a href="/imprint">Impressum</a></nav><p><a href="https://bummber.github.io/evolvera/#/einstellungen">Zurück zur Galerie</a></p></main></html>`,
    { status, headers: result },
  );
}
function settingsPage(config: GenerationConfig, csrf: string, message = '') {
  return `<h1>Kommende Werke.</h1>${message ? `<p class="notice" role="status">${escape(message)}</p>` : ''}<p>Gespeicherter Modus: <strong>${escape(modeLabels[config.inheritanceMode])}</strong> · Revision ${config.revision}</p><p>Änderungen wirken ab dem nächsten noch nicht begonnenen Generierungslauf. Bestehende Werke und bereits laufende Generierungen bleiben erhalten.</p><form action="/settings/mode" method="post"><input type="hidden" name="csrf" value="${escape(csrf)}"><input type="hidden" name="revision" value="${config.revision}"><label for="mode">Vererbungsmodus</label><select name="mode" id="mode"><option value="traceable" ${config.inheritanceMode === 'traceable' ? 'selected' : ''}>Nachvollziehbare Vererbung</option><option value="free" ${config.inheritanceMode === 'free' ? 'selected' : ''}>Maximale Freiheit</option></select><br><button>Modus speichern</button></form><form action="/logout" method="post"><input type="hidden" name="csrf" value="${escape(csrf)}"><button>Abmelden</button></form>`;
}
async function form(request: Request) {
  if (
    !request.headers
      .get('Content-Type')
      ?.startsWith('application/x-www-form-urlencoded')
  )
    throw new GitHubFailure(415);
  const reader = request.body?.getReader();
  if (!reader) throw new GitHubFailure(400);
  const parts: Uint8Array[] = [];
  let length = 0;
  for (;;) {
    const chunk = await reader.read();
    if (chunk.done) break;
    length += chunk.value.length;
    if (length > 4096) {
      await reader.cancel();
      throw new GitHubFailure(413);
    }
    parts.push(chunk.value);
  }
  const bytes = new Uint8Array(length);
  let offset = 0;
  for (const part of parts) {
    bytes.set(part, offset);
    offset += part.length;
  }
  return new URLSearchParams(
    new TextDecoder('utf-8', { fatal: true }).decode(bytes),
  );
}
async function handle(request: Request, env: Env, policy: PrivacyPolicy) {
  const ready =
    setup.safeParse(env).success &&
    !!env.SESSIONS &&
    workerPublicationIssues(policy, env.ADMIN_ORIGIN).length === 0;
  const url = new URL(request.url);
  if (
    ['GET', 'HEAD'].includes(request.method) &&
    ['/privacy', '/imprint'].includes(url.pathname)
  ) {
    const response = html(
      legalPage(
        policy,
        url.pathname === '/privacy' ? 'privacy' : 'imprint',
        env.ADMIN_ORIGIN,
      ),
    );
    return request.method === 'HEAD' ? new Response(null, response) : response;
  }
  if (url.pathname === '/health')
    return Response.json(
      { configurationReady: ready },
      { status: ready ? 200 : 503, headers: headers() },
    );
  if (!ready)
    return html(
      '<h1>Noch nicht eingerichtet.</h1><p>Die echte GitHub-Anmeldung ist noch nicht verfügbar. Es wurden keine Einstellungen gespeichert. Einrichtung und Datenschutzdurchsicht müssen vor Aktivierung abgeschlossen sein.</p>',
      503,
    );
  if (url.origin !== env.ADMIN_ORIGIN)
    return html('<h1>Ungültige Adresse.</h1>', 400);
  if (request.method === 'GET' && url.pathname === '/login') {
    const key = randomToken(),
      state = randomToken(),
      verifier = randomToken();
    await recordCall(env.SESSIONS, key, {
      operation: 'issue',
      record: { kind: 'login', state, verifier, expires: Date.now() + 600000 },
    });
    const authorize = new URL('https://github.com/login/oauth/authorize');
    authorize.search = new URLSearchParams({
      client_id: env.GITHUB_CLIENT_ID,
      redirect_uri: `${env.ADMIN_ORIGIN}/auth/callback`,
      state,
      code_challenge: await challenge(verifier),
      code_challenge_method: 'S256',
      allow_signup: 'false',
    }).toString();
    return redirect(authorize.href, cookie(loginCookie, key, 600));
  }
  if (request.method === 'GET' && url.pathname === '/auth/callback') {
    const key = readCookie(request, loginCookie),
      state = url.searchParams.get('state'),
      code = url.searchParams.get('code');
    if (
      !key ||
      !state ||
      !tokenPattern.test(state) ||
      !code ||
      code.length > 512 ||
      url.searchParams.getAll('state').length !== 1 ||
      url.searchParams.getAll('code').length !== 1
    )
      throw new GitHubFailure(403);
    const transaction = loginRecord.safeParse(
      await recordCall(env.SESSIONS, key, { operation: 'consume', state }),
    );
    if (!transaction.success) throw new GitHubFailure(403);
    const owner = await userIdentity(env, code, transaction.data.verifier);
    if (owner !== env.OWNER_ID) throw new GitHubFailure(403);
    const previous = readCookie(request, sessionCookie);
    if (previous)
      await recordCall(env.SESSIONS, previous, { operation: 'revoke' });
    const session = randomToken();
    await recordCall(env.SESSIONS, session, {
      operation: 'issue',
      record: {
        kind: 'session',
        ownerId: owner,
        csrf: randomToken(),
        expires: Date.now() + 3600000,
      },
    });
    const response = redirect(
      '/settings',
      cookie(sessionCookie, session, 3600),
    );
    response.headers.append('Set-Cookie', cookie(loginCookie, '', 0));
    return response;
  }
  const key = readCookie(request, sessionCookie);
  const parsed = key
    ? sessionRecord.safeParse(
        await recordCall(env.SESSIONS, key, { operation: 'read' }),
      )
    : null;
  const session =
    parsed?.success && parsed.data.ownerId === env.OWNER_ID
      ? parsed.data
      : null;
  if (!session)
    return html(
      '<h1>Nur für den Betreiber.</h1><p>Die Galerie ist frei zugänglich. Hier meldest du dich mit deinem GitHub-Konto für die Moduswahl an.</p><p><a href="/login">Mit GitHub anmelden</a></p>',
      request.method === 'GET' ? 200 : 401,
    );
  if (
    request.method === 'GET' &&
    (url.pathname === '/settings' || url.pathname === '/')
  )
    return html(settingsPage(await readConfig(env), session.csrf));
  if (
    request.method === 'POST' &&
    ['/settings/mode', '/logout'].includes(url.pathname)
  ) {
    const requestOrigin = request.headers.get('Origin');
    // Native POST forms under no-referrer send Origin:null (Fetch Standard).
    // Accept only top-level form navigation proven same-origin by browser-owned
    // Fetch Metadata; null/missing/foreign origins alone never grant access.
    const sameOriginForm =
      requestOrigin === 'null' &&
      request.headers.get('Sec-Fetch-Site') === 'same-origin' &&
      request.headers.get('Sec-Fetch-Mode') === 'navigate' &&
      request.headers.get('Sec-Fetch-Dest') === 'document';
    if (requestOrigin !== env.ADMIN_ORIGIN && !sameOriginForm)
      throw new GitHubFailure(403);
    const body = await form(request);
    if (body.getAll('csrf').length !== 1 || body.get('csrf') !== session.csrf)
      throw new GitHubFailure(403);
    if (url.pathname === '/logout') {
      if ([...body.keys()].some((name) => name !== 'csrf'))
        throw new GitHubFailure(400);
      await recordCall(env.SESSIONS, key!, { operation: 'revoke' });
      return redirect('/settings', cookie(sessionCookie, '', 0));
    }
    if (
      body.getAll('mode').length !== 1 ||
      body.getAll('revision').length !== 1 ||
      [...body.keys()].some(
        (name) => !['csrf', 'mode', 'revision'].includes(name),
      )
    )
      throw new GitHubFailure(400);
    const config = await saveMode(env, body.get('mode'), body.get('revision'));
    return html(
      settingsPage(
        config,
        session.csrf,
        'In Git gespeichert. Ab dem nächsten noch nicht begonnenen Generierungslauf.',
      ),
    );
  }
  return html('<h1>Seite nicht gefunden.</h1>', 404);
}
export function createWorker(input: PrivacyPolicy) {
  const policy = {
    legal: legalSchema.parse(input.legal),
    review: operatorPrivacySchema.parse(input.review),
  };
  return {
    async fetch(request: Request, env: Env) {
      try {
        return await handle(request, env, policy);
      } catch (error) {
        const status =
          error instanceof GitHubFailure
            ? [400, 401, 403, 409, 413, 415].includes(error.status)
              ? error.status
              : 502
            : 503;
        return html(
          `<h1>${status === 409 ? 'Speicherkonflikt.' : 'Vorgang nicht bestätigt.'}</h1><p>${status === 409 ? 'Der Git-Stand wurde zwischenzeitlich geändert. Bitte die Einstellungen frisch laden; fremde Änderungen wurden nicht überschrieben.' : 'Anmeldung oder Speicherung konnte nicht sicher abgeschlossen werden. Es wird kein Erfolg behauptet.'}</p><a href="/settings">Einstellungen neu laden</a>`,
          status,
        );
      }
    },
  };
}
export default createWorker({ legal: legalDetails, review: operatorPrivacy });
