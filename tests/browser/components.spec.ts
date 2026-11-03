import { expect, test } from '@playwright/test';

test('Leere Suche bleibt rücksetzbar und ein Archivfehler bleibt als Fehler erkennbar', async ({
  page,
}, testInfo) => {
  await page.goto('./#/galerie?sammlung=traceable');
  const search = page.getByLabel('Titel oder Werkdatum suchen');
  await search.fill('Diesen Titel gibt es in der Testsammlung nicht');
  await search.press('Enter');
  await expect(
    page.getByText('Keine Werke zu dieser Suche.', { exact: false }),
  ).toBeVisible();
  await expect(page.locator('.archive-card')).toHaveCount(0);
  await expect(page.getByRole('alert')).toHaveCount(0);
  await expect(page.locator('.empty-marker')).toHaveAttribute(
    'aria-hidden',
    'true',
  );
  await page.locator('.empty-message').scrollIntoViewIfNeeded();
  await page.screenshot({ path: testInfo.outputPath('empty-search.png') });
  await page
    .getByRole('link', { name: 'Alle Werke ansehen', exact: true })
    .click();
  await expect(page.locator('.archive-card')).toHaveCount(12);
  await expect(page).toHaveURL(/#\/galerie\?sammlung=traceable$/);
  await expect(page.getByLabel('Sammlung ansehen')).toHaveValue('traceable');

  await page.route('**/artworks/index.json', (route) =>
    route.fulfill({ status: 503, body: 'offline' }),
  );
  await page.goto('./#/galerie');
  const error = page.getByRole('alert');
  await expect(error).toContainText('Fehler');
  await expect(error).toContainText('Archiv gerade nicht verfügbar');
  await expect(
    page.getByText('Noch keine Werke im Archiv.', { exact: true }),
  ).toHaveCount(0);
  await expect(
    error.getByRole('button', { name: 'Erneut laden', exact: true }),
  ).toBeEnabled();
  await error.scrollIntoViewIfNeeded();
  await page.screenshot({ path: testInfo.outputPath('archive-error.png') });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await expect(page.locator('img, svg, canvas')).toHaveCount(0);
});
