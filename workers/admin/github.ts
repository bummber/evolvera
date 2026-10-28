import { z } from 'zod';
import { configSchema, modeSchema } from '../../src/art/schema/config';
export type GitHubEnv = {
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
  GITHUB_APP_ID: string;
  GITHUB_INSTALLATION_ID: string;
  GITHUB_PRIVATE_KEY_PKCS8: string;
  ADMIN_ORIGIN: string;
};
export class GitHubFailure extends Error {
  constructor(public status: number) {
    super('GitHub-Vorgang nicht bestätigt.');
  }
}
export const randomToken = () =>
  base64url(crypto.getRandomValues(new Uint8Array(32)));
export function base64url(bytes: Uint8Array) {
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}
export const challenge = async (verifier: string) =>
  base64url(
    new Uint8Array(
      await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier)),
    ),
  );
const encode = (value: unknown) =>
  base64url(new TextEncoder().encode(JSON.stringify(value)));
export const encodeContent = (value: unknown) =>
  btoa(
    String.fromCharCode(
      ...new TextEncoder().encode(JSON.stringify(value, null, 2) + '\n'),
    ),
  );
export async function appJwt(env: GitHubEnv) {
  const now = Math.floor(Date.now() / 1000);
  const message = `${encode({ alg: 'RS256', typ: 'JWT' })}.${encode({ iat: now - 60, exp: now + 540, iss: env.GITHUB_APP_ID })}`;
  const raw = env.GITHUB_PRIVATE_KEY_PKCS8.replace(/-----[^-]+-----|\s/g, '');
  const key = await crypto.subtle.importKey(
    'pkcs8',
    Uint8Array.from(atob(raw), (c) => c.charCodeAt(0)),
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  return `${message}.${base64url(new Uint8Array(await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, new TextEncoder().encode(message))))}`;
}
async function github(
  url: string,
  token: string,
  method = 'GET',
  body?: unknown,
) {
  const response = await fetch(url, {
    method,
    redirect: 'manual',
    signal: AbortSignal.timeout(10000),
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2026-03-10',
      'User-Agent': 'Evolvera-operator',
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  if (!response.ok) throw new GitHubFailure(response.status);
  return response.json() as Promise<unknown>;
}
export async function userIdentity(
  env: GitHubEnv,
  code: string,
  verifier: string,
) {
  const response = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    redirect: 'manual',
    signal: AbortSignal.timeout(10000),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code,
      code_verifier: verifier,
      redirect_uri: `${env.ADMIN_ORIGIN}/auth/callback`,
    }),
  });
  if (!response.ok) throw new GitHubFailure(response.status);
  const result = z
    .object({
      access_token: z.string().min(1),
      token_type: z.literal('bearer'),
    })
    .parse(await response.json());
  const user = z
    .object({ id: z.number().int().positive().safe() })
    .parse(await github('https://api.github.com/user', result.access_token));
  // User token is used once for identity, never stored or sent to the browser.
  return String(user.id);
}
const repo = 'https://api.github.com/repos/bummber/evolvera';
async function installationToken(env: GitHubEnv) {
  const jwt = await appJwt(env);
  const installation = z
    .object({ id: z.number().int().positive().safe() })
    .parse(await github(`${repo}/installation`, jwt));
  if (String(installation.id) !== env.GITHUB_INSTALLATION_ID)
    throw new GitHubFailure(403);
  const data = await github(
    `https://api.github.com/app/installations/${env.GITHUB_INSTALLATION_ID}/access_tokens`,
    jwt,
    'POST',
    { repositories: ['evolvera'], permissions: { contents: 'write' } },
  );
  return z.object({ token: z.string().min(1) }).parse(data).token;
}
const contents = z.object({
  type: z.literal('file'),
  encoding: z.literal('base64'),
  sha: z.string().regex(/^[a-f0-9]{40}$/),
  size: z.number().max(10000),
  content: z.string().max(16000),
});
async function readAt(token: string, ref: string) {
  const data = contents.parse(
    await github(`${repo}/contents/config/generation.json?ref=${ref}`, token),
  );
  const bytes = Uint8Array.from(atob(data.content.replace(/\s/g, '')), (char) =>
    char.charCodeAt(0),
  );
  return {
    sha: data.sha,
    config: configSchema.parse(
      JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes)),
    ),
  };
}
export async function readConfig(env: GitHubEnv) {
  return (await readAt(await installationToken(env), 'main')).config;
}
export async function saveMode(
  env: GitHubEnv,
  mode: unknown,
  revision: unknown,
) {
  const nextMode = modeSchema.parse(mode);
  const expected = z.coerce.number().int().positive().parse(revision);
  const token = await installationToken(env);
  const before = await readAt(token, 'main');
  if (before.config.revision !== expected) throw new GitHubFailure(409);
  if (before.config.inheritanceMode === nextMode) return before.config;
  const next = {
    ...before.config,
    inheritanceMode: nextMode,
    revision: expected + 1,
  };
  const saved = z
    .object({ commit: z.object({ sha: z.string().regex(/^[a-f0-9]{40}$/) }) })
    .parse(
      await github(`${repo}/contents/config/generation.json`, token, 'PUT', {
        message: 'Update future inheritance mode',
        branch: 'main',
        sha: before.sha,
        content: encodeContent(next),
      }),
    );
  const verified = await readAt(token, saved.commit.sha);
  if (JSON.stringify(verified.config) !== JSON.stringify(next))
    throw new GitHubFailure(502);
  return verified.config;
}
