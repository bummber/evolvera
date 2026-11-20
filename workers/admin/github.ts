import { z } from 'zod';
import {
  configV3Schema,
  modeSchema,
  readGenerationConfig,
  workDateSchema,
} from '../../src/art/schema/config';
import { addSettingsIssues, profileSchema } from '../../src/art/schema/profile';
import { runningSeries } from '../../src/series/restart';
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
export async function github(
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
export const repo = 'https://api.github.com/repos/bummber/evolvera';
export async function installationToken(env: GitHubEnv) {
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
export async function readAt(token: string, ref: string) {
  const data = contents.parse(
    await github(`${repo}/contents/config/generation.json?ref=${ref}`, token),
  );
  const bytes = Uint8Array.from(atob(data.content.replace(/\s/g, '')), (char) =>
    char.charCodeAt(0),
  );
  const stored = JSON.parse(
    new TextDecoder('utf-8', { fatal: true }).decode(bytes),
  ) as unknown;
  // Configuration schema 1, 2 or 3; schema 1 yields the standard profile.
  return { sha: data.sha, stored, config: readGenerationConfig(stored) };
}

const sha = z.string().regex(/^[a-f0-9]{40}$/);
const fileSchema = z.object({
  type: z.literal('file'),
  encoding: z.literal('base64'),
  sha,
  size: z.number().max(1_000_000),
  content: z.string().max(1_400_000),
});
/** A UTF-8 file at `ref`, or `null` if it does not exist there. */
export async function readFile(token: string, path: string, ref: string) {
  try {
    const data = fileSchema.parse(
      await github(`${repo}/contents/${path}?ref=${ref}`, token),
    );
    const bytes = Uint8Array.from(
      atob(data.content.replace(/\s/g, '')),
      (char) => char.charCodeAt(0),
    );
    return {
      sha: data.sha,
      text: new TextDecoder('utf-8', { fatal: true }).decode(bytes),
    };
  } catch (error) {
    if (error instanceof GitHubFailure && error.status === 404) return null;
    throw error;
  }
}
export async function head(token: string) {
  const ref = z
    .object({ object: z.object({ type: z.literal('commit'), sha }) })
    .parse(await github(`${repo}/git/ref/heads/main`, token));
  return ref.object.sha;
}
const archiveIndexSchema = z.object({
  works: z
    .array(
      z.object({
        id: workDateSchema,
        generation: z.number().int().positive(),
        title: z.string().min(1).max(160),
      }),
    )
    .max(20000),
});
/** Works of the running series at `ref`, newest first, as the archive index lists them. */
export async function archiveWorksAt(token: string, ref: string) {
  const file = await readFile(token, 'public/artworks/index.json', ref);
  return file ? archiveIndexSchema.parse(JSON.parse(file.text)).works : [];
}
/** Configuration and running series (package C) at the current main. */
export async function readSettings(env: GitHubEnv) {
  const token = await installationToken(env);
  const ref = await head(token);
  const [{ config }, works] = await Promise.all([
    readAt(token, ref),
    archiveWorksAt(token, ref),
  ]);
  return {
    config,
    series: runningSeries(
      works.map((work) => work.id),
      config.seriesStartDate,
    ),
  };
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
  /** Package C: days until the series restarts, `null` never; omitted keeps the stored value. */
  restart?: number | null,
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
  const restartAfterDays =
    restart === undefined ? before.config.restartAfterDays : restart;
  // Nothing to change: no commit and no new revision (and so no new seeds).
  if (
    JSON.stringify(current) === JSON.stringify(settings) &&
    restartAfterDays === before.config.restartAfterDays
  )
    return { config: before.config, changed: false };
  const next = configV3Schema.parse({
    schemaVersion: 3,
    revision: expected + 1,
    seriesStartDate: before.config.seriesStartDate,
    generationEnabled: before.config.generationEnabled,
    timezone: before.config.timezone,
    ...settings,
    restartAfterDays,
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
