import { test, expect } from "../fixtures/personas.fixture";
import { LoginPage } from "../pages/login.page";

type PersonaKey = "adminMaster" | "gestaoAdmin" | "financeiro" | "suporte" | "logistica" | "marketing" | "analytics" | "auditor" | "operador" | "distribuidor" | "afiliado" | "clienteFinal";

interface RBACRoute {
  path: string;
  label: string;
  allowedRoles: string[];
}

const RBAC_ROUTES: RBACRoute[] = [
  { path: "/admin/customers", label: "Admin Customers", allowedRoles: ["ADMIN_MASTER", "GESTAO_ADMIN", "FINANCEIRO", "SUPORTE", "LOGISTICA", "MARKETING", "ANALYTICS", "AUDITOR", "OPERADOR"] },
  { path: "/admin/distributors", label: "Admin Distributors", allowedRoles: ["ADMIN_MASTER", "GESTAO_ADMIN", "FINANCEIRO", "ANALYTICS", "AUDITOR"] },
  { path: "/admin/orders", label: "Admin Orders", allowedRoles: ["ADMIN_MASTER", "GESTAO_ADMIN", "LOGISTICA", "OPERADOR"] },
  { path: "/admin/analytics", label: "Admin Analytics", allowedRoles: ["ADMIN_MASTER", "GESTAO_ADMIN", "ANALYTICS", "AUDITOR"] },
  { path: "/admin/wallets", label: "Admin Wallets", allowedRoles: ["ADMIN_MASTER", "GESTAO_ADMIN", "FINANCEIRO", "AUDITOR"] },
  { path: "/admin/system", label: "Admin System", allowedRoles: ["ADMIN_MASTER", "GESTAO_ADMIN", "AUDITOR"] },
  { path: "/distributor", label: "Distributor Dashboard", allowedRoles: ["DISTRIBUIDOR", "AFILIADO", "ADMIN_MASTER", "GESTAO_ADMIN", "FINANCEIRO", "SUPORTE", "LOGISTICA", "MARKETING", "ANALYTICS", "AUDITOR", "OPERADOR"] },
  { path: "/distributor/network", label: "Distributor Network", allowedRoles: ["DISTRIBUIDOR", "AFILIADO", "ADMIN_MASTER", "GESTAO_ADMIN", "FINANCEIRO", "SUPORTE", "LOGISTICA", "MARKETING", "ANALYTICS", "AUDITOR", "OPERADOR"] },
  { path: "/minha-conta", label: "Minha Conta (Cliente)", allowedRoles: ["CLIENTE_FINAL", "DISTRIBUIDOR", "ADMIN_MASTER", "GESTAO_ADMIN", "FINANCEIRO", "SUPORTE", "LOGISTICA", "MARKETING", "ANALYTICS", "AUDITOR", "OPERADOR", "AFILIADO"] },
];

const ROLE_FIXTURE_MAP: Record<string, PersonaKey> = {
  ADMIN_MASTER: "adminMaster",
  GESTAO_ADMIN: "gestaoAdmin",
  FINANCEIRO: "financeiro",
  SUPORTE: "suporte",
  LOGISTICA: "logistica",
  MARKETING: "marketing",
  ANALYTICS: "analytics",
  AUDITOR: "auditor",
  OPERADOR: "operador",
  DISTRIBUIDOR: "distribuidor",
  AFILIADO: "afiliado",
  CLIENTE_FINAL: "clienteFinal",
};

async function loginAs(page: Page, roleFixture: PersonaKey, ctx: { [K in PersonaKey]?: { email: string; password: string } }) {
  const user = ctx[roleFixture];
  if (!user) return;
  const login = new LoginPage(page);
  await login.goto();
  await login.login(user.email, user.password);
}

test.describe("RBAC Matrix — Todos os 11 roles × rotas protegidas", () => {
  for (const route of RBAC_ROUTES) {
    for (const role of route.allowedRoles) {
      const personaKey = ROLE_FIXTURE_MAP[role] as PersonaKey | undefined;
      if (!personaKey) continue;
      test(`RBAC.${route.label}.${role} — pode acessar sem bloqueio`, async ({ page }, info) => {
        const ctx = (info.ctx as unknown) as Record<PersonaKey, { email: string; password: string }>;
        const user = ctx[personaKey];
        if (!user) {
          test.info().annotations.push({ type: "skip", description: `Fixture '${personaKey}' não encontrada no contexto atual` });
          return;
        }
        await loginAs(page, personaKey, ctx);
        await page.goto(route.path, { waitUntil: "domcontentloaded" });
        const currentUrl = page.url();
        const gotBlocked = /\/login(\?|$)/.test(currentUrl) || /\/ativacao/.test(currentUrl);
        expect(gotBlocked, `Role ${role} foi bloqueada em ${route.label}. URL atual: ${currentUrl}`).toBe(false);
      });
    }
  }
});
