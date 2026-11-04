import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';
import type { Artwork } from '../../src/art/schema/artwork';
const settings = JSON.parse(
  readFileSync(
    new URL('../../config/generation.json', import.meta.url),
    'utf8',
  ),
) as { generationEnabled: boolean; seriesStartDate: string | null };

// Read the same fixtures already validated by the build, without importing the
// browser bundle's JSON modules into Playwright's Node process.
const { chains } = JSON.parse(
  readFileSync(
    new URL('../../fixtures/preview/phase-3.json', import.meta.url),
    'utf8',
  ),
) as { chains: { inheritanceMode: string; works: Artwork[] }[] };

test('Heute rahmt leere und gespeicherte Bühnen ohne Verzerrung oder erfundene Serienwerte', async ({
  page,
}, testInfo) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.route('**/artworks/index.json', (route) =>
    route.fulfill({ json: { schemaVersion: 1, works: [] } }),
  );
  await page.goto('./#/');
  const heading = page.getByRole('heading', {
    name: 'Form wird Zukunft.',
    level: 1,
    exact: true,
  });
  await expect(heading).toBeVisible();
  const frame = page.locator('.home-stage .stage-frame');
  await expect(frame.locator('.cut-mark')).toHaveCount(4);
  await expect(frame.locator('.generation-sticker')).toHaveCount(0);
  await expect(
    frame.getByText('Hier beginnt etwas Neues.', { exact: true }),
  ).toBeVisible();
  const empty = await frame.locator('.stage').boundingBox();
  expect(empty!.height).toBeCloseTo(empty!.width, 0);
  const titleBox = await heading.boundingBox();
  const frameBox = await frame.boundingBox();
  if (page.viewportSize()!.width < 1000)
    expect(frameBox!.y).toBeLessThan(titleBox!.y);
  else expect(frameBox!.x).toBeGreaterThan(titleBox!.x);
  if (settings.generationEnabled) {
    await expect(page.locator('.series-info')).toContainText(
      `Serienstart ${settings.seriesStartDate}.`,
    );
    await expect(page.locator('.series-info')).toContainText(
      'Die tägliche Generierung ist aktiviert.',
    );
    await expect(page.locator('.series-info')).not.toContainText(
      'Startdatum steht noch nicht fest',
    );
  } else if (settings.seriesStartDate) {
    await expect(page.locator('.series-info')).toContainText(
      `Serienstart ${settings.seriesStartDate}.`,
    );
    await expect(page.locator('.series-info')).toContainText(
      'Die offizielle Generierung ist pausiert.',
    );
  } else {
    await expect(page.locator('.series-info')).toContainText(
      'Das Startdatum steht noch nicht fest.',
    );
    await expect(page.locator('.series-info')).toContainText(
      'Offizielle Werke werden derzeit nicht generiert.',
    );
  }
  await expect(frame.locator('[data-renderer]')).toHaveCount(0);
  await page.screenshot({
    path: testInfo.outputPath('today-before-series.png'),
    fullPage: true,
  });

  for (const chain of chains) {
    const work = chain.works.at(-1)!;
    await page.goto(`./#/?sammlung=${chain.inheritanceMode}`);
    await expect(
      page.getByRole('heading', { name: work.title, level: 1, exact: true }),
    ).toBeVisible();
    await expect(frame.locator('.generation-sticker strong')).toHaveText(
      String(work.generation).padStart(3, '0'),
    );
    await expect(frame.locator('.stage-frame-marks')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
    await expect(page.locator('.today-work .eyebrow')).toContainText(
      `Generation ${work.generation}`,
    );
    await expect(page.locator('.home-meta')).toContainText(
      'Simuliertes Testdatum',
    );
    const art = frame.locator('[data-renderer]');
    await expect(art).toHaveAttribute('data-state', 'rest');
    const geometry = await art.evaluate((node) => {
      const box = node.getBoundingClientRect();
      const plane = node.firstElementChild!;
      return {
        width: box.width,
        height: box.height,
        planeWidth: plane.getBoundingClientRect().width,
        scale: new DOMMatrix(getComputedStyle(plane).transform).a,
      };
    });
    expect(geometry.height).toBeCloseTo(geometry.width, 1);
    expect(geometry.planeWidth).toBeCloseTo(geometry.width, 1);
    expect(geometry.scale).toBeCloseTo(geometry.width / 1000, 4);
    await page.locator('.home-hero').screenshot({
      path: testInfo.outputPath(`today-${chain.inheritanceMode}.png`),
    });
    await page
      .getByRole('link', { name: 'Herkunft ansehen ↗', exact: true })
      .click();
    await expect(
      page.getByLabel('Werk für den Herkunftsvergleich'),
    ).toHaveValue(work.id);
    const target = new URLSearchParams(page.url().split('?').at(-1));
    expect(target.get('sammlung')).toBe(chain.inheritanceMode);
    expect(target.get('werk')).toBe(work.id);
    await expect(page.locator('.stage-frame')).toHaveCount(0);
  }
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await expect(page.locator('img, svg, canvas')).toHaveCount(0);
});
