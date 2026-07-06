import { supabase } from "@/lib/supabase/client";

export const ProfileService = {
  async fetchUserProfile(userId: string) {
    const { data, error } = await supabase
      .schema("crm")
      .from("customers")
      .select("*")
      .eq("id", userId)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async fetchLastProfile() {
    const { data, error } = await supabase
      .schema("crm")
      .from("customers")
      .select("id, nome, tipo_cliente, created_at")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async fetchMyProfile() {
    const { data, error } = await supabase
      .schema("crm")
      .from("customers")
      .select("id, nome, email, telefone, cpf, patrocinador_id, cidade, estado, tipo_cliente")
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
   * NOTE: This filters by tipo_cliente in crm.customers for commercial classification
   * For actual role-based filtering, use identity.user_roles
   */
  async fetchProfiles(role?: string, limit = 100) {
    let query = supabase
      .schema("crm")
      .from("customers")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (role) {
      query = query.eq("tipo_cliente", role);
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
      .schema("crm")
      .from("customers")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  /**
   * Busca distribuidores (tipo_cliente = 'distribuidor')
   */
  async fetchDistributors(limit = 100) {
    return this.fetchProfiles("distribuidor", limit);
  },

  /**
   * Busca clientes finais (tipo_cliente = 'cliente_final')
   */
  async fetchCustomerFinals(limit = 100) {
    return this.fetchProfiles("cliente_final", limit);
  },

  /**
   * Busca clientes diretos (tipo_cliente = 'cliente_direto')
   */
  async fetchClienteDiretos(limit = 100) {
    return this.fetchProfiles("cliente_direto", limit);
  },

  /**
   * Busca admins (tipo_cliente = 'admin')
   * NOTE: For actual admin role filtering, use identity.user_roles
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
      .schema("crm")
      .from("customers")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (role) {
      query = query.eq("tipo_cliente", role);
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
      .schema("crm")
      .from("customers")
      .select("id, nome, email, tipo_cliente, created_at")
      .order("created_at", { ascending: false })
      .limit(500);

    if (role) {
      query = query.eq("tipo_cliente", role);
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
   * Busca bônus de um perfil por profile_id (deprecated - customer_bonus_view does not exist)
   */
  async fetchProfileBonus(profileId: string) {
    console.warn("[ProfileService] fetchProfileBonus is deprecated - customer_bonus_view does not exist");
    return null;
  },

  /**
   * Busca plano de um perfil por profile_id (deprecated - customer_plans does not exist)
   * Use mlm.planos_distribuidores instead
   */
  async fetchProfilePlan(profileId: string) {
    console.warn("[ProfileService] fetchProfilePlan is deprecated - customer_plans does not exist, use mlm.planos_distribuidores instead");
    return null;
  },
};
