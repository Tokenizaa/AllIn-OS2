import { supabase } from "@/lib/supabase-client";

export const authService = {
  async getSession() {
    return supabase.auth.getSession();
  },

  onAuthStateChange(callback: Parameters<typeof supabase.auth.onAuthStateChange>[0]) {
    return supabase.auth.onAuthStateChange(callback);
  },

  async signInWithPassword(email: string, password: string) {
    return supabase.auth.signInWithPassword({ email, password });
  },

  async signUp(email: string, password: string, options?: Parameters<typeof supabase.auth.signUp>[0]["options"]) {
    return supabase.auth.signUp({ email, password, options });
  },

  async signOut() {
    return supabase.auth.signOut();
  },
};
