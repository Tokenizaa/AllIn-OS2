/**
 * Supabase Authentication Utilities
 * 
 * Centralized authentication functions for Supabase
 */

import { supabase } from "./client";
import { AuthError, AuthSession, AuthUser } from "./types";

// ============================================================================
// Session Management
// ============================================================================

/**
 * Get the current session
 * @returns Promise<AuthSession | null>
 */
export async function getSession(): Promise<AuthSession | null> {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      throw new AuthError("Failed to get session", error.message);
    }
    
    return session as AuthSession | null;
  } catch (error) {
    console.error("[Auth] Error getting session:", error);
    return null;
  }
}

/**
 * Get the current user
 * @returns Promise<AuthUser | null>
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      throw new AuthError("Failed to get user", error.message);
    }
    
    return user as AuthUser | null;
  } catch (error) {
    console.error("[Auth] Error getting user:", error);
    return null;
  }
}

/**
 * Refresh the current session
 * @returns Promise<AuthSession | null>
 */
export async function refreshSession(): Promise<AuthSession | null> {
  try {
    const { data: { session }, error } = await supabase.auth.refreshSession();
    
    if (error) {
      throw new AuthError("Failed to refresh session", error.message);
    }
    
    return session as AuthSession | null;
  } catch (error) {
    console.error("[Auth] Error refreshing session:", error);
    return null;
  }
}

// ============================================================================
// Authentication Operations
// ============================================================================

/**
 * Sign in with email and password
 * @param email User email
 * @param password User password
 * @returns Promise<AuthSession | null>
 */
export async function signIn(email: string, password: string): Promise<AuthSession | null> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      throw new AuthError(error.message, error.status?.toString());
    }
    
    return data.session as AuthSession | null;
  } catch (error) {
    console.error("[Auth] Error signing in:", error);
    throw error;
  }
}

/**
 * Sign up with email and password
 * @param email User email
 * @param password User password
 * @param metadata Optional user metadata
 * @returns Promise<AuthSession | null>
 */
export async function signUp(
  email: string,
  password: string,
  metadata?: Record<string, any>
): Promise<AuthSession | null> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });
    
    if (error) {
      throw new AuthError(error.message, error.status?.toString());
    }
    
    return data.session as AuthSession | null;
  } catch (error) {
    console.error("[Auth] Error signing up:", error);
    throw error;
  }
}

/**
 * Sign out the current user
 * @returns Promise<void>
 */
export async function signOut(): Promise<void> {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      throw new AuthError(error.message, error.status?.toString());
    }
  } catch (error) {
    console.error("[Auth] Error signing out:", error);
    throw error;
  }
}

/**
 * Reset password
 * @param email User email
 * @returns Promise<void>
 */
export async function resetPassword(email: string): Promise<void> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/redefinir-senha`,
    });
    
    if (error) {
      throw new AuthError(error.message, error.status?.toString());
    }
  } catch (error) {
    console.error("[Auth] Error resetting password:", error);
    throw error;
  }
}

/**
 * Update user password
 * @param newPassword New password
 * @returns Promise<void>
 */
export async function updatePassword(newPassword: string): Promise<void> {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    
    if (error) {
      throw new AuthError(error.message, error.status?.toString());
    }
  } catch (error) {
    console.error("[Auth] Error updating password:", error);
    throw error;
  }
}

// ============================================================================
// Auth State Changes
// ============================================================================

/**
 * Subscribe to auth state changes
 * @param callback Callback function to handle auth state changes
 * @returns Unsubscribe function
 */
export function onAuthStateChange(
  callback: (event: string, session: AuthSession | null) => void
): () => void {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (event, session) => {
      callback(event, session as AuthSession | null);
    }
  );
  
  return () => subscription.unsubscribe();
}
