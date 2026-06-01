import { type Page } from "@playwright/test";
import { WordWithTranslation } from "../../common/types/dictionary.types";

/**
 * Intercepts the setDictionary API response on the 'Set words' tab and returns
 * the WordWithTranslation object containing a word and it's translation
 * confirming that a word has been successfully saved to the user's dictionary
 */
export async function getSavedWordDetails(page: Page, timeout = 10_000): Promise<WordWithTranslation> {
  const responsePromise = page.waitForResponse(
    res => res.url().includes('/api/dictionaries/setDictionary')
      && res.status() === 200
      && res.request().method() === 'POST',
    { timeout }
  );

  const responseData = await (await responsePromise).json();

  if (responseData?.word && responseData?.translate) {
    return {
      word: responseData.word,
      translation: responseData.translate,
    }
  }

  throw new Error('Failed to add a new word to dictionary: invalid response structure')
}