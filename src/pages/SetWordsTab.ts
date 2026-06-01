import { HomePage } from "@pages/HomePage";
import { test, expect, Locator, Page } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { SetWordMessages } from "../common/constants/setWordMessages";
import { getTranslationSuggestions } from "../api/setWordsTab/translationSuggestions.api";

export class SetWordsTab extends HomePage {
  readonly engWordField: Locator;
  readonly themeField: Locator;
  readonly setWordButton: Locator;
  readonly wordFieldAlert: Locator;

  constructor(page: Page) {
    super(page);
    this.engWordField = page.getByRole('textbox', { name: 'Word' });
    this.themeField = page.getByRole('textbox', { name: 'Theme' });
    this.setWordButton = page.getByRole('button', { name: 'set word' });
    this.wordFieldAlert = page.locator('.v-input__control').filter({ hasText: 'Word' }).getByRole('alert');
  }

  async openSetWordsTab(): Promise<void> {
    await test.step(`Open 'Set Words' tab`, async () => {
      await super.openHomePage();
      await super.switchToSetWordsTab();
    });
  }

  async fillEngWordField(word: string): Promise<void> {
    await test.step(`Fill the 'Word' field with value '${word}'`, async () => {
      await this.engWordField.fill(word);
    });
  }

  async fillEngWordFieldWithTranslatableWord(maxTries = 5): Promise<void> {
    await test.step(`Fill the 'Word' field with new translatable word`, async () => {
      for (let i = 0; i < maxTries; i++) {
        const translationsPromise = getTranslationSuggestions(this.page);
        const word = faker.word.noun();
        await this.fillEngWordField(word);

        if (await this.wordAlreadyExistsErrorIsDisplayed()) {
          //TODO: add logger
          console.log(`Generated word '${word}' already exists, trying another one`);
          continue;
        }

        try {
          const translations = await translationsPromise;

          if (translations.length === 0) {
            //TODO: add logger
            console.log(`No translation for word '${word}', trying another one`);
            continue;
          }

          return;

        } catch (error) {
          //TODO: add logger
          console.log(`Attempt ${i + 1} failed for word '${word}' due to error: ${error}`);
          continue;
        }
      }
      throw new Error('Failed to find translatable word or translations were not displayed');
    });
  }

  async chooseFirstTranslation(): Promise<void> {
    await test.step(`Choose first available translation`, async () => {
      await this.dropdownListOption.first().click();
    });
  }

  async chooseThemeFromDropdownList(themeName: string): Promise<void> {
    await test.step(`Choose '${themeName}' theme from 'Theme' dropdown`, async () => {
      await this.themeField.click();
      await this.chooseOptionFromDropdown(themeName);
    });
  }

  async chooseDefaultTheme(): Promise<void> {
    await test.step(`Choose 'default theme' from 'Theme' dropdown`, async () => {
      try {
        await this.chooseThemeFromDropdownList('default theme');
      } catch {
        //TODO: add loger
        console.log('Default theme not found, creating it');
        await this.themeField.fill('default theme');
        await this.page.keyboard.press('Enter');
      }
    });
  }

  async clickSetWordButton(): Promise<void> {
    await test.step(`Click 'SET WORD' button`, async () => {
      await this.setWordButton.click();
    });
  }

  async expectSuccessfullyAddedWordAlert(): Promise<void> {
    await test.step(`Expect alert of a successfully added word to be displayed`, async () => {
      await expect(this.alert_toast_message).toContainText(
        SetWordMessages.WORD_ADDED_TOAST_TEXT
      );
    });
  }

  private async wordAlreadyExistsErrorIsDisplayed(): Promise<boolean> {
    return await test.step(`Check if word is already added to dictionary`, async () => {
      return await this.wordFieldAlert.filter({
        hasText: SetWordMessages.WORD_ALREADY_EXIST_ERROR_TEXT
      }).isVisible();
    });
  }
}