import { expect, type Locator, type Page } from "@playwright/test";
import { BasePage, MEDIUM_TIMEOUT, SHORT_TIMEOUT } from "./base.page";

export class AdminCustomersPage extends BasePage {
  readonly header: Locator;
  readonly searchInput: Locator;
  readonly table: Locator;
  readonly tableRows: Locator;
  readonly skeletonRows: Locator;

  constructor(page: Page) {
    super(page);
    this.header = page.getByRole("heading", { name: /Clientes/i });
    this.searchInput = page.getByPlaceholder(/Buscar por nome|Buscar/i).first();
    this.table = page.getByRole("table").first();
    this.tableRows = this.table.locator("tbody tr");
    this.skeletonRows = page.locator("tbody tr:has(.animate-pulse)");
  }

  async goto(): Promise<void> {
    await super.goto("/admin/customers");
  }

  async waitForLoad(): Promise<void> {
    await expect(this.skeletonRows.first()).not.toBeVisible({ timeout: MEDIUM_TIMEOUT });
    await this.page.waitForLoadState("networkidle", { timeout: SHORT_TIMEOUT });
  }

  async search(query: string): Promise<void> {
    await expect(this.searchInput).toBeVisible({ timeout: MEDIUM_TIMEOUT });
    await this.searchInput.fill(query);
    await this.waitForLoad();
  }

  async getRowCount(): Promise<number> {
    return this.tableRows.count();
  }

  async clickRowByIndex(index: number): Promise<void> {
    await this.waitForLoad();
    const row = this.tableRows.nth(index);
    await expect(row).toBeVisible();
    await row.getByRole("link").first().click();
  }

  async expectVisible(): Promise<void> {
    await expect(this.header).toBeVisible();
    await expect(this.searchInput).toBeVisible();
    await expect(this.table).toBeVisible();
  }

  async expectNoDistributors(): Promise<void> {
    const rows = await this.tableRows.all();
    for (const row of rows.slice(0, 20)) {
      const cells = row.locator("td");
      const count = await cells.count();
      if (count > 1) {
        const tipoCell = cells.nth(1);
        const text = (await tipoCell.textContent())?.toLowerCase() ?? "";
        if (text.includes("distribuidor") || text.includes("afiliado")) {
          throw new Error(`Distribuidor/Afiliado encontrado na lista de clientes: ${text}`);
        }
      }
    }
  }

  async getFirstCustomerId(): Promise<string | null> {
    const rows = await this.tableRows.all();
    if (rows.length === 0) return null;
    const link = rows[0].getByRole("link").first();
    const href = await link.getAttribute("href");
    if (!href) return null;
    const match = href.match(/\/admin\/customers\/([a-z0-9-]+)/i);
    return match?.[1] ?? null;
  }
}
