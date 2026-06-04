import { type Locator, type Page, expect, test } from "@playwright/test";
import { Logger } from "../common/logger/logger";

export abstract class BasePage {
  protected abstract readonly URL: string;

  protected logger = new Logger();

  readonly page: Page;
  readonly overlayLoader: Locator;
  readonly userAvatarButton: Locator;
  readonly userMenu: Locator;
  readonly alert_toast_message: Locator;
  readonly dropdownList: Locator;
  readonly dropdownListOption: Locator;

  constructor(page: Page) {
    this.page = page;
    this.overlayLoader = page.locator('.v-overlay__content .v-progress-circular');
    this.userAvatarButton = page.getByRole('banner').getByRole('button');
    this.userMenu = page
      .getByRole('menu')
      .filter({ has: page.getByRole('link', { name: 'My account' }) });
    this.alert_toast_message = page.getByRole('alert');
    this.dropdownList = page.getByRole('listbox');
    this.dropdownListOption = this.dropdownList.getByRole('option');
  }

  protected async waitForOverlayLoaderToDisappear(): Promise<void> {
    await test.step('Wait for overlay loader to disappear', async () => {
      try {
        await this.overlayLoader.waitFor({ state: 'visible' });
        await this.overlayLoader.waitFor({ state: 'hidden' });
      } catch {
        this.logger.warning(`Overlay loader was not displayed`);
      }
    });
  }

  protected async waitForPageURL(): Promise<void> {
    await test.step('Waiting for page to be loaded', async () => {
      await this.page.waitForURL(this.URL);
    });
  }

  async chooseOptionFromDropdown(option: string, timeout = 1000): Promise<void> {
    await test.step(`Choose '${option}' option from dropdown list`, async () => {
      await this.dropdownListOption.getByText(option, { exact: true }).click({timeout});
    });
  }

  async verifyLoggedUserEmail(email: string): Promise<void> {
    await test.step('Verify that logged in user email is correct', async () => {
      await this.userAvatarButton.click();
      await expect(this.userMenu).toContainText(email);
      await this.userAvatarButton.click();
    });
  }

  async verifyAlertMessageText(text: string): Promise<void> {
    await test.step(`Verify alert toast message to contain text '${text}'`, async () => {
      await expect(this.alert_toast_message).toHaveText(text);
    });
  }
}