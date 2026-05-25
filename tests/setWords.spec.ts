import { test } from '@fixtures/fixture'
import { SetWordsTab } from '@pages/SetWordsTab'

test('Add new word to the dictionary (set up word)', async ({ authorizedPage }) => {
  const setWordsTab = new SetWordsTab(authorizedPage);
  
  await setWordsTab.openSetWordsTab();
  await setWordsTab.fillEngWordFieldWithTranslatableWord();
  await setWordsTab.chooseFirstTranslation();
  await setWordsTab.chooseDefaultTheme();
  await setWordsTab.clickSetWordButton();
  await setWordsTab.expectSuccessfullyAddedWordAlert();
});