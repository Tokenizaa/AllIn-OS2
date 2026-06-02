import { UserRole } from "@/shared/types/roles";
import { User } from "../context/auth.types";
import { supabase } from "@/lib/supabase-client";
import { SupabaseService } from "./supabase.service";

/**
 * Authentication service for handling user login, registration, and logout
 * Now uses Supabase for real authentication
 */
export class AuthService {
  /**
   * Login user with email and password using Supabase
   */
  static async login(
    email: string,
    password: string,
    setUser: (user: User) => void,
    setLoading: (loading: boolean) => void
  ): Promise<User> {
    setLoading(true);
    
    try {
      // Login with Supabase
      const { data: { user }, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setLoading(false);
        throw new Error(error.message || "Credenciais inválidas.");
      }

      if (!user) {
        setLoading(false);
        throw new Error("Credenciais inválidas: usuário não encontrado.");
      }

      // Fetch user profile from database
      const profile = await SupabaseService.fetchUserProfile(user.id);
      
      if (!profile) {
        setLoading(false);
        throw new Error("Perfil de usuário não encontrado.");
      }

      if (profile.status === "suspended") {
        setLoading(false);
        throw new Error("Conta bloqueada por políticas de conformidade interna.");
      }

      setUser(profile);
      return profile;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  }

  /**
   * Register new user using Supabase
   */
  static async register(
    name: string,
    email: string,
    role: UserRole,
    extra?: { phone?: string; cpf?: string; sponsor_id?: string; password?: string },
    activeSponsor?: string | null,
    activeReferralMetadata?: any | null,
    setUser?: (user: User) => void,
    setDistributorProfile?: (profile: any) => void,
    setLoading?: (loading: boolean) => void
  ): Promise<User> {
    if (setLoading) setLoading(true);
    
    try {
      // Register with Supabase Auth
      const { data: { user }, error } = await supabase.auth.signUp({
        email,
        password: extra?.password || (() => { throw new Error("Senha obrigatória para registro."); })(),
        options: {
          data: {
            name,
            role,
            phone: extra?.phone,
            cpf: extra?.cpf,
            sponsor_id: extra?.sponsor_id || activeSponsor,
          },
        },
      });

      if (error) {
        if (setLoading) setLoading(false);
        throw new Error(error.message || "Erro ao registrar usuário.");
      }

      if (!user) {
        if (setLoading) setLoading(false);
        throw new Error("Erro ao criar usuário.");
      }

      // Create profile in database
      const { error: profileError } = await supabase
        .from("profiles")
        .insert({
          user_id: user.id,
          name,
          email,
          role,
          status: role === UserRole.DISTRIBUIDOR ? "pending" : "active",
          phone: extra?.phone,
          cpf: extra?.cpf,
          sponsor_id: extra?.sponsor_id || activeSponsor,
          referral_code: role === UserRole.DISTRIBUIDOR ? name.toLowerCase().replace(/\s+/g, "") : null,
        });

      if (profileError) {
        if (setLoading) setLoading(false);
        throw new Error("Erro ao criar perfil de usuário.");
      }

      // Fetch complete user profile
      const profile = await SupabaseService.fetchUserProfile(user.id);
      
      if (!profile) {
        if (setLoading) setLoading(false);
        throw new Error("Erro ao recuperar perfil criado.");
      }

      // Set active session for the registered user
      if (setUser) setUser(profile);
      if (setLoading) setLoading(false);
      return profile;
    } catch (error) {
      if (setLoading) setLoading(false);
      throw error;
    }
  }

  /**
   * Logout user using Supabase
   */
  static async logout(
    user: User | null,
    setUser: (user: User | null) => void,
    setDistributorProfile: (profile: any) => void,
    setLoading: (loading: boolean) => void
  ): Promise<void> {
    setLoading(true);
    
    await supabase.auth.signOut();
    setUser(null);
    setDistributorProfile(null);
    setLoading(false);
  }

  /**
   * Change user role (admin only) using Supabase
   */
  static async changeUserRole(
    userId: string,
    targetRole: UserRole,
    user: User | null,
    setUser: (user: User) => void
  ): Promise<void> {
    if (!user || user.role !== UserRole.ADMIN_MASTER) {
      throw new Error("Acesso negado: Requer privilégio Admin Master.");
    }

    const { error } = await supabase
      .from("profiles")
      .update({ role: targetRole, updated_at: new Date().toISOString() })
      .eq("user_id", userId);

    if (error) {
      throw new Error(error.message || "Erro ao alterar role do usuário.");
    }

    if (user.id === userId) {
      const profile = await SupabaseService.fetchUserProfile(userId);
      if (profile) {
        setUser(profile);
      }
    }
  }

  /**
   * Clear sponsor tracking
   */
  static clearSponsor(
    setActiveSponsor: (sponsor: string | null) => void,
    setActiveReferralMetadata: (metadata: any) => void
  ): void {
    setActiveSponsor(null);
    setActiveReferralMetadata(null);
    // Sponsor tracking is managed by the referral table.
  }
}
