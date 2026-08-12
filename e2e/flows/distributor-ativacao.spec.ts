import { test, expect } from "../fixtures/personas.fixture";
import { LoginPage } from "../pages/login.page";
import { DistributorAtivacaoPage } from "../pages/distributor-ativacao.page";
import { getSupabaseAdmin } from "../utils/supabase-admin";

async function seedPendingDistributor() {
  const admin = getSupabaseAdmin();
  const { e2eEnv } = await import("../utils/env");
  const { newTestEmail } = await import("../fixtures/personas");

  const email = newTestEmail("penddist");

  const { data: authData, error: authErr } = await admin.auth.admin.createUser({
    email,
    password: e2eEnv.E2E_PASSWORD_DISTRIBUIDOR,
    email_confirm: true,
    user_metadata: { name: "E2E Pending Distributor", role: "distribuidor" },
  });

  if (authErr || !authData?.user) throw new Error(`[ativacao] auth: ${authErr?.message}`);

  const { data: custData, error: custErr } = await admin
    .schema("crm")
    .from("customers")
    .insert({ auth_user_id: authData.user.id, nome: "E2E Pending Distributor", email, tipo_cliente: "distribuidor", status: "pending" })
    .select("id")
    .single();

  if (custErr || !custData?.id) { await admin.auth.admin.deleteUser(authData.user.id); throw new Error(`[ativacao] crm: ${custErr?.message}`); }

  const persona = { email, password: e2eEnv.E2E_PASSWORD_DISTRIBUIDOR, role: "distribuidor" as const, authUserId: authData.user!.id, customerId: custData!.id };

  return {
    ...persona,
    cleanup: async () => {
      await admin.schema("crm").from("customers").delete().eq("id", custData.id);
      await admin.auth.admin.deleteUser(authData.user.id);
    },
  };
}

test.describe("Distributor — Ativação de Escritório (/ativacao)", () => {
  let pendingDist: Awaited<ReturnType<typeof seedPendingDistributor>>;

  test.beforeAll(async () => { pendingDist = await seedPendingDistributor(); });
  test.afterAll(async () => { await pendingDist.cleanup(); });

  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login(pendingDist.email, pendingDist.password);
  });

  test("A1 — distribuidor pending redireciona para /ativacao", async ({ page }) => {
    await expect(page).toHaveURL(/\/ativacao/, { timeout: 15_000 });
  });

  test("A2 — página carrega heading e grid de planos visível", async ({ page }) => {
    const ativacao = new DistributorAtivacaoPage(page);
    await ativacao.waitForPlansLoaded();
    await expect(page.getByRole("heading", { name: /Ativação de Escritório Digital/i })).toBeVisible({ timeout: 10_000 });
  });

  test("A3 — seleciona o primeiro plano disponível e abre checkout", async ({ page }) => {
    const ativacao = new DistributorAtivacaoPage(page);
    await ativacao.waitForPlansLoaded();
    await ativacao.selectFirstPlan();
    await ativacao.goToCheckout();
    await expect(page.getByText(/Método de Pagamento/i)).toBeVisible({ timeout: 10_000 });
  });

  test("A4 — seleciona pagamento PIX e exibe código copia-e-cola", async ({ page }) => {
    const ativacao = new DistributorAtivacaoPage(page);
    await ativacao.waitForPlansLoaded();
    await ativacao.selectFirstPlan();
    await ativacao.goToCheckout();
    await ativacao.selectPaymentMethod("pix");
    await expect(page.getByText(/PIX|Copia e Cola/i).first()).toBeVisible({ timeout: 5_000 });
  });

  test("A5 — seleciona pagamento Cartão exibe formulário", async ({ page }) => {
    const ativacao = new DistributorAtivacaoPage(page);
    await ativacao.waitForPlansLoaded();
    await ativacao.selectFirstPlan();
    await ativacao.goToCheckout();
    await ativacao.selectPaymentMethod("card");
    await expect(page.getByLabel("Número do cartão")).toBeVisible({ timeout: 5_000 });
  });

  test("A6 — cupom inválido retorna toast de erro", async ({ page }) => {
    const ativacao = new DistributorAtivacaoPage(page);
    await ativacao.waitForPlansLoaded();
    await ativacao.applyCoupon("INVALIDO");
    await expect(page.locator("[data-type='error']")).toBeVisible({ timeout: 5_000 });
  });

  test("A7 — simula pagamento PIX e ativa o distribuidor (redirect para /distributor)", async ({ page }) => {
    const ativacao = new DistributorAtivacaoPage(page);
    await ativacao.waitForPlansLoaded();
    await ativacao.selectFirstPlan();
    await ativacao.goToCheckout();
    await ativacao.selectPaymentMethod("pix");
    await ativacao.confirmPayment();

    await expect(page.getByText(/Processando/i)).toBeVisible({ timeout: 5_000 }).catch(() => {});
    await ativacao.waitForSuccess();
    await expect(page).toHaveURL(/\/distributor/, { timeout: 15_000 });
  });
});
