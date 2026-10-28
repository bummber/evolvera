import { z } from 'zod';
const token = z.string().regex(/^[A-Za-z0-9_-]{43}$/);
const expiry = { expires: z.number().int().positive() };
export const loginRecord = z.strictObject({
  kind: z.literal('login'),
  state: token,
  verifier: token,
  ...expiry,
});
export const sessionRecord = z.strictObject({
  kind: z.literal('session'),
  ownerId: z.string().regex(/^[1-9]\d*$/),
  csrf: token,
  ...expiry,
});
const recordSchema = z.union([loginRecord, sessionRecord]);
export type Session = z.infer<typeof sessionRecord>;
export interface Storage {
  get<T>(key: string): Promise<T | undefined>;
  put(key: string, value: unknown): Promise<void>;
  delete(key: string): Promise<boolean>;
  deleteAll(): Promise<void>;
  setAlarm(time: number): Promise<void>;
  transaction<T>(callback: (txn: Storage) => Promise<T>): Promise<T>;
}
export interface SessionNamespace {
  idFromName(name: string): unknown;
  get(id: unknown): { fetch(request: Request): Promise<Response> };
}
/** Binding-only endpoint. Records are isolated by random cookie IDs and expire absolutely. */
export class Sessions {
  constructor(private ctx: { storage: Storage }) {}
  async fetch(request: Request) {
    if (request.method !== 'POST') return new Response(null, { status: 405 });
    const body = (await request.json()) as {
      operation?: string;
      record?: unknown;
      state?: string;
    };
    const store = this.ctx.storage;
    const value = await store.transaction(async (txn) => {
      const existing = await txn.get<unknown>('record');
      const parsed = recordSchema.safeParse(existing);
      const record =
        parsed.success && parsed.data.expires > Date.now() ? parsed.data : null;
      if (body.operation === 'issue') {
        const next = recordSchema.parse(body.record);
        if (
          existing ||
          next.expires <= Date.now() ||
          next.expires > Date.now() + 3600000
        )
          throw new Error('Ungültige neue Sitzung.');
        await txn.put('record', next);
        return next;
      }
      if (body.operation === 'revoke') {
        await txn.delete('record');
        return null;
      }
      if (!record) {
        await txn.delete('record');
        return null;
      }
      if (body.operation === 'consume') {
        if (record.kind !== 'login' || body.state !== record.state) return null;
        await txn.delete('record');
        return record;
      }
      return body.operation === 'read' && record.kind === 'session'
        ? record
        : null;
    });
    if (body.operation === 'issue' && value)
      await store.setAlarm(value.expires);
    return Response.json(value, { headers: { 'Cache-Control': 'no-store' } });
  }
  async alarm() {
    await this.ctx.storage.deleteAll();
  }
}
export async function recordCall(
  namespace: SessionNamespace,
  id: string,
  body: unknown,
): Promise<unknown> {
  const stub = namespace.get(namespace.idFromName(id));
  const response = await stub.fetch(
    new Request('https://session.internal/', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    }),
  );
  if (!response.ok) throw new Error('Sitzungsspeicher nicht verfügbar.');
  return response.json();
}
