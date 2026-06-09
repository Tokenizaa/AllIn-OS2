import { UserRole } from "@/shared/types/roles";
import { User } from "../context/auth.types";
import { supabase } from "@/lib/supabase-client";
import { SupabaseService } from "./supabase.service";
import { withRetry, withTimeout, getNetworkErrorMessage } from "@/lib/network-resilience";

/**
 * Authentication service for handling user login, registration, and logout
 * Pure business logic without UI state management
 */
export class AuthService {
  /**
   * Login user with email and password using Supabase
   * Returns user profile without managing UI state
   */
  static async login(
    email: string,
    password: string
  ): Promise<User> {
    try {
      // Login with Supabase with retry and timeout protection
      const signInResult = await withRetry(
        () => withTimeout(
          () => supabase.auth.signInWithPassword({ email, password }),
          12000,
          "Tempo esgotado ao conectar com o servidor. Verifique sua conexão."
        ),
        { maxRetries: 2, delayMs: 1000 }
      );

      const { data: { user }, error } = signInResult;

      if (error) {
        throw new Error(error.message || "Credenciais inválidas.");
      }

      if (!user) {
        throw new Error("Credenciais inválidas: usuário não encontrado.");
      }

      // Fetch user profile from database with retry and timeout protection
      const userProfile = await withRetry(
        () => withTimeout(
          () => SupabaseService.fetchUserProfile(user.id),
          60000,
          "Tempo esgotado ao carregar perfil. Tente novamente."
        ),
        { maxRetries: 2, delayMs: 2000 }
      );
      
      if (!userProfile) {
        throw new Error("Perfil de usuário não encontrado.");
      }

      if (userProfile.status === "suspended") {
        throw new Error("Conta bloqueada por políticas de conformidade interna.");
      }

      return userProfile;
    } catch (error: any) {
      console.error("[AuthService] Login error:", error);
      
      // Provide user-friendly error message for network errors
      if (error.message?.includes('timeout') || 
          error.message?.includes('network') ||
          error.message?.includes('ERR_NAME_NOT_RESOLVED') ||
          error.message?.includes('ERR_QUIC')) {
        throw new Error(getNetworkErrorMessage(error));
      }
      
      throw error;
    }
  }

  /**
   * Register new user using Supabase
   * Returns user profile without managing UI state
   */
  static async register(
    name: string,
    email: string,
    role: UserRole,
    extra?: { phone?: string; cpf?: string; sponsor_id?: string; password?: string },
    activeSponsor?: string | null
  ): Promise<User> {
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
      throw new Error(error.message || "Erro ao registrar usuário.");
    }

    if (!user) {
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
      throw new Error("Erro ao criar perfil de usuário.");
    }

    // Fetch complete user profile
    const userProfile = await SupabaseService.fetchUserProfile(user.id);
    
    if (!userProfile) {
      throw new Error("Erro ao recuperar perfil criado.");
    }

    return userProfile;
  }

  /**
   * Logout user using Supabase
   * Does not manage UI state
   */
  static async logout(): Promise<void> {
    await supabase.auth.signOut();
  }

  /**
   * Change user role (admin only) using Supabase
   * Returns updated profile without managing UI state
   */
  static async changeUserRole(
    userId: string,
    targetRole: UserRole,
    currentUser: User | null
  ): Promise<User | null> {
    if (!currentUser || currentUser.role !== UserRole.ADMIN_MASTER) {
      throw new Error("Acesso negado: Requer privilégio Admin Master.");
    }

    const { error } = await supabase
      .from("profiles")
      .update({ role: targetRole, updated_at: new Date().toISOString() })
      .eq("user_id", userId);

    if (error) {
      throw new Error(error.message || "Erro ao alterar role do usuário.");
    }

    if (currentUser.id === userId) {
      return await SupabaseService.fetchUserProfile(userId);
    }

    return null;
  }
}
