import { test as base, Page } from '@playwright/test';

type Fixture = {
  authorizedPage: Page,
}

type WorkerFixture = {
}

export const test = base.extend<Fixture, WorkerFixture>({
  authorizedPage: async ({ browser }, use) => {
    const authorizedContext = await browser.newContext({
      storageState: './playwright/.auth/mainUser.json',
    });
    const authorizedPage = await authorizedContext.newPage();

    await use(authorizedPage);

    await authorizedContext.close();
  }
})
