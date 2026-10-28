import { afterEach, describe, expect, it, vi } from 'vitest';
import old from '../fixtures/preview/phase-2.json';
import { reviewChains, previewReader } from '../src/preview/review';
import {
  berlinCycleDate,
  collectionKey,
  collectionLink,
  createReader,
  loadWorkContext,
  openCollection,
  orderedIndex,
  pageOf,
  visibleIndex,
} from '../src/archive/reader';

const chain = reviewChains[0]!;
const works = chain.works;
const index = {
  schemaVersion: 1 as const,
  works: works
    .toReversed()
    .map(({ id, generation, title }) => ({ id, generation, title })),
};
afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});
describe('Lesendes Archiv und getrennte Testsammlungen', () => {
  it('ergänzt auf 40 getrennte Werke und erhält die bisherigen 20 exakt', () => {
    expect(
      reviewChains.map((candidate) => candidate.works.slice(0, 10)),
    ).toEqual(old.chains.map((candidate) => candidate.works));
    const all = reviewChains.flatMap((candidate) => candidate.works);
    expect(all).toHaveLength(40);
    expect(new Set(all.map((work) => work.seed)).size).toBe(40);
    expect(new Set(all.map((work) => JSON.stringify(work.dna))).size).toBe(40);
  });
  it.each(['traceable', 'free'] as const)(
    'findet tatsächliche Eltern und Nachfolger einschließlich beider Ursprünge in %s',
    async (mode) => {
      const reader = previewReader(mode);
      const first = await loadWorkContext(reader, '2000-01-01');
      expect(first.parents).toHaveLength(0);
      expect(first.successors.map((work) => work.generation)).toEqual([3]);
      const second = await loadWorkContext(reader, '2000-01-02');
      expect(second.parents).toHaveLength(0);
      expect(second.successors.map((work) => work.generation)).toEqual([3, 4]);
      const middle = await loadWorkContext(reader, '2000-01-10');
      expect(middle.parents.map((work) => work.generation)).toEqual([8, 9]);
      expect(middle.successors.map((work) => work.generation)).toEqual([
        11, 12,
      ]);
      const last = await loadWorkContext(reader, '2000-01-20');
      expect(last.successors).toHaveLength(0);
      expect(last.work.inheritanceMode).toBe(mode);
      expect(
        (await loadWorkContext(reader, '2000-01-19')).successors.map(
          (work) => work.generation,
        ),
      ).toEqual([20]);
    },
  );
  it('weist ungeordnete, lückenhafte und datumswidrige Indizes ab', () => {
    expect(() =>
      orderedIndex({ ...index, works: index.works.toReversed() }),
    ).toThrow();
    expect(() =>
      orderedIndex({ ...index, works: index.works.slice(1, 10) }),
    ).toThrow();
    expect(() =>
      orderedIndex({
        ...index,
        works: index.works.map((row, i) => ({
          ...row,
          id: index.works.at(-1 - i)!.id,
        })),
      }),
    ).toThrow();
  });
  it('lädt höchstens die angeforderten zwölf Kacheln und hält Suchen/Seiten reproduzierbar', async () => {
    const load = vi.fn(async (id: string) =>
      works.find((work) => work.id === id),
    );
    const reader = createReader('official', index, load);
    const first = pageOf(reader.index, '', 1);
    expect(first.rows.map((row) => row.generation)).toEqual([
      20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9,
    ]);
    await Promise.all(first.rows.map((row) => reader.read(row.id)));
    expect(load).toHaveBeenCalledTimes(12);
    expect(pageOf(index, '', 2).rows.map((row) => row.generation)).toEqual([
      8, 7, 6, 5, 4, 3, 2, 1,
    ]);
    expect(
      pageOf(index, works[0]!.title.toLocaleUpperCase('de-DE'), 1).rows.map(
        (row) => row.id,
      ),
    ).toContain('2000-01-01');
    expect(pageOf(index, '2000-01-02', 1).total).toBe(1);
    expect(pageOf(index, 'nichtvorhanden', 1).total).toBe(0);
    expect(pageOf(index, '', 3).outOfRange).toBe(true);
    expect(() => pageOf(index, '', 0)).toThrow();
  });
  it('weist fremde Pfade vor dem Laden und widersprüchliche Werkdaten vor Anzeige ab', async () => {
    const load = vi.fn(async () => ({ ...works[2]!, title: 'Falscher Titel' }));
    const reader = createReader('official', index, load);
    await expect(reader.read('../secret')).rejects.toThrow();
    await expect(reader.read('2000-02-01')).rejects.toThrow();
    expect(load).not.toHaveBeenCalled();
    await expect(reader.read('2000-01-03')).rejects.toThrow(/widersprechen/);
    const reversed = {
      ...works[2]!,
      parentIds: works[2]!.parentIds.toReversed(),
      evolution: {
        ...works[2]!.evolution,
        evaluatedParentIds: works[2]!.parentIds.toReversed(),
      },
    };
    await expect(
      createReader('official', index, async () => reversed).read('2000-01-03'),
    ).rejects.toThrow();
  });
  it('prüft V2-Rezepte im Zusammenhang, statt eine falsche Herkunft anzuzeigen', async () => {
    const corrupted = structuredClone(works);
    corrupted[2]!.evolution.recipe.base.seed = 'falsche-basis';
    corrupted[2]!.evolution.recipe.base.source = 'new';
    const reader = createReader('official', index, async (id) =>
      corrupted.find((work) => work.id === id),
    );
    await expect(loadWorkContext(reader, '2000-01-03')).rejects.toThrow();
  });
  it('behält abgebrochene oder fehlgeschlagene Ladevorgänge nicht im Cache', async () => {
    let complete: (value: unknown) => void = () => {};
    const load = vi
      .fn()
      .mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            complete = resolve;
          }),
      )
      .mockResolvedValueOnce(works[0]);
    const reader = createReader('official', index, load);
    const controller = new AbortController();
    const pending = reader.read('2000-01-01', controller.signal);
    controller.abort();
    complete(works[0]);
    await expect(pending).rejects.toThrow();
    expect(await reader.read('2000-01-01')).toEqual(works[0]);
    expect(load).toHaveBeenCalledTimes(2);
    await reader.read('2000-01-01');
    expect(load).toHaveBeenCalledTimes(2);
    const retry = vi
      .fn()
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValueOnce(works[0]);
    const retried = createReader('official', index, retry);
    await expect(retried.read('2000-01-01')).rejects.toThrow('offline');
    expect(await retried.read('2000-01-01')).toEqual(works[0]);
  });
  it('liest offizielle JSON-Daten unter /evolvera/ und trennt HTTP-/Schemafehler', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({ ok: true, json: async () => index })
      .mockResolvedValueOnce({ ok: true, json: async () => works[0] })
      .mockResolvedValueOnce({ ok: false, status: 503 });
    vi.stubGlobal('fetch', fetchMock);
    const reader = await openCollection('official');
    await reader.read('2000-01-01');
    expect(fetchMock.mock.calls[1]![0]).toBe(
      '/evolvera/artworks/2000/2000-01-01.json',
    );
    await expect(reader.read('2000-01-02')).rejects.toThrow(/503/);
    vi.stubGlobal('fetch', vi.fn());
    expect((await openCollection('free')).key).toBe('free');
    expect(fetch).not.toHaveBeenCalled();
  });
  it('trennt Moduswahl über URLs von Betreiberkonfiguration und vermeidet stillen Fallback', () => {
    expect(collectionKey(new URLSearchParams())).toBe('official');
    expect(collectionKey(new URLSearchParams('sammlung=free'))).toBe('free');
    expect(collectionKey(new URLSearchParams('sammlung=unknown'))).toBeNull();
    expect(
      collectionKey(new URLSearchParams('sammlung=free&sammlung=traceable')),
    ).toBeNull();
    expect(collectionLink('/galerie', 'free', { seite: '2' })).toBe(
      '/galerie?seite=2&sammlung=free',
    );
    expect(collectionLink('/werk/2000-01-01', 'official')).toBe(
      '/werk/2000-01-01',
    );
  });
});
describe('Tagesanzeige nach Berliner 04:00-Grenze', () => {
  it.each([
    ['2026-03-29T01:59:59Z', '2026-03-28'],
    ['2026-03-29T02:00:00Z', '2026-03-29'],
    ['2026-10-25T02:59:59Z', '2026-10-24'],
    ['2026-10-25T03:00:00Z', '2026-10-25'],
    ['2027-01-01T02:59:59Z', '2026-12-31'],
    ['2027-01-01T03:00:00Z', '2027-01-01'],
  ])('bestimmt den aktuellen Zyklus bei %s als %s', (now, expected) => {
    expect(berlinCycleDate(new Date(now))).toBe(expected);
  });
  it('zeigt vor 04:00 kein zukünftiges Werk, auch wenn es fälschlich im Index steht', () => {
    const visible = visibleIndex(index, new Date('2000-01-20T02:59:59Z'));
    expect(visible.works[0]!.id).toBe('2000-01-19');
    expect(
      visibleIndex(index, new Date('2000-01-20T03:00:00Z')).works[0]!.id,
    ).toBe('2000-01-20');
    expect(orderedIndex(visible)).toEqual(visible);
  });
});
