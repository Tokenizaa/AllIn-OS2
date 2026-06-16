import { supabase } from "@/lib/supabase-client";
import { User, DistributorProfile } from "../context/auth.types";
import { UserRole } from "@/shared/types/roles";

/**
 * Supabase Service for fetching real data from the database
 * Replaces mock data with real database queries
 */
export class SupabaseService {
  /**
   * Fetch user profile from auth.users + crm.customers
   */
  static async fetchUserProfile(userId: string): Promise<User | null> {
    const startTime = Date.now();
    console.log("[SupabaseService] fetchUserProfile START - userId:", userId);
    
    try {
      // Get customer profile data from crm.customers
      console.log("[SupabaseService] Querying crm.customers table for auth_user_id:", userId);
      const queryStartTime = Date.now();
      
      const { data: customer, error: customerError } = await supabase
        .schema("crm")
        .from("customers")
        .select("*")
        .eq("auth_user_id", userId)
        .maybeSingle();
      
      const queryDuration = Date.now() - queryStartTime;
      console.log("[SupabaseService] Query duration:", queryDuration, "ms");
      console.log("[SupabaseService] Query result - customer:", customer);
      console.log("[SupabaseService] Query result - error:", customerError);

      if (customerError) {
        console.error("[SupabaseService] Error fetching customer:", customerError);
        console.error("[SupabaseService] Error code:", customerError.code);
        console.error("[SupabaseService] Error message:", customerError.message);
        console.error("[SupabaseService] Error details:", customerError.details);
        return null;
      }

      if (!customer) {
        console.error("[SupabaseService] Customer profile not found for auth_user_id:", userId);
        return null;
      }

      // Map customer tipo_cliente to UserRole
      let userRole = UserRole.CLIENTE_FINAL;
      if (customer.tipo_cliente === 'admin') {
        userRole = UserRole.ADMIN_MASTER;
      } else if (customer.tipo_cliente === 'distribuidor') {
        userRole = UserRole.DISTRIBUIDOR;
      } else if (customer.tipo_cliente === 'afiliado') {
        userRole = UserRole.AFILIADO;
      }

      // Combine customer data
      const result = {
        id: customer.auth_user_id,
        email: customer.email || "",
        name: customer.nome || customer.email?.split("@")[0] || "",
        role: userRole,
        status: customer.status || "active",
        active: customer.ativo === true,
        avatar: null,
        phone: customer.telefone || null,
        cpf: customer.cpf || null,
        created_at: customer.created_at || "",
        last_login: customer.data_cadastro || "",
        referral_code: null,
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
   * Fetch distributor profile from mlm.distribuidores table
   */
  static async fetchDistributorProfile(userId: string): Promise<DistributorProfile | null> {
    try {
      const { data, error } = await supabase
        .schema("mlm")
        .from("distribuidores")
        .select("id, usuario, patrocinador_id, plan_id, qualificacao, status, metadata")
        .eq("auth_user_id", userId)
        .maybeSingle();

      if (error) {
        console.error("[SupabaseService] Error fetching distributor profile:", error);
        return null;
      }

      if (!data) {
        return null;
      }

      // Map distributor data to DistributorProfile format
      return {
        id: data.id,
        id_comprador: userId,
        sponsor_id: data.patrocinador_id || null,
        referral_code: data.usuario || userId || "",
        referral_link: `/loja/ref/${data.usuario || userId}`,
        plan_id: data.plan_id || "none",
        qualification: data.qualificacao || "Associado",
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
   * Check if user is admin based on admin_users table
   */
  static async isAdminUser(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from("admin_users")
        .select("id")
        .eq("user_id", userId)
        .eq("status", "active")
        .single();

      return !error && !!data;
    } catch (error) {
      console.error("[SupabaseService] Error in isAdminUser:", error);
      return false;
    }
  }

  /**
   * Fetch admin user details
   */
  static async fetchAdminUser(userId: string) {
    try {
      const { data, error } = await supabase
        .from("admin_users")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error) {
        console.error("[SupabaseService] Error fetching admin user:", error);
        return null;
      }
      return data;
    } catch (error) {
      console.error("[SupabaseService] Error in fetchAdminUser:", error);
      return null;
    }
  }

  /**
   * Fetch distributor by slug (usuario)
   */
  static async fetchDistributorBySlug(slug: string) {
    try {
      const normSlug = slug.toLowerCase().trim();

      // Find by usuario field in mlm.distribuidores
      const { data, error } = await supabase
        .schema("mlm")
        .from("distribuidores")
        .select(`
          id,
          auth_user_id,
          usuario,
          qualificacao,
          patrocinador_id,
          plan_id,
          status,
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
        .order("created_at", { ascending: true });

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
   * Fetch leads for a user
   * Note: Leads are stored in crm.customers with tipo_cliente = 'lead'
   */
  static async fetchLeads(userId?: string) {
    try {
      let query = supabase
        .schema("crm")
        .from("customers")
        .select("*")
        .eq("tipo_cliente", "lead")
        .order("created_at", { ascending: false });

      if (userId) {
        query = query.eq("auth_user_id", userId);
      }

      const { data, error } = await query;

      if (error) {
        console.error("[SupabaseService] Error fetching leads:", error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error("[SupabaseService] Error in fetchLeads:", error);
      return [];
    }
  }

  /**
   * Fetch distributor theme by distributor_id or default theme
   * Note: Themes are stored in mlm.distribuidor_temas
   */
  static async fetchDistributorTheme(distributorId?: string) {
    try {
      if (distributorId) {
        // Try to fetch custom theme for distributor
        const { data, error } = await supabase
          .schema("mlm")
          .from("distribuidor_temas")
          .select("*")
          .eq("distribuidor_id", distributorId)
          .single();

        if (!error && data) {
          return data;
        }
      }

      // Fetch default theme
      const { data, error } = await supabase
        .schema("mlm")
        .from("distribuidor_temas")
        .select("*")
        .eq("is_default", true)
        .single();

      if (error) {
        console.error("[SupabaseService] Error fetching default theme:", error);
        return null;
      }

      return data;
    } catch (error) {
      console.error("[SupabaseService] Error in fetchDistributorTheme:", error);
      return null;
    }
  }
}
