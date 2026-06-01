/**
 * Cria usuarios de teste e garante as senhas no Supabase Auth
 * Execute: npx tsx scripts/set-test-passwords.ts
 */

import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

config();

type TestLoginAccount = {
  email: string;
  password: string;
  role: string;
};

const DEFAULT_USERS: TestLoginAccount[] = [
  { email: "admin@allin.io", password: "admin123", role: "admin_master" },
  { email: "gestao@allin.io", password: "gestao123", role: "gestao_admin" },
  { email: "financeiro@allin.io", password: "finance123", role: "financeiro" },
  { email: "suporte@allin.io", password: "support123", role: "suporte" },
  { email: "logistica@allin.io", password: "logistica123", role: "logistica" },
  { email: "marketing@allin.io", password: "marketing123", role: "marketing" },
  { email: "analytics@allin.io", password: "analytics123", role: "analytics" },
  { email: "auditor@allin.io", password: "auditor123", role: "auditor" },
  { email: "operador@allin.io", password: "operador123", role: "operador" },
  { email: "distributor@allin.io", password: "distributor123", role: "distribuidor" },
  { email: "afiliado@allin.io", password: "affiliate123", role: "afiliado" },
  { email: "customer@allin.io", password: "client123", role: "cliente_final" },
];

function loadUsersFromEnv(): TestLoginAccount[] {
  const raw = process.env.TEST_LOGIN_ACCOUNTS_JSON;
  if (!raw) return DEFAULT_USERS;

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return DEFAULT_USERS;

    const validUsers = parsed.filter((item): item is TestLoginAccount => {
      return Boolean(
        item &&
          typeof item === "object" &&
          "email" in item &&
          "password" in item &&
          "role" in item,
      );
    });

    return validUsers.length > 0 ? validUsers : DEFAULT_USERS;
  } catch {
    return DEFAULT_USERS;
  }
}

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseServiceKey = process.env.EXTERNAL_SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing environment variables: VITE_SUPABASE_URL and EXTERNAL_SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function setPasswords() {
  console.log("Criando usuarios de teste no Supabase Auth...\n");
  const users = loadUsersFromEnv();

  for (const user of users) {
    const { error } = await supabase.auth.admin.createUser({
      email: user.email,
      password: user.password,
      email_confirm: true,
      user_metadata: {
        role: user.role,
      },
    });

    if (error) {
      console.error(`Erro ao criar usuario ${user.email}:`, error.message);
      continue;
    }

    console.log(`OK ${user.email}`);
  }
}

setPasswords().catch((error) => {
  console.error(error);
  process.exit(1);
});
