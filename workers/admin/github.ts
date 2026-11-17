import { z } from 'zod';
import {
  configV2Schema,
  modeSchema,
  readGenerationConfig,
} from '../../src/art/schema/config';
import { addSettingsIssues, profileSchema } from '../../src/art/schema/profile';
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
  const stored = JSON.parse(
    new TextDecoder('utf-8', { fatal: true }).decode(bytes),
  ) as unknown;
  // Configuration schema 1 or 2; schema 1 yields the standard profile.
  return { sha: data.sha, stored, config: readGenerationConfig(stored) };
}
export async function readConfig(env: GitHubEnv) {
  return (await readAt(await installationToken(env), 'main')).config;
}

/**
 * What the operator may write (EP-01 P8): the mode and the complete profile,
 * checked with the compatibility rules of the shared module. Start date,
 * generation switch and time zone are not part of it and stay as stored.
 */
export const writableSettingsSchema = z
  .strictObject({ inheritanceMode: modeSchema, ...profileSchema.shape })
  .superRefine((settings, ctx) => addSettingsIssues(settings, ctx));
export type WritableSettings = z.infer<typeof writableSettingsSchema>;

export type SettingsIssue = { path: string; message: string };
/** A request the rules reject; nothing was read from or written to Git. */
export class SettingsRejected extends Error {
  constructor(public issues: SettingsIssue[]) {
    super('Einstellungen abgelehnt.');
  }
}
/** Rule violations carry their own German message; any other issue is malformed input. */
export function checkSettings(input: unknown): WritableSettings {
  const result = writableSettingsSchema.safeParse(input);
  if (result.success) return result.data;
  if (result.error.issues.some((issue) => issue.code !== 'custom'))
    throw new GitHubFailure(400);
  throw new SettingsRejected(
    result.error.issues.map((issue) => ({
      path: issue.path.join('.'),
      message: issue.message,
    })),
  );
}

export async function saveSettings(
  env: GitHubEnv,
  revision: unknown,
  input: unknown,
) {
  const expected = z.number().int().positive().parse(revision);
  const settings = checkSettings(input);
  const token = await installationToken(env);
  const before = await readAt(token, 'main');
  if (before.config.revision !== expected) throw new GitHubFailure(409);
  const current = writableSettingsSchema.parse({
    inheritanceMode: before.config.inheritanceMode,
    ...before.config.profile,
  });
  // Nothing to change: no commit and no new revision (and so no new seeds).
  if (JSON.stringify(current) === JSON.stringify(settings))
    return { config: before.config, changed: false };
  const next = configV2Schema.parse({
    schemaVersion: 2,
    revision: expected + 1,
    seriesStartDate: before.config.seriesStartDate,
    generationEnabled: before.config.generationEnabled,
    timezone: before.config.timezone,
    ...settings,
  });
  const saved = z
    .object({ commit: z.object({ sha: z.string().regex(/^[a-f0-9]{40}$/) }) })
    .parse(
      await github(`${repo}/contents/config/generation.json`, token, 'PUT', {
        message: 'Update future generation settings',
        branch: 'main',
        sha: before.sha,
        content: encodeContent(next),
      }),
    );
  const verified = await readAt(token, saved.commit.sha);
  if (JSON.stringify(verified.stored) !== JSON.stringify(next))
    throw new GitHubFailure(502);
  return { config: verified.config, changed: true };
}
