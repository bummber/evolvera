import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';
import type { Artwork } from '../../src/art/schema/artwork';

type Fixture = { chains: { inheritanceMode: string; works: Artwork[] }[] };
const fixture = (file: string) =>
  JSON.parse(
    readFileSync(
      new URL(`../../fixtures/preview/${file}`, import.meta.url),
      'utf8',
    ),
  ) as Fixture;
const original = fixture('phase-2.json');
const extension = fixture('phase-3.json');

test('Evolution zeigt tatsächliche A/B-Eltern, ruhige Knoten und unabhängige Ursprünge', async ({
  page,
}, testInfo) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const chain of extension.chains) {
    const mode = chain.inheritanceMode;
    const work = chain.works.at(-1)!;
    await page.goto(`./#/evolution?sammlung=${mode}&werk=${work.id}`);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      work.title,
    );
    await expect(
      page.getByLabel('Werk für den Herkunftsvergleich'),
    ).toHaveValue(work.id);
    const lineage = page.getByRole('region', {
      name: 'Abstammung des ausgewählten Werks',
    });
    await expect(lineage.locator('ol > li')).toHaveCount(3);
    await expect(lineage.locator('.lineage-lines')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
    const selected = lineage.getByRole('link', { name: /^Ausgewähltes Werk/ });
    const a = lineage.getByRole('link', { name: /^Elternteil A/ });
    const b = lineage.getByRole('link', { name: /^Elternteil B/ });
    await expect(a).toHaveAttribute(
      'href',
      new RegExp(`/werk/${work.parentIds[0]}\\?sammlung=${mode}`),
    );
    await expect(b).toHaveAttribute(
      'href',
      new RegExp(`/werk/${work.parentIds[1]}\\?sammlung=${mode}`),
    );
    const boxes = await Promise.all(
      [selected, a, b].map((link) =>
        link.locator('.lineage-preview').boundingBox(),
      ),
    );
    if (page.viewportSize()!.width < 1000) {
      expect(boxes[0]!.y).toBeLessThan(boxes[2]!.y);
      expect(boxes[2]!.y).toBeLessThan(boxes[1]!.y);
      expect(boxes[0]!.width).toBeCloseTo(44, 1);
    } else {
      expect(boxes[1]!.x).toBeLessThan(boxes[2]!.x);
      expect(boxes[2]!.x).toBeLessThan(boxes[0]!.x);
      expect(boxes[0]!.width).toBeCloseTo(96, 1);
    }
    expect(
      await lineage
        .locator('[data-renderer]')
        .evaluateAll((nodes) =>
          nodes.every(
            (node) =>
              node.getAttribute('data-state') === 'rest' &&
              node.getAnimations({ subtree: true }).length === 0,
          ),
        ),
    ).toBe(true);
    await expect(
      page.locator('.evolution-current .art-stage [data-renderer]'),
    ).toHaveAttribute('data-state', 'rest');
    const art = page.locator('.evolution-current .art-stage [data-renderer]');
    const geometry = await art.evaluate((node) => {
      const box = node.getBoundingClientRect();
      return {
        width: box.width,
        height: box.height,
        plane: node.firstElementChild!.getBoundingClientRect().width,
      };
    });
    expect(geometry.height).toBeCloseTo(geometry.width, 1);
    expect(geometry.plane).toBeCloseTo(geometry.width, 1);
    await lineage.focus();
    await expect(lineage).toBeFocused();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(page.viewportSize()!.width);
    await expect(page.locator('img, svg, canvas')).toHaveCount(0);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({
      path: testInfo.outputPath(`evolution-${mode}.png`),
      fullPage: true,
    });
    await a.focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(
      new RegExp(`/werk/${work.parentIds[0]}\\?sammlung=${mode}`),
    );
    await expect(page.locator('.work-detail')).toBeVisible();
  }
  await page.goto('./#/evolution?sammlung=traceable&werk=2000-01-03');
  for (const generation of [1, 2]) {
    const work = original.chains[0]!.works[generation - 1]!;
    await page
      .getByLabel('Werk für den Herkunftsvergleich')
      .selectOption(work.id);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      work.title,
    );
    await expect(page.locator('.lineage-nodes > li')).toHaveCount(1);
    await expect(page.locator('.lineage-edge')).toHaveCount(0);
    await expect(page.locator('.work-provenance')).toContainText(
      'Ursprungswerk – unabhängig generiert.',
    );
  }
  await page.screenshot({
    path: testInfo.outputPath('evolution-origin.png'),
    fullPage: true,
  });
  await page.route('**/artworks/index.json', (route) =>
    route.fulfill({ json: { schemaVersion: 1, works: [] } }),
  );
  await page.goto('./#/evolution');
  await expect(
    page.getByRole('heading', { name: 'Evolution', exact: true, level: 1 }),
  ).toBeVisible();
  await expect(page.locator('.lineage-nodes')).toHaveCount(0);
  await expect(
    page.getByText('Die Geschichte beginnt mit zwei Ursprüngen.', {
      exact: true,
    }),
  ).toBeVisible();
});

test('Die Evolutionsauswahl bleibt bei beschädigtem Werk zur Erholung erreichbar', async ({
  page,
}) => {
  const works = [...original.chains[0]!.works, ...extension.chains[0]!.works];
  await page.route('**/artworks/index.json', (route) =>
    route.fulfill({
      json: {
        schemaVersion: 1,
        works: works
          .toReversed()
          .map(({ id, generation, title }) => ({ id, generation, title })),
      },
    }),
  );
  const requests: string[] = [];
  await page.route(/\/artworks\/2000\/.*\.json$/, (route) => {
    const id = route.request().url().split('/').at(-1)!.replace('.json', '');
    requests.push(id);
    return id === '2000-01-20'
      ? route.fulfill({ status: 503 })
      : route.fulfill({ json: works.find((work) => work.id === id) });
  });
  await page.goto('./#/evolution?werk=2000-01-20');
  await expect(page.getByRole('alert')).toContainText(
    'Werk gerade nicht verfügbar',
  );
  await expect(
    page.getByLabel('Werk für den Herkunftsvergleich'),
  ).toBeVisible();
  await page
    .getByLabel('Werk für den Herkunftsvergleich')
    .selectOption('2000-01-03');
  await expect(page.locator('.lineage-nodes > li')).toHaveCount(3);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    works[2]!.title,
  );
  // The existing context reads the work, two parents and two candidate successors.
  expect([...new Set(requests)].sort()).toEqual([
    '2000-01-01',
    '2000-01-02',
    '2000-01-03',
    '2000-01-04',
    '2000-01-05',
    '2000-01-20',
  ]);
});
