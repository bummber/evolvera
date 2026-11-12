import { expect, test, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';

// EP-01 P7: the acceptance works of generator 0.3.0 in the collection
// selection, and the load measurement page for the device check. No
// reference images; the fixtures themselves are frozen by their SHA-256.
type Work = { id: string; generation: number; title: string };
const chains = (name: string) =>
  (
    JSON.parse(
      readFileSync(
        new URL(`../../fixtures/preview/${name}.json`, import.meta.url),
        'utf8',
      ),
    ) as { chains: { key: string; works: Work[] }[] }
  ).chains;
const standard = chains('ep01-review');
const noOverflow = async (page: Page) =>
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(page.viewportSize()!.width);

for (const [key, count] of [
  ['abnahme-traceable', 20],
  ['abnahme-free', 20],
  ['abnahme-ruhig', 6],
  ['abnahme-wild', 6],
  ['abnahme-reduziert', 6],
] as const)
  test(`Galerie zeigt die Abnahmesammlung ${key}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(`./#/galerie?sammlung=${key}`);
    await expect(page.getByLabel('Sammlung ansehen')).toHaveValue(key);
    await expect(page.locator('.gallery-count')).toContainText(
      `${count} Werke`,
    );
    await expect(page.locator('.collection-bar')).toContainText(
      'Am 12.11.2026 abgenommen',
    );
    const cards = page.locator('.archive-card');
    await expect(cards).toHaveCount(Math.min(count, 12));
    await expect(
      cards.locator('[data-renderer="2"][data-state="rest"]'),
    ).toHaveCount(Math.min(count, 12));
    await expect(cards.locator('[role=alert]')).toHaveCount(0);
    await expect(page.locator('img, svg, canvas')).toHaveCount(0);
    await noOverflow(page);
    expect(errors).toEqual([]);
  });

test('Detailansicht eines Abnahmewerks mit Herkunft und reduzierter Bewegung', async ({
  page,
}) => {
  const work = standard.find((chain) => chain.key === 'traceable')!.works[9]!;
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(`./#/werk/${work.id}?sammlung=abnahme-traceable`);
  const detail = page.locator('.work-detail');
  await expect(detail.getByRole('heading', { level: 1 })).toHaveText(
    work.title,
  );
  const art = detail.locator('.art-stage [data-renderer]');
  await expect(art).toHaveAttribute('data-renderer', '2');
  await expect(art).toHaveAttribute('data-state', 'rest');
  await expect(page.locator('main .atelier-notice')).toContainText(
    'Am 12.11.2026 abgenommen',
  );
  await expect(detail.locator('[role=alert]')).toHaveCount(0);
  await noOverflow(page);
});

test('Messseite misst alle sechs Werke und gibt einen Bericht aus', async ({
  page,
}) => {
  await page.goto('./#/messung?dauer=1');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Lastmessung',
  );
  await page.getByRole('button', { name: 'Messung starten' }).click();
  await expect(page.locator('.measure-stage [data-renderer="2"]')).toHaveCount(
    1,
  );
  const report = page.getByLabel('Messergebnis als Text');
  await expect(report).toBeVisible({ timeout: 30_000 });
  const text = await report.inputValue();
  expect(text).toContain('Musterbogen');
  expect(text.match(/Abnahmewerk /g)).toHaveLength(5);
  expect(text.match(/Median/g)).toHaveLength(6);
  expect(text).toContain('Bewegung reduzieren: nein');
  expect(text).toContain('elements 120/120');
  await expect(page.locator('img, svg, canvas')).toHaveCount(0);
  await noOverflow(page);
});

test('Messseite lässt die Werke bei reduzierter Bewegung ruhen', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./#/messung?dauer=1');
  await page.getByRole('button', { name: 'Messung starten' }).click();
  await expect(
    page.locator('.measure-stage [data-renderer][data-state="rest"]'),
  ).toHaveCount(1);
  const report = page.getByLabel('Messergebnis als Text');
  await expect(report).toBeVisible({ timeout: 30_000 });
  const text = await report.inputValue();
  expect(text).toContain('Bewegung reduzieren: ja');
  expect(text.match(/laufende Animationen: 0/g)).toHaveLength(6);
});
