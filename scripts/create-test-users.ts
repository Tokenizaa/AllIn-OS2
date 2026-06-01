/**
 * Cria ou atualiza usuarios de teste no Supabase Auth + profiles
 * Execute: npx tsx scripts/create-test-users.ts
 */

import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

config();

type TestLoginAccount = {
  email: string;
  password: string;
  role: string;
  name: string;
};

const DEFAULT_USERS: TestLoginAccount[] = [
  { email: "admin@allin.io", password: "admin123", role: "admin_master", name: "Administrador Master" },
  { email: "gestao@allin.io", password: "gestao123", role: "gestao_admin", name: "Gestao Admin" },
  { email: "financeiro@allin.io", password: "finance123", role: "financeiro", name: "Financeiro" },
  { email: "suporte@allin.io", password: "support123", role: "suporte", name: "Suporte" },
  { email: "logistica@allin.io", password: "logistica123", role: "logistica", name: "Logistica" },
  { email: "marketing@allin.io", password: "marketing123", role: "marketing", name: "Marketing" },
  { email: "analytics@allin.io", password: "analytics123", role: "analytics", name: "Analytics" },
  { email: "auditor@allin.io", password: "auditor123", role: "auditor", name: "Auditor" },
  { email: "operador@allin.io", password: "operador123", role: "operador", name: "Operador" },
  { email: "distributor@allin.io", password: "distributor123", role: "distribuidor", name: "Distribuidor Teste" },
  { email: "afiliado@allin.io", password: "affiliate123", role: "afiliado", name: "Afiliado Teste" },
  { email: "customer@allin.io", password: "client123", role: "cliente_final", name: "Cliente Teste" },
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
          "role" in item &&
          "name" in item,
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

async function upsertUsers() {
  console.log("Atualizando usuarios de teste...\n");
  const users = loadUsersFromEnv();

  const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) {
    throw listError;
  }

  for (const user of users) {
    const authUser = existingUsers.users.find((u) => u.email === user.email);

    if (!authUser) {
      const { data: created, error: createError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
        user_metadata: {
          role: user.role,
          name: user.name,
        },
      });

      if (createError || !created.user) {
        console.error(`Erro ao criar ${user.email}:`, createError?.message || "unknown error");
        continue;
      }

      await supabase
        .from("profiles")
        .update({
          email: user.email,
          name: user.name,
          role: user.role,
          status: "active",
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", created.user.id);

      console.log(`Criado: ${user.email}`);
      continue;
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        email: user.email,
        name: user.name,
        role: user.role,
        status: "active",
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", authUser.id);

    if (updateError) {
      console.error(`Erro ao atualizar profile de ${user.email}:`, updateError.message);
      continue;
    }

    console.log(`Atualizado: ${user.email}`);
  }

  console.log("\nProcesso concluido.");
}

upsertUsers().catch((error) => {
  console.error(error);
  process.exit(1);
});
