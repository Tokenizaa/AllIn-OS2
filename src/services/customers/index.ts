import { supabase } from "@/lib/supabase-client";

export const CustomerService = {
  async fetchCustomerById(id: string) {
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async fetchCustomerByCompradorId(compradorId: string) {
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .eq("id_comprador", compradorId)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async fetchDownlines(compradorId: string) {
    const { data, error } = await supabase
      .from("customers")
      .select("id, usuario, id_comprador, status, telefone, created_at, cidade, estado, nome_completo")
      .eq("patrocinador_comprador", compradorId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async fetchCustomersList(limit = 100) {
    const { data, error } = await supabase
      .from("customers")
      .select("id, nome_completo, email, status, cpf, user_id, updated_at, created_at, usuario, id_comprador, patrocinador_comprador, cidade, estado, telefone, plano_comprador")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data || [];
  },

  async fetchCustomersWithOrderStats(page = 1, pageSize = 15) {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const [{ data: customerData, error: customerError, count: customerCount }, { data: orderStats, error: statsError }] = await Promise.all([
      supabase
        .from("customers")
        .select("id, user_id, usuario, id_comprador, status, telefone, created_at, nome_completo, plano_comprador, cidade, estado", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(from, to),
      supabase
        .from("customer_order_stats")
        .select("id_comprador, order_count, ltv"),
    ]);

    if (customerError) throw customerError;
    if (statsError) throw statsError;

    const statsMap: Record<string, { count: number; ltv: number }> = {};
    if (orderStats) {
      orderStats.forEach((stat: any) => {
        statsMap[stat.id_comprador] = {
          count: stat.order_count || 0,
          ltv: Number(stat.ltv || 0),
        };
      });
    }

    return {
      customers: customerData || [],
      orderStats: statsMap,
      totalCount: customerCount || 0,
      page,
      pageSize,
    };
  },

  async fetchRecentCustomers(limit = 20) {
    const { data, error } = await supabase
      .from("customers")
      .select("id, usuario, id_comprador, status, cidade, estado, user_id, nome_completo")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data || [];
  },

  async fetchNetworkMembers(limit = 500) {
    const { data, error } = await supabase
      .from("customers")
      .select("id, usuario, id_comprador, user_id, status, cidade, estado, nome_completo")
      .limit(limit);
    if (error) throw error;
    return data || [];
  },

  async fetchAnalyticsCustomers() {
    const { data, error } = await supabase
      .from("customers")
      .select("id, usuario, id_comprador, user_id, nome_completo");
    if (error) throw error;
    return data || [];
  },

  async fetchCustomerBonus(compradorId: string) {
    const { data, error } = await supabase
      .from("customer_bonus_view")
      .select("*")
      .eq("id_comprador", compradorId)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async fetchCustomerPlan(compradorId: string) {
    const { data, error } = await supabase
      .from("customer_plans")
      .select("*, plans(*)")
      .eq("id_comprador", compradorId)
      .maybeSingle();
    if (error) throw error;
    return data;
  }
};
