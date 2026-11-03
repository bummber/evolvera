import { expect, test } from '@playwright/test';
import { spawn } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

test('Worker-Rechtstexte sind ohne Sitzung auf Desktop und 320px lesbar', async ({
  page,
}, info) => {
  test.skip(
    info.project.name !== 'desktop-chromium',
    'Beide Breiten im selben isolierten Worker-Lauf.',
  );
  test.setTimeout(60000);
  const storage = await mkdtemp(
    path.join(tmpdir(), 'evolvera-worker-browser-'),
  );
  const child = spawn(
    process.execPath,
    [
      'node_modules/wrangler/bin/wrangler.js',
      'dev',
      '--local',
      '--ip',
      '127.0.0.1',
      '--port',
      '8790',
      '--config',
      'tests/runtime/wrangler.jsonc',
      '--persist-to',
      storage,
    ],
    {
      env: { ...process.env, WRANGLER_SEND_METRICS: 'false' },
      stdio: ['ignore', 'pipe', 'pipe'],
    },
  );
  let output = '';
  child.stdout.on('data', (chunk) => {
    output += String(chunk);
  });
  child.stderr.on('data', (chunk) => {
    output += String(chunk);
  });
  try {
    await expect
      .poll(
        async () => {
          if (child.exitCode !== null) throw new Error(output.slice(-1500));
          try {
            return (await fetch('http://127.0.0.1:8790/privacy')).status;
          } catch {
            return 0;
          }
        },
        { timeout: 30000 },
      )
      .toBe(200);
    const external: string[] = [];
    page.on('request', (request) => {
      if (new URL(request.url()).origin !== 'http://127.0.0.1:8790')
        external.push(request.url());
    });
    for (const width of [1280, 320]) {
      await page.setViewportSize({ width, height: 800 });
      await page.goto('http://127.0.0.1:8790/settings');
      const footer = page.getByRole('navigation', {
        name: 'Rechtliche Informationen',
      });
      await footer
        .getByRole('link', { name: 'Datenschutz', exact: true })
        .click();
      await expect(
        page.getByRole('heading', {
          name: 'Datenschutz',
          level: 1,
          exact: true,
        }),
      ).toBeVisible();
      await expect(page.getByLabel('Entwurfsstatus')).toBeVisible();
      await expect(
        page.getByRole('heading', {
          name: 'Erforderliche Cookies und Sitzungsdaten',
        }),
      ).toBeVisible();
      await expect(page.locator('address')).toContainText(
        'Testperson Beispiel',
      );
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await footer
        .getByRole('link', { name: 'Impressum', exact: true })
        .click();
      await expect(
        page.getByRole('heading', { name: 'Impressum', level: 1, exact: true }),
      ).toBeVisible();
      await expect(page.locator('address a')).toHaveAttribute(
        'href',
        'mailto:kontakt@example.test',
      );
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await expect(page.locator('img, svg, canvas')).toHaveCount(0);
    }
    expect(external).toEqual([]);
    expect(await page.context().cookies()).toEqual([]);
  } finally {
    child.kill('SIGTERM');
    if (child.exitCode === null)
      await new Promise<void>((resolve) => child.once('exit', () => resolve()));
    await rm(storage, { recursive: true, force: true });
  }
});
