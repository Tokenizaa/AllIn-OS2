import { httpClient } from "@/lib/api-client/http-client";

export const OrderService = {
  async fetchOrdersForDashboard() {
    const result = await httpClient.getOrders({ limit: 300 });
    if (!result.success) {
      throw new Error(result.error || "Failed to fetch orders for dashboard");
    }
    return result.data || [];
  },

  async fetchOrdersByidComprador(idComprador: string) {
    const result = await httpClient.getOrdersByComprador(idComprador);
    if (!result.success) {
      throw new Error(result.error || "Failed to fetch orders by comprador ID");
    }
    return result.data || [];
  },

  async fetchOrdersList(page = 1, pageSize = 15) {
    const result = await httpClient.getOrders({ page, limit: pageSize });
    if (!result.success) {
      throw new Error(result.error || "Failed to fetch orders list");
    }
    return {
      orders: result.data || [],
      totalCount: 0, // TODO: Add pagination support
      page,
      pageSize,
    };
  },

  async fetchOfficeOrders(limit = 200) {
    const result = await httpClient.getOfficeOrders({ limit });
    if (!result.success) {
      throw new Error(result.error || "Failed to fetch office orders");
    }
    return result.data || [];
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
    const result = await httpClient.getRecentOrders(options);
    if (!result.success) {
      throw new Error(result.error || "Failed to fetch recent orders");
    }
    return result.data;
  },

  async fetchOrderStats() {
    const result = await httpClient.getOrderStats();
    if (!result.success) {
      throw new Error(result.error || "Failed to fetch order stats");
    }
    return {
      success: true,
      data: result.data
    };
  }
};
