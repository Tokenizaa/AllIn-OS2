import { supabase } from "@/lib/supabase/client";

export const OrderService = {
  async fetchOrdersForDashboard() {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .limit(300)
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message || "Failed to fetch orders for dashboard");
    return data || [];
  },

  async fetchOrdersList(page = 1, pageSize = 15) {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .range((page - 1) * pageSize, page * pageSize - 1)
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message || "Failed to fetch orders list");
    return {
      orders: data || [],
      totalCount: 0,
      page,
      pageSize,
    };
  },

  async fetchOrdersAndCustomers(limit = 60) {
    const [{ data: ordersData, error: ordersError }, { data: customersData, error: customersError }] = await Promise.all([
      supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(limit),
      supabase.from("customers").select("id, usuario, id_comprador, user_id, qualification, telefone, metadata, nome_completo").order("created_at", { ascending: false }),
    ]);
    if (ordersError) throw ordersError;
    if (customersError) throw customersError;
    return {
      orders: ordersData || [],
      customers: customersData || [],
    };
  },

  async fetchRecentOrders(options: { page?: number; limit?: number; id_comprador?: string; status?: string } = {}) {
    let query = supabase
      .from('orders')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });
    if (options.limit) query = query.limit(options.limit);
    if (options.page && options.limit) query = query.range((options.page - 1) * options.limit, options.page * options.limit - 1);
    if (options.id_comprador) query = query.eq('id_comprador', options.id_comprador);
    if (options.status) query = query.eq('status', options.status);
    const { data, error, count } = await query;
    if (error) throw new Error(error.message || "Failed to fetch recent orders");
    return { data: data || [], total: count || 0, pages: options.limit ? Math.ceil((count || 0) / options.limit) : 1 };
  },

  async fetchOrderStats() {
    const { data, error } = await supabase
      .from('orders')
      .select('*');
    if (error) throw new Error(error.message || "Failed to fetch order stats");
    const totalOrders = data?.length || 0;
    const totalRevenue = data?.reduce((sum, o) => sum + (Number(o.total) || 0), 0) || 0;
    return {
      success: true,
      data: { totalOrders, totalRevenue, orders: data }
    };
  }
};
