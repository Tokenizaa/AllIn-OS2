import { expect, type Locator, type Page } from "@playwright/test";

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly heading: Locator;
  readonly errorToast: Locator;

constructor(page: Page) {
  this.page = page;
  this.emailInput = page.getByLabel("E-mail");
  this.passwordInput = page.getByTestId("auth-login-password");
  this.submitButton = page.getByRole("button", { name: /^entrar$/i });
  this.heading = page.getByRole("heading", { name: /entre na sua conta/i });
  this.errorToast = page.locator("[data-sonner-toast][data-type='error']");
}

  async goto() {
    await this.page.goto("/login");
    await expect(this.heading).toBeVisible();
  }

  async fill(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
  }

  async submit() {
    await this.submitButton.click();
  }

  async login(email: string, password: string) {
    await this.fill(email, password);
    await this.submit();
  }
}
