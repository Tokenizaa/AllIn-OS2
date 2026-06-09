import { supabase } from "@/lib/supabase-client";

export const OrderService = {
  async fetchOrdersForDashboard() {
    const { data, error } = await supabase
      .from("orders")
      .select("id, numero_pedido, valor_total_pedido, valor_total, created_at, status, status_pedido")
      .order("created_at", { ascending: false })
      .limit(300);
    if (error) throw error;
    return data || [];
  },

  async fetchOrdersByCustomerId(customerId: string) {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("customer_id", customerId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async fetchOrdersList(page = 1, pageSize = 15) {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await supabase
      .from("orders")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);
    if (error) throw error;
    return {
      orders: data || [],
      totalCount: count || 0,
      page,
      pageSize,
    };
  },

  async fetchOfficeOrders(limit = 200) {
    const { data, error } = await supabase
      .from("orders")
      .select("id, order_number, status, order_type, payment_method, total_amount, customer_name, created_at")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data || [];
  },

  async fetchOrdersAndCustomers(page = 1, pageSize = 15) {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const [{ data: ordersData, error: ordersError, count: ordersCount }, { data: customersData, error: customersError }] = await Promise.all([
      supabase.from("orders").select("*", { count: "exact" }).order("created_at", { ascending: false }).range(from, to),
      supabase.from("customers").select("id, usuario, id_comprador, user_id, qualification, telefone, metadata, nome_completo").order("created_at", { ascending: false }),
    ]);
    if (ordersError) throw ordersError;
    if (customersError) throw customersError;
    return {
      orders: ordersData || [],
      customers: customersData || [],
      totalCount: ordersCount || 0,
      page,
      pageSize,
    };
  },

  async fetchRecentOrders(options: { page?: number; limit?: number; customer_id?: string; status?: string } = {}) {
    const page = options.page || 1;
    const limit = options.limit || 20;
    const offset = (page - 1) * limit;

    let query = supabase.from("orders").select("*", { count: "exact" });

    if (options.customer_id) {
      query = query.or(`user_id.eq.${options.customer_id},comprador.eq.${options.customer_id}`);
    }
    if (options.status) {
      query = query.eq("status", options.status);
    }

    const { data, count, error } = await query
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return {
      success: true,
      data: {
        data: data || [],
        total: count || 0,
        pages: Math.ceil((count || 0) / limit)
      }
    };
  },

  async fetchOrderStats() {
    const countStatus = async (status: string) => {
      const { count, error } = await supabase
        .from("orders")
        .select("*", { count: "exact", head: true })
        .eq("status", status);
      if (error) throw error;
      return count || 0;
    };

    const countAll = async () => {
      const { count, error } = await supabase
        .from("orders")
        .select("*", { count: "exact", head: true });
      if (error) throw error;
      return count || 0;
    };

    const calculateTotalRevenue = async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("valor_total");
      if (error) throw error;
      return data?.reduce((sum: number, order: any) => sum + Number(order.valor_total || 0), 0) || 0;
    };

    const [
      totalOrders,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      totalRevenue
    ] = await Promise.all([
      countAll(),
      countStatus("pending"),
      countStatus("processing"),
      countStatus("shipped"),
      countStatus("delivered"),
      countStatus("cancelled"),
      calculateTotalRevenue()
    ]);

    return {
      success: true,
      data: {
        totalOrders,
        pendingOrders,
        processingOrders,
        shippedOrders,
        deliveredOrders,
        cancelledOrders,
        totalRevenue
      }
    };
  }
};
