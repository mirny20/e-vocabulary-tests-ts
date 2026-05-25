import { type Locator, type Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { test } from '@fixtures/fixture';

export class HomePage extends BasePage {
  protected readonly URL = '/#/home';

  readonly wordsTab: Locator;
  readonly wordsTranslatedTab: Locator;
  readonly updateWordsTab: Locator;
  readonly setWordsTab: Locator;
  readonly repeatWordsTab: Locator;
  readonly repeatWordsTranslatedTab: Locator;
  readonly dictionaryTab: Locator;
  readonly dictionaryTranslateTab: Locator;
  readonly archiveTab: Locator;
  readonly irregularVerbsTab: Locator;

  constructor(page: Page) {
    super(page);
    this.wordsTab = page.getByRole('tab', { name: 'Words', exact: true });
    this.wordsTranslatedTab = page.getByRole('tab', { name: 'Words_Translated', exact: true });
    this.updateWordsTab = page.getByRole('tab', { name: 'Update_words' });
    this.setWordsTab = page.getByRole('tab', { name: 'Set_Words' });
    this.repeatWordsTab = page.getByRole('tab', { name: 'Repeat_Words', exact: true });
    this.repeatWordsTranslatedTab = page.getByRole('tab', { name: 'Repeat_Words_Translated' });
    this.dictionaryTab = page.getByRole('tab', { name: 'Dictionary', exact: true });
    this.dictionaryTranslateTab = page.getByRole('tab', { name: 'Dictionary_Translate' });
    this.archiveTab = page.getByRole('tab', { name: 'Archive' });
    this.irregularVerbsTab = page.getByRole('tab', { name: 'Irregular_Verbs' });
  }

  async openHomePage(): Promise<void> {
    await test.step('Open Home page', async () => {
      await this.page.goto(this.URL);
    });
  }

  async waitForHomePageToBeLoaded(): Promise<void> {
    await test.step('Wait for home page to be loaded', async () => {
      await this.waitForPageURL();
      await this.waitForOverlayLoaderToDisappear();
    });
  }

  async switchToWordsTab(): Promise<void> {
    await test.step(`Switch to 'words' tab`, async () => {
      await this.wordsTab.click();
    });
  }

  async switchToWordsTranslatedTab(): Promise<void> {
    await test.step(`Switch to 'words_translated' tab`, async () => {
      await this.wordsTranslatedTab.click();
    });
  }

  async switchToUpdateWordsTab(): Promise<void> {
    await test.step(`Switch to 'update_words' tab`, async () => {
      await this.updateWordsTab.click();
    });
  }

  async switchToSetWordsTab(): Promise<void> {
    await test.step(`Switch to 'set_words' tab`, async () => {
      await this.setWordsTab.click();
    });
  }

  async switchToRepeatWordsTab(): Promise<void> {
    await test.step(`Switch to 'repeat_words' tab`, async () => {
      await this.repeatWordsTab.click();
    });
  }

  async switchToRepeatWordsTranslatedTab(): Promise<void> {
    await test.step(`Switch to 'repeat_words_translated' tab`, async () => {
      await this.repeatWordsTranslatedTab.click();
    });
  }

  async switchToDictionaryTab(): Promise<void> {
    await test.step(`Switch to 'dictionary' tab`, async () => {
      await this.dictionaryTab.click();
    });
  }

  async switchToDictionaryTranslateTab(): Promise<void> {
    await test.step(`Switch to 'dictionary_translate' tab`, async () => {
      await this.dictionaryTranslateTab.click();
    });
  }

  async switchToArchiveTab(): Promise<void> {
    await test.step(`Switch to 'archive' tab`, async () => {
      await this.archiveTab.click();
    });
  }

  async switchToIrregularVerbsTab(): Promise<void> {
    await test.step(`Switch to 'irregular_verbs' tab`, async () => {
      await this.irregularVerbsTab.click();
    });
  }
}