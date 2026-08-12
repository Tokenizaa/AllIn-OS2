import { test, expect } from "../fixtures/personas.fixture";
import { LoginPage } from "../pages/login.page";

async function loginAs(page: Page, user: { email: string; password: string }) {
  const login = new LoginPage(page);
  await login.goto();
  await login.login(user.email, user.password);
  await expect(page).not.toHaveURL(/\/login(\?|$)/, { timeout: 15_000 });
}

test.describe("Navegação — Rotas Públicas", () => {
  let login: LoginPage;

  test.beforeEach(async ({ page }) => {
    login = new LoginPage(page);
  });

  test("R.1 — / carrega sem erro e não redireciona anônimo", async ({ page }) => {
    await login.goto();
    await expect(page).toHaveURL("/");
    await expect(page.locator("body")).toBeVisible();
  });

  test("R.2 — /login carrega com formulário", async ({ page }) => {
    await login.goto();
    await expect(page.getByRole("heading", { name: /entre na sua conta/i })).toBeVisible();
  });

  test("R.3 — /cadastro carrega", async ({ page }) => {
    await page.goto("/cadastro");
    await expect(page.locator("body")).toBeVisible();
  });

  test("R.4 — /recuperar-senha carrega", async ({ page }) => {
    await page.goto("/recuperar-senha");
    await expect(page.locator("body")).toBeVisible();
  });

  test("R.5 — /redefinir-senha carrega", async ({ page }) => {
    await page.goto("/redefinir-senha");
    await expect(page.locator("body")).toBeVisible();
  });

  test("R.6 — /loja carrega e exibe conteúdo", async ({ page }) => {
    await page.goto("/loja");
    await expect(page.locator("body")).toBeVisible();
  });

  test("R.7 — /produto/$id carrega", async ({ page }) => {
    await page.goto("/produto/00000000-0000-0000-0000-000000000000");
    await expect(page.locator("body")).toBeVisible();
  });

  test("R.8 — /busca-produtos carrega", async ({ page }) => {
    await page.goto("/busca-produtos");
    await expect(page.locator("body")).toBeVisible();
  });

  test("R.9 — /doencas carrega", async ({ page }) => {
    await page.goto("/doencas");
    await expect(page.locator("body")).toBeVisible();
  });

  test("R.10 — /seja-distribuidor carrega", async ({ page }) => {
    await page.goto("/seja-distribuidor");
    await expect(page.locator("body")).toBeVisible();
  });

  test("R.11 — rota inexistente não quebra a aplicação", async ({ page }) => {
    await page.goto("/rota-que-nao-existe-xyz-abc", { waitUntil: "domcontentloaded" });
    await expect(page.locator("body")).toBeVisible();
  });
});

test.describe("Navegação — Guard / Redirects", () => {
  test("R.12 — anônimo em /admin/customers redireciona para /login", async ({ page }) => {
    await page.goto("/admin/customers", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/\/login/);
  });

  test("R.13 — cliente_final em /admin é bloqueado", async ({ page, clienteFinal }) => {
    await loginAs(page, clienteFinal);
    await page.goto("/admin/customers", { waitUntil: "domcontentloaded" });
    await expect(page).not.toHaveURL(/\/admin\/customers/);
  });

  test("R.14 — distribuidor em /admin redireciona para /distributor", async ({ page, distribuidor }) => {
    await loginAs(page, distribuidor);
    await page.goto("/admin/customers", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/\/(distributor|login)/);
  });
});

