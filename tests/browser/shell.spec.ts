import { expect, test } from '@playwright/test';
test.beforeEach(async ({ page }) => {
  await page.route('**/artworks/index.json', (route) =>
    route.fulfill({ json: { schemaVersion: 1, works: [] } }),
  );
});

test('Projektbasis, JSON, alle Direktlinks und mobile Breite funktionieren', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  const archiveResponse = page.waitForResponse((response) =>
    response.url().endsWith('/evolvera/artworks/index.json'),
  );
  await page.goto('./');
  expect((await archiveResponse).status()).toBe(200);
  await expect(page.getByText('Hier beginnt etwas Neues.')).toBeVisible();
  for (const [hash, title] of [
    ['#/galerie', 'Galerie'],
    ['#/evolution', 'Evolution'],
    ['#/ueber', 'Über Evolvera'],
    ['#/einstellungen', 'Einstellungen'],
    ['#/werk/2026-10-27', 'Werk noch nicht vorhanden'],
    ['#/werk/2026-02-30', 'Ungültige Werkadresse'],
    ['#/unbekannt', 'Diese Seite gibt es nicht.'],
  ]) {
    await page.goto(`./${hash}`);
    await expect(
      page.getByRole('heading', { name: title, exact: true, level: 1 }),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
  await page.goto('./#/einstellungen');
  const operatorLink = page.getByRole('link', {
    name: /Zur geschützten Betreiberseite/,
  });
  if (await operatorLink.count())
    await expect(operatorLink).toHaveAttribute(
      'href',
      /^https:\/\/[^/]+\/settings$/,
    );
  else
    await expect(
      page.getByRole('button', { name: /Mit GitHub anmelden/ }),
    ).toBeDisabled();
  expect(errors).toEqual([]);
});

test('Archivfehler erscheinen als Fehler, nicht als leere Galerie', async ({
  page,
}) => {
  await page.route('**/artworks/index.json', (route) =>
    route.fulfill({ status: 503, body: 'offline' }),
  );
  await page.goto('./#/galerie');
  await expect(page.getByRole('alert')).toContainText(
    'Archiv gerade nicht verfügbar',
  );
});

test('Tastatur, aktiver Navigationspunkt und ruhige HTML-/CSS-Shell', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Zum Inhalt' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('main')).toBeFocused();
  const menu = page.locator('summary');
  if (await menu.isVisible()) await menu.click();
  await page.getByRole('link', { name: 'Galerie', exact: true }).click();
  if (await menu.isVisible()) await menu.click();
  await expect(
    page.getByRole('link', { name: 'Galerie', exact: true }),
  ).toHaveAttribute('aria-current', 'page');
  await expect(page.locator('img, svg, canvas')).toHaveCount(0);
  await expect(page.getByText('Noch keine Werke im Archiv.')).toBeVisible();
});

test('Navigation ist auf Desktop und Mobil erreichbar, Escape schließt das mobile Menü', async ({
  page,
}) => {
  await page.goto('./');
  const menu = page.locator('summary');
  if (await menu.isVisible()) {
    await menu.click();
    await expect(
      page.getByRole('navigation', {
        name: 'Mobile Hauptnavigation',
        exact: true,
      }),
    ).toBeVisible();
    await menu.press('Escape');
    await expect(page.locator('details')).not.toHaveAttribute('open');
    await expect(menu).toBeFocused();
    await menu.click();
    await page
      .getByRole('link', { name: 'Über Evolvera', exact: true })
      .click();
    await expect(page.locator('details')).not.toHaveAttribute('open');
  } else {
    await expect(
      page.getByRole('navigation', { name: 'Hauptnavigation', exact: true }),
    ).toBeVisible();
    await page
      .getByRole('link', { name: 'Über Evolvera', exact: true })
      .click();
  }
  await expect(
    page.getByRole('heading', { name: 'Über Evolvera', level: 1 }),
  ).toBeVisible();
  await expect(page.getByRole('main')).toBeFocused();
});
