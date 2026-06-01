import { UserRole } from "@/shared/types/roles";
import { getDemoRedirectPath } from "./navigation";

export type TestLoginAccount = {
  role: UserRole;
  email: string;
  password: string;
  label: string;
};

const DEFAULT_TEST_LOGIN_ACCOUNTS: TestLoginAccount[] = [
  { role: UserRole.ADMIN_MASTER, email: "admin@allin.io", password: "admin123", label: "Admin Master" },
  { role: UserRole.GESTAO_ADMIN, email: "gestao@allin.io", password: "gestao123", label: "Gestao Admin" },
  { role: UserRole.FINANCEIRO, email: "financeiro@allin.io", password: "finance123", label: "Financeiro" },
  { role: UserRole.SUPORTE, email: "suporte@allin.io", password: "support123", label: "Suporte" },
  { role: UserRole.LOGISTICA, email: "logistica@allin.io", password: "logistica123", label: "Logistica" },
  { role: UserRole.MARKETING, email: "marketing@allin.io", password: "marketing123", label: "Marketing" },
  { role: UserRole.ANALYTICS, email: "analytics@allin.io", password: "analytics123", label: "Analytics" },
  { role: UserRole.AUDITOR, email: "auditor@allin.io", password: "auditor123", label: "Auditor" },
  { role: UserRole.OPERADOR, email: "operador@allin.io", password: "operador123", label: "Operador" },
  { role: UserRole.DISTRIBUIDOR, email: "distributor@allin.io", password: "distributor123", label: "Distribuidor" },
  { role: UserRole.AFILIADO, email: "afiliado@allin.io", password: "affiliate123", label: "Afiliado" },
  { role: UserRole.CLIENTE_FINAL, email: "customer@allin.io", password: "client123", label: "Cliente" },
];

function normalizeAccounts(raw: unknown): TestLoginAccount[] {
  if (!Array.isArray(raw)) return DEFAULT_TEST_LOGIN_ACCOUNTS;

  const accounts = raw.filter((item): item is TestLoginAccount => {
    return Boolean(
      item &&
        typeof item === "object" &&
        "role" in item &&
        "email" in item &&
        "password" in item &&
        "label" in item,
    );
  });

  return accounts.length > 0 ? accounts : DEFAULT_TEST_LOGIN_ACCOUNTS;
}

export function getTestLoginAccounts(): Array<TestLoginAccount & { destination: string }> {
  const rawValue = import.meta.env.VITE_TEST_LOGIN_ACCOUNTS_JSON;

  if (!rawValue) {
    return DEFAULT_TEST_LOGIN_ACCOUNTS.map((account) => ({
      ...account,
      destination: getDemoRedirectPath(account.role),
    }));
  }

  try {
    const parsed = JSON.parse(rawValue) as unknown;
    return normalizeAccounts(parsed).map((account) => ({
      ...account,
      destination: getDemoRedirectPath(account.role),
    }));
  } catch {
    return DEFAULT_TEST_LOGIN_ACCOUNTS.map((account) => ({
      ...account,
      destination: getDemoRedirectPath(account.role),
    }));
  }
}