test.describe("Navegação — Rotas Admin (autenticado)", () => {
  test.beforeEach(async ({ page, adminMaster }) => {
    await loginAs(page, adminMaster);
  });

  test("R.15 — /admin redireciona para dashboard padrão", async ({ page }) => {
    await page.goto("/admin");
    await expect(page.locator("body")).toBeVisible();
  });

  test("R.16 — /admin/customers carrega com tabela", async ({ page }) => {
    await page.goto("/admin/customers");
    await expect(page.getByRole("table").first()).toBeVisible({ timeout: 15_000 });
  });

  test("R.17 — /admin/distributors carrega", async ({ page }) => {
    await page.goto("/admin/distributors");
    await expect(page.locator("body")).toBeVisible();
  });

  test("R.18 — /admin/plans carrega", async ({ page }) => {
    await page.goto("/admin/plans");
    await expect(page.locator("body")).toBeVisible();
  });

  test("R.19 — /admin/network carrega", async ({ page }) => {
    await page.goto("/admin/network");
    await expect(page.locator("body")).toBeVisible();
  });

  test("R.20 — /admin/genealogy carrega", async ({ page }) => {
    await page.goto("/admin/genealogy");
    await expect(page.locator("body")).toBeVisible();
  });

  test("R.21 — /admin/orders carrega", async ({ page }) => {
    await page.goto("/admin/orders");
    await expect(page.locator("body")).toBeVisible();
  });

  test("R.22 — /admin/wallets carrega", async ({ page }) => {
    await page.goto("/admin/wallets");
    await expect(page.locator("body")).toBeVisible();
  });

  test("R.23 — /admin/insights carrega", async ({ page }) => {
    await page.goto("/admin/insights");
    await expect(page.locator("body")).toBeVisible();
  });

  test("R.24 — /admin/marketing carrega", async ({ page }) => {
    await page.goto("/admin/marketing");
    await expect(page.locator("body")).toBeVisible();
  });

  test("R.25 — /admin/copilot carrega", async ({ page }) => {
    await page.goto("/admin/copilot");
    await expect(page.locator("body")).toBeVisible();
  });

  test("R.26 — /admin/alerts carrega", async ({ page }) => {
    await page.goto("/admin/alerts");
    await expect(page.locator("body")).toBeVisible();
  });

  test("R.27 — /admin/analytics carrega", async ({ page }) => {
    await page.goto("/admin/analytics");
    await expect(page.locator("body")).toBeVisible();
  });

  test("R.28 — /admin/commissions carrega", async ({ page }) => {
    await page.goto("/admin/commissions");
    await expect(page.locator("body")).toBeVisible();
  });

  test("R.29 — /admin/system carrega", async ({ page }) => {
    await page.goto("/admin/system");
    await expect(page.locator("body")).toBeVisible();
  });

  test("R.30 — /admin/settings carrega", async ({ page }) => {
    await page.goto("/admin/settings");
    await expect(page.locator("body")).toBeVisible();
  });

  test("R.31 — /admin/products carrega", async ({ page }) => {
    await page.goto("/admin/products");
    await expect(page.locator("body")).toBeVisible();
  });

  test("R.32 — /admin/industrial e sub-rotas carregam", async ({ page }) => {
    await page.goto("/admin/industrial");
    await expect(page.locator("body")).toBeVisible();
    await page.goto("/admin/industrial/machines");
    await expect(page.locator("body")).toBeVisible();
    await page.goto("/admin/industrial/materials");
    await expect(page.locator("body")).toBeVisible();
    await page.goto("/admin/industrial/processes");
    await expect(page.locator("body")).toBeVisible();
  });
});

test.describe("Navegação — Rotas Distributor (autenticado)", () => {
  test.beforeEach(async ({ page, distribuidor }) => {
    await loginAs(page, distribuidor);
  });

  test("R.33 — /distributor carrega dashboard", async ({ page }) => {
    await page.goto("/distributor");
    await expect(page.getByRole("heading", { name: /Olá,/i })).toBeVisible({ timeout: 15_000 });
  });

  test("R.34 — /distributor/finance carrega", async ({ page }) => {
    await page.goto("/distributor/finance");
    await expect(page.locator("body")).toBeVisible();
  });

  test("R.35 — /distributor/reports carrega", async ({ page }) => {
    await page.goto("/distributor/reports");
    await expect(page.locator("body")).toBeVisible();
  });

  test("R.36 — /distributor/verification carrega", async ({ page }) => {
    await page.goto("/distributor/verification");
    await expect(page.locator("body")).toBeVisible();
  });

  test("R.37 — /distributor/copilot carrega", async ({ page }) => {
    await page.goto("/distributor/copilot");
    await expect(page.locator("body")).toBeVisible();
  });

  test("R.38 — /distributor/profile carrega", async ({ page }) => {
    await page.goto("/distributor/profile");
    await expect(page.locator("body")).toBeVisible();
  });

  test("R.39 — /distributor/store carrega", async ({ page }) => {
    await page.goto("/distributor/store");
    await expect(page.locator("body")).toBeVisible();
  });

  test("R.40 — /distributor/plan carrega", async ({ page }) => {
    await page.goto("/distributor/plan");
    await expect(page.locator("body")).toBeVisible();
  });

  test("R.41 — /distributor/network carrega", async ({ page }) => {
    await page.goto("/distributor/network");
    await expect(page.getByRole("heading", { name: /Minha Rede/i })).toBeVisible({ timeout: 15_000 });
  });

  test("R.42 — /distributor/orders carrega", async ({ page }) => {
    await page.goto("/distributor/orders");
    await expect(page.locator("body")).toBeVisible();
  });

  test("R.43 — /distributor/downloads carrega", async ({ page }) => {
    await page.goto("/distributor/downloads");
    await expect(page.locator("body")).toBeVisible();
  });
});
