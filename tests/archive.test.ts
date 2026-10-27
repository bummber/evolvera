import { afterEach, describe, expect, it, vi } from 'vitest';
import { archiveIndexSchema, dataPath, loadArchiveIndex } from '../src/archive';
afterEach(() => vi.unstubAllGlobals());

describe('Archivgrenze', () => {
  it('bezieht alle Werkpfade auf die Projektbasis', () => {
    expect(dataPath('artworks/index.json')).toBe(
      '/evolvera/artworks/index.json',
    );
    expect(dataPath('artworks/2026/2026-10-27.json')).toBe(
      '/evolvera/artworks/2026/2026-10-27.json',
    );
    expect(() => dataPath('../config/generation.json')).toThrow();
    expect(() => dataPath('https://example.org')).toThrow();
  });
  it('liest einen validierten leeren Index ohne Testwerke', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ schemaVersion: 1, works: [] }),
    });
    vi.stubGlobal('fetch', fetchMock);
    expect(await loadArchiveIndex()).toEqual({ schemaVersion: 1, works: [] });
    expect(fetchMock).toHaveBeenCalledWith('/evolvera/artworks/index.json', {
      signal: undefined,
    });
  });
  it('verwechselt HTTP- und Schemafehler nicht mit einem leeren Archiv', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: false, status: 404 }),
    );
    await expect(loadArchiveIndex()).rejects.toThrow(/404/);
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValue({ ok: true, json: async () => ({ works: [] }) }),
    );
    await expect(loadArchiveIndex()).rejects.toThrow();
  });
  it('erkennt doppelte Datums-IDs und Generationen', () => {
    const row = { id: '2026-10-27', title: 'Schema', generation: 1 };
    expect(
      archiveIndexSchema.safeParse({ schemaVersion: 1, works: [row, row] })
        .success,
    ).toBe(false);
  });
});
