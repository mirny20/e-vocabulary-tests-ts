import { type Page } from "@playwright/test";

/**
 * Intercepts the API response containing translation suggestions for the entered word 
 * on the 'Set Words' tab and returns the list of available translations
 */
export async function getTranslationSuggestions(page: Page, timeout = 10_000): Promise<string[]> {
  const responsePromise = page.waitForResponse(
    res => res.url().includes('/api/translate/translate') && res.status() === 200,
    { timeout }
  );

  const responseData = await (await responsePromise).json();

  if (responseData?.translates) {
    return responseData.translates.map((translation: any) => translation.translate)
  }

  return [];
}
