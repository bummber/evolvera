import { expect, test, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';

// EP-01 P6: gallery, today, evolution and detail view for works of schema 3,
// shown through the preview collections of generator 0.3.0. Reference images
// are new files for three works; all existing references stay untouched.
type Decision = { parentId: string; operation: { kind: string } };
type Work = {
  id: string;
  generation: number;
  title: string;
  description: string;
  parentIds: string[];
  evolution: { decisions: Decision[] };
};
const read = (name: string) =>
  JSON.parse(
    readFileSync(
      new URL(`../../fixtures/preview/${name}.json`, import.meta.url),
      'utf8',
    ),
  ) as unknown;
const chains = (
  read('ep01-chains') as { chains: { key: string; works: Work[] }[] }
).chains;
const works = (key: string) => chains.find((chain) => chain.key === key)!.works;
const constraints = (read('ep01-constraints') as { chain: { works: Work[] } })
  .chain.works;
const noOverflow = async (page: Page) =>
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(page.viewportSize()!.width);

test('Galerie zeigt eine gemischte Kette aus Schema 2 und 3 mit statischen Kacheln', async ({
  page,
}) => {
  await page.goto('./#/galerie?sammlung=ep01-transition');
  await expect(page.getByLabel('Sammlung ansehen')).toHaveValue(
    'ep01-transition',
  );
  await expect(page.locator('.gallery-count')).toContainText('14 Werke');
  const cards = page.locator('.archive-card');
  await expect(cards).toHaveCount(12);
  await expect(cards.locator('[data-renderer="2"]')).toHaveCount(4);
  await expect(cards.locator('[data-renderer="1"]')).toHaveCount(8);
  await expect(cards.locator('[data-renderer][data-state="rest"]')).toHaveCount(
    12,
  );
  await expect(cards.locator('[role=alert]')).toHaveCount(0);
  expect(
    await cards
      .locator('[data-renderer]')
      .evaluateAll((nodes) =>
        nodes.every(
          (node) => node.getAnimations({ subtree: true }).length === 0,
        ),
      ),
  ).toBe(true);
  await expect(page.locator('img, svg, canvas')).toHaveCount(0);
  await noOverflow(page);
  // The reviewed test collections keep their own wording.
  await page.getByLabel('Sammlung ansehen').selectOption('traceable');
  await expect(page.locator('.collection-bar')).toContainText(
    'Testsammlung · 20 Werke',
  );
});

test('Detailansicht eines Werks im Schema 3 mit alten Eltern, Tastaturweg und Rahmenbedingungen', async ({
  page,
}) => {
  const work = works('transition')[0]!;
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(`./#/werk/${work.id}?sammlung=ep01-transition`);
  const detail = page.locator('.work-detail');
  await expect(detail.getByRole('heading', { level: 1 })).toHaveText(
    work.title,
  );
  const stage = detail.locator('.art-stage [data-renderer]');
  await expect(stage).toHaveAttribute('data-renderer', '2');
  // Reduced motion: the animated work rests until the visitor starts it.
  await expect(stage).toHaveAttribute('data-state', 'rest');
  await expect(detail.locator('.art-controls')).toContainText(
    'Reduzierte Bewegung beachtet',
  );
  await detail.getByRole('button', { name: 'Animation abspielen' }).click();
  await expect(stage).toHaveAttribute('data-state', 'playing');
  await detail.getByRole('button', { name: 'Animation pausieren' }).click();

  await expect(detail.locator('.work-composition')).toContainText(
    work.description,
  );
  const parents = detail.locator('.parent-diagram');
  await expect(
    parents.locator('.related-card [data-renderer="1"]'),
  ).toHaveCount(2);
  await expect(
    parents.locator('.diagram-child [data-renderer="2"]'),
  ).toHaveCount(1);
  await expect(detail.locator('.provenance-note')).toContainText(
    'Beide Elternwerke stammen aus einer früheren Werkversion',
  );
  const contributions = work.evolution.decisions.filter(
    (decision) => decision.operation.kind !== 'constrained',
  );
  const proofs = detail.locator('ol.inheritance-proofs > li');
  await expect(proofs).toHaveCount(contributions.length);
  const proof = proofs.first().locator('details');
  await proof.locator('summary').focus();
  await page.keyboard.press('Enter');
  await expect(proof).toHaveAttribute('open');
  await expect(proof).toContainText('Quelle');

  const conditions = detail.locator('.work-conditions');
  await expect(conditions).not.toHaveAttribute('open');
  await conditions.locator('summary').focus();
  await page.keyboard.press('Enter');
  await expect(conditions).toHaveAttribute('open');
  await expect(conditions.locator('dt')).toHaveText([
    'Evolution',
    'Formen',
    'Oberfläche',
    'Farbe',
    'Komposition',
    'Bewegung',
    'Experimente',
    'Ähnlichkeitsprüfung',
  ]);
  await expect(conditions).toContainText('Mindestabstand erreicht');
  await expect(detail.locator('.work-metadata')).toContainText(
    'Schema 3 · Generator 0.3.0',
  );
  await noOverflow(page);
  await expect(page.locator('img, svg, canvas')).toHaveCount(0);

  // An old parent keeps its view and says what it does not store.
  await page.goto(`./#/werk/${work.parentIds[0]}?sammlung=ep01-transition`);
  const old = page.locator('.work-detail');
  await expect(old.locator('.art-stage [data-renderer]')).toHaveAttribute(
    'data-renderer',
    '1',
  );
  await expect(old.locator('.work-composition')).toHaveCount(0);
  await old.locator('.work-conditions summary').click();
  await expect(old.locator('.work-conditions')).toContainText(
    'in dieser Version nicht gespeichert',
  );
  // Its direct successors: one stored in schema 2, one in schema 3.
  const successors = page.locator('.detail-relations [data-renderer]');
  await expect(successors).toHaveCount(2);
  await expect(
    page.locator('.detail-relations [data-renderer="2"]'),
  ).toHaveCount(1);
  await noOverflow(page);
});

test('Mutationsbericht nennt umgewandelte Merkmale ausdrücklich', async ({
  page,
}) => {
  const work = constraints[2]!;
  const converted = work.evolution.decisions.filter(
    (decision) => decision.operation.kind === 'constrained',
  );
  expect(converted.length).toBeGreaterThan(0);
  await page.goto(`./#/werk/${work.id}?sammlung=ep01-constraints`);
  const provenance = page.locator('.work-detail .work-provenance');
  await expect(
    provenance.getByRole('heading', {
      name: 'Durch Rahmenbedingungen umgewandelt.',
    }),
  ).toBeVisible();
  await expect(provenance.locator('ol.inheritance-proofs > li')).toHaveCount(
    work.evolution.decisions.length - converted.length,
  );
  const groups = provenance.locator('.conversion-proofs > li');
  expect(await groups.count()).toBeGreaterThan(0);
  await expect(provenance.locator('.conversion-proofs')).toContainText(
    'weil „Linien“ auf Aus steht',
  );
  const first = groups.first().locator('details');
  await first.locator('summary').focus();
  await page.keyboard.press('Enter');
  await expect(first).toContainText('Umwandlung · features.');
  const conditions = page.locator('.work-detail > .work-conditions');
  await conditions.locator('summary').click();
  await expect(conditions).toContainText('Verläufe: Aus');
  await expect(conditions).toContainText('Revision 2');
  await noOverflow(page);
});

test('Heute-Ansicht und Evolution stellen Schema 3 über den Dispatch dar', async ({
  page,
}) => {
  const latest = works('free').at(-1)!;
  await page.goto('./#/?sammlung=ep01-free');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    latest.title,
  );
  await expect(
    page.locator('.home-stage .art-stage [data-renderer]'),
  ).toHaveAttribute('data-renderer', '2');
  await expect(page.locator('.today-information')).toContainText(
    latest.description,
  );
  await expect(page.locator('.work-conditions')).toHaveCount(1);
  await expect(page.locator('.atelier-notice')).toContainText(
    'Probewerk von Generator 0.3.0',
  );
  await noOverflow(page);

  const child = works('transition')[1]!;
  await page.goto(`./#/evolution?sammlung=ep01-transition&werk=${child.id}`);
  await expect(page.getByLabel('Werk für den Herkunftsvergleich')).toHaveValue(
    child.id,
  );
  const nodes = page.locator('.lineage-nodes > li');
  await expect(nodes).toHaveCount(3);
  await expect(nodes.locator('[data-renderer="2"]')).toHaveCount(2);
  await expect(nodes.locator('[data-renderer="1"]')).toHaveCount(1);
  await expect(page.locator('.evolution-analysis')).toContainText(
    'Elternteil A stammt aus einer früheren Werkversion',
  );
  await expect(
    page.locator('.evolution-analysis .work-conditions'),
  ).toHaveCount(1);
  await noOverflow(page);
});

