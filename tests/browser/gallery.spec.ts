import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import type { Artwork } from '../../src/art/schema/artwork';
type Fixture = { chains: { works: Artwork[] }[] };
const original = JSON.parse(
  readFileSync(
    new URL('../../fixtures/preview/phase-2.json', import.meta.url),
    'utf8',
  ),
) as Fixture;
const extension = JSON.parse(
  readFileSync(
    new URL('../../fixtures/preview/phase-3.json', import.meta.url),
    'utf8',
  ),
) as Fixture;
const works = [...original.chains[0]!.works, ...extension.chains[0]!.works];
const index = {
  schemaVersion: 1,
  works: works
    .toReversed()
    .map(({ id, title, generation }) => ({ id, title, generation })),
};
async function noOverflow(page: import('@playwright/test').Page) {
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await expect(page.locator('img,svg,canvas')).toHaveCount(0);
}
async function stubArchive(
  page: import('@playwright/test').Page,
  corrupt = false,
) {
  await page.route('**/evolvera/artworks/index.json', (route) =>
    route.fulfill({ json: index }),
  );
  await page.route(/\/evolvera\/artworks\/2000\/.*\.json$/, (route) => {
    const id = route.request().url().split('/').at(-1)!.replace('.json', '');
    const work = works.find((candidate) => candidate.id === id);
    if (!work) return route.fulfill({ status: 404 });
    const data =
      id === '2000-01-20'
        ? {
            ...work,
            runStartedAt: '2000-01-23T04:00:00+01:00',
            generatedAt: '2000-01-23T04:00:02+01:00',
            isCatchUp: true,
          }
        : work;
    return route.fulfill({
      json: corrupt ? { ...data, id: '2000-02-01' } : data,
    });
  });
}
test('40 Testwerke sind getrennt erreichbar, Galerie blättert zwölf plus acht und Suche bleibt verlinkbar', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./#/kunstpruefung');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Was bleibt.Was bricht.',
  );
  await expect(
    page.getByText('Die Kunstabnahme ist offen.', { exact: false }),
  ).toBeVisible();
  await page
    .getByRole('link', { name: 'Sammlung durchsehen ↗' })
    .first()
    .click();
  await expect(page.locator('.archive-card [data-renderer]')).toHaveCount(12);
  await expect(page.locator('.archive-card').first()).toContainText(
    'Generation 20',
  );
  expect(
    await page
      .locator('.archive-card [data-renderer]')
      .evaluateAll((nodes) =>
        nodes.every(
          (node) => node.getAnimations({ subtree: true }).length === 0,
        ),
      ),
  ).toBe(true);
  await page.getByRole('link', { name: 'Ältere Werke →' }).click();
  await expect(page.locator('.archive-card [data-renderer]')).toHaveCount(8);
  await expect(page).toHaveURL(/seite=2/);
  await page.reload();
  await expect(page.locator('.archive-card')).toHaveCount(8);
  await page.locator('.archive-card').last().getByRole('link').click();
  await expect(page.locator('.eyebrow').last()).toContainText('Generation 1');
  await page.goBack();
  await expect(page.locator('.archive-card')).toHaveCount(8);
  await page.getByLabel('Titel oder Werkdatum suchen').fill('2000-01-02');
  await page.getByRole('button', { name: 'Suchen', exact: true }).click();
  await expect(page.locator('.archive-card')).toHaveCount(1);
  await expect(page.locator('.archive-card')).toContainText('Generation 2');
  await expect(page).toHaveURL(/suche=2000-01-02/);
  await noOverflow(page);
});
test('Ursprünge, Eltern und bis zu zwei echte Nachfolger sind navigierbar; Bewegung bleibt im Hauptwerk', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./#/werk/2000-01-01?sammlung=traceable');
  const parents = page.getByRole('region', {
    name: 'Elternwerke',
    exact: true,
  });
  const successors = page.getByRole('region', {
    name: 'Direkte Nachfolger',
    exact: true,
  });
  await expect(parents.getByRole('link')).toHaveCount(0);
  await expect(successors.getByRole('link')).toHaveCount(1);
  await expect(successors.getByRole('link')).toHaveAccessibleName(
    /^Generation 3:/,
  );
  await page.goto('./#/werk/2000-01-02?sammlung=traceable');
  await expect(successors.getByRole('link')).toHaveCount(2);
  await successors.getByRole('link', { name: /^Generation 3:/ }).click();
  await expect(parents.getByRole('link')).toHaveCount(2);
  await expect(page.locator('.work-provenance')).toContainText('Elternteil A');
  await expect(page.locator('.work-provenance')).toContainText('Elternteil B');
  const art = page.locator('.work-layout .art-stage [data-renderer]');
  await expect(art).toHaveAttribute('data-state', 'rest');
  await page
    .getByRole('button', { name: 'Animation abspielen', exact: true })
    .click();
  await expect(art).toHaveAttribute('data-state', 'playing');
  await page
    .getByRole('button', { name: 'Animation pausieren', exact: true })
    .click();
  await expect(art).toHaveAttribute('data-state', 'paused');
  expect(
    await page
      .locator('.related-card [data-renderer]')
      .evaluateAll((nodes) =>
        nodes.every(
          (node) => node.getAnimations({ subtree: true }).length === 0,
        ),
      ),
  ).toBe(true);
  await page
    .getByRole('link', { name: 'Herkunft ansehen ↗', exact: true })
    .click();
  await expect(page.getByLabel('Werk für den Herkunftsvergleich')).toHaveValue(
    '2000-01-03',
  );
  await page
    .getByLabel('Werk für den Herkunftsvergleich')
    .selectOption('2000-01-20');
  await expect(successors.getByRole('link')).toHaveCount(0);
  await expect(
    parents.getByRole('link', { name: /^Generation 18:/ }),
  ).toBeVisible();
  await page
    .getByLabel('Sammlung ansehen', { exact: true })
    .selectOption('free');
  await expect(page.locator('.work-dateline')).toContainText(
    'Maximale Freiheit',
  );
  await expect(page).toHaveURL(/sammlung=free/);
  await noOverflow(page);
});
test('Offizieller Datenweg lädt nur eine Galerieseite; verspätetes Werk nennt ehrliches Datum und Nachholstatus', async ({
  page,
}) => {
  await stubArchive(page);
  const requests: string[] = [];
  page.on('request', (request) => {
    if (/artworks\/2000\//.test(request.url())) requests.push(request.url());
  });
  await page.goto('./#/galerie');
  await expect(page.locator('.archive-card [data-renderer]')).toHaveCount(12);
  expect(requests).toHaveLength(12);
  await page.goto('./#/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    works.at(-1)!.title,
  );
  await expect(page).toHaveTitle(new RegExp(works.at(-1)!.title));
  await expect(page.locator('.eyebrow').last()).toContainText(
    'Zuletzt veröffentlicht',
  );
  await expect(page.locator('.work-dateline')).toContainText('20. Januar 2000');
  await expect(page.locator('.work-dateline')).toContainText('Nachgeholt');
  await page.getByText('Werkdaten ansehen', { exact: true }).click();
  await expect(page.locator('.work-metadata')).toContainText('23.01.2000');
  await expect(page.locator('.work-metadata')).toContainText('Revision 1');
  await noOverflow(page);
});
test('Fehlende, ungültige und beschädigte Werke sowie falsche Seiten werden ehrlich abgefangen', async ({
  page,
}) => {
  await page.goto('./#/galerie?sammlung=traceable&seite=3');
  await expect(
    page.getByText('Diese Galerieseite gibt es nicht.', { exact: true }),
  ).toBeVisible();
  await page.goto('./#/galerie?sammlung=traceable&seite=-1');
  await expect(
    page.getByText('Diese Galerieseite gibt es nicht.', { exact: true }),
  ).toBeVisible();
  await page.goto('./#/werk/2000-01-21?sammlung=free');
  await expect(
    page.getByRole('heading', { name: 'Werk noch nicht vorhanden' }),
  ).toBeVisible();
  await page.goto('./#/werk/2000-02-30?sammlung=free');
  await expect(
    page.getByRole('heading', { name: 'Ungültige Werkadresse' }),
  ).toBeVisible();
  await page.goto('./#/galerie?sammlung=falsch');
  await expect(
    page.getByRole('heading', { name: 'Unbekannte Sammlung' }),
  ).toBeVisible();
  await stubArchive(page, true);
  await page.goto('./#/werk/2000-01-20');
  await expect(page.getByRole('alert')).toContainText(
    'Werk gerade nicht verfügbar',
  );
  await expect(page.locator('.work-layout [data-renderer]')).toHaveCount(0);
  await noOverflow(page);
});
test('Ein verspäteter Indexabruf ersetzt nach Sammlungswechsel nicht die Testsammlung', async ({
  page,
}) => {
  let release: () => void = () => {};
  const barrier = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route('**/artworks/index.json', async (route) => {
    await barrier;
    await route
      .fulfill({ json: { schemaVersion: 1, works: [] } })
      .catch(() => {});
  });
  await page.goto('./#/galerie');
  await expect(
    page.getByText('Archiv wird geladen …', { exact: true }),
  ).toBeVisible();
  await page
    .getByLabel('Sammlung ansehen', { exact: true })
    .selectOption('free');
  await expect(page.locator('.archive-card [data-renderer]')).toHaveCount(12);
  release();
  await expect(
    page.getByLabel('Sammlung ansehen', { exact: true }),
  ).toHaveValue('free');
  await expect(page.locator('.archive-card')).toHaveCount(12);
  await expect(
    page.getByText('Noch keine Werke im Archiv.', { exact: true }),
  ).toHaveCount(0);
});

test('Vor 04:00 bleibt das letzte fällige Werk sichtbar, nach Reload ab 04:00 das neue', async ({
  page,
}) => {
  const requests: string[] = [];
  await page.clock.setFixedTime(new Date('2000-01-20T02:59:59Z'));
  await page.route('**/evolvera/artworks/index.json', (route) =>
    route.fulfill({ json: index }),
  );
  await page.route(/\/evolvera\/artworks\/2000\/.*\.json$/, (route) => {
    const id = route.request().url().split('/').at(-1)!.replace('.json', '');
    requests.push(id);
    return route.fulfill({ json: works.find((work) => work.id === id) });
  });
  await page.goto('./#/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    works[18]!.title,
  );
  expect(requests).not.toContain('2000-01-20');
  await expect(page.locator('.work-dateline')).toContainText('19. Januar 2000');
  await page.clock.setFixedTime(new Date('2000-01-20T03:00:00Z'));
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    works[19]!.title,
  );
  await expect(page.locator('.work-dateline')).toContainText('20. Januar 2000');
  await expect(page.locator('.eyebrow').last()).toContainText(
    'Aktuelles Tageswerk',
  );
});
test('Eine fehlende Werkdatei erzeugt eine Fehlerkachel und keine erfundene Kunst', async ({
  page,
}) => {
  await stubArchive(page);
  await page.route('**/artworks/2000/2000-01-20.json', (route) =>
    route.fulfill({ status: 503, body: 'offline' }),
  );
  await page.goto('./#/galerie');
  await expect(page.locator('.archive-card')).toHaveCount(12);
  await expect(
    page.locator('.archive-card').first().getByRole('alert'),
  ).toHaveText('Werkdaten nicht verfügbar');
  await expect(
    page.locator('.archive-card').first().locator('[data-renderer]'),
  ).toHaveCount(0);
  await page.locator('.archive-card').first().getByRole('link').click();
  await expect(page.getByRole('alert')).toContainText(
    'Werk gerade nicht verfügbar',
  );
  await expect(page.locator('.work-layout [data-renderer]')).toHaveCount(0);
});
