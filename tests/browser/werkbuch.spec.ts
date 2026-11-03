import { expect, test } from '@playwright/test';

for (const width of [320, 390, 768, 1024, 1440]) {
  test(`Lokale variable Schriften und Shell bei ${width} CSS-Pixeln`, async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== 'desktop-chromium',
      'Die CSS-Breite wird bereits im Desktopprojekt geprüft.',
    );
    test.setTimeout(45000);
    const external: string[] = [];
    page.on('request', (request) => {
      if (new URL(request.url()).origin !== 'http://127.0.0.1:4173')
        external.push(request.url());
    });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('./');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    const widths = await page.evaluate(async () => {
      await document.fonts.ready;
      await document.fonts.load('500 12px "IBM Plex Mono"');
      const label = document.createElement('span');
      label.textContent = 'EVOLVERA';
      Object.assign(label.style, {
        position: 'absolute',
        fontFamily: 'Archivo',
        fontSize: '84px',
        fontWeight: '900',
      });
      document.body.append(label);
      const measure = (stretch: string) => {
        label.style.fontStretch = stretch;
        return label.getBoundingClientRect().width;
      };
      const result = {
        narrow: measure('62%'),
        normal: measure('100%'),
        wide: measure('125%'),
      };
      label.remove();
      return result;
    });
    expect(widths.narrow).toBeLessThan(widths.normal * 0.8);
    expect(widths.wide).toBeGreaterThan(widths.normal * 1.1);
    await testInfo.attach('Archivo-Breitenmessung', {
      body: JSON.stringify(widths),
      contentType: 'application/json',
    });

    const routes = [
      '/',
      '/galerie',
      '/evolution',
      '/ueber',
      '/einstellungen',
      '/atelier',
      '/evolutionslabor',
      '/kunstpruefung',
      '/impressum',
      '/datenschutz',
      '/werk/2026-10-27',
      '/unbekannt',
      ...(['traceable', 'free'] as const).flatMap((mode) => [
        `/?sammlung=${mode}`,
        `/galerie?sammlung=${mode}`,
        `/evolution?sammlung=${mode}`,
        `/werk/2000-01-20?sammlung=${mode}`,
      ]),
    ];
    await page.setViewportSize({ width, height: 900 });
    for (const [index, route] of routes.entries()) {
      // A fresh document prevents scroll restoration from the preceding footer
      // capture and avoids observing a previous route during React's transition.
      await page.goto(`./?werkbuch-pruefung=${width}-${index}#${route}`);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      await page.evaluate(() => window.scrollTo(0, 0));
      await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
        `${width}px ${route}`,
      ).toBeLessThanOrEqual(width);
      await expect(page.locator('img, svg, canvas')).toHaveCount(0);
      await page.screenshot({
        path: testInfo.outputPath(`${width}-${index}.png`),
      });
    }
    await expect(
      page.getByRole('navigation', { name: 'Hauptnavigation', exact: true }),
    )[width >= 1000 ? 'toBeVisible' : 'toBeHidden']();
    await page.goto(`./?werkbuch-pruefung=${width}-footer#/`);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    if (width < 1000) {
      await page
        .getByRole('navigation', { name: 'Schnellnavigation', exact: true })
        .getByRole('button', { name: 'Menü', exact: true })
        .click();
      const menu = page.locator('details.mobile-navigation');
      await expect(menu).toHaveAttribute('open');
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBe(width);
      await expect(page.locator('img, svg, canvas')).toHaveCount(0);
      await page.screenshot({
        path: testInfo.outputPath(`${width}-overlay.png`),
      });
      await menu
        .getByRole('link', { name: 'Datenschutz', exact: true })
        .focus();
      await page.screenshot({
        path: testInfo.outputPath(`${width}-overlay-footer.png`),
      });
      await menu.locator('summary').press('Escape');
      await expect(menu).not.toHaveAttribute('open');
    }
    await page.getByRole('contentinfo').scrollIntoViewIfNeeded();
    await page.screenshot({ path: testInfo.outputPath(`${width}-footer.png`) });
    expect(external).toEqual([]);
  });
}
