import { test as base } from "@playwright/test";
import { e2eEnv } from "../utils/env";
import { seedPersona } from "./personas";
import { getSupabaseAdmin } from "../utils/supabase-admin";
import type { CreatedPersona, PersonaRole } from "./types";

interface PersonasFixture {
  adminMaster: CreatedPersona;
  gestaoAdmin: CreatedPersona;
  financeiro: CreatedPersona;
  suporte: CreatedPersona;
  logistica: CreatedPersona;
  marketing: CreatedPersona;
  analytics: CreatedPersona;
  auditor: CreatedPersona;
  operador: CreatedPersona;
  distribuidor: CreatedPersona;
  afiliado: CreatedPersona;
  clienteFinal: CreatedPersona;
}

const PASSWORDS: Partial<Record<PersonaRole, string>> = {
  admin_master: e2eEnv.E2E_PASSWORD_ADMIN,
  gestao_admin: e2eEnv.E2E_PASSWORD_ADMIN,
  financeiro: e2eEnv.E2E_PASSWORD_FINANCEIRO,
  suporte: e2eEnv.E2E_PASSWORD_FINANCEIRO,
  logistica: e2eEnv.E2E_PASSWORD_FINANCEIRO,
  marketing: e2eEnv.E2E_PASSWORD_FINANCEIRO,
  analytics: e2eEnv.E2E_PASSWORD_FINANCEIRO,
  auditor: e2eEnv.E2E_PASSWORD_FINANCEIRO,
  operador: e2eEnv.E2E_PASSWORD_FINANCEIRO,
  distribuidor: e2eEnv.E2E_PASSWORD_DISTRIBUIDOR,
  afiliado: e2eEnv.E2E_PASSWORD_DISTRIBUIDOR,
  cliente_final: e2eEnv.E2E_PASSWORD_CLIENTE,
};

const ROLE_LABELS: Partial<Record<PersonaRole, string>> = {
  admin_master: "E2E Admin Master",
  gestao_admin: "E2E Gestão Admin",
  financeiro: "E2E Financeiro",
  suporte: "E2E Suporte",
  logistica: "E2E Logística",
  marketing: "E2E Marketing",
  analytics: "E2E Analytics",
  auditor: "E2E Auditor",
  operador: "E2E Operador",
  distribuidor: "E2E Distribuidor",
  afiliado: "E2E Afiliado",
  cliente_final: "E2E Cliente Final",
};

function resolveConfig(role: PersonaRole) {
  return {
    password: PASSWORDS[role] ?? "e2E_Pass!2026",
    name: ROLE_LABELS[role] ?? `E2E ${role}`,
  };
}

async function seedRole(role: PersonaRole) {
  const admin = getSupabaseAdmin();
  const { password, name } = resolveConfig(role);

  const email = `e2e-${role.replace("_", "")}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}@e2e.test.local`;

  const seed = {
    email,
    password,
    role,
    name,
    status: "active" as const,
  };

  return seedPersona(seed);
}

export const test = base.extend<PersonasFixture>({
  adminMaster: async ({}, use) => {
    const seeded = await seedRole("admin_master");
    await use(seeded.persona);
    void seeded.cleanup().catch(() => {});
  },
  gestaoAdmin: async ({}, use) => {
    const seeded = await seedRole("gestao_admin");
    await use(seeded.persona);
    void seeded.cleanup().catch(() => {});
  },
  financeiro: async ({}, use) => {
    const seeded = await seedRole("financeiro");
    await use(seeded.persona);
    void seeded.cleanup().catch(() => {});
  },
  suporte: async ({}, use) => {
    const seeded = await seedRole("suporte");
    await use(seeded.persona);
    void seeded.cleanup().catch(() => {});
  },
  logistica: async ({}, use) => {
    const seeded = await seedRole("logistica");
    await use(seeded.persona);
    void seeded.cleanup().catch(() => {});
  },
  marketing: async ({}, use) => {
    const seeded = await seedRole("marketing");
    await use(seeded.persona);
    void seeded.cleanup().catch(() => {});
  },
  analytics: async ({}, use) => {
    const seeded = await seedRole("analytics");
    await use(seeded.persona);
    void seeded.cleanup().catch(() => {});
  },
  auditor: async ({}, use) => {
    const seeded = await seedRole("auditor");
    await use(seeded.persona);
    void seeded.cleanup().catch(() => {});
  },
  operador: async ({}, use) => {
    const seeded = await seedRole("operador");
    await use(seeded.persona);
    void seeded.cleanup().catch(() => {});
  },
  distribuidor: async ({}, use) => {
    const seeded = await seedRole("distribuidor");
    await use(seeded.persona);
    void seeded.cleanup().catch(() => {});
  },
  afiliado: async ({}, use) => {
    const seeded = await seedRole("afiliado");
    await use(seeded.persona);
    void seeded.cleanup().catch(() => {});
  },
  clienteFinal: async ({}, use) => {
    const seeded = await seedRole("cliente_final");
    await use(seeded.persona);
    void seeded.cleanup().catch(() => {});
  },
});

export { expect } from "@playwright/test";
