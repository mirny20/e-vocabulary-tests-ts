import { defineConfig, devices } from "@playwright/test";
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  // Playwright gives trace.zip finalization the same budget as the test timeout. On the CI runner
  // writing large traces exceeds 30s, which drops the trace attachment and truncates trace.zip.
  timeout: process.env.CI ? 90_000 : 30_000,
  reporter: [['list'], ['allure-playwright']],

  expect: {
    timeout: 10_000,
  },

  use: {
    baseURL: 'https://e-vocabulary.vercel.app',
    trace: "on",
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'setupStorageState',
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
      dependencies: ['setupStorageState'],
    },
  ],
});
