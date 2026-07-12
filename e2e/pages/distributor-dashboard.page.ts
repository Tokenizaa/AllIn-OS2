import { type Page, expect } from "@playwright/test";
import { BasePage, MEDIUM_TIMEOUT } from "./base.page";

export class DistributorDashboardPage extends BasePage {
  readonly networkLink: ReturnType<Page["getByRole"]>;

  constructor(page: Page) {
    super(page);
    this.networkLink = page.getByRole("link", { name: /Minha Rede/i });
  }

  async goto(): Promise<void> {
    await super.goto("/distributor");
  }

  async waitForLoad(): Promise<void> {
    await this.page.waitForLoadState("networkidle", { timeout: MEDIUM_TIMEOUT });
    await expect(this.page.getByRole("heading", { name: /Olá,/i })).toBeVisible({ timeout: MEDIUM_TIMEOUT });
  }

  async openNetworkTab(): Promise<void> {
    const link = this.networkLink;
    await expect(link).toBeVisible({ timeout: MEDIUM_TIMEOUT });
    await link.click();
    await expect(this.page.getByRole("heading", { name: /Minha Rede/i })).toBeVisible({ timeout: MEDIUM_TIMEOUT });
  }

  async expectVisible(): Promise<void> {
    await expect(this.page.getByRole("heading", { name: /Olá,/i })).toBeVisible({ timeout: MEDIUM_TIMEOUT });
  }
}
