import { type Page, expect } from "@playwright/test";

const SHORT_TIMEOUT = 5_000;
const MEDIUM_TIMEOUT = 15_000;
const LONG_TIMEOUT = 30_000;

export { MEDIUM_TIMEOUT, SHORT_TIMEOUT };

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(path: string): Promise<void> {
    await this.page.goto(path);
    await this.expectNoConsoleErrors();
    await this.expectNoNetworkErrors();
  }

  async waitForLoad(): Promise<void> {
    await this.page.waitForLoadState("networkidle", { timeout: MEDIUM_TIMEOUT });
  }

  async expectVisible(): Promise<void> {
    await expect(this.page).not.toHaveURL(/\/login(\?|$)/);
    await expect(this.page.locator("body")).toBeVisible();
  }

  async expectUrlPattern(pattern: RegExp | string, timeout = MEDIUM_TIMEOUT): Promise<void> {
    await expect(this.page).toHaveURL(pattern, { timeout });
  }

  async expectNotOnPath(path: string | RegExp, timeout = SHORT_TIMEOUT): Promise<void> {
    const pattern = typeof path === "string" ? new RegExp(`^${path.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`) : path;
    await expect(this.page).not.toHaveURL(pattern, { timeout });
  }

  async expectNoConsoleErrors(): Promise<void> {
    const errors = await this.page.evaluate(() => {
      const entries = (window as unknown as { __e2eErrors?: string[] }).__e2eErrors ?? [];
      return entries;
    });
    expect(errors).toEqual([]);
  }

  async expectNoNetworkErrors(): Promise<void> {
    const failed = await this.page.evaluate(() => {
      const entries = (window as unknown as { __e2eNetworkErrors?: Array<{ url: string; status: number }> }).__e2eNetworkErrors ?? [];
      return entries.filter((e) => e.status >= 400);
    });
    expect(failed).toEqual([]);
  }

  async collectNetworkErrors(): Promise<Array<{ url: string; status: number }>> {
    return this.page.evaluate(() => {
      return (window as unknown as { __e2eNetworkErrors?: Array<{ url: string; status: number }> }).__e2eNetworkErrors ?? [];
    });
  }
}
