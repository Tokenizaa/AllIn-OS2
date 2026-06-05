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
      .select("id, usuario, id_comprador, qualification, status, telefone, created_at, cidade, estado, nome_completo")
      .eq("patrocinador_comprador", compradorId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async fetchCustomersList(limit = 100) {
    const { data, error } = await supabase
      .from("customers")
      .select("id, nome_completo, email, avatar_url, phone, status, qualification, cpf, user_id, updated_at, created_at, usuario, id_comprador, patrocinador_comprador, cidade, estado, telefone")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data || [];
  },

  async fetchCustomersWithOrderStats() {
    const [{ data: customerData, error: customerError }, { data: allOrders, error: orderError }] = await Promise.all([
      supabase
        .from("customers")
        .select("id, user_id, usuario, id_comprador, qualification, status, telefone, created_at, nome_completo")
        .order("created_at", { ascending: false }),
      supabase
        .from("orders")
        .select("id, customer_id, valor_total_pedido, valor_total, status_pedido, status"),
    ]);

    if (customerError) throw customerError;
    if (orderError) throw orderError;

    const statsMap: Record<string, { count: number; ltv: number }> = {};
    if (allOrders) {
      allOrders.forEach((o: any) => {
        const cid = o.customer_id;
        if (!cid) return;
        if (!statsMap[cid]) {
          statsMap[cid] = { count: 0, ltv: 0 };
        }
        statsMap[cid].count += 1;

        const isPaid = ["pago", "entregue", "enviado"].includes(
          (o.status_pedido || o.status || "").toLowerCase()
        );
        if (isPaid) {
          statsMap[cid].ltv += Number(o.valor_total_pedido || o.valor_total || 0);
        }
      });
    }

    return {
      customers: customerData || [],
      orderStats: statsMap,
    };
  },

  async fetchRecentCustomers(limit = 20) {
    const { data, error } = await supabase
      .from("customers")
      .select("id, usuario, id_comprador, qualification, status, cidade, estado, user_id, nome_completo")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data || [];
  },

  async fetchNetworkMembers(limit = 500) {
    const { data, error } = await supabase
      .from("customers")
      .select("id, usuario, id_comprador, user_id, qualification, status, cidade, estado, nome_completo")
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
  }
};
