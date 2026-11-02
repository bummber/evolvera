import { describe, expect, it } from 'vitest';
import { legalSchema, publicationIssues } from '../src/site/legal';

const ready = {
  schemaVersion: 1,
  country: 'DE',
  purpose: 'noncommercial-art',
  fullName: 'Testperson Beispiel',
  email: 'kontakt@example.test',
  address: { street: 'Teststraße 1', postalCode: '12345', city: 'Testort' },
  privacyScope: 'pages-only',
  reviewedOn: '2026-11-02',
} as const;

describe('Angaben für die Veröffentlichung', () => {
  it('lässt eine vollständige, durchgesehene Pages-Fassung technisch zu', () => {
    expect(publicationIssues(legalSchema.parse(ready), null)).toEqual([]);
  });
  it('hält lokale Entwürfe mit fehlenden Angaben von der Veröffentlichung zurück', () => {
    const draft = legalSchema.parse({
      ...ready,
      address: null,
      reviewedOn: null,
    });
    expect(publicationIssues(draft, null)).toEqual([
      'Ladungsfähige Anschrift fehlt.',
      'Textdurchsicht vor Veröffentlichung offen.',
    ]);
  });
  it('verlangt bei aktivem Betreiberlink eine Anpassung der Pages-only-Hinweise', () => {
    expect(
      publicationIssues(legalSchema.parse(ready), 'https://admin.example.test'),
    ).toEqual([
      'Datenschutzhinweise für die eingerichtete Betreiberanmeldung ergänzen.',
    ]);
  });
  it.each([
    { ...ready, email: 'mailto:kontakt@example.test?subject=untrusted' },
    { ...ready, fullName: '' },
    { ...ready, address: { ...ready.address, postalCode: '123' } },
    { ...ready, extra: true },
  ])('verwirft ungültige Daten statt sie als Kontakt einzusetzen', (input) => {
    expect(legalSchema.safeParse(input).success).toBe(false);
  });
});
