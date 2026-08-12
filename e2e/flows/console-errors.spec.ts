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

async function loginAs(page: Page, user: { email: string; password: string }) {
  const login = new LoginPage(page);
  await login.goto();
  await login.login(user.email, user.password);
  await expect(page).not.toHaveURL(/\/login(\?|$)/, { timeout: 15_000 });
}

test.describe("Console & Network — Monitoramento global de erros", () => {
  const routeErrors: Record<string, string[]> = {};

  test.beforeEach(async ({ page }) => {
    page.on("console", async (msg) => {
      if (msg.type() === "error") {
        const text = await msg.text();
        const url = page.url();
        const key = url;
        if (!routeErrors[key]) routeErrors[key] = [];
        routeErrors[key].push(`[console error] ${text}`);
      }
    });

    page.on("pageerror", (err) => {
      const url = page.url();
      if (!routeErrors[url]) routeErrors[url] = [];
      routeErrors[url].push(`[pageerror] ${err.message}`);
    });

    page.on("requestfailed", (req) => {
      const url = req.url();
      const routeKey = page.url();
      if (!routeErrors[routeKey]) routeErrors[routeKey] = [];
      const failure = req.failure();
      routeErrors[routeKey].push(`[requestfailed] ${url} - ${failure?.errorText ?? "unknown"}`);
    });
  });

  for (const route of MONITORED_ROUTES) {
    test(`CN.${route.label} — sem erros de console/network`, async ({ page, adminMaster, distribuidor }) => {
      let user = adminMaster;
      if (route.role === "distribuidor") user = distribuidor;
      if (route.role === "adminMaster") user = adminMaster;

      if (!route.auth) {
        await page.goto(route.path, { waitUntil: "networkidle" });
      } else if (user) {
        await loginAs(page, user);
        await page.goto(route.path, { waitUntil: "networkidle" });
      }

      const errors = routeErrors[page.url()] ?? [];
      expect(errors, `Erros encontrados em ${route.label} (${route.url()}):\n${errors.join("\n")}`).toEqual([]);
    });
  }
});
