import { describe, expect, it } from 'vitest';
import { artworkSchema, validateArtwork } from '../src/art/schema/artwork';
import { configSchema } from '../src/art/schema/config';
import { initialSettings, snapshotSettings } from '../src/operator/settings';
import { family, origin } from './fixtures/artworks';

describe('Konfiguration und Lauf-Snapshot', () => {
  it('lässt Serie deaktiviert, Start offen und traceable als Standard', () => {
    expect(initialSettings).toMatchObject({
      inheritanceMode: 'traceable',
      revision: 1,
      seriesStartDate: null,
      generationEnabled: false,
    });
  });
  it('weist unbekannte Modi, Revisionen, Zusatzfelder und Aktivierung ohne Datum zurück', () => {
    for (const patch of [
      { inheritanceMode: 'demo' },
      { revision: 0 },
      { secret: 'x' },
      { generationEnabled: true },
      { seriesStartDate: '2026-02-30' },
    ]) {
      expect(
        configSchema.safeParse({ ...initialSettings, ...patch }).success,
      ).toBe(false);
    }
  });
  it('friert einen kopierten Snapshot ein, spätere Änderungen betreffen nur den nächsten', () => {
    const config = { ...initialSettings };
    const snapshot = snapshotSettings(config);
    config.inheritanceMode = 'free';
    config.revision = 2;
    expect(Object.isFrozen(snapshot)).toBe(true);
    expect(snapshot).toMatchObject({
      inheritanceMode: 'traceable',
      revision: 1,
    });
    expect(snapshotSettings(config)).toMatchObject({
      inheritanceMode: 'free',
      revision: 2,
    });
  });
});

describe('Werkvertrag und Herkunftsbelege', () => {
  it('validiert unabhängige Ursprünge und konkrete Kopier-/Mutationsbelege', () => {
    const { a, b, child } = family();
    expect(validateArtwork(a, [])).toEqual(a);
    expect(validateArtwork(b, [])).toEqual(b);
    expect(validateArtwork(child, [a, b])).toEqual(child);
  });
  it('verlangt im nachvollziehbaren Modus Belege beider Eltern', () => {
    const { child } = family();
    child.evolution.decisions.pop();
    expect(artworkSchema.safeParse(child).success).toBe(false);
    child.inheritanceMode = 'free';
    child.evolution.decisions = [];
    expect(artworkSchema.safeParse(child).success).toBe(true);
  });
  it('verlangt auch im freien Modus dieselben ausgewerteten Eltern', () => {
    const { child } = family();
    child.inheritanceMode = 'free';
    child.evolution.evaluatedParentIds = [];
    expect(artworkSchema.safeParse(child).success).toBe(false);
  });
  it('erkennt erfundene Ausgangswerte und falsche unmittelbare Vorgänger', () => {
    const { a, b, child } = family();
    b.dna.elements[0]!.x = 0.4;
    expect(() => validateArtwork(child, [a, b])).toThrow(/Ausgangsbeleg/);
    expect(() => validateArtwork(child, [b, a])).toThrow(
      /Vorgängergenerationen/,
    );
    expect(() => validateArtwork(child, [a])).toThrow(/Elternwerke/);
  });
  it('erkennt erfundene Zielwerte, falsche Operatoren und reine Titelbelege', () => {
    const { child } = family();
    child.evolution.decisions[1]!.target.value = 0.8;
    expect(artworkSchema.safeParse(child).success).toBe(false);
    child.evolution.decisions[1]!.target.value = 0.6;
    child.evolution.decisions[1]!.operation = { kind: 'offset', amount: 0.3 };
    expect(artworkSchema.safeParse(child).success).toBe(false);
    child.evolution.decisions[0]!.target.path = 'titleDna.tokens.0';
    expect(artworkSchema.safeParse(child).success).toBe(false);
  });
  it.each([
    { schemaVersion: 2 },
    { rendererVersion: '999' },
    { generatorVersion: 'latest' },
    { id: '2026-02-30' },
    { generatedAt: 'gestern' },
    { parentIds: ['2026-10-26'] },
    { settingsRevision: 0 },
    { isCatchUp: 'true' },
  ])('weist ungültige Metadaten zurück: %j', (patch) => {
    expect(artworkSchema.safeParse({ ...origin(), ...patch }).success).toBe(
      false,
    );
  });
  it('begrenzt CSS-Eingaben, unsichtbare Elemente, leere Kompositionen und Last', () => {
    const work = origin();
    const invalid = [
      { ...work.dna, background: 'url(https://example.com/x.png)' },
      { ...work.dna, elements: [] },
      {
        ...work.dna,
        elements: Array.from({ length: 121 }, () => work.dna.elements[0]),
      },
      { ...work.dna, elements: [{ ...work.dna.elements[0], opacity: 0 }] },
      { ...work.dna, elements: [{ ...work.dna.elements[0], kind: 'svg' }] },
    ];
    for (const dna of invalid)
      expect(artworkSchema.safeParse({ ...work, dna }).success).toBe(false);
  });
  it('bewahrt Titel als Text, auch bei HTML-ähnlichem Inhalt', () => {
    expect(
      artworkSchema.parse({ ...origin(), title: '<script>kein HTML</script>' })
        .title,
    ).toContain('<script>');
  });
});

describe('Datumsvertrag: 04:00 Berlin und ehrliche Nachholung', () => {
  it.each([
    ['2026-03-28', '+01:00', '2026-03-29T01:59:59Z', false],
    ['2026-03-28', '+01:00', '2026-03-29T02:00:00Z', true],
    ['2026-10-24', '+02:00', '2026-10-25T02:59:59Z', false],
    ['2026-10-24', '+02:00', '2026-10-25T03:00:00Z', true],
  ] as const)(
    'prüft Tageszyklus über die Zeitumstellung: %s %s %s',
    (id, offset, start, catchUp) => {
      const work = {
        ...origin(1, id),
        scheduledFor: `${id}T04:00:00${offset}`,
        runStartedAt: start,
        generatedAt: start,
        isCatchUp: catchUp,
      };
      expect(artworkSchema.safeParse(work).success).toBe(true);
      expect(
        artworkSchema.safeParse({ ...work, isCatchUp: !catchUp }).success,
      ).toBe(false);
    },
  );
  it('unterscheidet Laufstart und Fertigstellung', () => {
    expect(
      artworkSchema.safeParse({
        ...origin(),
        runStartedAt: '2026-10-28T02:59:59Z',
        generatedAt: '2026-10-28T03:00:05Z',
        isCatchUp: false,
      }).success,
    ).toBe(true);
  });
  it('weist vorzeitigen Start und falschen Berliner Termin zurück', () => {
    expect(
      artworkSchema.safeParse({
        ...origin(),
        runStartedAt: '2026-10-27T02:59:59Z',
      }).success,
    ).toBe(false);
    expect(
      artworkSchema.safeParse({
        ...origin(),
        scheduledFor: '2026-10-27T04:00:00+02:00',
      }).success,
    ).toBe(false);
  });
});
