import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';

// EP-01 P3: the 40 stored origin studies of generator 0.3.0 in the test
// atelier. All of them are checked for a faithful render; reference images
// exist for one study per family at 320 px and desktop. New references only;
// the references of renderer 1, the archive and the sample sheets are
// separate files and stay untouched.
type Study = {
  id: string;
  dna: {
    layers: Record<string, { family: string } | undefined>;
    elements: unknown[];
  };
};
const { studies } = JSON.parse(
  readFileSync(
    new URL('../../fixtures/preview/ep01-origins.json', import.meta.url),
    'utf8',
  ),
) as { studies: Study[] };

const families = [
  'geometric',
  'color-field',
  'mosaic',
  'organic',
  'generative',
  'chaotic',
];
/** First study per family that no earlier family has taken. */
const referenced: { family: string; study: Study; index: number }[] = [];
for (const family of families) {
  const index = studies.findIndex(
    (study, position) =>
      Object.values(study.dna.layers).some(
        (layer) => layer?.family === family,
      ) && !referenced.some((entry) => entry.index === position),
  );
  if (index >= 0) referenced.push({ family, study: studies[index]!, index });
}

test('Atelier zeigt alle Ursprungs-Probewerke im Ruhezustand ohne Bild-, SVG- oder Canvas-Kunst', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./#/atelier');
  expect(studies).toHaveLength(40);
  expect(referenced).toHaveLength(families.length);
  const cards = page.locator('.origin-card');
  await expect(cards).toHaveCount(studies.length);
  await expect(
    page.locator('.origin-card [data-renderer="2"][data-state="rest"]'),
  ).toHaveCount(studies.length);
  await expect(page.locator('.origin-card [role=alert]')).toHaveCount(0);
  await expect(
    page
      .locator('.origin-card, .origin-main')
      .locator('img, svg, canvas, iframe'),
  ).toHaveCount(0);
  const counts = await cards.evaluateAll((nodes) =>
    nodes.map((node) => node.querySelectorAll('[data-art-element]').length),
  );
  expect(counts).toEqual(studies.map((study) => study.dna.elements.length));
  const usesUrl = await page
    .locator('.origin-card [data-art-element]')
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

test('Auswahl zeigt ein Probewerk groß und per Tastatur erreichbar', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./#/atelier');
  const main = page.locator('.origin-main');
  await expect(main.locator('figcaption strong')).toHaveText('Probewerk 01');
  const third = page.locator('.origin-card').nth(2);
  await third.focus();
  await page.keyboard.press('Enter');
  await expect(third).toHaveAttribute('aria-pressed', 'true');
  await expect(main.locator('figcaption strong')).toHaveText('Probewerk 03');
  await expect(main.locator('[data-art-element]')).toHaveCount(
    studies[2]!.dna.elements.length,
  );
});

for (const { family, study } of referenced) {
  test(`Probewerk ${study.id} (${family}) entspricht der Referenz`, async ({
    page,
  }, testInfo) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('./#/atelier');
    const work = page.locator(`#${study.id} [data-renderer]`);
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
    await expect(work).toHaveScreenshot(`generator-v3-${study.id}.png`, {
      threshold: 0.25,
      maxDiffPixelRatio: 0.01,
    });
  });
}
