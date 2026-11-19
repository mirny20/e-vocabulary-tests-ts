import { type Locator, type Page, expect, test } from "@playwright/test";
import { BasePage } from "./BasePage";
import { AuthErrorMessages } from "../common/constants/authErrorMessages";
import { waitForLoginResponse } from "../api/auth/login.api";

export class AuthPage extends BasePage {
  protected readonly URL = '/#/auth';

  readonly usernameField: Locator;
  readonly passwordField: Locator;
  readonly loginButton: Locator;
  readonly switchToRegistrationButton: Locator;
  readonly switchToLoginButton: Locator;
  readonly registrationButton: Locator;
  readonly emailField: Locator;
  readonly confirmPasswordField: Locator;
  readonly formTitle: Locator;
  readonly usernameFieldError: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameField = page.getByRole('textbox', { name: 'Username' });
    this.passwordField = page.getByRole('textbox', { name: 'Password', exact: true });
    this.loginButton = page.getByRole('button', { name: 'Login', exact: true });
    this.switchToRegistrationButton = page.getByRole('button', {
      name: 'switch to registration',
    });
    this.switchToLoginButton = page.getByRole('button', { name: 'switch to login' });
    this.registrationButton = page.getByRole('button', { name: 'Registration', exact: true });
    this.emailField = page.getByRole('textbox', { name: 'Email' });
    this.confirmPasswordField = page.getByRole('textbox', { name: 'Confirm password' });
    this.formTitle = page.getByText(/^(Login|Registration) form$/);
    this.usernameFieldError = page.locator(".v-input__control").filter({ hasText: 'Username' })
      .getByRole("alert");
  }

  async open(): Promise<void> {
    await test.step('Open Auth page', async () => {
      await this.page.goto(this.URL);
    });
  }

  async fillUsernameField(username: string): Promise<void> {
    await test.step(`Fill 'Username' field with value '${username}'`, async () => {
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

  async submitLoginWithEnterKey(): Promise<void> {
    await test.step(`Press 'Enter' in 'Password' field to submit login form`, async () => {
      await this.passwordField.press('Enter');
    });
  }

  async performLogin(username: string, password: string): Promise<void> {
    await test.step(`Sign in into application with user '${username}'`, async () => {
      await this.fillUsernameField(username);
      await this.fillPasswordField(password);
      const loginResponsePromise = waitForLoginResponse(this.page);
      await this.clickLoginButton();
      await loginResponsePromise;
    });
  }

  async clickSwitchToRegistrationButton(): Promise<void> {
    await test.step(`Click 'Switch To Registration' button`, async () => {
      await this.switchToRegistrationButton.click();
    });
  }

  async clickSwitchToLoginButton(): Promise<void> {
    await test.step(`Click 'Switch To Login' button`, async () => {
      await this.switchToLoginButton.click();
    });
  }

  async verifyAuthPageIsOpened(): Promise<void> {
    await test.step('Expect Auth page to be opened', async () => {
      await expect(this.page).toHaveURL(this.URL);
    });
  }

  async verifyLoginFormIsDisplayed(): Promise<void> {
    await test.step('Expect login form to be displayed', async () => {
      await expect(this.formTitle).toHaveText('Login form');
      await expect(this.usernameField).toBeVisible();
      await expect(this.passwordField).toBeVisible();
      await expect(this.loginButton).toBeVisible();
      await expect(this.emailField).toBeHidden();
      await expect(this.confirmPasswordField).toBeHidden();
    });
  }

  async verifyRegistrationFormIsDisplayed(): Promise<void> {
    await test.step('Expect registration form to be displayed', async () => {
      await expect(this.formTitle).toHaveText('Registration form');
      await expect(this.usernameField).toBeVisible();
      await expect(this.emailField).toBeVisible();
      await expect(this.passwordField).toBeVisible();
      await expect(this.confirmPasswordField).toBeVisible();
      await expect(this.registrationButton).toBeVisible();
      await expect(this.loginButton).toBeHidden();
    });
  }

  async verifyUsernameFieldValue(value: string): Promise<void> {
    await test.step(`Expect 'Username' field to have value '${value}'`, async () => {
      await expect(this.usernameField).toHaveValue(value);
    });
  }

  async verifyPasswordFieldIsMasked(): Promise<void> {
    await test.step(`Expect 'Password' field input to be masked`, async () => {
      await expect(this.passwordField).toHaveAttribute('type', 'password');
    });
  }

  async verifyAuthTokenIsNotStored(): Promise<void> {
    await test.step('Expect auth token not to be stored in local storage', async () => {
      const token = await this.page.evaluate(() => localStorage.getItem('token'));
      expect(token).toBeNull();
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

    await test.step(`Verify username filed errors is not displayed`,
      async () => {
        await expect(this.usernameFieldError).not.toBeVisible();
      });
  }
}