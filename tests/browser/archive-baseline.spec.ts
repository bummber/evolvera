import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';

// EP-01 A-36: one reference image per frozen archive work and project
// (320 px and desktop). Works archived after `frozenThrough` have no image
// until the baseline is extended on purpose; see tests/archive-baseline.test.tsx.
// Never refresh existing images with --update-snapshots. Package C: works
// of an earlier series (dated before the first work of the running series)
// were deleted by its restart and are not opened.
const manifest = JSON.parse(
  readFileSync(
    new URL('../fixtures/archive-baseline/manifest.json', import.meta.url),
    'utf8',
  ),
) as { works: { id: string; title: string; path: string }[] };
// The renderer version each work stores (1, or 2 for works of schema 3).
const rendererOf = (path: string) =>
  (
    JSON.parse(
      readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8'),
    ) as { rendererVersion: string }
  ).rendererVersion;

const index = JSON.parse(
  readFileSync(
    new URL('../../public/artworks/index.json', import.meta.url),
    'utf8',
  ),
) as { works: { id: string }[] };
const start = index.works.map((work) => work.id).sort()[0];
const active = manifest.works.filter(
  ({ id }) => start !== undefined && id >= start,
);

for (const { id, title, path } of active) {
  test(`Archivwerk ${id} bleibt im Bild unverändert`, async ({
    page,
  }, testInfo) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(`./#/werk/${id}`);
    const detail = page.locator('.work-detail');
    await expect(detail.getByRole('heading', { level: 1 })).toHaveText(title);
    const work = detail.locator('.art-stage [data-renderer]');
    await expect(work).toHaveAttribute('data-renderer', rendererOf(path));
    await expect(work).toHaveAttribute('data-state', 'rest');
    // Fix only the capture geometry so shell typography, layout and scroll
    // position stay out of the artwork comparison. The frame keeps its own
    // scaling; tolerances match the existing renderer references.
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
    await expect(work).toHaveScreenshot(`archive-${id}.png`, {
      threshold: 0.25,
      maxDiffPixelRatio: 0.01,
    });
  });
}
