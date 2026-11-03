import { expect, test } from '@playwright/test';

test('Galerieraster erhält vollständige ruhige Kunst, Reihenfolge und verlinkte Karten', async ({
  page,
}, testInfo) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const mode of ['traceable', 'free']) {
    await page.goto(`./#/galerie?sammlung=${mode}`);
    await expect(
      page.getByRole('heading', { name: 'Galerie', exact: true, level: 1 }),
    ).toBeVisible();
    const cards = page.locator('.archive-card');
    await expect(cards).toHaveCount(12);
    await expect(cards.locator('[data-renderer]')).toHaveCount(12);
    await expect(page.locator('.gallery-count')).toHaveText(
      '20 Werke · Seite 1 von 2',
    );
    const dates = await cards
      .locator('time')
      .evaluateAll((nodes) =>
        nodes.map((node) => node.getAttribute('datetime')),
      );
    expect(dates).toEqual(
      Array.from(
        { length: 12 },
        (_, index) => `2000-01-${String(20 - index).padStart(2, '0')}`,
      ),
    );
    for (const card of await cards.all()) {
      await expect(card.getByRole('link')).toHaveCount(1);
      await expect(card.getByRole('link')).toHaveAttribute(
        'href',
        new RegExp(`sammlung=${mode}`),
      );
    }
    const geometry = await cards
      .locator('[data-renderer]')
      .evaluateAll((nodes) =>
        nodes.map((node) => {
          const art = node.getBoundingClientRect();
          const holder = node.parentElement!.getBoundingClientRect();
          const plane = node.firstElementChild!;
          return {
            width: art.width,
            height: art.height,
            holderWidth: holder.width,
            holderHeight: holder.height,
            planeWidth: plane.getBoundingClientRect().width,
            state: node.getAttribute('data-state'),
            animations: node.getAnimations({ subtree: true }).length,
          };
        }),
      );
    for (const art of geometry) {
      expect(art.height).toBeCloseTo(art.width, 1);
      expect(art.planeWidth).toBeCloseTo(art.width, 1);
      expect(art.holderWidth).toBeCloseTo(art.width, 1);
      expect(art.holderHeight).toBeGreaterThanOrEqual(art.height - 0.1);
      expect(art.state).toBe('rest');
      expect(art.animations).toBe(0);
    }
    if (page.viewportSize()!.width >= 1000) {
      expect(geometry[0]!.width).toBeGreaterThan(geometry[1]!.width * 1.9);
    }
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(page.viewportSize()!.width);
    await expect(page.locator('img, svg, canvas')).toHaveCount(0);
    await page.screenshot({
      path: testInfo.outputPath(`gallery-${mode}.png`),
      fullPage: true,
    });
    await cards.first().getByRole('link').focus();
    await expect(cards.first().getByRole('link')).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(
      new RegExp(`/werk/2000-01-20\\?sammlung=${mode}`),
    );
    await expect(page.locator('.work-dateline')).toContainText(
      '20. Januar 2000',
    );
  }
});
