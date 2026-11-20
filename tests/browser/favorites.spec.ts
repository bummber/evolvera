import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import type { Page } from '@playwright/test';

// Package B: the public favourites gallery. Every test routes its own index, so
// the result never depends on the favourites the operator marks in the real
// repository. The copies come from the reviewed chain of generator 0.4.0
// (series start 2000-01-01).
type Work = { id: string; generation: number; title: string };
const chain = (
  JSON.parse(
    readFileSync(
      new URL('../../fixtures/preview/review-v4.json', import.meta.url),
      'utf8',
    ),
  ) as { chains: { works: Work[] }[] }
).chains[0]!.works;
const byId = (id: string) => chain.find((work) => work.id === id)!;
const entry = (id: string) => {
  const { generation, title } = byId(id);
  return { series: '2000-01-01', id, generation, title };
};
async function noOverflow(page: Page) {
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await expect(page.locator('img,svg,canvas')).toHaveCount(0);
}
async function stubFavorites(page: Page, broken?: string) {
  await page.route('**/evolvera/favorites/index.json', (route) =>
    route.fulfill({
      json: {
        schemaVersion: 1,
        favorites: [entry('2000-01-04'), entry('2000-01-02')],
      },
    }),
  );
  await page.route(/\/evolvera\/favorites\/2000-01-01\/.*\.json$/, (route) => {
    const id = route.request().url().split('/').at(-1)!.replace('.json', '');
    return id === broken
      ? route.fulfill({ status: 503 })
      : route.fulfill({ json: byId(id) });
  });
}

test('Favoriten sind erreichbar und zeigen ohne Auswahl einen leeren Zustand', async ({
  page,
}) => {
  await page.route('**/evolvera/favorites/index.json', (route) =>
    route.fulfill({ json: { schemaVersion: 1, favorites: [] } }),
  );
  await page.goto('./#/favoriten');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Favoriten');
  await expect(
    page.getByRole('heading', { name: 'Noch keine Favoriten.' }),
  ).toBeVisible();
  await noOverflow(page);
});

test('Favoriten zeigen jedes Werk mit seinen direkten Eltern', async ({
  page,
}) => {
  await stubFavorites(page);
  await page.goto('./#/favoriten');
  const groups = page.locator('.favorite-group');
  await expect(groups).toHaveCount(2);
  const first = page.getByRole('region', {
    name: `Favorit: ${byId('2000-01-04').title}`,
  });
  await expect(first.locator('article')).toHaveCount(3);
  await expect(first.locator('[data-renderer="2"]')).toHaveCount(3);
  await expect(first.locator('.card-meta')).toContainText([
    'Favorit · Generation 4',
    'Elternwerk · Generation 2',
    'Elternwerk · Generation 3',
  ]);
  await expect(first.getByRole('heading', { level: 2 })).toHaveText([
    byId('2000-01-04').title,
    byId('2000-01-02').title,
    byId('2000-01-03').title,
  ]);
  const origin = page.getByRole('region', {
    name: `Favorit: ${byId('2000-01-02').title}`,
  });
  await expect(origin.locator('article')).toHaveCount(1);
  await expect(origin).toContainText('Ursprungswerk · Serie ab 1. Januar 2000');
  await noOverflow(page);
});

test('Eine fehlende Favoritenkopie erscheint als Fehler ihrer Gruppe', async ({
  page,
}) => {
  await stubFavorites(page, '2000-01-03');
  await page.goto('./#/favoriten');
  const first = page.getByRole('region', {
    name: `Favorit: ${byId('2000-01-04').title}`,
  });
  await expect(first.getByRole('alert')).toContainText(
    'Werk gerade nicht verfügbar',
  );
  await expect(
    page
      .getByRole('region', { name: `Favorit: ${byId('2000-01-02').title}` })
      .locator('article'),
  ).toHaveCount(1);
});
