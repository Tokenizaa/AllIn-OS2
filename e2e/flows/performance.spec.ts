import { test, expect } from "../fixtures/personas.fixture";
import { LoginPage } from "../pages/login.page";

const MONITORED_ROUTES = [
  { path: "/", label: "Home", auth: false },
  { path: "/login", label: "Login", auth: false },
  { path: "/cadastro", label: "Cadastro", auth: false },
  { path: "/loja", label: "Loja", auth: false },
  { path: "/busca-produtos", label: "Busca Produtos", auth: false },
  { path: "/doencas", label: "Doencas", auth: false },
  { path: "/seja-distribuidor", label: "Seja Distribuidor", auth: false },
  { path: "/admin/customers", label: "Admin Customers", role: "adminMaster" },
  { path: "/admin/distributors", label: "Admin Distributors", role: "adminMaster" },
  { path: "/admin/plans", label: "Admin Plans", role: "adminMaster" },
  { path: "/admin/orders", label: "Admin Orders", role: "adminMaster" },
  { path: "/admin/analytics", label: "Admin Analytics", role: "adminMaster" },
  { path: "/distributor", label: "Distributor Dashboard", role: "distribuidor" },
  { path: "/distributor/network", label: "Distributor Network", role: "distribuidor" },
  { path: "/distributor/finance", label: "Distributor Finance", role: "distribuidor" },
  { path: "/distributor/orders", label: "Distributor Orders", role: "distribuidor" },
];

const PERFORMANCE_BUDGET_MS = 8000;
const FAILED_ROUTES: string[] = [];
const SLOW_ROUTES: Array<{ route: string; ms: number }> = [];
const ALL_TIMINGS: Array<{ route: string; ms: number }> = [];

async function loginAs(page: Page, user: { email: string; password: string }) {
  const login = new LoginPage(page);
  await login.goto();
  await login.login(user.email, user.password);
  await expect(page).not.toHaveURL(/\/login(\?|$)/, { timeout: 15_000 });
}

test.describe("Performance — Medição de carga por rota", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.__perfMark = performance.mark("e2e-start");
      window.__e2eNetworkErrors = [];
      window.__e2eErrors = [];
    });
  });

  for (const route of MONITORED_ROUTES) {
    test(`PERF.${route.label} — carga dentro do budget de ${PERFORMANCE_BUDGET_MS}ms`, async ({ page, adminMaster, distribuidor }) => {
      const start = Date.now();
      if (!route.auth) {
        await page.goto(route.path, { waitUntil: "domcontentloaded" });
      } else {
        const user = route.role === "adminMaster" ? adminMaster : distribuidor;
        await loginAs(page, user);
        await page.goto(route.path, { waitUntil: "domcontentloaded" });
      }
      const ms = Date.now() - start;
      ALL_TIMINGS.push({ route: route.label, ms });
      if (ms > PERFORMANCE_BUDGET_MS) {
        SLOW_ROUTES.push({ route: route.label, ms });
        FAILED_ROUTES.push(`${route.label}: ${ms}ms`);
      }
      expect(ms, `${route.label} demorou ${ms}ms (budget: ${PERFORMANCE_BUDGET_MS}ms)`).toBeLessThan(PERFORMANCE_BUDGET_MS);
    });
  }
});

test.afterAll(async () => {
  console.log("\n=== Performance Report ===");
  const times = ALL_TIMINGS.map(t => t.ms);
  const average = times.reduce((a, b) => a + b, 0) / times.length;
  const sorted = [...times].sort((a, b) => a - b);
  const median = sorted.length % 2 === 0 ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2 : sorted[Math.floor(sorted.length / 2)];
  console.log(`Total rotas testadas: ${ALL_TIMINGS.length}`);
  console.log(`Média: ${average.toFixed(0)}ms`);
  console.log(`Mediana: ${median}ms`);
  console.log(`Rotas lentas (>${PERFORMANCE_BUDGET_MS}ms): ${SLOW_ROUTES.length}`);
  if (SLOW_ROUTES.length) {
    console.table(SLOW_ROUTES);
  }
  console.log("\n=== All Timings ===");
  console.table(ALL_TIMINGS);
  console.log("\n=== Failed (< budget) ===");
  console.log(FAILED_ROUTES.join("\n") || "nenhuma");
});
