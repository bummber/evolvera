import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';

// EP-01 P4: the stored preview chains of generator 0.3.0 in the test
// atelier. All works are checked for a faithful render; reference images
// exist for three works per inheritance mode and one of the transition, at
// 320 px and desktop. New references only; all other references are
// separate files and stay untouched.
type Work = {
  generation: number;
  title: string;
  dna: { elements: unknown[] };
};
const { chains } = JSON.parse(
  readFileSync(
    new URL('../../fixtures/preview/ep01-chains.json', import.meta.url),
    'utf8',
  ),
) as { chains: { key: string; legacyParents: unknown[]; works: Work[] }[] };
const works = chains.flatMap((chain) =>
  chain.works.map((work) => ({ key: chain.key, work })),
);
const referenced = [
  ['traceable', 3],
  ['traceable', 6],
  ['traceable', 10],
  ['free', 3],
  ['free', 6],
  ['free', 10],
  ['transition', 11],
] as const;

test('Atelier zeigt alle Kettenwerke im Ruhezustand ohne Bild-, SVG- oder Canvas-Kunst', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./#/atelier');
  expect(chains.map((chain) => chain.key)).toEqual([
    'traceable',
    'free',
    'transition',
  ]);
  expect(works).toHaveLength(24);
  const cards = page.locator('.chainv3-card');
  await expect(cards).toHaveCount(works.length);
  await expect(
    page.locator('.chainv3-card [data-renderer="2"][data-state="rest"]'),
  ).toHaveCount(works.length);
  // The two old parents of the transition keep renderer 1.
  await expect(
    page.locator('.chainv3-legacy [data-renderer="1"][data-state="rest"]'),
  ).toHaveCount(2);
  await expect(
    page.locator('.chainv3-card [role=alert], .chainv3-legacy [role=alert]'),
  ).toHaveCount(0);
  await expect(
    page
      .locator('.chainv3-card, .chainv3-legacy, .chainv3-main')
      .locator('img, svg, canvas, iframe'),
  ).toHaveCount(0);
  const counts = await cards.evaluateAll((nodes) =>
    nodes.map((node) => node.querySelectorAll('[data-art-element]').length),
  );
  expect(counts).toEqual(works.map(({ work }) => work.dna.elements.length));
  const usesUrl = await page
    .locator('.chainv3-card [data-art-element]')
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

test('Auswahl zeigt ein Kettenwerk groß mit Herkunft und per Tastatur erreichbar', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./#/atelier');
  const main = page.locator('.chainv3-main');
  const first = chains[0]!.works[0]!;
  await expect(main.locator('figcaption strong')).toHaveText(first.title);
  await expect(main.locator('.chainv3-facts')).toContainText('Ursprungswerk');
  const child = chains[0]!.works[2]!;
  const card = page.locator('#ep01-chain-traceable-3');
  await card.focus();
  await page.keyboard.press('Enter');
  await expect(card).toHaveAttribute('aria-pressed', 'true');
  await expect(main.locator('figcaption strong')).toHaveText(child.title);
  await expect(main.locator('[data-art-element]')).toHaveCount(
    child.dna.elements.length,
  );
  await expect(main.locator('.chainv3-facts')).toContainText('2000-01-01');
  // One tab stop per chain: arrow keys move within it, Tab leaves it.
  await expect(page.locator('.chainv3-card[tabindex="0"]')).toHaveCount(
    chains.length,
  );
  await page.keyboard.press('ArrowRight');
  const next = page.locator('#ep01-chain-traceable-4');
  await expect(next).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(next).toHaveAttribute('aria-pressed', 'true');
  await page.keyboard.press('Tab');
  await expect(page.locator('#ep01-chain-free-1')).toBeFocused();
  await expect(main.locator('.chainv3-facts')).toContainText('2000-01-02');
});

for (const [key, generation] of referenced) {
  test(`Kettenwerk ${key} Generation ${generation} entspricht der Referenz`, async ({
    page,
  }, testInfo) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('./#/atelier');
    const work = page.locator(
      `#ep01-chain-${key}-${generation} [data-renderer]`,
    );
    await expect(work).toHaveAttribute('data-renderer', '2');
    await expect(work).toHaveAttribute('data-state', 'rest');
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
    await expect(work).toHaveScreenshot(
      `generator-v3-chain-${key}-${generation}.png`,
      { threshold: 0.25, maxDiffPixelRatio: 0.01 },
    );
  });
}
