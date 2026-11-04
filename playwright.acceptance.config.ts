import { defineConfig } from '@playwright/test';
import base from './playwright.config';

// Opt-in local pre-series acceptance. The regular Chromium/reference suite is unchanged.
export default defineConfig({
  ...base,
  testDir: './tests',
  testMatch: ['**/acceptance/*.spec.ts', '**/browser/operator-forms.spec.ts'],
  outputDir: 'test-results/acceptance',
  workers: 1,
  use: {
    ...base.use,
    baseURL: 'http://127.0.0.1:4174/evolvera/',
    viewport: { width: 1280, height: 900 },
  },
  projects: [
    {
      name: 'chromium-third-party-blocked',
      use: {
        browserName: 'chromium',
        launchOptions: { args: ['--test-third-party-cookie-phaseout'] },
      },
    },
    { name: 'firefox', use: { browserName: 'firefox' } },
    { name: 'webkit', use: { browserName: 'webkit' } },
  ],
  webServer: {
    command: 'npm run preview -- --port 4174 --strictPort',
    url: 'http://127.0.0.1:4174/evolvera/',
    reuseExistingServer: false,
  },
});
