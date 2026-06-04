import { test, expect, type Page, type Locator } from "@playwright/test";
import { HomePage } from "@pages/HomePage";
import { WordWithTranslation } from "../common/types/dictionary.types";

export class WordsTab extends HomePage {
  readonly unloadedWordCard: Locator;
  readonly wordCard: Locator;
  readonly wordCardText: Locator;
  readonly paginationButton: Locator;
  readonly paginationNextPageButton: Locator;

  constructor(page: Page) {
    super(page);
    this.unloadedWordCard = page.locator("[class='v-lazy']");
    this.wordCard = page.locator("[class^='word v-card']");
    this.wordCardText = page.locator("[class^='v-card__title']>span:first-of-type");
    this.paginationButton = page.getByRole('navigation').nth(0).getByRole('button');
    this.paginationNextPageButton = page.getByRole("button", { name: "Next page" }).nth(0);
  }

  async openWordsTab(): Promise<void> {
    await test.step(`Open 'Words' tab`, async () => {
      await super.openHomePage();
      await super.switchToWordsTab();
    });
  }

  async getWordsFromAllCardsOnPage(): Promise<string[]> {
    return await test.step(`Get words from all word cards on page`, async () => {
      await this.scrollThroughAllWordCards();

      const wordCardTextLocators = await this.wordCardText.all();

      return await Promise.all(wordCardTextLocators.map(async wordTextLocator => {
        const textContent = await wordTextLocator.textContent();
        return textContent?.trim().split(/\s+/)[0] ?? '';
      }));
    });
  }

  async fillTranslationInWordCard(wordWithTranslation: WordWithTranslation): Promise<void> {
    const wordEng = wordWithTranslation.word;
    const translation = wordWithTranslation.translation;

    await test.step(`Fill translation '${translation}' into word card '${wordEng}'`, async () => {
      const wordCardInputCells = await this.getWordCardInputCells(wordEng);

      for (let i = 0; i < wordCardInputCells.length; i++) {
        await wordCardInputCells[i].fill(translation[i]);
      }
    });
  }

  async verifyWordCardIsHidden(wordWithTranslation: WordWithTranslation): Promise<void> {
    await test.step(`Expect word card '${wordWithTranslation.word}' to be hidden`, async () => {
      await this.scrollThroughAllWordCards();
      const wordCard = this.wordCard.filter({ hasText: wordWithTranslation.word });
      await expect(wordCard).toBeHidden();
    });
  }

  private async getWordCardInputCells(word: string): Promise<Locator[]> {
    return await test.step(`Get input cells for word '${word}'`, async () => {
      await this.scrollThroughAllWordCards();

      const wordCard = this.wordCard.filter({ hasText: word });

      return await wordCard.getByRole('textbox').all();
    });
  }

  private async scrollThroughAllWordCards(maxCardsPerPage = 10, timeout = 1_000): Promise<void> {
    await test.step(`Scroll through all word cards to trigger lazy loading`, async () => {
      for (let i = 0; i < maxCardsPerPage; i++) {
        try {
          await this.unloadedWordCard.nth(i).scrollIntoViewIfNeeded({ timeout });
          await expect(this.wordCard.nth(i)).toBeVisible({ timeout });
        }
        catch (error) {
          if (await this.lastWordsPageOpened()) {
            this.logger.debug(`Last page of 'Words' tab with less than 10 word cards is displayed`);
            break;
          }

          this.logger.warning(`Failed to load all word cards after scrolling: ${error}`);
        }
      }
    });
  }

  private async lastWordsPageOpened(): Promise<boolean> {
    return await test.step(`Check if last page of 'WORDS' tab is opened`, async () => {
      const paginationButtons = await this.paginationButton.all()
      const currentPageAtt = await paginationButtons.at(-2)?.getAttribute('aria-current');

      return Boolean(currentPageAtt);
    });
  }
}