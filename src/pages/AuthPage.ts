import { type Locator, type Page, expect, test } from "@playwright/test";
import { BasePage } from "./BasePage";
import { AuthErrorMessages } from "../common/constants/authErrorMessages";

export class AuthPage extends BasePage {
  protected readonly URL = '/#/auth';

  readonly usernameField: Locator;
  readonly passwordField: Locator;
  readonly loginButton: Locator;
  readonly switchToRegistrationButton: Locator;
  readonly usernameFieldError: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameField = page.getByRole('textbox', { name: 'Username' });
    this.passwordField = page.getByRole('textbox', { name: 'Password' });
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.switchToRegistrationButton = page.getByRole('button', {
      name: 'switch to registration',
    });
    this.usernameFieldError = page.locator(".v-input__control").filter({ hasText: 'Username' })
      .getByRole("alert");
  }

  async open(): Promise<void> {
    await test.step('Open Auth page', async () => {
      await this.page.goto(this.URL);
    });
  }

  async fillUsernameField(username: string): Promise<void> {
    await test.step(`Fill 'Username' field`, async () => {
      await this.usernameField.fill(username);
    });
  }

  async clearUsernameField(): Promise<void> {
    await test.step(`Clear 'Username' field`, async () => {
      await this.usernameField.clear();
    });
  }

  async fillPasswordField(password: string): Promise<void> {
    await test.step(`Fill 'Password' field`, async () => {
      await this.passwordField.fill(password);
    });
  }

  async clickLoginButton(): Promise<void> {
    await test.step(`Click 'Login' button`, async () => {
      await this.loginButton.click();
    });
  }

  async performLogin(username: string, password: string): Promise<void> {
    await test.step(`Sign in into application`, async () => {
      await this.fillUsernameField(username);
      await this.fillPasswordField(password);
      await this.clickLoginButton();
    });
  }

  async clickSwitchToRegistrationButton(): Promise<void> {
    await test.step(`Click 'Switch To Registration' button`, async () => {
      await this.switchToRegistrationButton.click();
    });
  }

  async verifyLoginButtonIsEnabled(): Promise<void> {
    await test.step(`Expect 'Login' button to be enabled`, async () => {
      await expect(this.loginButton).toBeEnabled();
    });
  }

  async verifyLoginButtonIsDisabled(): Promise<void> {
    await test.step(`Expect 'Login' button to be disabled`, async () => {
      await expect(this.loginButton).toBeDisabled();
    });
  }

  async verifyInvalidCredentialsErrorIsDisplayed(): Promise<void> {
    const errorText = AuthErrorMessages.INVALID_CREDENTIALS;

    await test.step(`Expect error toast message to have text '${errorText}'`, async () => {
      await this.verifyAlertMessageText(errorText);
    });
  }

  async verifyUsernameInvalidCharsErrorIsDisplayed(): Promise<void> {
    const errorText = AuthErrorMessages.INVALID_CHARS;

    await test.step(`Expect username filed error is displayed with text: '${errorText}'`,
      async () => {
        await expect(this.usernameFieldError).toHaveText(errorText);
      });
  }

  async verifyUsernameInvalidCharsErrorIsNotDisplayed(): Promise<void> {
    const errorText = AuthErrorMessages.INVALID_CHARS;

    await test.step(`Expect username filed error is displayed with text: '${errorText}'`,
      async () => {
        await expect(this.usernameFieldError).not.toBeVisible();
      });
  }
}