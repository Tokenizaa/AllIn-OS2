import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { e2eEnv } from "./env";

let adminClient: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (!adminClient) {
    adminClient = createClient(
      e2eEnv.E2E_SUPABASE_URL,
      e2eEnv.E2E_SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
          detectSessionInUrl: false,
        },
      }
    );
  }
  return adminClient;
}
