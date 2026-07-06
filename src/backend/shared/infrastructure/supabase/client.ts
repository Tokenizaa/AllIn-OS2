import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Backend-only Supabase client using SERVICE_ROLE_KEY
// This bypasses RLS and has full admin access
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    "Missing required backend Supabase environment variables: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY"
  );
}

const supabase: SupabaseClient = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export { supabase };

export function getSupabaseClient() {
  return supabase;
}

export function getSupabaseAdminClient() {
  // Admin client should NOT be used in frontend code
  // This function is kept for compatibility but should not be called
  throw new Error(
    "SECURITY VIOLATION: getSupabaseAdminClient should not be called from frontend code. " +
    "Admin operations must be performed server-side with proper service role credentials."
  );
}
