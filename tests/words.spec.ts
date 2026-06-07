import { test } from '@fixtures/fixture'
import { WordsTab } from '@pages/WordsTab';
import * as allure from "allure-js-commons";

test.beforeEach(async () => {
  await allure.suite(`'Words' tab`);
});

test('Type correct word translation into word card', async ({ authorizedPage, wordWithTranslation }) => {
  const wordsTab = new WordsTab(authorizedPage);

  await wordsTab.openWordsTab();
  await wordsTab.fillTranslationInWordCard(wordWithTranslation);
  await wordsTab.verifyWordCardIsHidden(wordWithTranslation);
});
