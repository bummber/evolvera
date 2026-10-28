import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HashRouter } from 'react-router-dom';
import { App } from '../src/app/App';

beforeEach(() =>
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ schemaVersion: 1, works: [] }),
    }),
  ),
);
afterEach(() => {
  vi.unstubAllGlobals();
  window.location.hash = '#/';
});
function open(hash: string) {
  window.location.hash = hash;
  return render(
    <HashRouter>
      <App />
    </HashRouter>,
  );
}
describe('Hash-Routing der lokalen Vorschau', () => {
  it.each([
    ['#/', 'Form wird Zukunft.'],
    ['#/galerie', 'Galerie'],
    ['#/evolution', 'Evolution'],
    ['#/ueber', 'Über Evolvera'],
    ['#/einstellungen', 'Einstellungen'],
    ['#/werk/2026-10-27', 'Werk noch nicht vorhanden'],
    ['#/werk/2026-02-30', 'Ungültige Werkadresse'],
    ['#/falsch', 'Diese Seite gibt es nicht.'],
  ])('öffnet Direktlink %s', async (hash, title) => {
    open(hash);
    expect(
      await screen.findByRole('heading', { level: 1, name: title }),
    ).toBeVisible();
  });
  it('navigiert per Tastatur-/Linkbedienung und setzt den Inhaltsfokus', async () => {
    open('#/');
    await screen.findByText('Hier beginnt etwas Neues.');
    await userEvent.click(
      within(
        screen.getByRole('navigation', { name: 'Hauptnavigation' }),
      ).getByRole('link', { name: 'Galerie' }),
    );
    expect(window.location.hash).toBe('#/galerie');
    expect(
      await screen.findByRole('heading', { name: 'Galerie', level: 1 }),
    ).toBeVisible();
    expect(screen.getByRole('main')).toHaveFocus();
  });
  it('zeigt keine vorgetäuschte Anmelde- oder Speichermöglichkeit', () => {
    open('#/einstellungen');
    expect(
      screen.getByRole('button', { name: /Mit GitHub anmelden/ }),
    ).toBeDisabled();
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
    expect(
      screen.getByText('Nachvollziehbare Vererbung', { exact: true }),
    ).toBeVisible();
  });
  it('kennzeichnet Ladefehler statt leere oder erfundene Werke zu zeigen', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
    const { container } = open('#/');
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Archiv gerade nicht verfügbar',
    );
    expect(container.querySelector('img, svg, canvas')).toBeNull();
  });
});
