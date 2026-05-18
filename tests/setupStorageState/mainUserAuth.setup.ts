import { test as setup } from '@playwright/test';
import { env } from '../../src/common/config/env';
import { AuthPage } from '@pages/AuthPage'
import { HomePage } from '@pages/HomePage';
import path from 'path';

export const authFile = path.join(__dirname, '..', '..', 'playwright', '.auth', 'mainUser.json');

setup('Authenticate main user', async ({ page }) => {
  const authPage = new AuthPage(page);
  const homePage = new HomePage(page);

  await authPage.open();
  await authPage.performLogin(
    env.users.mainUser.username,
    env.users.mainUser.password
  );
  await homePage.waitForHomePageToBeLoaded();

  await page.context().storageState({path: authFile});
});