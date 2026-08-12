import { test, expect } from "../fixtures/personas.fixture";
import { LoginPage } from "../pages/login.page";
import { RouteGuardPage } from "../pages/route-guard.page";
import { DashboardResolver } from "../../src/modules/auth/services/dashboardResolver.service";
import type { UserRole } from "../../src/shared/types/roles";

function dashboardRegex(role: UserRole): RegExp {
  const path = DashboardResolver.getDashboardPath(role);
  return new RegExp(path.replace(/\//g, "\\/"));
}

test.describe("P0.1 — Login válido roteia ao dashboard correto", () => {
  test("admin_master → DashboardResolver.getDashboardPath", async ({ page, adminMaster }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login(adminMaster.email, adminMaster.password);
    await expect(page).toHaveURL(dashboardRegex("admin_master"), { timeout: 15_000 });
  });

  test("financeiro → DashboardResolver.getDashboardPath", async ({ page, financeiro }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login(financeiro.email, financeiro.password);
    await expect(page).toHaveURL(dashboardRegex("financeiro"), { timeout: 15_000 });
  });

  test("distribuidor → /distributor/network (ou /ativacao se pending)", async ({
    page,
    distribuidor,
  }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login(distribuidor.email, distribuidor.password);
    await expect(page).toHaveURL(/\/(distributor\/network|ativacao)/, {
      timeout: 15_000,
    });
  });

  test("cliente_final → /minha-conta", async ({ page, clienteFinal }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login(clienteFinal.email, clienteFinal.password);
    await expect(page).toHaveURL(dashboardRegex("cliente_final"), { timeout: 15_000 });
  });
});

test.describe("P0.2 — Login inválido", () => {
  test("credenciais inválidas: toast de erro e mantém em /login", async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.fill("inexistente+e2e@test.local", "wrong-password-123");
    await login.submit();
    await expect(page).toHaveURL(/\/login(\?|$)/, { timeout: 15_000 });
    await expect(login.errorToast).toBeVisible({ timeout: 10_000 });
  });
});

test.describe("P0.3 — RouteGuard: usuário anônimo", () => {
  test("/admin/customers sem login redireciona para /login", async ({ page }) => {
    const route = new RouteGuardPage(page);
    await page.goto("/admin/customers");
    await expect(page).toHaveURL(/\/login(\?|$)/, { timeout: 15_000 });
    await route.expectAtLogin();
  });
});

test.describe("P0.4 — RouteGuard: role mismatch", () => {
  test("DISTRIBUIDOR em /admin é redirecionado para /distributor/*", async ({
    page,
    distribuidor,
  }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login(distribuidor.email, distribuidor.password);
    await expect(page).not.toHaveURL(/\/login(\?|$)/, { timeout: 15_000 });

    await page.goto("/admin");
    await expect(page).not.toHaveURL(/\/admin/, { timeout: 15_000 });
    await expect(page).toHaveURL(/\/distributor\/network|\/ativacao/, {
      timeout: 15_000,
    });
  });
});
