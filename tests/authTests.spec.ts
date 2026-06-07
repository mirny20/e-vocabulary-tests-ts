import { test } from '@fixtures/fixture'
import { env } from '../src/common/config/env';
import { AuthPage } from '@pages/AuthPage';
import { HomePage } from '@pages/HomePage';
import * as allure from "allure-js-commons";

let authPage: AuthPage;
let homePage: HomePage;

test.beforeEach(async ({ page }) => {
  await allure.suite('Auth page');
  authPage = new AuthPage(page);
  homePage = new HomePage(page);
});

test('User is able to log in', async () => {
  await authPage.open();
  await authPage.fillUsernameField(env.users.mainUser.username);
  await authPage.fillPasswordField(env.users.mainUser.password);
  await authPage.clickLoginButton();
  await homePage.waitForHomePageToBeLoaded();
  await homePage.verifyLoggedUserEmail(env.users.mainUser.email);
});

test(`Ensure 'Login' button 'enabled' and 'disabled' states`, async () => {
  await authPage.open();
  await authPage.verifyLoginButtonIsDisabled();

  await authPage.fillUsernameField('testUsername');
  await authPage.verifyLoginButtonIsDisabled();

  await authPage.fillPasswordField('testPass');
  await authPage.verifyLoginButtonIsEnabled();

  await authPage.clearUsernameField();
  await authPage.verifyLoginButtonIsDisabled();
});

test('Alert message is displayed when credentials are invalid', async () => {
  test.fail(true);
  allure.description('Expected fail. Known issue: alert toast message is not displayed');

  await authPage.open();
  await authPage.performLogin('invalidUsername', 'invalidPass');
  await authPage.verifyInvalidCredentialsErrorIsDisplayed();
});

test('Username field accepts only latin characters and numbers', async () => {
  await authPage.open();
  await authPage.fillUsernameField('кирилиця');
  await authPage.verifyUsernameInvalidCharsErrorIsDisplayed();

  await authPage.fillUsernameField('@;№%');
  await authPage.verifyUsernameInvalidCharsErrorIsDisplayed();

  await authPage.fillUsernameField('abc');
  await authPage.verifyUsernameInvalidCharsErrorIsNotDisplayed();
});
