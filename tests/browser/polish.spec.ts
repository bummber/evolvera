import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';
import type { Artwork } from '../../src/art/schema/artwork';

const works = ['phase-2.json', 'phase-3.json']
  .flatMap((file) => {
    const fixture = JSON.parse(
      readFileSync(
        new URL(`../../fixtures/preview/${file}`, import.meta.url),
        'utf8',
      ),
    ) as { chains: { inheritanceMode: string; works: Artwork[] }[] };
    return fixture.chains.flatMap((chain) =>
      chain.works.map((work) => ({ mode: chain.inheritanceMode, work })),
    );
  })
  .toSorted((a, b) => b.work.title.length - a.work.title.length)
  .slice(0, 3);

test('Tastaturfokus bleibt bei fünf Breiten über dem Dock und erreicht den Footer', async ({
  page,
}, testInfo) => {
  test.setTimeout(60000);
  const widths =
    testInfo.project.name === 'mobile-chromium'
      ? [320]
      : [390, 768, 1024, 1440];
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const evidence: {
    width: number;
    route: string;
    stops: number;
    tall: number;
  }[] = [];
  for (const width of widths) {
    await page.setViewportSize({ width, height: 740 });
    for (const route of [
      '/ueber',
      '/einstellungen',
      '/atelier',
      '/galerie?sammlung=free',
      '/werk/2000-01-20?sammlung=traceable',
      '/evolution?sammlung=free',
    ]) {
      await page.goto(`./?focus-review=${width}#${route}`);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      await page.locator('main').focus();
      let stops = 0,
        tall = 0,
        footer = false;
      for (let step = 0; step < 80; step++) {
        await page.keyboard.press('Tab');
        const state = await page.evaluate(() => {
          const node = document.activeElement!;
          const inFooter = !!document.querySelector('footer')?.contains(node);
          if (!document.querySelector('main')?.contains(node) && !inFooter)
            return null;
          const box = node.getBoundingClientRect();
          const dock = document.querySelector('.mobile-dock')!;
          const limit =
            getComputedStyle(dock).display === 'none'
              ? innerHeight
              : dock.getBoundingClientRect().top - 4;
          const style = getComputedStyle(node);
          return {
            top: box.top,
            bottom: box.bottom,
            height: box.height,
            limit,
            inFooter,
            outline: style.outlineStyle,
            outlineWidth: parseFloat(style.outlineWidth),
          };
        });
        if (!state) break;
        stops++;
        footer ||= state.inFooter;
        expect(state.outline).not.toBe('none');
        expect(state.outlineWidth).toBeGreaterThanOrEqual(2);
        if (state.height <= state.limit) {
          expect(state.top, `${width}px ${route}`).toBeGreaterThanOrEqual(-0.5);
          expect(state.bottom, `${width}px ${route}`).toBeLessThanOrEqual(
            state.limit + 0.5,
          );
        } else {
          tall++;
          expect(
            Math.min(state.bottom, state.limit) - Math.max(0, state.top),
          ).toBeGreaterThanOrEqual(44);
        }
      }
      expect(stops).toBeGreaterThan(0);
      expect(footer, `${width}px ${route}: Footer erreicht`).toBe(true);
      evidence.push({ width, route, stops, tall });
    }
  }
  await testInfo.attach('Tastaturdurchlauf', {
    body: JSON.stringify(evidence),
    contentType: 'application/json',
  });
});

