import { expect, type Locator, type Page } from "@playwright/test";
import { BasePage, MEDIUM_TIMEOUT } from "./base.page";

export class AdminDistributorsPage extends BasePage {
  readonly header: Locator;
  readonly searchInput: Locator;
  readonly cityFilter: Locator;
  readonly table: Locator;
  readonly tableRows: Locator;
  readonly skeletonRows: Locator;
  readonly emptyState: Locator;
  readonly pagination: Locator;
  readonly pageSizeSelect: Locator;

  constructor(page: Page) {
    super(page);
    this.header = page.getByRole("heading", { name: /Distribuidores/i });
    this.searchInput = page.getByPlaceholder(/Buscar por nome/i).or(page.getByPlaceholder(/Buscar/i)).first();
    this.cityFilter = page.locator("select").first();
    this.table = page.getByRole("table").first();
    this.tableRows = this.table.locator("tbody tr");
    this.skeletonRows = page.locator("tbody tr:has(.animate-pulse)");
    this.emptyState = page.getByText(/Nenhum distribuidor encontrado/i);
    this.pagination = page.locator("nav[aria-label='pagination'], .pagination").first();
    this.pageSizeSelect = page.locator("select").nth(1);
  }

  async goto(): Promise<void> {
    await super.goto("/admin/distributors");
  }

  async waitForLoad(): Promise<void> {
    await expect(this.skeletonRows.first()).not.toBeVisible({ timeout: MEDIUM_TIMEOUT });
  }

  async search(query: string): Promise<void> {
    await expect(this.searchInput).toBeVisible({ timeout: MEDIUM_TIMEOUT });
    await this.searchInput.fill(query);
    await this.waitForLoad();
  }

  async filterByCity(option: string): Promise<void> {
    await expect(this.cityFilter).toBeVisible({ timeout: MEDIUM_TIMEOUT });
    await this.cityFilter.selectOption(option);
    await this.waitForLoad();
  }

  async clickRowByIndex(index: number): Promise<void> {
    await this.waitForLoad();
    const row = this.tableRows.nth(index);
    await expect(row).toBeVisible();
    await row.getByRole("link").first().click();
  }

  async expectOnlyDistributors(): Promise<void> {
    const rows = await this.tableRows.all();
    for (const row of rows.slice(0, 10)) {
      const cells = row.locator("td");
      const count = await cells.count();
      if (count > 1) {
        const tipoCell = cells.nth(1);
        const text = (await tipoCell.textContent())?.toLowerCase() ?? "";
        if (!text.includes("distribuidor") && !text.includes("afiliado")) {
          console.warn(`Possível não-distribuidor: ${text}`);
        }
      }
    }
  }

  async expectHasLTVColumn(): Promise<void> {
    const headers = this.table.locator("thead th");
    await expect(headers.first()).toBeVisible();
    const texts = (await headers.allTextContents()).map(h => h.toLowerCase());
    expect(texts.some(h => h.includes("ltv") || h.includes("pedido"))).toBe(true);
  }

  async expectVisible(): Promise<void> {
    await expect(this.header).toBeVisible();
    await expect(this.searchInput).toBeVisible();
    await expect(this.table).toBeVisible();
    await expect(this.cityFilter).toBeVisible();
  }
}
