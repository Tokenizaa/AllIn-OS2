import { createClient } from "@supabase/supabase-js";
import { getServerConfig } from "../../../lib/config.server";

let supabaseClient: ReturnType<typeof createClient> | null = null;

export function getSupabaseClient() {
  if (!supabaseClient) {
    const config = getServerConfig();
    if (!config.supabaseUrl || !config.supabaseAnonKey) {
      throw new Error("Missing Supabase server configuration");
    }
    supabaseClient = createClient(
      config.supabaseUrl,
      config.supabaseServiceRoleKey || config.supabaseAnonKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );
  }
  return supabaseClient;
}

export function getSupabaseAdminClient() {
  const config = getServerConfig();
  if (!config.supabaseUrl || !config.supabaseServiceRoleKey) {
    throw new Error("Missing Supabase admin configuration");
  }
  return createClient(
    config.supabaseUrl,
    config.supabaseServiceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
