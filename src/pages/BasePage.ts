import { type Locator, type Page, expect, test } from "@playwright/test";

export abstract class BasePage {
  protected abstract readonly URL: string;

  readonly page: Page;
  readonly overlayLoader: Locator;
  readonly userAvatarButton: Locator;
  readonly dropdownUserMenu: Locator;
  readonly alert_toast_message: Locator;

  constructor(page: Page) {
    this.page = page;
    this.overlayLoader = page.locator('.v-overlay__content .v-progress-circular');
    this.userAvatarButton = page.getByRole('banner').getByRole('button');
    this.dropdownUserMenu = page
      .getByRole('menu')
      .filter({ has: page.getByRole('link', { name: 'My account' }) });
    this.alert_toast_message = page.getByRole('alert');
  }

  async waitForOverlayLoaderToDisappear(): Promise<void> {
    await test.step('Wait for overlay loader to disappear', async () => {
      try {
        await this.overlayLoader.waitFor({ state: 'visible' });
        await this.overlayLoader.waitFor({ state: 'hidden' });
      } catch {
        //TODO: add logger
        console.log(`Overlay loader was not displayed`);
      }
    });
  }

  async waitForPageURL(): Promise<void> {
    await test.step('Waiting for page to be loaded', async () => {
      await this.page.waitForURL(this.URL);
    });
  }

  async verifyLoggedUserEmail(email: string): Promise<void> {
    await test.step('Verify that logged in user email is correct', async () => {
      await this.userAvatarButton.click();
      await expect(this.dropdownUserMenu).toContainText(email);
      await this.userAvatarButton.click();
    });
  }

  async verifyAlertMessageText(text: string): Promise<void> {
    await test.step(`Verify alert toast message to contain text '${text}'`, async () => {
      await expect(this.alert_toast_message).toHaveText(text);
    });
  }
}