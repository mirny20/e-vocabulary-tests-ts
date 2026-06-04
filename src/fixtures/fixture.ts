import { test as base, Page } from '@playwright/test';
import { SetWordsTab } from '@pages/SetWordsTab';
import { getSavedWordDetails } from '../api/setWordsTab/savedWordDetails.api';
import { getUserDictionary } from '../api/wordsTab/dictionary.api';
import { WordsTab } from '@pages/WordsTab';
import { WordWithTranslation } from '../common/types/dictionary.types';
import { Logger } from '../common/logger/logger';

const logger = new Logger();

type Fixture = {
  authorizedPage: Page,
  wordWithTranslation: WordWithTranslation,
}

type WorkerFixture = {
}

export const test = base.extend<Fixture, WorkerFixture>({
  authorizedPage: async ({ browser }, use) => {
    const authorizedContext = await browser.newContext({
      storageState: './playwright/.auth/mainUser.json',
    });
    const authorizedPage = await authorizedContext.newPage();

    await use(authorizedPage);

    await authorizedContext.close();
  },

  wordWithTranslation: async ({ browser }, use) => {
    let wordWithTranslation: WordWithTranslation | undefined;

    const authorizedContext = await browser.newContext({
      storageState: './playwright/.auth/mainUser.json',
    });
    const authorizedPage = await authorizedContext.newPage();

    const wordsTab = new WordsTab(authorizedPage);
    const setWordsTab = new SetWordsTab(authorizedPage);

    const userDictionaryPromise = getUserDictionary(setWordsTab.page);
    await wordsTab.openWordsTab()
    const userDictionary = await userDictionaryPromise;

    const wordsOnPage = await wordsTab.getWordsFromAllCardsOnPage();

    if (Object.keys(userDictionary).length === 0 || wordsOnPage.length === 0) {
      logger.debug(`No usable words was found in the user dictionary.
        Adding new word with 'set word' functionality`);
      await wordsTab.switchToSetWordsTab()
      await setWordsTab.fillEngWordFieldWithTranslatableWord();
      await setWordsTab.chooseFirstTranslation();
      await setWordsTab.chooseDefaultTheme();
      const wordWithTranslationPromise = getSavedWordDetails(setWordsTab.page);
      await setWordsTab.clickSetWordButton();
      wordWithTranslation = await wordWithTranslationPromise;
      logger.debug(`New word was added: 
        {${wordWithTranslation.word}: ${wordWithTranslation.translation}}`);
    }
    else {
      for (const word of wordsOnPage) {

        if (Object.hasOwn(userDictionary, word)) {
          wordWithTranslation = {
            word,
            translation: userDictionary[word],
          };

          logger.debug(`Using word founded in user dictionary: 
            {${wordWithTranslation.word}: ${wordWithTranslation.translation}}`);
          
          break;
        }
      }
    }

    if (!wordWithTranslation) {
      throw new Error('Failed to find or generate a word with translation');
    }

    await use(wordWithTranslation);

    await authorizedContext.close();
  },
})
