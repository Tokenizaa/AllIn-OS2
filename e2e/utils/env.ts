import "dotenv/config";
import { z } from "zod";

const EnvSchema = z.object({
  E2E_SUPABASE_URL: z.string().url(),
  E2E_SUPABASE_ANON_KEY: z.string().min(20),
  E2E_SUPABASE_SERVICE_ROLE_KEY: z.string().min(20),
  E2E_PASSWORD_ADMIN: z.string().min(8),
  E2E_PASSWORD_FINANCEIRO: z.string().min(8),
  E2E_PASSWORD_DISTRIBUIDOR: z.string().min(8),
  E2E_PASSWORD_CLIENTE: z.string().min(8),
  E2E_PORT: z
    .string()
    .optional()
    .transform((v) => (v ? Number(v) : 5173)),
  E2E_BASE_SPONSOR_CODE: z.string().min(3).default("e2e_anchor_sponsor"),
});

const parseResult = EnvSchema.safeParse(process.env);
if (!parseResult.success) {
  const missing = parseResult.error.issues
    .map((i) => `- ${i.path.join(".")}: ${i.message}`)
    .join("\n");
  throw new Error(
    `[e2e/env] Variáveis inválidas:\n${missing}\n\nCopie .env.e2e.example para .env.e2e.`
  );
}

export const e2eEnv = parseResult.data;
