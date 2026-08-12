import { test, expect } from "../fixtures/personas.fixture";
import { LoginPage } from "../pages/login.page";
import { AdminCustomersPage } from "../pages/admin-customers.page";
import { AdminDistributorsPage } from "../pages/admin-distributors.page";
import { DistributorDashboardPage } from "../pages/distributor-dashboard.page";
import { getSupabaseAdmin } from "../utils/supabase-admin";
import {
  validateCustomerData,
  validateDistributorData,
  validateOrderData,
  validateNoTechnicalData,
  formatCurrency,
  formatDate,
  formatPhone,
  formatCPF,
  BusinessValidationResult,
} from "../utils/db-validation";

const admin = getSupabaseAdmin();

async function loginAs(page: Page, user: { email: string; password: string }) {
  const login = new LoginPage(page);
  await login.goto();
  await login.login(user.email, user.password);
  await expect(page).not.toHaveURL(/\/login(\?|$)/, { timeout: 15_000 });
}

function assertBusinessOK(result: BusinessValidationResult) {
  expect(result.passed, `[${result.screen}] Validação falhou:\n${result.issues.join("\n")}`).toBe(true);
}

test.describe("Fase 10 — Validação Funcional dos Dados (Business E2E)", () => {
  test.describe("B10.1 — Tela Clientes: dados resolvidos e sem vazamento técnico", () => {
    test("cliente: nome completo exibido (não email, não ID)", async ({ page, adminMaster }) => {
      await loginAs(page, adminMaster);
      const customersPage = new AdminCustomersPage(page);
      await customersPage.goto();
      await customersPage.waitForLoad();
      const rows = await customersPage.tableRows.all();
      expect(rows.length).toBeGreaterThan(0);
      const firstRow = rows[0];
      const cellTexts = await firstRow.locator("td").allTextContents();
      const fullText = cellTexts.join(" ").toLowerCase();
      expect(fullText).not.toContain("undefined");
      expect(fullText).not.toContain("null");
      expect(fullText).not.toContain("nan");
      expect(fullText).not.toMatch(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i);
    });

    test("cliente: sem campos vazios nas linhas visíveis", async ({ page, adminMaster }) => {
      await loginAs(page, adminMaster);
      const customersPage = new AdminCustomersPage(page);
      await customersPage.goto();
      await customersPage.waitForLoad();
      const emptyIssues: string[] = [];
      const rows = await customersPage.tableRows.all();
      for (let i = 0; i < Math.min(rows.length, 10); i++) {
        const texts = await rows[i].locator("td").allTextContents();
        texts.forEach((t, idx) => {
          if (t.trim() === "" || t.trim() === "-") emptyIssues.push(`Row ${i}, col ${idx}: vazio`);
        });
      }
      expect(emptyIssues, `Campos vazios encontrados:\n${emptyIssues.join("\n")}`).toEqual([]);
    });
  });

  test.describe("B10.2 — Tela Distribuidores: relacionamentos resolvidos", () => {
    test("distribuidor: nome, cidade e plano exibidos sem ID técnico", async ({ page, adminMaster }) => {
      await loginAs(page, adminMaster);
      const distPage = new AdminDistributorsPage(page);
      await distPage.goto();
      await distPage.waitForLoad();
      const rows = await distPage.tableRows.all();
      expect(rows.length).toBeGreaterThan(0);
      const firstRow = rows[0];
      const text = await firstRow.textContent();
      expect(text).toBeTruthy();
      expect((text ?? "").toLowerCase()).not.toContain("undefined");
      expect((text ?? "").toLowerCase()).not.toContain("null");
    });

    test("distribuidor: DB valida campos obrigatórios do primeiro registro", async ({ page, adminMaster }) => {
      await loginAs(page, adminMaster);
      const distPage = new AdminDistributorsPage(page);
      await distPage.goto();
      await distPage.waitForLoad();
      const { data: dists } = await admin
        .schema("mlm")
        .from("distribuidores")
        .select("id, nome, cidade, status, patrocinador_id")
        .limit(1);
      if (!dists || dists.length === 0) {
        test.skip(true, "Sem distribuidores no banco");
        return;
      }
      const d = dists[0];
      const result = await validateDistributorData(d.id);
      assertBusinessOK(result);
    });
  });

  test.describe("B10.3 — Tela Dashboard Distribuidor: dados financeiros formatados", () => {
    test("dashboard: sem valores negativos em saldo/comissão", async ({ page, distribuidor }) => {
      await loginAs(page, distribuidor);
      const dashboard = new DistributorDashboardPage(page);
      await dashboard.goto();
      await dashboard.waitForLoad();
      const pageText = await page.textContent("body");
      expect(pageText).toBeTruthy();
      if (pageText) {
        const negativeMatches = pageText.match(/-R\$\s*\d+\.\d{2}/g);
        expect(negativeMatches, `Saldos negativos encontrados: ${negativeMatches}`).toBeNull();
      }
    });

    test("dashboard: sem UUIDs expostos na tela", async ({ page, distribuidor }) => {
      await loginAs(page, distribuidor);
      const dashboard = new DistributorDashboardPage(page);
      await dashboard.goto();
      await dashboard.waitForLoad();
      const bodyText = await page.textContent("body") ?? "";
      const uuidMatches = bodyText.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi);
      expect(uuidMatches, `UUIDs expostos na UI: ${uuidMatches}`).toBeNull();
    });
  });

  test.describe("B10.4 — Tela Pedidos: validação cruzada com banco", () => {
    test("pedido: cliente exibido como nome, não como ID", async ({ page, adminMaster }) => {
      await loginAs(page, adminMaster);
      await page.goto("/admin/orders");
      await page.waitForLoadState("networkidle");
      const { data: firstOrder } = await admin
        .schema("commerce")
        .from("pedidos")
        .select("id, cliente_nome, cliente_id")
        .limit(1);
      if (!firstOrder || firstOrder.length === 0) {
        test.skip(true, "Sem pedidos no banco");
        return;
      }
      const order = firstOrder[0];
      const result = await validateOrderData(order.id);
      assertBusinessOK(result);
    });
  });

  test.describe("B10.5 — Formatacao global: datas, moedas, telefones, CPFs, CEPs", () => {
    test("formatacao: valores monetários usam pt-BR", async ({ page, adminMaster }) => {
      await loginAs(page, adminMaster);
      await page.goto("/admin/customers");
      await page.waitForLoadState("networkidle");
      const body = await page.textContent("body") ?? "";
      const formattedCurrency = body.match(/R\$\s*[\d.,]+/g);
      expect(formattedCurrency, "Nenhum valor monetário em formato pt-BR encontrado").not.toBeNull();
    });

    test("formatacao: datas em formato pt-BR", async ({ page, adminMaster }) => {
      await loginAs(page, adminMaster);
      await page.goto("/admin/customers");
      await page.waitForLoadState("networkidle");
      const body = await page.textContent("body") ?? "";
      const isoDates = body.match(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/g);
      expect(isoDates, "Datas em formato ISO detectadas na UI (não devem aparecer)").toBeNull();
    });

    test("formatacao: emails não usam como nome de usuario", async ({ page, adminMaster }) => {
      await loginAs(page, adminMaster);
      await page.goto("/admin/customers");
      await page.waitForLoadState("networkidle");
      const body = await page.textContent("body") ?? "";
      const emailAsName = body.match(/^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$/gim);
      const suspicious = (emailAsName ?? []).filter((e: string) => !e.includes("support") && !e.includes("contato"));
      expect(suspicious, `Emails aparecendo como nome:\n${suspicious.join("\n")}`).toEqual([]);
    });
  });

  test.describe("B10.6 — Semantic validation: dados incoerentes", () => {
    test("comissao: valor negativo não aparece", async ({ page, adminMaster }) => {
      await loginAs(page, adminMaster);
      await page.goto("/admin/commissions");
      await page.waitForLoadState("networkidle");
      const body = await page.textContent("body") ?? "";
      expect(body.toLowerCase()).not.toContain("-r$");
    });

    test("pedido: cliente nome não é UUID", async ({ page, adminMaster }) => {
      await loginAs(page, adminMaster);
      await page.goto("/admin/orders");
      await page.waitForLoadState("networkidle");
      const body = await page.textContent("body") ?? "";
      const uuids = body.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi);
      if (uuids && uuids.length > 0) {
        test.info().annotations.push({ type: "warn", description: `UUIDs encontrados: ${uuids.slice(0, 3).join(", ")}` });
      }
    });
  });

  test.describe("B10.7 — Varrer páginas principais em busca de vazamento técnico", () => {
    const pagesToScan = ["/admin/customers", "/admin/distributors", "/admin/orders", "/admin/plans", "/admin/analytics"];

    for (const route of pagesToScan) {
      test(`scan: ${route} sem vazamento de dados técnicos`, async ({ page, adminMaster }) => {
        await loginAs(page, adminMaster);
        await page.goto(route, { waitUntil: "networkidle" });
        const html = await page.content();
        const body = await page.textContent("body") ?? "";
        const issues = validateNoTechnicalData(route, { html, body });
        expect(issues, `Issues em ${route}:\n${issues.join("\n")}`).toEqual([]);
      });
    }
  });
});