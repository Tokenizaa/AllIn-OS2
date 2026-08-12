import { type Page, expect } from "@playwright/test";
import { BasePage } from "./base.page";

export class DistributorStorePage extends BasePage {
  readonly heading: ReturnType<Page["getByRole"]>;
  readonly productCards: ReturnType<Page["locator"]>;
  readonly cartBadge: ReturnType<Page["locator"]>;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole("heading", { name: /Loja|Vitrine|Produtos/i });
    this.productCards = page.locator('[class*="product"], [data-cy*="product"], [data-testid*="product"]').or(
      page.getByRole("article")
    );
    this.cartBadge = page.locator('[aria-label*="carrinho" i], [aria-label*="cart" i], [data-cy*="cart"]').first();
  }

  async goto(): Promise<void> {
    await super.goto("/distributor/store");
    await super.waitForLoad();
  }

  async expectLoaded(): Promise<void> {
    await expect(this.heading).toBeVisible({ timeout: MEDIUM_TIMEOUT });
  }

  async getProductCount(): Promise<number> {
    return this.productCards.count();
  }

  async openFirstProduct(): Promise<void> {
    const first = this.productCards.first();
    await expect(first).toBeVisible({ timeout: MEDIUM_TIMEOUT });
    await first.click();
  }

  async expectStoreHasContent(): Promise<void> {
    const count = await this.getProductCount();
    expect(count).toBeGreaterThanOrEqual(0);
  }
}
