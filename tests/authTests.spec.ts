import { test } from '@playwright/test'
import { env } from '../src/common/config/env';
import { AuthPage } from '@pages/AuthPage';
import { HomePage } from '@pages/HomePage';

test.describe('Authorisation tests', async () => {
  let authPage: AuthPage;
  let homepage: HomePage;

  test.beforeEach(async ({ page }) => {
    authPage = new AuthPage(page);
    homepage = new HomePage(page);
  });

  test('User is able to log in', async () => {
    await authPage.open();
    await authPage.fillUsernameField(env.users.mainUser.username);
    await authPage.fillPasswordField(env.users.mainUser.password);
    await authPage.clickLoginButton();
    await homepage.waitForHomePageToBeLoaded();
    await homepage.verifyLoggedUserEmail(env.users.mainUser.email);
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
    test.fail(true, 'Known issue: alert toast message is not displayed');

    await authPage.open();
    await authPage.performLogin('invalidUsername', 'invalidPass');
    await authPage.verifyInvalidCredentialsErrorIsDisplayed();
  });

  test('Username field accepts only latin characters and numbers', async ({page}) => {
    await authPage.open();
    await authPage.fillUsernameField('кирилиця');
    await authPage.verifyUsernameInvalidCharsErrorIsDisplayed();

    await authPage.fillUsernameField('@;№%');
    await authPage.verifyUsernameInvalidCharsErrorIsDisplayed();

    await authPage.fillUsernameField('abc');
    await authPage.verifyUsernameInvalidCharsErrorIsNotDisplayed();  
  });
});