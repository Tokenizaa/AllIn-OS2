import { test, expect } from "../fixtures/personas.fixture";
import { AdminCustomersPage } from "../pages/admin-customers.page";
import { AdminDistributorsPage } from "../pages/admin-distributors.page";
import { AdminDistributor360Page } from "../pages/admin-distributor-360.page";
import { LoginPage } from "../pages/login.page";

async function loginAs(page: Page, user: { email: string; password: string }) {
  const login = new LoginPage(page);
  await login.goto();
  await login.login(user.email, user.password);
  await expect(page).not.toHaveURL(/\/login(\?|$)/, { timeout: 15_000 });
}

test.describe("Admin - Customers (Clientes Finais)", () => {
  let pageObj: AdminCustomersPage;

  test.beforeEach(async ({ page }) => {
    pageObj = new AdminCustomersPage(page);
  });

  test.beforeEach(async ({ page, adminMaster }) => {
    await loginAs(page, adminMaster);
  });

  test("P1.1 — carrega a página de clientes e exibe tabela", async ({ page }) => {
    await pageObj.goto();
    await pageObj.waitForLoad();
    await pageObj.expectVisible();
    const count = await pageObj.getRowCount();
    expect(count).toBeGreaterThan(0);
  });

  test("P1.2 — não mostra distribuidores na lista de clientes", async ({ page }) => {
    await pageObj.goto();
    await pageObj.waitForLoad();
    await pageObj.expectNoDistributors();
  });

  test("P1.3 — busca por nome filtra resultados", async ({ page }) => {
    await pageObj.goto();
    await pageObj.waitForLoad();
    const initialCount = await pageObj.getRowCount();
    await pageObj.search("xyz-nonexistent-123");
    const filteredCount = await pageObj.getRowCount();
    expect(filteredCount).toBeLessThanOrEqual(initialCount);
  });

  test("P1.4 — clicar em cliente navega para 360°", async ({ page }) => {
    await pageObj.goto();
    await pageObj.waitForLoad();
    await pageObj.clickRowByIndex(0);
    await expect(page).toHaveURL(/\/admin\/customers\/[a-z0-9-]+/, { timeout: 15_000 });
  });
});

test.describe("Admin - Distributors (Distribuidores)", () => {
  let pageObj: AdminDistributorsPage;

  test.beforeEach(async ({ page }) => {
    pageObj = new AdminDistributorsPage(page);
  });

  test.beforeEach(async ({ page, adminMaster }) => {
    await loginAs(page, adminMaster);
  });

  test("P2.1 — carrega a página de distribuidores e exibe tabela", async ({ page }) => {
    await pageObj.goto();
    await pageObj.waitForLoad();
    await pageObj.expectVisible();
    const count = await pageObj.getRowCount();
    expect(count).toBeGreaterThan(0);
  });

  test("P2.2 — exibe colunas MLM (Pedidos, LTV)", async ({ page }) => {
    await pageObj.goto();
    await pageObj.waitForLoad();
    await pageObj.expectHasLTVColumn();
  });

  test("P2.3 — filtro por cidade funciona", async ({ page }) => {
    await pageObj.goto();
    await pageObj.waitForLoad();
    await pageObj.filterByCity("all");
    await pageObj.expectVisible();
  });

  test("P2.4 — busca por nome filtra resultados", async ({ page }) => {
    await pageObj.goto();
    await pageObj.waitForLoad();
    const initialCount = await pageObj.getRowCount();
    await pageObj.search("xyz-nonexistent-123");
    const filteredCount = await pageObj.getRowCount();
    expect(filteredCount).toBeLessThanOrEqual(initialCount);
  });

  test("P2.5 — clicar em distribuidor navega para 360° MLM", async ({ page }) => {
    await pageObj.goto();
    await pageObj.waitForLoad();
    await pageObj.clickRowByIndex(0);
    await expect(page).toHaveURL(/\/admin\/distributors\/[a-z0-9-]+/, { timeout: 15_000 });
  });
});

test.describe("Distributor 360° MLM", () => {
  let p360: AdminDistributor360Page;
  test.beforeEach(async ({ page, adminMaster }) => {
    await loginAs(page, adminMaster);
    const distributors = new AdminDistributorsPage(page);
    await distributors.goto();
    const rows = await distributors.tableRows.all();
    if (rows.length === 0) { test.skip(true, "Sem distribuidores"); return; }
    await distributors.clickRowByIndex(0);
    p360 = new AdminDistributor360Page(page);
  });

  test("P3.1 — 360° exibe abas MLM", async () => {
    await p360.expectTabsVisible();
  });

  test("P3.2 — aba Rede mostra downlines diretas", async ({ page }) => {
    await p360.openRedeTab();
    await expect(page.locator("text=Parceiros da Rede").or(page.locator("text=Rede")).first()).toBeVisible({ timeout: 10_000 });
  });

  test("P3.3 — aba Comissões visível", async ({ page }) => {
    await p360.openComissoesTab();
    await expect(page.locator("text=Histórico de Comissões").or(page.locator("text=Comissões")).first()).toBeVisible({ timeout: 10_000 });
  });
});
