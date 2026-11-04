import { expect, test } from '../fixtures/browser';
import operator from '../../config/operator.json' with { type: 'json' };
import settings from '../../config/generation.json' with { type: 'json' };

test('Gebautes Werkbuch bleibt bedienbar und ohne automatische Fremdabrufe', async ({
  page,
  browserName,
}, info) => {
  test.setTimeout(90000);
  const external: string[] = [];
  const writes: string[] = [];
  const errors: string[] = [];
  page.on('request', (request) => {
    if (new URL(request.url()).origin !== 'http://127.0.0.1:4174')
      external.push(request.url());
    if (!['GET', 'HEAD'].includes(request.method())) writes.push(request.url());
  });
  page.on('pageerror', (error) => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    const routes = [
      '/',
      '/galerie',
      '/evolution',
      '/ueber',
      '/einstellungen',
      '/datenschutz',
      '/werk/2000-01-20?sammlung=traceable',
      '/werk/2000-01-20?sammlung=free',
    ];
    for (const [index, route] of routes.entries()) {
      await page.goto(`./?abnahme=${width}-${index}#${route}`);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator('img, svg, canvas')).toHaveCount(0);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
        `${width}px ${route}`,
      ).toBeLessThanOrEqual(width);
      if (route === '/') {
        // macOS WebKit follows Safari's Option-Tab navigation for links.
        await page.keyboard.press(
          browserName === 'webkit' && process.platform === 'darwin'
            ? 'Alt+Tab'
            : 'Tab',
        );
        await expect(
          page.getByRole('link', { name: 'Zum Inhalt' }),
        ).toBeFocused();
        await page.keyboard.press('Enter');
        await expect(page.getByRole('main')).toBeFocused();
      }
      if (route === '/einstellungen') {
        await expect(
          page.getByRole('link', { name: /Zur geschützten Betreiberseite/ }),
        ).toHaveAttribute('href', `${operator.adminOrigin}/settings`);
        await expect(page.locator('.settings-status dd').nth(1)).toHaveText(
          String(settings.revision),
        );
        for (const radio of await page.getByRole('radio').all())
          await expect(radio).toBeDisabled();
        if (width === 320 || width === 1440)
          await page.screenshot({
            path: info.outputPath(`settings-${width}.png`),
            fullPage: true,
          });
      }
      if (route.includes('sammlung='))
        await expect(page.locator('[data-renderer]').first()).toBeVisible();
    }
  }
  expect(external).toEqual([]);
  expect(writes).toEqual([]);
  expect(errors).toEqual([]);
  expect(await page.context().cookies()).toEqual([]);
});
