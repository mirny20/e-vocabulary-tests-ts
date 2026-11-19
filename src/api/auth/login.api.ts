import { type Page, type Response } from "@playwright/test";

/**
 * Waits for the login API request sent from the Auth page and returns its response.
 * Start waiting before triggering the login so the response is not missed.
 */
export async function waitForLoginResponse(page: Page, timeout = 10_000): Promise<Response> {
  return page.waitForResponse(
    res => res.url().includes('/api/auth/login') && res.request().method() === 'POST',
    { timeout }
  );
}
