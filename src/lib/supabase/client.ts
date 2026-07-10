import { createClient, SupabaseClient } from "@supabase/supabase-js";

let frontendClient: SupabaseClient | null = null;

function readEnv(name: string): string | undefined {
  const viteValue = import.meta.env?.[name];
  const processValue =
    typeof process !== "undefined"
      ? process.env[name as keyof NodeJS.ProcessEnv]
      : undefined;

  return viteValue || processValue;
}

export function getFrontendClient(): SupabaseClient {
  if (!frontendClient) {
    const supabaseUrl = readEnv("VITE_SUPABASE_URL");
    const supabaseAnonKey = readEnv("VITE_SUPABASE_ANON_KEY");

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error(
        "Missing required Supabase environment variables: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY"
      );
    }

    frontendClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    });
  }

  return frontendClient;
}

export const supabase = getFrontendClient();
