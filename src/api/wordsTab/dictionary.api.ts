import { type Page } from "@playwright/test";
import { Dictionary } from "../../common/types/dictionary.types";

/**
 * Intercepts the API response containing the user's dictionary data
 * and extracts it as a key-value object of words and their translations.
 */
export async function getUserDictionary(page: Page, timeout = 10_000): Promise<Dictionary> {
  const responsePromise = page.waitForResponse(
    res => res.url().includes('/api/dictionaries/dictionary') && res.status() === 200,
    { timeout }
  )

  const responseData = await (await responsePromise).json();

  const userDictionary: Dictionary = {};

  try {
    for (const key in responseData) {
      userDictionary[key] = responseData[key].translate;
    }
  } catch (error) {
    throw new Error(`Error during parsing Dictionary: ${error}`);
  }

  return userDictionary;
}