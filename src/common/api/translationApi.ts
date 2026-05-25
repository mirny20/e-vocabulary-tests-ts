import { type Page, type Response } from "@playwright/test";

export async function getTranslationResponse(page: Page, timeout = 10_000): Promise<Response> {
  return await page.waitForResponse(
    res => res.url().includes('/api/translate/translate') && res.status() === 200,
    {timeout}
  )
}

export async function captureTranslationData(page: Page): Promise<string[]> {
  const response = await getTranslationResponse(page);
  const responseData = await response.json();

  if (responseData?.translates) {
    return responseData.translates.map((translation: any) => translation.translate)
  }

  return [];
}