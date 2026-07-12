import { type Locator, type Page, expect } from "@playwright/test";

export class RouteGuardPage {
  readonly page: Page;
  readonly loadingIndicator: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loadingIndicator = page.getByText(/iniciando ambiente de segurança/i);
  }

  async expectLoadingThenReady(): Promise<void> {
    await expect(this.loadingIndicator)
      .toBeVisible({ timeout: 5_000 })
      .catch(() => {});
  }

  async expectAtLogin(): Promise<void> {
    await expect(this.page).toHaveURL(/\/login(\?|$)/);
  }

  async expectNotOnAdmin(): Promise<void> {
    await expect(this.page).not.toHaveURL(/\/admin/);
  }

  async expectOn(pathRegex: RegExp): Promise<void> {
    await expect(this.page).toHaveURL(pathRegex);
  }
}
