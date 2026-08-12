import { type Page, expect } from "@playwright/test";

export class DistributorAtivacaoPage {
  readonly heading: ReturnType<Page["getByRole"]>;
  readonly planGrid: ReturnType<Page["locator"]>;
  readonly checkoutButton: ReturnType<Page["getByRole"]>;
  readonly paymentPixButton: ReturnType<Page["getByRole"]>;
  readonly paymentCardButton: ReturnType<Page["getByRole"]>;
  readonly couponInput: ReturnType<Page["getByPlaceholder"]>;
  readonly couponApplyButton: ReturnType<Page["getByRole"]>;
  readonly simulatePaymentButton: ReturnType<Page["locator"]>;
  readonly successHeading: ReturnType<Page["getByRole"]>;
  readonly backofficeButton: ReturnType<Page["getByRole"]>;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole("heading", { name: /Ativação de Escritório Digital/i });
    this.planGrid = page.locator('[class*="grid-cols"]').first();
    this.checkoutButton = page.getByRole("button", { name: /Seguir para Pagamento de Ativação/i });
    this.paymentPixButton = page.getByRole("button", { name: /PIX/i });
    this.paymentCardButton = page.getByRole("button", { name: /Cartão de Crédito/i });
    this.couponInput = page.getByPlaceholder(/Cupom:/i);
    this.couponApplyButton = page.getByRole("button", { name: /Aplicar/i });
    this.simulatePaymentButton = page.locator('[data-testid*="simulate"], [data-cy*="simulate"], [class*="simulate"]').first();
    this.successHeading = page.getByRole("heading", { name: /Membro Ativo/i });
    this.backofficeButton = page.getByRole("link", { name: /Acessar Backoffice|Voltar ao painel|Dashboard/i });
  }

  async goto(): Promise<void> {
    await this.page.goto("/ativacao");
    await this.expectVisible();
  }

  async waitForPlansLoaded(): Promise<void> {
    await expect(this.planGrid).toBeVisible({ timeout: 15_000 });
    await this.page.waitForLoadState("networkidle");
  }

  async selectFirstPlan(): Promise<void> {
    await this.waitForPlansLoaded();
    const planCard = this.planGrid.locator('[class*="border"], [class*="card"], [role="button"]').first();
    await expect(planCard).toBeVisible({ timeout: 10_000 });
    await planCard.click();
  }

  async goToCheckout(): Promise<void> {
    await expect(this.checkoutButton).toBeEnabled({ timeout: 5_000 });
    await this.checkoutButton.click();
  }

  async selectPaymentMethod(method: "pix" | "card"): Promise<void> {
    const label = method === "pix" ? /PIX/i : /Cartão/i;
    const btn = method === "pix" ? this.paymentPixButton : this.paymentCardButton;
    await expect(btn).toBeVisible({ timeout: 5_000 });
    await btn.click();
  }

  async applyCoupon(code: string): Promise<void> {
    await expect(this.couponInput).toBeVisible({ timeout: 5_000 });
    await this.couponInput.fill(code);
    await this.couponApplyButton.click();
  }

  async confirmPayment(): Promise<void> {
    const confirmBtn = this.page.getByRole("button", { name: /Confirmar Pagamento/i });
    await expect(confirmBtn).toBeVisible({ timeout: 10_000 });
    await confirmBtn.click();
  }

  async waitForSuccess(): Promise<void> {
    await expect(this.successHeading).toBeVisible({ timeout: 30_000 });
  }

  async expectVisible(): Promise<void> {
    await expect(this.heading).toBeVisible({ timeout: 15_000 });
  }
}
