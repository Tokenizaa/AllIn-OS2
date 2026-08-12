import { randomBytes } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import { e2eEnv } from "../utils/env";
import { getSupabaseAdmin } from "../utils/supabase-admin";
import type { CreatedPersona, PersonaSeed } from "./types";

const DOMAIN = `e2e-${randomBytes(3).toString("hex")}.test.local`;

export function newTestEmail(prefix: string): string {
  return `e2e-${prefix}-${Date.now()}-${randomBytes(2).toString("hex")}@${DOMAIN}`;
}

export async function seedPersona(
  seed: PersonaSeed
): Promise<{ persona: CreatedPersona; cleanup: () => Promise<void> }> {
  const admin = getSupabaseAdmin();
  const { data, error } = await createAuthAndProfile(admin, seed);

  if (error || !data?.user || !data?.customer) {
    throw new Error(
      `[personas] Falha ao criar ${seed.email}: ${error?.message ?? "dados incompletos"}`
    );
  }

  const persona: CreatedPersona = {
    email: seed.email,
    password: seed.password,
    role: seed.role,
    authUserId: data.user.id,
    customerId: data.customer.id,
  };

  return {
    persona,
    cleanup: async () => {
      await admin.schema("crm").from("customers").delete().eq("id", data.customer.id);
      await admin.auth.admin.deleteUser(data.user.id);
    },
  };
}

interface CreateResult {
  data: { user: { id: string }; customer: { id: string } } | null;
  error: { message: string } | null;
}

async function createAuthAndProfile(
  admin: SupabaseClient,
  seed: PersonaSeed
): Promise<CreateResult> {
  const { data: authData, error: authError } = await admin.auth.admin.createUser({
    email: seed.email,
    password: seed.password,
    email_confirm: true,
    user_metadata: { name: seed.name, role: seed.role },
  });

  if (authError || !authData.user) {
    return { data: null, error: { message: authError?.message ?? "createUser falhou" } };
  }

  const { data: customerData, error: customerError } = await admin
    .schema("crm")
    .from("customers")
    .insert({
      auth_user_id: authData.user.id,
      nome: seed.name,
      email: seed.email,
      tipo_cliente: seed.role,
      status: seed.status,
    })
    .select("id")
    .single();

  if (customerError) {
    await admin.auth.admin.deleteUser(authData.user.id);
    return { data: null, error: { message: customerError.message } };
  }

  return {
    data: { user: { id: authData.user.id }, customer: customerData },
    error: null,
  };
}
