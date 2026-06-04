import { test } from '@fixtures/fixture'
import { WordsTab } from '@pages/WordsTab';


test('Type correct word translation into word card', async ({ authorizedPage, wordWithTranslation }) => {
  const wordsTab = new WordsTab(authorizedPage);

  await wordsTab.openWordsTab();
  await wordsTab.fillTranslationInWordCard(wordWithTranslation);
  await wordsTab.verifyWordCardIsHidden(wordWithTranslation);
});
