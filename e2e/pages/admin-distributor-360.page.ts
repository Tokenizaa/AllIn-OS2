import { type Page, expect } from "@playwright/test";
import { BasePage, MEDIUM_TIMEOUT } from "./base.page";

export class AdminDistributor360Page extends BasePage {
  readonly tabRede: ReturnType<Page["getByRole"]>;
  readonly tabComissoes: ReturnType<Page["getByRole"]>;
  readonly tabCarteira: ReturnType<Page["getByRole"]>;
  readonly redeHeading: ReturnType<Page["getByText"]>;
  readonly comissoesHeading: ReturnType<Page["getByText"]>;
  readonly table: ReturnType<Page["getByRole"]>;

  constructor(page: Page) {
    super(page);
    this.tabRede = page.getByRole("tab", { name: /Rede|Genealogia/i });
    this.tabComissoes = page.getByRole("tab", { name: /Comissões/i });
    this.tabCarteira = page.getByRole("tab", { name: /Carteira Pontos/i });
    this.redeHeading = page.getByText("Parceiros da Rede");
    this.comissoesHeading = page.getByText("Histórico de Comissões");
    this.table = page.getByRole("table").first();
  }

  async goto(distributorId: string): Promise<void> {
    await super.goto(`/admin/distributors/${distributorId}`);
  }

  async expectTabsVisible(): Promise<void> {
    await expect(this.tabRede).toBeVisible({ timeout: MEDIUM_TIMEOUT });
    await expect(this.tabComissoes).toBeVisible({ timeout: MEDIUM_TIMEOUT });
    await expect(this.tabCarteira).toBeVisible({ timeout: MEDIUM_TIMEOUT });
  }

  async openRedeTab(): Promise<void> {
    await this.tabRede.click();
    await expect(this.redeHeading).toBeVisible({ timeout: 10_000 });
  }

  async openComissoesTab(): Promise<void> {
    await this.tabComissoes.click();
    await expect(this.comissoesHeading).toBeVisible({ timeout: 10_000 });
  }

  async openCarteiraTab(): Promise<void> {
    await this.tabCarteira.click();
  }

  async expectTableHasRows(): Promise<void> {
    const rows = this.table.getByRole("row");
    await expect(rows).not.toHaveCount(0, { timeout: 10_000 });
  }
}