test('Lange gespeicherte Titel und ausgeglichene Einstellungsüberschrift passen in fünf Breiten', async ({
  page,
}, testInfo) => {
  test.setTimeout(45000);
  const widths =
    testInfo.project.name === 'mobile-chromium'
      ? [320]
      : [390, 768, 1024, 1440];
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const width of widths) {
    await page.setViewportSize({ width, height: 740 });
    await page.goto(`./?title-review=${width}#/einstellungen`);
    const heading = page.getByRole('heading', {
      level: 1,
      name: 'Einstellungen',
      exact: true,
    });
    await expect(heading).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    const lines = await heading.evaluate((node) => {
      const text = node.firstChild!;
      const rows = new Map<number, string>();
      for (let index = 0; index < text.textContent!.length; index++) {
        const range = document.createRange();
        range.setStart(text, index);
        range.setEnd(text, index + 1);
        const y = range.getBoundingClientRect().y;
        rows.set(y, (rows.get(y) ?? '') + text.textContent![index]);
      }
      return [...rows.values()];
    });
    expect(lines.at(-1)!.length).toBeGreaterThanOrEqual(4);
    if (width === 390)
      await heading.screenshot({
        path: testInfo.outputPath('balanced-title-390.png'),
      });
    for (const { mode, work } of works) {
      await page.goto(
        `./?title-review=${width}-${work.id}#/werk/${work.id}?sammlung=${mode}`,
      );
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(
        work.title,
      );
      await page.evaluate(() => document.fonts.ready);
      const titleLines = await page
        .getByRole('heading', { level: 1 })
        .evaluate((node) => {
          const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
          const rows = new Map<number, string>();
          for (let text = walker.nextNode(); text; text = walker.nextNode()) {
            for (let index = 0; index < text.textContent!.length; index++) {
              const range = document.createRange();
              range.setStart(text, index);
              range.setEnd(text, index + 1);
              const y = range.getBoundingClientRect().y;
              rows.set(y, (rows.get(y) ?? '') + text.textContent![index]);
            }
          }
          return [...rows.values()].map((line) => line.trim());
        });
      expect(titleLines[0]!.length).toBeGreaterThanOrEqual(4);
      expect(titleLines.at(-1)!.length).toBeGreaterThanOrEqual(3);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(width);
      const art = page.locator('.work-detail .art-stage [data-renderer]');
      const box = (await art.boundingBox())!;
      expect(box.height).toBeCloseTo(box.width, 1);
      expect(
        await art.evaluate(
          (node) => node.firstElementChild!.getBoundingClientRect().width,
        ),
      ).toBeCloseTo(box.width, 1);
      await page.locator('.detail-story').screenshot({
        path: testInfo.outputPath(`title-${width}-${mode}-${work.id}.png`),
      });
    }
  }
});

test('Reduced Motion und Menügrenze 999/1000 px erhalten Ruhe, Fokus und Bedienung', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./#/werk/2000-01-20?sammlung=traceable');
  const art = page.locator('.work-detail .art-stage [data-renderer]');
  await expect(art).toHaveAttribute('data-state', 'rest');
  const button = page.locator('.detail-toolbar .secondary-link');
  expect(
    await button.evaluate((node) => getComputedStyle(node).transitionDuration),
  ).toBe('0s');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(art).toHaveAttribute('data-state', 'playing');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(art).toHaveAttribute('data-state', 'rest');
  expect(
    await page
      .locator('.related-card [data-renderer]')
      .evaluateAll((nodes) =>
        nodes.every(
          (node) => node.getAnimations({ subtree: true }).length === 0,
        ),
      ),
  ).toBe(true);
  await page.setViewportSize({ width: 999, height: 560 });
  await page.locator('.mobile-dock button').click();
  const menu = page.locator('details.mobile-navigation');
  await expect(menu).toHaveAttribute('open');
  expect(
    await menu.evaluate((node) => getComputedStyle(node).animationName),
  ).toBe('none');
  await expect(menu.locator('summary')).toBeFocused();
  await page.setViewportSize({ width: 1000, height: 740 });
  await expect(menu).not.toHaveAttribute('open');
  await expect(page.locator('.mobile-dock')).toBeHidden();
  await expect(
    page.getByRole('navigation', { name: 'Hauptnavigation', exact: true }),
  ).toBeVisible();
  await expect(page.locator('main')).toBeFocused();
  expect(
    await page.evaluate(() => getComputedStyle(document.body).overflow),
  ).not.toBe('hidden');
  await page.setViewportSize({ width: 390, height: 740 });
  await page.locator('.mobile-dock button').click();
  await menu.locator('summary').press('Escape');
  await expect(menu).not.toHaveAttribute('open');
  await expect(menu.locator('summary')).toBeFocused();
  await expect(page.locator('img, svg, canvas')).toHaveCount(0);
});
