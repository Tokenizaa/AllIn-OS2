import { createClient } from "@supabase/supabase-js";
import { getServerConfig } from "../../../lib/config.server";

let supabaseClient: ReturnType<typeof createClient> | null = null;

const placeholderUrl = "https://placeholder-project.supabase.co";
const placeholderKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Nzg0MDU3MDIsImV4cCI6MTk5NDM4MTcwMn0.placeholder-signature";

export function getSupabaseClient() {
  if (!supabaseClient) {
    const config = getServerConfig();
    const hasConfig = config.supabaseUrl && config.supabaseAnonKey;
    
    if (!hasConfig) {
      console.warn(
        "⚠️ SERVER WARNING: Missing Supabase server configuration. Lazily using placeholder Supabase client."
      );
    }

    supabaseClient = createClient(
      config.supabaseUrl || placeholderUrl,
      config.supabaseServiceRoleKey || config.supabaseAnonKey || placeholderKey,
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
  const hasConfig = config.supabaseUrl && (config.supabaseServiceRoleKey || config.supabaseAnonKey);

  if (!hasConfig) {
    console.warn(
      "⚠️ SERVER WARNING: Missing Supabase admin configuration. Lazily using placeholder admin Supabase client."
    );
  }

  return createClient(
    config.supabaseUrl || placeholderUrl,
    config.supabaseServiceRoleKey || config.supabaseAnonKey || placeholderKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
