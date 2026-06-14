/**
 * Supabase Client for Backend Repository
 * 
 * This module provides a Supabase client for backend repository operations.
 * Uses environment variables for configuration.
 */

import { createClient, SupabaseClient } from "@supabase/supabase-js";

let backendClient: SupabaseClient | null = null;

export function getBackendClient(): SupabaseClient {
  if (!backendClient) {
    // Check if running in browser environment
    if (typeof window !== "undefined") {
      throw new Error(
        "SECURITY VIOLATION: getBackendClient should not be called from browser code. " +
        "Backend operations must be performed server-side."
      );
    }

    const supabaseUrl = typeof process !== 'undefined' ? process.env.SUPABASE_URL : undefined;
    const supabaseAnonKey = typeof process !== 'undefined' ? process.env.SUPABASE_ANON_KEY : undefined;

    // Fallback values for development (should be removed in production)
    const finalUrl = supabaseUrl || "https://imeadfnlgzphumuawdyt.supabase.co";
    const finalKey = supabaseAnonKey || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImltZWFkZm5sZ3pwaHVtdWF3ZHl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExOTgyOTAsImV4cCI6MjA5Njc3NDI5MH0.SGPJajfqa3B3x9KDalSaux1RLDSoxdoF0LCmqLVfZMY";

    if (!finalUrl || !finalKey) {
      throw new Error(
        "Missing required Supabase environment variables: SUPABASE_URL and SUPABASE_ANON_KEY"
      );
    }

    backendClient = createClient(finalUrl, finalKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  return backendClient;
}

// Export singleton for convenience - initialize lazily
let supabaseInstance: SupabaseClient | null = null;

export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    if (!supabaseInstance) {
      supabaseInstance = getBackendClient();
    }
    return supabaseInstance[prop as keyof SupabaseClient];
  },
});
