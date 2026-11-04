import { test as base } from '@playwright/test';
import { mkdtemp, mkdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

// Firefox's temporary -profile does not isolate its shared application-data root.
// See https://github.com/microsoft/playwright/issues/42768 (macOS 27).
// Use disposable app data instead of requesting access to personal browser data.
export const test = base.extend({
  launchOptions: [
    async ({ browserName, launchOptions }, use) => {
      if (browserName !== 'firefox' || process.platform !== 'darwin') {
        await use(launchOptions);
        return;
      }
      const storage = await mkdtemp(path.join(tmpdir(), 'evolvera-firefox-'));
      const appData = path.join(storage, 'app-data');
      try {
        await mkdir(appData, { mode: 0o700 });
        await use({
          ...launchOptions,
          env: { ...process.env, ...launchOptions.env, MOZ_APP_DATA: appData },
        });
      } finally {
        await rm(storage, { recursive: true, force: true });
      }
    },
    { scope: 'worker' },
  ],
});

export { expect } from '@playwright/test';
