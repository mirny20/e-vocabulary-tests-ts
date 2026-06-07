import { test } from '@fixtures/fixture'
import { SetWordsTab } from '@pages/SetWordsTab'
import * as allure from "allure-js-commons";

test.beforeEach(async () => {
  await allure.suite(`'Set Words' tab`);
});

test('Add new word to the dictionary (set up word)', async ({ authorizedPage }) => {
  const setWordsTab = new SetWordsTab(authorizedPage);
  
  await setWordsTab.openSetWordsTab();
  await setWordsTab.fillEngWordFieldWithTranslatableWord();
  await setWordsTab.chooseFirstTranslation();
  await setWordsTab.chooseDefaultTheme();
  await setWordsTab.clickSetWordButton();
  await setWordsTab.expectSuccessfullyAddedWordAlert();
});