const referenced = [
  ['ep01-transition', works('transition')[1]!],
  ['ep01-constraints', constraints[2]!],
  ['ep01-constraints', constraints[5]!],
] as const;
for (const [collection, work] of referenced) {
  test(`Detailansicht ${collection} Generation ${work.generation} bleibt im Bild unverändert`, async ({
    page,
  }, testInfo) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(`./#/werk/${work.id}?sammlung=${collection}`);
    const detail = page.locator('.work-detail');
    await expect(detail.getByRole('heading', { level: 1 })).toHaveText(
      work.title,
    );
    const art = detail.locator('.art-stage [data-renderer]');
    await expect(art).toHaveAttribute('data-renderer', '2');
    await expect(art).toHaveAttribute('data-state', 'rest');
    // Same capture geometry as the archive baseline: only the artwork.
    const width = testInfo.project.name === 'mobile-chromium' ? 280 : 660;
    await art.evaluate((node, size) => {
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
        art.evaluate((node) => {
          const plane = node.firstElementChild!;
          return (
            new DOMMatrix(getComputedStyle(plane).transform).a /
            (node.getBoundingClientRect().width / 1000)
          );
        }),
      )
      .toBeCloseTo(1, 3);
    await expect(art).toHaveScreenshot(
      `schema3-detail-${collection}-${work.generation}.png`,
      { threshold: 0.25, maxDiffPixelRatio: 0.01 },
    );
  });
}
