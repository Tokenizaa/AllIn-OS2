import { supabase } from "../../../../lib/supabase-client";

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
