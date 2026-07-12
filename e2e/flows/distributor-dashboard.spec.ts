import { test, expect } from "../fixtures/personas.fixture";
import { LoginPage } from "../pages/login.page";
import { DistributorDashboardPage } from "../pages/distributor-dashboard.page";

test.describe("Distributor — Dashboard MLM (/distributor)", () => {
  test.beforeEach(async ({ page, distribuidor }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login(distribuidor.email, distribuidor.password);
    await expect(page).not.toHaveURL(/\/login(\?|$)/, { timeout: 15_000 });
  });

  test("B1 — dashboard carrega e mostra greeting + KPIs", async ({ page }) => {
    const dashboard = new DistributorDashboardPage(page);
    await dashboard.goto();
    await dashboard.waitForLoad();

    await expect(page.getByRole("heading", { name: /Olá,/i })).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText("Saldo disponível").first()).toBeVisible({ timeout: 10_000 });
  });

  test("B2 — /distributor/network carrega tabela de rede", async ({ page }) => {
    const dashboard = new DistributorDashboardPage(page);
    await dashboard.openNetworkTab();

    await expect(page.getByRole("heading", { name: /Minha Rede/i })).toBeVisible({ timeout: 15_000 });
    await expect(page.locator("table").first()).toBeVisible({ timeout: 10_000 });
  });

  test("B3 — filtros de rede respondem sem erro", async ({ page }) => {
    const dashboard = new DistributorDashboardPage(page);
    await dashboard.openNetworkTab();

    for (const filter of ["Ativos", "Líderes", "Risco", "Todos"]) {
      const btn = page.getByRole("button", { name: new RegExp(`^${filter}$`, "i") });
      if (await btn.count()) {
        await btn.click();
        await page.waitForTimeout(400);
      }
    }

    await expect(page.locator("table").first()).toBeVisible();
  });
});
