import { test, expect } from '@playwright/test';

async function openAtelier(page: import('@playwright/test').Page) {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./#/atelier');
  await expect(
    page.getByRole('heading', { name: 'Testatelier', level: 1 }),
  ).toBeVisible();
  await expect(page).toHaveTitle(/Testatelier/);
}

test('Gespeicherte Familien, Ruhevorschauen und visuelle Referenzen', async ({
  page,
}, testInfo) => {
  await openAtelier(page);
  await expect(page.locator('.study-card')).toHaveCount(12);
  await expect(page.locator('.study-card [data-state=rest]')).toHaveCount(12);
  for (const [name, file] of [
    ['Geometrische Konstellation · Studie 01', 'geometric'],
    ['Farbfeld / Minimalismus · Studie 05', 'color-field'],
    ['Mosaik / Raster · Studie 09', 'mosaic'],
  ]) {
    await page.getByRole('button', { name, exact: true }).click();
    const work = page.locator('.atelier-main [data-renderer]');
    await expect(work).toHaveAttribute('data-state', 'rest');
    // Fix only the capture geometry to the original reference raster. The
    // pre-Werkbuch dimensions/subpixel origins keep shell typography and scroll
    // position out of the artwork comparison; renderer pixels/tolerances stay.
    const style = await work.getAttribute('style');
    await work.evaluate((node, mobile) => {
      Object.assign((node as HTMLElement).style, {
        position: 'fixed',
        zIndex: '100',
        left: mobile ? '20px' : '20.1875px',
        top: mobile ? '20.515625px' : '20.015625px',
        width: mobile ? '280px' : '660.484375px',
      });
    }, testInfo.project.name === 'mobile-chromium');
    try {
      await expect(work).toHaveScreenshot(`renderer-v1-${file}.png`, {
        threshold: 0.25,
        maxDiffPixelRatio: 0.01,
      });
    } finally {
      await work.evaluate((node, original) => {
        if (original === null) node.removeAttribute('style');
        else node.setAttribute('style', original);
      }, style);
    }
    expect(
      await work.locator('[data-art-element]').count(),
    ).toBeLessThanOrEqual(50);
    const scaling = await work.evaluate((node) => {
      const plane = node.firstElementChild!;
      const scale = new DOMMatrix(getComputedStyle(plane).transform).a;
      return {
        width: node.getBoundingClientRect().width,
        renderedWidth: plane.getBoundingClientRect().width,
        scale,
      };
    });
    expect(scaling.renderedWidth).toBeCloseTo(scaling.width, 1);
    expect(scaling.scale).toBeCloseTo(scaling.width / 1000, 4);
  }
  expect(
    await page
      .locator('.study-card [data-renderer]')
      .evaluateAll((nodes) =>
        nodes.every(
          (node) => node.getAnimations({ subtree: true }).length === 0,
        ),
      ),
  ).toBe(true);
  await expect(page.locator('img,svg,canvas')).toHaveCount(0);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test('Reduzierte Bewegung, Opt-in, Pause am aktuellen Moment und statische Kacheln', async ({
  page,
}) => {
  await openAtelier(page);
  const work = page.locator('.atelier-main [data-renderer]');
  await expect(work).toHaveAttribute('data-state', 'rest');
  await page
    .getByRole('button', { name: 'Animation abspielen', exact: true })
    .click();
  await expect(work).toHaveAttribute('data-state', 'playing');
  await expect
    .poll(() =>
      work.evaluate((node) =>
        node
          .getAnimations({ subtree: true })
          .some((animation) => Number(animation.currentTime) > 40),
      ),
    )
    .toBe(true);
  await page
    .getByRole('button', { name: 'Animation pausieren', exact: true })
    .click();
  await expect(work).toHaveAttribute('data-state', 'paused');
  await work.evaluate(async (node) => {
    await Promise.all(
      node.getAnimations({ subtree: true }).map((animation) => animation.ready),
    );
  });
  const frozen = await work
    .locator('[data-art-element]')
    .evaluateAll((nodes) =>
      nodes.map((node) => getComputedStyle(node).transform),
    );
  // Wait for two actual paint frames, then ensure no animation has advanced.
  await page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      ),
  );
  expect(
    await work
      .locator('[data-art-element]')
      .evaluateAll((nodes) =>
        nodes.map((node) => getComputedStyle(node).transform),
      ),
  ).toEqual(frozen);
  expect(
    await page
      .locator('.study-card [data-renderer]')
      .evaluateAll((nodes) =>
        nodes.every(
          (node) => node.getAnimations({ subtree: true }).length === 0,
        ),
      ),
  ).toBe(true);
});

test('Seed-Eingabe liefert reproduzierbare DNA, Hauptwerk-Autoplay und ruhige Galeriekacheln', async ({
  page,
}) => {
  await openAtelier(page);
  await page.getByLabel('Seed', { exact: true }).fill('Ein neuer Anfang');
  await page.getByLabel('Kompositionsfamilie').selectOption('mosaic');
  await page.getByRole('button', { name: 'Studie aus Seed erzeugen' }).click();
  const work = page.locator('.atelier-main [data-renderer]');
  const first = await work
    .locator('[data-art-element]')
    .evaluateAll((nodes) => nodes.map((node) => node.getAttribute('style')));
  await page.getByRole('button', { name: 'Studie aus Seed erzeugen' }).click();
  expect(
    await work
      .locator('[data-art-element]')
      .evaluateAll((nodes) => nodes.map((node) => node.getAttribute('style'))),
  ).toEqual(first);
  await page.getByLabel('Seed', { exact: true }).fill('Eine andere Welt');
  await page.getByRole('button', { name: 'Studie aus Seed erzeugen' }).click();
  expect(
    await work
      .locator('[data-art-element]')
      .evaluateAll((nodes) => nodes.map((node) => node.getAttribute('style'))),
  ).not.toEqual(first);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page
    .getByRole('button', {
      name: 'Geometrische Konstellation · Studie 01',
      exact: true,
    })
    .click();
  await expect(work).toHaveAttribute('data-state', 'playing');
  expect(
    await page
      .locator('.study-card [data-renderer]')
      .evaluateAll((nodes) =>
        nodes.every(
          (node) => node.getAnimations({ subtree: true }).length === 0,
        ),
      ),
  ).toBe(true);
});
