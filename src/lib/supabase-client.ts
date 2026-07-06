/**
 * @deprecated Use src/lib/supabase/client.ts instead
 * This file is kept for backward compatibility and will be removed in a future update
 */

import { supabase, getFrontendClient, getBackendClient } from "./lib/supabase/client";

// Re-export for backward compatibility
export { supabase, getFrontendClient, getBackendClient };

export function getSupabaseClient() {
  return getFrontendClient();
}

export function getSupabaseAdminClient() {
  return getBackendClient();
}
