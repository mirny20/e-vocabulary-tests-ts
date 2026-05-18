import { type Locator, type Page, expect, test } from "@playwright/test";
import { BasePage } from "./BasePage";

export class HomePage extends BasePage {
  protected readonly URL = '/#/home';

  constructor(page: Page) {
    super(page);
  }

  async open(): Promise<void> {
    await test.step('Open Home page', async () => {
      await this.page.goto(this.URL);
    });
  }

  async waitForHomePageToBeLoaded(): Promise<void> {
    await test.step('Wait for home page to be loaded', async () => {
      await this.waitForPageURL();
      await this.waitForOverlayLoaderToDisappear();
    })
  }
}