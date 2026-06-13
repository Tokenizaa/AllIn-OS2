import { supabase } from "@/lib/supabase-client";

export const ProfileService = {
  async fetchUserProfile(userId: string) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async fetchLastProfile() {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, name, role, created_at")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async fetchMyProfile() {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, name, email, phone, cpf, sponsor_id, city, state, role")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  // ============================================================================
  // MÉTODOS POR ROLE (NOVO - para migrar de CustomerService)
  // ============================================================================

  /**
   * Busca todos os perfis com filtro opcional por role
   */
  async fetchProfiles(role?: string, limit = 100) {
    let query = supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (role) {
      query = query.eq("role", role);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  /**
   * Busca perfil por ID
   */
  async fetchProfileById(id: string) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  /**
   * Busca distribuidores (role = 'distribuidor')
   */
  async fetchDistributors(limit = 100) {
    return this.fetchProfiles("distribuidor", limit);
  },

  /**
   * Busca clientes finais (role = 'customer_final')
   */
  async fetchCustomerFinals(limit = 100) {
    return this.fetchProfiles("customer_final", limit);
  },

  /**
   * Busca clientes diretos (role = 'cliente_direto')
   */
  async fetchClienteDiretos(limit = 100) {
    return this.fetchProfiles("cliente_direto", limit);
  },

  /**
   * Busca admins (role = 'admin')
   */
  async fetchAdmins(limit = 100) {
    return this.fetchProfiles("admin", limit);
  },

  /**
   * Busca perfis com paginação (compatível com CustomerService.fetchCustomersWithOrderStats)
   * NOTA: Este método precisa ser adaptado para incluir stats de pedidos
   */
  async fetchProfilesWithStats(page = 1, pageSize = 15, role?: string) {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from("profiles")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (role) {
      query = query.eq("role", role);
    }

    const { data, error, count } = await query;
    if (error) throw error;

    // TODO: Integrar com customer_order_stats quando a migração para profiles estiver completa
    return {
      profiles: data || [],
      orderStats: {}, // Placeholder - precisa ser implementado
      totalCount: count || 0,
      page,
      pageSize,
    };
  },

  /**
   * Busca perfis para analytics (compatível com CustomerService.fetchAnalyticsCustomers)
   */
  async fetchAnalyticsProfiles(role?: string) {
    let query = supabase
      .from("profiles")
      .select("id, name, email, role, created_at")
      .order("created_at", { ascending: false })
      .limit(500);

    if (role) {
      query = query.eq("role", role);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  /**
   * Busca perfis recentes (compatível com CustomerService.fetchRecentCustomers)
   */
  async fetchRecentProfiles(limit = 20, role?: string) {
    return this.fetchProfiles(role, limit);
  },

  /**
   * Busca membros da rede (compatível com CustomerService.fetchNetworkMembers)
   */
  async fetchNetworkMembers(limit = 500, role?: string) {
    return this.fetchProfiles(role, limit);
  },

  // ============================================================================
  // MÉTODOS DE BÔNUS E PLANOS (MIGRAÇÃO DE CustomerService)
  // ============================================================================

  /**
   * Busca bônus de um perfil por profile_id
   * Tenta usar profile_id, mas fallback para id_comprador se necessário
   */
  async fetchProfileBonus(profileId: string) {
    // Primeiro tenta usar profile_id direto na view
    let { data, error } = await supabase
      .from("customer_bonus_view")
      .select("*")
      .eq("profile_id", profileId)
      .maybeSingle();

    // Se não encontrar ou se a coluna não existir, tenta usar id_comprador
    if (error || !data) {
      // Busca o profile para obter id_comprador
      const profile = await this.fetchProfileById(profileId);
      if (profile?.id_comprador) {
        const result = await supabase
          .from("customer_bonus_view")
          .select("*")
          .eq("id_comprador", profile.id_comprador)
          .maybeSingle();
        data = result.data;
        error = result.error;
      }
    }

    if (error) throw error;
    return data;
  },

  /**
   * Busca plano de um perfil por profile_id
   * Tenta usar profile_id, mas fallback para id_comprador se necessário
   */
  async fetchProfilePlan(profileId: string) {
    // Primeiro tenta usar profile_id direto
    let { data, error } = await supabase
      .from("customer_plans")
      .select("*, plans(*)")
      .eq("profile_id", profileId)
      .maybeSingle();

    // Se não encontrar ou se a coluna não existir, tenta usar id_comprador
    if (error || !data) {
      // Busca o profile para obter id_comprador
      const profile = await this.fetchProfileById(profileId);
      if (profile?.id_comprador) {
        const result = await supabase
          .from("customer_plans")
          .select("*, plans(*)")
          .eq("id_comprador", profile.id_comprador)
          .maybeSingle();
        data = result.data;
        error = result.error;
      }
    }

    if (error) throw error;
    return data;
  },
};
