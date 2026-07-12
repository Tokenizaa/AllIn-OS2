import { type Page, expect } from "@playwright/test";
import { BasePage } from "./base.page";

export class AdminPlansPage extends BasePage {
  readonly heading: ReturnType<Page["getByRole"]>;
  readonly newPlanButton: ReturnType<Page["getByRole"]>;
  readonly table: ReturnType<Page["getByRole"]>;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole("heading", { name: /Planos|Planos de/i });
    this.newPlanButton = page.getByRole("link", { name: /Novo plano|Criar plano/i }).or(
      page.getByRole("button", { name: /Novo plano|Criar plano/i })
    );
    this.table = page.getByRole("table").first();
  }

  async goto(): Promise<void> {
    await super.goto("/admin/plans");
  }

  async expectLoaded(): Promise<void> {
    await expect(this.heading).toBeVisible({ timeout: MEDIUM_TIMEOUT });
  }

  async expectTableVisible(): Promise<void> {
    await expect(this.table).toBeVisible({ timeout: 10_000 });
  }
}
