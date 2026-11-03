import { expect, test } from '@playwright/test';
import settings from '../../config/generation.json' with { type: 'json' };
import { configSchema, modeLabels } from '../../src/art/schema/config';

test('Overlay hält Fokus und Hintergrund fest und schließt per Escape, Ziel und Schließen', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 740 });
  await page.goto('./#/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => window.scrollTo(0, 160));
  const scroll = await page.evaluate(() => scrollY);
  const dock = page.getByRole('navigation', {
    name: 'Schnellnavigation',
    exact: true,
  });
  const dockMenu = page.locator('.mobile-dock button');
  const details = page.locator('details.mobile-navigation');
  const summary = details.locator('summary');
  await dock.getByRole('button', { name: 'Menü', exact: true }).click();
  await expect(details).toHaveAttribute('open');
  await expect(dockMenu).toHaveAttribute('aria-expanded', 'true');
  await expect(summary).toBeFocused();
  await expect(page.locator('main')).toHaveAttribute('inert');
  expect(
    await page.evaluate(() => getComputedStyle(document.body).overflow),
  ).toBe('hidden');
  await page.mouse.wheel(0, 300);
  await page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      ),
  );
  expect(await page.evaluate(() => scrollY)).toBe(scroll);
  await expect(
    details.getByText(
      modeLabels[configSchema.parse(settings).inheritanceMode],
      { exact: true },
    ),
  ).toBeVisible();
  await expect(
    details.getByText(settings.timezone, { exact: true }),
  ).toBeVisible();
  await summary.press('Shift+Tab');
  await expect(
    details.getByRole('link', { name: 'Datenschutz', exact: true }),
  ).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(summary).toBeFocused();
  await summary.press('Escape');
  await expect(details).not.toHaveAttribute('open');
  await expect(summary).toBeFocused();
  await expect(dockMenu).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('main')).not.toHaveAttribute('inert');
  expect(
    await page.evaluate(() => getComputedStyle(document.body).overflow),
  ).not.toBe('hidden');

  await summary.click();
  await details
    .getByRole('navigation', { name: 'Mobile Hauptnavigation', exact: true })
    .getByRole('link', { name: 'Über Evolvera', exact: true })
    .click();
  await expect(
    page.getByRole('heading', { name: 'Über Evolvera', exact: true }),
  ).toBeVisible();
  await expect(page.getByRole('main')).toBeFocused();
  await expect(details).not.toHaveAttribute('open');
  await summary.click();
  await details.getByRole('link', { name: 'Datenschutz', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'Datenschutz', exact: true }),
  ).toBeVisible();
  await expect(page.getByRole('main')).toBeFocused();
  await summary.click();
  await expect(summary).toHaveAccessibleName('Menü schließen');
  await summary.click();
  await expect(details).not.toHaveAttribute('open');
  await expect(summary).toBeFocused();
});

test('Dock erhält Testsammlung, Footer bleibt frei und Desktopwechsel entsperrt das Menü', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 320, height: 560 });
  await page.goto('./#/?sammlung=free');
  const dock = page.getByRole('navigation', {
    name: 'Schnellnavigation',
    exact: true,
  });
  await dock.getByRole('link', { name: 'Galerie', exact: true }).click();
  await expect(page).toHaveURL(/#\/galerie\?sammlung=free$/);
  await expect(
    dock.getByRole('link', { name: 'Galerie', exact: true }),
  ).toHaveAttribute('aria-current', 'page');
  await expect(page.getByRole('main')).toBeFocused();
  const legal = page.getByRole('navigation', {
    name: 'Rechtliche Informationen',
    exact: true,
  });
  await legal.getByRole('link', { name: 'Datenschutz', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'Datenschutz', exact: true }),
  ).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  await legal.getByRole('link', { name: 'Datenschutz', exact: true }).focus();
  const legalBox = await legal.boundingBox();
  const dockBox = await dock.boundingBox();
  expect(legalBox!.y + legalBox!.height).toBeLessThan(dockBox!.y);

  await dock.getByRole('button', { name: 'Menü', exact: true }).click();
  const details = page.locator('details.mobile-navigation');
  await expect(details).toHaveAttribute('open');
  expect(
    await details.evaluate((node) => getComputedStyle(node).animationName),
  ).toBe('none');
  // All overlay content must remain reachable even on a short screen.
  await details.getByRole('link', { name: 'Datenschutz', exact: true }).focus();
  expect(await details.evaluate((node) => node.scrollTop)).toBeGreaterThan(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    320,
  );
  await page.setViewportSize({ width: 1024, height: 740 });
  await expect(details).not.toHaveAttribute('open');
  await expect(dock).toBeHidden();
  await expect(
    page.getByRole('navigation', { name: 'Hauptnavigation', exact: true }),
  ).toBeVisible();
  await expect(page.getByRole('main')).toBeFocused();
  expect(
    await page.evaluate(() => getComputedStyle(document.body).overflow),
  ).not.toBe('hidden');
  await page.setViewportSize({ width: 390, height: 740 });
  await dock.getByRole('button', { name: 'Menü', exact: true }).click();
  // Also close on URL changes that do not originate in a menu link.
  await page.evaluate(() => {
    location.hash = '#/ueber';
  });
  await expect(
    page.getByRole('heading', { name: 'Über Evolvera', exact: true }),
  ).toBeVisible();
  await expect(details).not.toHaveAttribute('open');
  await expect(page.getByRole('main')).toBeFocused();
  await expect(page.locator('img, svg, canvas')).toHaveCount(0);
});
