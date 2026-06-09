import { supabase } from "@/lib/supabase-client";
import { User, DistributorProfile } from "../context/auth.types";
import { UserRole } from "@/shared/types/roles";

/**
 * Supabase Service for fetching real data from the database
 * Replaces mock data with real database queries
 */
export class SupabaseService {
  /**
   * Fetch user profile from auth.users + profiles
   */
  static async fetchUserProfile(userId: string): Promise<User | null> {
    try {
      // Get profile data directly by user_id
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (profileError && profileError.code !== "PGRST116") {
        console.error("[SupabaseService] Error fetching profile:", profileError);
        return null;
      }

      if (!profile) {
        console.error("[SupabaseService] Profile not found for user_id:", userId);
        return null;
      }

      // Get auth user for additional data
      const { data: authUser, error: authError } = await supabase.auth.getUser();
      if (authError) {
        console.error("[SupabaseService] Error fetching auth user:", authError);
      }

      // Combine profile data with auth user data if available
      return {
        id: profile.user_id,
        email: profile.email || authUser?.user?.email || "",
        name: profile.name || authUser?.user?.email?.split("@")[0] || "",
        role: (profile.role as UserRole) || UserRole.CLIENTE_FINAL,
        status: profile.status || "active",
        active: profile.status === "active",
        avatar: profile.avatar || null,
        phone: profile.phone || null,
        cpf: profile.cpf || null,
        created_at: profile.created_at || authUser?.user?.created_at || "",
        last_login: authUser?.user?.last_sign_in_at || profile.created_at || "",
        referral_code: profile.referral_code || null,
        sponsor_id: profile.sponsor_id || null,
      };
    } catch (error) {
      console.error("[SupabaseService] Error in fetchUserProfile:", error);
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
        .from("customers")
        .select("id, user_id, usuario, id_comprador, patrocinador_comprador, qualification, status, plan_id, metadata")
        .eq("user_id", userId)
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
        id_comprador: data.user_id,
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
      
      // Find by usuario field, including theme fields
      const { data, error } = await supabase
        .from("customers")
        .select(`
          id,
          user_id,
          usuario,
          id_comprador,
          qualification,
          patrocinador_comprador,
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
        .from("plans")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

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
        .from("withdrawals")
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
   */
  static async fetchLeads(userId?: string) {
    try {
      let query = supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });

      if (userId) {
        query = query.eq("user_id", userId);
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
   */
  static async fetchDistributorTheme(distributorId?: string) {
    try {
      if (distributorId) {
        // Try to fetch custom theme for distributor
        const { data, error } = await supabase
          .from("distributor_themes")
          .select("*")
          .eq("distributor_id", distributorId)
          .single();

        if (!error && data) {
          return data;
        }
      }

      // Fetch default theme
      const { data, error } = await supabase
        .from("distributor_themes")
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
