import { supabase } from "@/lib/supabase/client";
import { User, DistributorProfile } from "../context/auth.types";
import { UserRole } from "@/shared/types/roles";
import { RoleResolver } from "./roleResolver.service";

/**
 * Supabase Service for fetching real data from the database
 * Replaces mock data with real database queries
 */
export class SupabaseService {
  /**
   * Fetch user profile from auth.users + crm.customers + identity.user_roles
   */
  static async fetchUserProfile(userId: string): Promise<User | null> {
    const startTime = Date.now();
    console.log("[SupabaseService] fetchUserProfile START - userId:", userId);
    
    try {
      // Get customer data directly by user_id
      console.log("[SupabaseService] Querying crm.customers table for user_id:", userId);
      const queryStartTime = Date.now();

      const { data: customer, error: customerError } = await supabase
        .schema("crm")
        .from("customers")
        .select("*")
        .eq("auth_user_id", userId)
        .single();
      
      const queryDuration = Date.now() - queryStartTime;
      console.log("[SupabaseService] Query duration:", queryDuration, "ms");
      console.log("[SupabaseService] Query result - customer:", customer);
      console.log("[SupabaseService] Query result - error:", customerError);

      if (customerError && customerError.code !== "PGRST116") {
        console.error("[SupabaseService] Error fetching customer:", customerError);
        console.error("[SupabaseService] Error code:", customerError.code);
        console.error("[SupabaseService] Error message:", customerError.message);
        console.error("[SupabaseService] Error details:", customerError.details);
        return null;
      }

      if (!customer) {
        console.error("[SupabaseService] Customer not found for user_id:", userId);
        return null;
      }

      // Get user role using RoleResolver service
      const role = await RoleResolver.getUserRole(userId);
      
      if (!role) {
        console.warn("[SupabaseService] No role found for user, defaulting to CLIENTE_FINAL");
      }

      // Combine customer data with role
      const result = {
        id: customer.auth_user_id,
        email: customer.email || "",
        name: customer.nome || customer.email?.split("@")[0] || "",
        role: role || UserRole.CLIENTE_FINAL,
        status: customer.status || "active",
        active: customer.status === "active",
        avatar: customer.avatar || null,
        phone: customer.telefone || null,
        cpf: customer.cpf || null,
        created_at: customer.data_cadastro || customer.created_at || "",
        last_login: customer.data_cadastro || customer.created_at || "",
        referral_code: customer.referral_code || null,
        sponsor_id: customer.patrocinador_id || null,
      };
      
      const totalDuration = Date.now() - startTime;
      console.log("[SupabaseService] fetchUserProfile END - Total duration:", totalDuration, "ms");
      console.log("[SupabaseService] fetchUserProfile SUCCESS - user:", result.email, "role:", result.role);
      
      return result;
    } catch (error) {
      const totalDuration = Date.now() - startTime;
      console.error("[SupabaseService] Error in fetchUserProfile after", totalDuration, "ms:", error);
      console.error("[SupabaseService] Error name:", error instanceof Error ? error.name : "unknown");
      console.error("[SupabaseService] Error message:", error instanceof Error ? error.message : String(error));
      console.error("[SupabaseService] Error stack:", error instanceof Error ? error.stack : "no stack");
      return null;
    }
  }

