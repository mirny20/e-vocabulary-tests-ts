import { defineConfig, devices } from "@playwright/test";
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  reporter: "allure-playwright",

  expect: {
    timeout: 10_000,
  },

  use: {
    baseURL: 'https://e-vocabulary.vercel.app',
    trace: "on-first-retry",
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
