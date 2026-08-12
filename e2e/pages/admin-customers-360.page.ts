import { type Page, expect } from "@playwright/test";
import { BasePage } from "./base.page";

export class AdminCustomers360Page extends BasePage {
  readonly sectionTitle: ReturnType<Page["getByRole"]>;
  readonly ordersHeading: ReturnType<Page["getByText"]>;
  readonly walletsHeading: ReturnType<Page["getByText"]>;
  readonly table: ReturnType<Page["getByRole"]>;

  constructor(page: Page) {
    super(page);
    this.sectionTitle = page.getByRole("heading", { name: /360.*Cliente|Detalhes.*Cliente/i });
    this.ordersHeading = page.getByText(/Pedidos|Ordens/i);
    this.walletsHeading = page.getByText(/Carteira|Wallet/i);
    this.table = page.getByRole("table").first();
  }

  async goto(customerId: string): Promise<void> {
    await super.goto(`/admin/customers/${customerId}`);
  }

  async expectLoaded(): Promise<void> {
    await expect(this.sectionTitle).toBeVisible({ timeout: MEDIUM_TIMEOUT });
  }

  async openOrdersTab(): Promise<void> {
    const ordersTab = this.page.getByRole("tab", { name: /Pedidos|Ordens/i });
    await expect(ordersTab).toBeVisible({ timeout: MEDIUM_TIMEOUT });
    await ordersTab.click();
    await expect(this.ordersHeading).toBeVisible({ timeout: 10_000 });
  }

  async openWalletsTab(): Promise<void> {
    const walletsTab = this.page.getByRole("tab", { name: /Carteira|Wallet/i });
    await expect(walletsTab).toBeVisible({ timeout: MEDIUM_TIMEOUT });
    await walletsTab.click();
  }
}