  /**
   * Fetch current session user
   */
  static async fetchCurrentUser(): Promise<User | null> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        return null;
      }
      return this.fetchUserProfile(user.id);
    } catch (error) {
      console.error("[SupabaseService] Error in fetchCurrentUser:", error);
      return null;
    }
  }

  /**
   * Fetch distributor profile from customers table
   */
  static async fetchDistributorProfile(userId: string): Promise<DistributorProfile | null> {
    try {
      const { data, error } = await supabase
        .schema("crm")
        .from("customers")
        .select("id, auth_user_id, usuario, id_comprador, patrocinador_comprador, plan_id, metadata, qualification, status")
        .eq("auth_user_id", userId)
        .maybeSingle();

      if (error) {
        console.error("[SupabaseService] Error fetching distributor profile:", error);
        return null;
      }

      if (!data) {
        return null;
      }

      // Map customer data to DistributorProfile format
      return {
        id: data.id,
        id_comprador: data.auth_user_id,
        sponsor_id: data.patrocinador_comprador || null,
        referral_code: data.usuario || data.id_comprador || "",
        referral_link: `/loja/ref/${data.usuario || data.id_comprador}`,
        plan_id: data.plan_id || "none",
        qualification: data.qualification || "Associado",
        wallet_balance: 0, // Would need to fetch from wallets table
        bonus_balance: 0, // Would need to fetch from wallets table
        status: data.status || "active",
      };
    } catch (error) {
      console.error("[SupabaseService] Error in fetchDistributorProfile:", error);
      return null;
    }
  }

  /**
   * Check if user is admin based on crm.user_roles_view
   * @deprecated Use RoleResolver.getUserRole instead
   */
  static async isAdminUser(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .schema("crm")
        .from("user_roles_view")
        .select("role_name")
        .eq("user_id", userId)
        .maybeSingle();

      if (error || !data) {
        return false;
      }

      return !!(data.role_name === "ADMIN_MASTER" || data.role_name === "ADMIN");
    } catch (error) {
      console.error("[SupabaseService] Error in isAdminUser:", error);
      return false;
    }
  }

  /**
   * Fetch admin user details
   * @deprecated Use identity.user_roles table directly
   */
  static async fetchAdminUser(userId: string) {
    console.warn("[SupabaseService] fetchAdminUser is deprecated - use identity.user_roles instead");
    return null;
  }

  /**
   * Fetch distributor by slug (usuario)
   */
  static async fetchDistributorBySlug(slug: string) {
    try {
      const normSlug = slug.toLowerCase().trim();
      
      // Find by usuario field in mlm.distribuidores table
      const { data, error } = await supabase
        .schema("mlm")
        .from("distribuidores")
        .select(`
          id,
          auth_user_id,
          usuario,
          nome,
          email,
          cpf,
          cnpj,
          tipo_pessoa,
          data_nascimento,
          cep,
          cidade,
          bairro,
          endereco,
          complemento,
          numero,
          ativo,
          status,
          data_cadastro,
          patrocinador_id,
          metadata,
          created_at,
          updated_at
        `)
        .eq("usuario", normSlug)
        .maybeSingle();

      if (error) {
        console.error("[SupabaseService] Error fetching distributor by slug:", error);
        return null;
      }

      return data;
    } catch (error) {
      console.error("[SupabaseService] Error in fetchDistributorBySlug:", error);
      return null;
    }
  }

  /**
   * Fetch all active plans from database
   */
  static async fetchPlans() {
    try {
      const { data, error } = await supabase
        .schema("mlm")
        .from("planos")
        .select("*")
        .eq("is_active", true)
        .order("preco", { ascending: true });

      if (error) {
        console.error("[SupabaseService] Error fetching plans:", error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error("[SupabaseService] Error in fetchPlans:", error);
      return [];
    }
  }

  /**
   * Fetch withdrawals for a user or all withdrawals (admin)
   */
  static async fetchWithdrawals(userId?: string) {
    try {
      let query = supabase
        .schema("finance")
        .from("solicitacoes_saque")
        .select("*")
        .order("created_at", { ascending: false });

      if (userId) {
        query = query.eq("user_id", userId);
      }

      const { data, error } = await query;

      if (error) {
        console.error("[SupabaseService] Error fetching withdrawals:", error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error("[SupabaseService] Error in fetchWithdrawals:", error);
      return [];
    }
  }

  /**
   * Fetch leads for a user (deprecated - leads table does not exist in current schema)
   * Use crm.customers instead
   */
  static async fetchLeads(userId?: string) {
    console.warn("[SupabaseService] fetchLeads is deprecated - leads table does not exist");
    return [];
  }

  /**
   * Fetch distributor theme by distributor_id or default theme (deprecated)
   * distributor_themes table does not exist in current schema
   */
  static async fetchDistributorTheme(distributorId?: string) {
    console.warn("[SupabaseService] fetchDistributorTheme is deprecated - distributor_themes table does not exist");
    return null;
  }
}
