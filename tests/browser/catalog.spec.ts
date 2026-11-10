import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';

// EP-01 P2: reference images of the hand-written sample sheets for renderer 2
// at 320 px and desktop. New references only; the renderer 1 and archive
// references are separate files and stay untouched.
const catalog = JSON.parse(
  readFileSync(
    new URL('../../fixtures/preview/ep01-catalog.json', import.meta.url),
    'utf8',
  ),
) as { sheets: { id: string; title: string; dna: { elements: unknown[] } }[] };

test('Musterbogen zeigt alle Bögen im Ruhezustand ohne Bild-, SVG- oder Canvas-Kunst', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./#/atelier');
  const sheets = page.locator('.catalog-sheet');
  await expect(sheets).toHaveCount(catalog.sheets.length);
  await expect(
    page.locator('.catalog-sheet [data-renderer="2"][data-state="rest"]'),
  ).toHaveCount(catalog.sheets.length);
  await expect(page.locator('.catalog-sheet [role=alert]')).toHaveCount(0);
  await expect(
    page.locator('.catalog-sheet').locator('img, svg, canvas, iframe'),
  ).toHaveCount(0);
  const usesUrl = await page
    .locator('.catalog-sheet [data-art-element]')
    .evaluateAll((nodes) =>
      nodes.some((node) => {
        const own = getComputedStyle(node);
        const paint = getComputedStyle(node, '::before');
        return [
          own.maskImage,
          own.filter,
          paint.backgroundImage,
          paint.clipPath,
        ].some((value) => value.includes('url('));
      }),
    );
  expect(usesUrl).toBe(false);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});

for (const sheet of catalog.sheets) {
  test(`Musterbogen ${sheet.id} entspricht der Referenz`, async ({
    page,
  }, testInfo) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('./#/atelier');
    const figure = page.locator(`#${sheet.id}`);
    await expect(figure.locator('figcaption strong')).toHaveText(sheet.title);
    const work = figure.locator('[data-renderer]');
    await expect(work).toHaveAttribute('data-renderer', '2');
    await expect(work).toHaveAttribute('data-state', 'rest');
    await expect(work.locator('[data-art-element]')).toHaveCount(
      sheet.dna.elements.length,
    );
    // Fix only the capture geometry, as for the other art references.
    const width = testInfo.project.name === 'mobile-chromium' ? 280 : 660;
    await work.evaluate((node, size) => {
      Object.assign((node as HTMLElement).style, {
        position: 'fixed',
        zIndex: '2147483647',
        left: '20px',
        top: '20px',
        width: `${size}px`,
      });
    }, width);
    await expect
      .poll(() =>
        work.evaluate((node) => {
          const plane = node.firstElementChild!;
          return (
            new DOMMatrix(getComputedStyle(plane).transform).a /
            (node.getBoundingClientRect().width / 1000)
          );
        }),
      )
      .toBeCloseTo(1, 3);
    await expect(work).toHaveScreenshot(`renderer-v2-${sheet.id}.png`, {
      threshold: 0.25,
      maxDiffPixelRatio: 0.01,
    });
  });
}
