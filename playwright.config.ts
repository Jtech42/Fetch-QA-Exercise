import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  use: {
    headless: false,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true
  },
  timeout: 30000,
  retries: 1,
  testDir: './tests'
};

export default config;