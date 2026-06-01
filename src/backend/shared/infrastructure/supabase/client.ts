import { supabase } from "../../../../lib/supabase-client";

export { supabase };

export function getSupabaseClient() {
  return supabase;
}

export function getSupabaseAdminClient() {
  return supabase;
}
