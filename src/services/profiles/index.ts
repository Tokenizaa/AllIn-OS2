import { supabase } from "@/lib/supabase/client";

type CustomerRow = Record<string, any>;

function mapCustomerToProfile(customer: CustomerRow | null) {
  if (!customer) return null;

  return {
    id: customer.id,
    id_comprador: customer.id_comprador || customer.id || null,
    user_id: customer.auth_user_id || customer.user_id || null,
    name: customer.name || customer.nome_completo || customer.usuario || null,
    email: customer.email || null,
    role: customer.role || customer.customer_type || "cliente_final",
    status: customer.status || "active",
    display_name: customer.display_name || customer.nome_completo || customer.name || null,
    avatar_url: customer.avatar_url || null,
    phone: customer.phone || customer.telefone || null,
    cpf: customer.cpf || customer.documento_cpf_cnpj || null,
    sponsor_id: customer.sponsor_id || customer.patrocinador_comprador || null,
    created_at: customer.created_at,
    updated_at: customer.updated_at,
  };
}

async function getRoleForAuthUserId(authUserId: string | null | undefined): Promise<string> {
  if (!authUserId) return "cliente_final";

  const { data: userRole } = await supabase
    .schema("identity")
    .from("user_roles")
    .select("role_id, is_active")
    .eq("user_id", authUserId)
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!userRole?.role_id) return "cliente_final";

  const { data: roleData } = await supabase
    .schema("identity")
    .from("roles")
    .select("name")
    .eq("id", userRole.role_id)
    .maybeSingle();

  return roleData?.name || "cliente_final";
}

async function mapCustomerRow(customer: CustomerRow | null) {
  const profile = mapCustomerToProfile(customer);
  if (!profile) return null;

  profile.role = await getRoleForAuthUserId(profile.user_id);
  return profile;
}

export const ProfileService = {
  async fetchUserProfile(userId: string) {
    const { data, error } = await supabase
      .schema("crm")
      .from("customers")
      .select("*")
      .eq("id", userId)
      .maybeSingle();
    if (error) throw error;
    return mapCustomerRow(data);
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
    return mapCustomerRow(data);
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
    return mapCustomerRow(data);
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

    const rows = data || [];
    const mapped = [];
    for (const row of rows) {
      const profile = await mapCustomerRow(row);
      if (!role || profile?.role === role) {
        mapped.push(profile);
      }
    }
    return mapped;
  },

  async fetchProfileById(id: string) {
    const { data, error } = await supabase
      .schema("crm")
      .from("customers")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return mapCustomerRow(data);
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

    const profiles = [];
    for (const row of data || []) {
      const profile = await mapCustomerRow(row);
      if (!role || profile?.role === role) {
        profiles.push(profile);
      }
    }

    return {
      profiles,
      orderStats: {},
      totalCount: count || 0,
      page,
      pageSize,
    };
  },

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

  async fetchRecentProfiles(limit = 20, role?: string) {
    return this.fetchProfiles(role, limit);
  },

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
