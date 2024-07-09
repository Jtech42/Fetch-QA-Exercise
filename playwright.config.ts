import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: {
    headless: false, // Set to true if you want to run tests in headless mode
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true
  }
});