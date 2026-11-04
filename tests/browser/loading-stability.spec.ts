import { expect, test } from '@playwright/test';
import type { Route } from '@playwright/test';

test('Verzögertes Laden lässt den Footer bis zur fertigen Ansicht unter dem Sichtbereich', async ({
  page,
}, info) => {
  test.setTimeout(60000);
  const widths = info.project.name === 'mobile-chromium' ? [320] : [390, 1440];
  const measurements: {
    width: number;
    route: string;
    phase: string;
    footerTop: number;
    viewportHeight: number;
  }[] = [];
  await page.emulateMedia({ reducedMotion: 'reduce' });

  for (const width of widths) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of [
      '/',
      '/galerie?sammlung=traceable',
      '/werk/2000-01-13?sammlung=traceable',
    ]) {
      let releaseModule!: () => void;
      let releaseData!: () => void;
      const moduleGate = new Promise<void>((resolve) => {
        releaseModule = resolve;
      });
      const dataGate = new Promise<void>((resolve) => {
        releaseData = resolve;
      });
      let modulesBlocked = 0;
      let dataBlocked = 0;
      const modulePattern = '**/assets/ArchivePages-*.js';
      const dataPattern =
        /\/(?:assets\/review-[^/]+\.js|artworks\/index\.json)(?:\?|$)/;
      const holdModule = async (request: Route) => {
        modulesBlocked++;
        await moduleGate;
        await request.continue();
      };
      const holdData = async (request: Route) => {
        dataBlocked++;
        await dataGate;
        await request.continue();
      };
      await page.route(modulePattern, holdModule);
      await page.route(dataPattern, holdData);
      const verifyFooter = async (phase: string) => {
        const measured = await page.locator('footer').evaluate((node) => ({
          footerTop: node.getBoundingClientRect().top,
          viewportHeight: innerHeight,
        }));
        measurements.push({ width, route, phase, ...measured });
        expect(
          measured.footerTop,
          `${width}px ${route}: Footer während ${phase}`,
        ).toBeGreaterThanOrEqual(measured.viewportHeight);
      };

      try {
        await page.goto(
          `./?loading-review=${width}-${encodeURIComponent(route)}#${route}`,
          {
            waitUntil: 'domcontentloaded',
          },
        );
        await expect.poll(() => modulesBlocked).toBeGreaterThan(0);
        await expect(
          page.getByRole('status').filter({ hasText: 'Ansicht wird geladen' }),
        ).toBeVisible();
        await page.evaluate(() => document.fonts.ready);
        await verifyFooter('Routenmodul lädt');

        releaseModule();
        await expect.poll(() => dataBlocked).toBeGreaterThan(0);
        await expect(
          page.getByRole('status').filter({ hasText: 'Archiv wird geladen' }),
        ).toBeVisible();
        await verifyFooter('Archiv lädt');

        releaseData();
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
        if (route.startsWith('/galerie'))
          await expect(
            page.locator('.archive-grid [data-renderer]'),
          ).toHaveCount(12);
        if (route.startsWith('/werk'))
          await expect(
            page.locator('.art-stage [data-renderer]'),
          ).toBeVisible();
        await expect(
          page.getByRole('status').filter({
            hasText: /(?:Ansicht|Archiv) wird geladen/,
          }),
        ).toHaveCount(0);
      } finally {
        releaseModule();
        releaseData();
        await page.unroute(modulePattern, holdModule);
        await page.unroute(dataPattern, holdData);
      }
    }
  }

  await info.attach(
    'Footerposition bei blockierten Routen- und Archivantworten',
    {
      body: JSON.stringify(measurements),
      contentType: 'application/json',
    },
  );
});
