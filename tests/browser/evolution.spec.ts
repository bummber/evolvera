import { expect, test } from '@playwright/test';

test('Eltern, Ursprünge, Moduswechsel und kleine Ansichten der getrennten Beispielketten', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./#/evolutionslabor');
  await expect(
    page.getByRole('heading', { name: 'Evolutionslabor', level: 1 }),
  ).toBeVisible();
  await expect(page).toHaveTitle(/Evolutionslabor/);
  await expect(
    page.getByRole('button', { name: 'Generation 3', exact: true }),
  ).toHaveAttribute('aria-pressed', 'true');
  await expect(
    page.getByRole('button', {
      name: 'Elternteil A: Generation 1',
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole('button', {
      name: 'Elternteil B: Generation 2',
      exact: true,
    }),
  ).toBeVisible();
  expect(
    await page
      .locator('.parent-studies [data-renderer]')
      .evaluateAll((nodes) =>
        nodes.every(
          (node) => node.getAnimations({ subtree: true }).length === 0,
        ),
      ),
  ).toBe(true);
  await expect(page.locator('.inheritance-proofs')).toContainText(
    'Elternteil A',
  );
  await expect(page.locator('.inheritance-proofs')).toContainText(
    'Elternteil B',
  );
  await page
    .getByRole('button', { name: 'Elternteil A: Generation 1', exact: true })
    .click();
  await expect(
    page.getByText('Ursprungswerk – unabhängig generiert.', { exact: false }),
  ).toBeVisible();
  await expect(page.locator('.parent-studies')).toHaveCount(0);
  await page
    .getByRole('button', { name: 'Generation 10', exact: true })
    .click();
  await expect(
    page.getByRole('button', {
      name: 'Elternteil A: Generation 8',
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole('button', {
      name: 'Elternteil B: Generation 9',
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Nächstes Werk →', exact: true }),
  ).toBeDisabled();
  await page.getByLabel('Beispielmodus', { exact: true }).selectOption('free');
  await expect(
    page.getByRole('button', { name: 'Generation 3', exact: true }),
  ).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.evolution-main figcaption')).toContainText(
    'Maximale Freiheit',
  );
  await expect(page.locator('img,svg,canvas')).toHaveCount(0);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await expect(page.getByRole('button', { name: /Speichern/ })).toHaveCount(0);
});
