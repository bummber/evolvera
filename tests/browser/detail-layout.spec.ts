import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';
import type { Artwork } from '../../src/art/schema/artwork';

type Fixture = { chains: { inheritanceMode: string; works: Artwork[] }[] };
const load = (file: string) =>
  JSON.parse(
    readFileSync(
      new URL(`../../fixtures/preview/${file}`, import.meta.url),
      'utf8',
    ),
  ) as Fixture;
const original = load('phase-2.json');
const extension = load('phase-3.json');

test('Werkdetail zeigt belegte Herkunft und vollständige Kunst, Ursprünge bleiben unabhängig', async ({
  page,
}, testInfo) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const chain of extension.chains) {
    const work = chain.works.at(-1)!;
    const mode = chain.inheritanceMode;
    await page.goto(`./#/werk/${work.id}?sammlung=${mode}`);
    const detail = page.locator('.work-detail');
    const title = detail.getByRole('heading', { level: 1 });
    await expect(title).toHaveText(work.title);
    await expect(detail.locator('.title-dna-legend li')).toHaveCount(
      work.schemaVersion === 2 ? work.titleDna.parentFragments.length : 0,
    );
    if (work.schemaVersion === 2) {
      for (const fragment of work.titleDna.parentFragments) {
        await expect(
          detail.getByRole('list', { name: 'Titelherkunft' }),
        ).toContainText(
          `„${fragment.fragment}“ von ${work.parentIds.indexOf(fragment.parentId) === 0 ? 'A' : 'B'}`,
        );
      }
    }
    const art = detail.locator('.art-stage [data-renderer]');
    await expect(art).toHaveAttribute('data-state', 'rest');
    const box = (await art.boundingBox())!;
    const titleBox = (await title.boundingBox())!;
    expect(box.height).toBeCloseTo(box.width, 1);
    const planeWidth = await art.evaluate(
      (node) => node.firstElementChild!.getBoundingClientRect().width,
    );
    expect(planeWidth).toBeCloseTo(box.width, 1);
    if (page.viewportSize()!.width < 1000)
      expect(box.y).toBeLessThan(titleBox.y);
    else expect(box.x + box.width).toBeLessThan(titleBox.x);

    const parents = page.getByRole('region', {
      name: 'Elternwerke',
      exact: true,
    });
    await expect(parents.getByRole('link')).toHaveCount(2);
    await expect(parents.locator('.parent-bracket')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
    await expect(parents.locator('.diagram-child')).toContainText(
      `Dieses Werk · Generation ${work.generation}`,
    );
    const links = await parents
      .getByRole('link')
      .evaluateAll((nodes) => nodes.map((node) => node.getAttribute('href')));
    for (const id of work.parentIds)
      expect(
        links.some((link) => link!.includes(`/werk/${id}?sammlung=${mode}`)),
      ).toBe(true);
    expect(
      await parents
        .locator('[data-renderer]')
        .evaluateAll((nodes) =>
          nodes.every(
            (node) => node.getAnimations({ subtree: true }).length === 0,
          ),
        ),
    ).toBe(true);

    const proofs = detail.locator('.inheritance-proofs > li');
    await expect(proofs).toHaveCount(work.evolution.decisions.length);
    await expect(proofs.first().locator('.proof-parent')).toHaveText(
      work.evolution.decisions[0]!.parentId === work.parentIds[0] ? 'A' : 'B',
    );
    const proof = proofs.first().locator('details');
    await proof.locator('summary').focus();
    await page.keyboard.press('Enter');
    await expect(proof).toHaveAttribute('open');
    await expect(proof).toContainText(work.evolution.decisions[0]!.source.path);
    await expect(proof).toContainText(work.evolution.decisions[0]!.target.path);
    const metadata = detail.locator('.work-metadata');
    await expect(metadata).toHaveAttribute('open');
    await expect(metadata.locator('dt')).toHaveCount(9);
    await expect(metadata).toContainText(work.seed);
    await expect(metadata).toContainText(`Revision ${work.settingsRevision}`);
    await metadata.locator('summary').focus();
    await page.keyboard.press('Enter');
    await expect(metadata).not.toHaveAttribute('open');
    await page.keyboard.press('Enter');
    await expect(metadata).toHaveAttribute('open');
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(page.viewportSize()!.width);
    await expect(page.locator('img, svg, canvas')).toHaveCount(0);
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
    await page.screenshot({
      path: testInfo.outputPath(`detail-${mode}.png`),
      fullPage: true,
    });
  }
  const origin = original.chains[0]!.works[0]!;
  await page.goto(`./#/werk/${origin.id}?sammlung=traceable`);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    origin.title,
  );
  await expect(
    page.locator('.parent-bracket, .title-fragment, .inheritance-proofs'),
  ).toHaveCount(0);
  await expect(page.locator('.work-provenance')).toContainText(
    'Ursprungswerk – unabhängig generiert.',
  );

  const fresh = extension.chains
    .find((chain) => chain.inheritanceMode === 'free')!
    .works.find((work) => work.evolution.decisions.length === 0)!;
  await page.goto(`./#/werk/${fresh.id}?sammlung=free`);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(fresh.title);
  await expect(page.locator('.work-provenance')).toContainText(
    'Vollständige gestalterische Neuschöpfung.',
  );
  await expect(page.locator('.inheritance-proofs')).toHaveCount(0);
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
  await page.screenshot({
    path: testInfo.outputPath('detail-fresh.png'),
    fullPage: true,
  });
  await page.goto('./#/evolution?sammlung=traceable&werk=2000-01-20');
  await expect(page.getByLabel('Werk für den Herkunftsvergleich')).toHaveValue(
    '2000-01-20',
  );
  await expect(
    page.locator('.work-detail, .parent-bracket, .title-fragment'),
  ).toHaveCount(0);
});
