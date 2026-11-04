import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';

const settings = JSON.parse(
  readFileSync(
    new URL('../../config/generation.json', import.meta.url),
    'utf8',
  ),
) as {
  inheritanceMode: string;
  revision: number;
  generationEnabled: boolean;
  seriesStartDate: string | null;
};
const operator = JSON.parse(
  readFileSync(new URL('../../config/operator.json', import.meta.url), 'utf8'),
) as { adminOrigin: string | null };

test('Über-Kapitel behalten Hash-Routing, Direktlinks und Tastaturfokus', async ({
  page,
}, testInfo) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./#/ueber?sammlung=free');
  await expect(
    page.getByRole('heading', { level: 1, name: 'Über Evolvera', exact: true }),
  ).toBeVisible();
  const chapters = page.getByRole('navigation', {
    name: 'Kapitel über Evolvera',
  });
  await expect(chapters.getByRole('link')).toHaveCount(5);
  await expect(page.locator('.about-chapters > section')).toHaveCount(5);
  const contrasts = await page.locator('.mode-study dt').evaluateAll((nodes) =>
    nodes.map((node) => {
      const luminance = (value: string) => {
        const channels = value
          .match(/[\d.]+/g)!
          .slice(0, 3)
          .map((value) => {
            const channel = Number(value) / 255;
            return channel <= 0.04045
              ? channel / 12.92
              : ((channel + 0.055) / 1.055) ** 2.4;
          });
        return (
          channels[0]! * 0.2126 + channels[1]! * 0.7152 + channels[2]! * 0.0722
        );
      };
      let parent: Element | null = node;
      let background = 'rgb(255, 255, 255)';
      while (parent) {
        const value = getComputedStyle(parent).backgroundColor;
        if (value !== 'rgba(0, 0, 0, 0)') {
          background = value;
          break;
        }
        parent = parent.parentElement;
      }
      const foreground = luminance(getComputedStyle(node).color);
      const back = luminance(background);
      return (
        (Math.max(foreground, back) + 0.05) /
        (Math.min(foreground, back) + 0.05)
      );
    }),
  );
  for (const contrast of contrasts)
    expect(contrast).toBeGreaterThanOrEqual(4.5);
  await expect(page.locator('img, svg, canvas, [data-renderer]')).toHaveCount(
    0,
  );
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(page.viewportSize()!.width);
  await page.screenshot({
    path: testInfo.outputPath('about-page.png'),
    fullPage: true,
  });

  const modes = chapters.getByRole('link', { name: 'Vererbung', exact: true });
  await modes.focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#\/ueber\?sammlung=free#about-modes$/);
  const section = page.locator('#about-modes');
  await expect(section).toBeFocused();
  await expect(modes).toHaveAttribute('aria-current', 'location');
  await expect
    .poll(async () => (await section.boundingBox())!.y)
    .toBeLessThan(40);
  await page.reload();
  await expect(section).toBeFocused();
  await expect(section.getByRole('heading', { level: 2 })).toHaveText(
    'Zwei Wege der Vererbung',
  );
  // Re-selecting the current anchor must work after scrolling elsewhere too.
  await page.evaluate(() => scrollTo(0, 0));
  await modes.click();
  await expect(section).toBeFocused();
  await expect
    .poll(async () => (await section.boundingBox())!.y)
    .toBeLessThan(40);
  await page.goto('./#/ueber#about-preview');
  await expect(page.locator('#about-preview')).toBeFocused();
  await expect(page.locator('#about-preview')).toContainText(
    settings.generationEnabled
      ? `Die tägliche Generierung ist aktiviert. Serienstart ${settings.seriesStartDate}.`
      : settings.seriesStartDate
        ? `Die offizielle Generierung ist pausiert. Serienstart ${settings.seriesStartDate}.`
        : 'Die offizielle Kunstserie ist noch nicht gestartet.',
  );
  await page
    .getByRole('link', { name: '40 Testwerke sichten', exact: true })
    .click();
  await expect(page).toHaveURL(/#\/kunstpruefung$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Was bleibt.Was bricht.',
  );
});

test('Moduskarten zeigen den echten Stand und erlauben in der Galerie keine Änderungen', async ({
  page,
}, testInfo) => {
  const external: string[] = [];
  const writes: string[] = [];
  page.on('request', (request) => {
    if (new URL(request.url()).origin !== 'http://127.0.0.1:4173')
      external.push(request.url());
    if (!['GET', 'HEAD'].includes(request.method())) writes.push(request.url());
  });
  await page.goto('./#/einstellungen');
  await expect(
    page.getByRole('heading', { level: 1, name: 'Einstellungen', exact: true }),
  ).toBeVisible();
  const status = page.locator('.settings-status');
  await expect(status.locator('dd').nth(1)).toHaveText(
    String(settings.revision),
  );
  await expect(status).toContainText(
    settings.generationEnabled
      ? `Aktiv · Serienstart ${settings.seriesStartDate}`
      : settings.seriesStartDate
        ? `Deaktiviert · Serienstart ${settings.seriesStartDate}`
        : 'Deaktiviert · Startdatum offen',
  );
  const modes = page.getByRole('group', {
    name: 'Vererbungsmodus',
    exact: true,
  });
  await expect(modes.getByRole('radio')).toHaveCount(2);
  for (const radio of await modes.getByRole('radio').all())
    await expect(radio).toBeDisabled();
  const selected = modes.locator(`input[value="${settings.inheritanceMode}"]`);
  await expect(selected).toBeChecked();
  const other = modes.locator(
    `input:not([value="${settings.inheritanceMode}"])`,
  );
  const otherLabel = modes.locator('label').filter({
    has: page.locator(`input:not([value="${settings.inheritanceMode}"])`),
  });
  await expect(otherLabel).toHaveCount(1);
  await otherLabel.evaluate((node) => node.scrollIntoView({ block: 'center' }));
  const box = (await otherLabel.boundingBox())!;
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  await expect(selected).toBeChecked();
  await expect(other).not.toBeChecked();
  await expect(
    page.getByRole('button', { name: /Speichern|Verwerfen|Abmelden/ }),
  ).toHaveCount(0);
  if (operator.adminOrigin)
    await expect(
      page.getByRole('link', { name: /Zur geschützten Betreiberseite/ }),
    ).toHaveAttribute('href', `${operator.adminOrigin}/settings`);
  else
    await expect(
      page.getByRole('button', { name: /Mit GitHub anmelden/ }),
    ).toBeDisabled();
  await expect(page.getByRole('switch')).toHaveCount(0);
  await expect(page.getByRole('combobox')).toHaveCount(0);
  if (!operator.adminOrigin)
    await expect(page.locator('#auth-status')).toContainText(
      'In dieser Vorschau kannst du keine Einstellungen ändern.',
    );
  await expect(page.locator('img, svg, canvas')).toHaveCount(0);
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(page.viewportSize()!.width);
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
  await page.screenshot({
    path: testInfo.outputPath('settings-locked.png'),
    fullPage: true,
  });
  await page.reload();
  await expect(selected).toBeChecked();
  expect(external).toEqual([]);
  expect(writes).toEqual([]);
  expect(await page.context().cookies()).toEqual([]);
});
