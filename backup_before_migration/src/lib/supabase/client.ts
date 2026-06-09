/**
 * Centralized Supabase Client Configuration
 * 
 * This module provides a single source of truth for Supabase client initialization.
 * Frontend uses ANON_KEY (public), backend uses SERVICE_ROLE_KEY (admin).
 */

import { createClient, SupabaseClient } from "@supabase/supabase-js";

// ============================================================================
// FRONTEND CLIENT (Browser-accessible)
// ============================================================================

/**
 * Frontend Supabase client using ANON_KEY
 * This client has limited permissions based on RLS policies
 * Safe to use in browser code
 */
let frontendClient: SupabaseClient | null = null;

export function getFrontendClient(): SupabaseClient {
  if (!frontendClient) {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

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
      global: {
        headers: {
          'X-Client-Info': 'allin-os-frontend',
        },
      },
      db: {
        schema: 'public',
      },
      // Add network resilience settings
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    });
  }

  return frontendClient;
}

// Export singleton for convenience
export const supabase = getFrontendClient();

// ============================================================================
// BACKEND CLIENT (Server-side only)
// ============================================================================

/**
 * Backend Supabase client using SERVICE_ROLE_KEY
 * This client bypasses RLS and has full admin access
 * MUST ONLY be used in server-side code
 * 
 * @throws Error if called from browser environment
 */
export function getBackendClient(): SupabaseClient {
  // Check if running in browser environment
  if (typeof window !== "undefined") {
    throw new Error(
      "SECURITY VIOLATION: getBackendClient should not be called from browser code. " +
      "Backend operations must be performed server-side."
    );
  }

  // In a real server environment, these would come from process.env
  // For now, we'll use a placeholder that needs to be configured
  const supabaseUrl = process.env.SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Missing required backend Supabase environment variables: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY"
    );
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Legacy alias for getBackendClient
 * @deprecated Use getBackendClient instead
 */
export function getSupabaseAdminClient(): SupabaseClient {
  return getBackendClient();
}
