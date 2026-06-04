import { supabase } from "@/lib/supabase-client";
import { OrderService } from "../orders";

export const AnalyticsService = {
  async fetchOrderStats() {
    return OrderService.fetchOrderStats();
  },

  async fetchRecentOrders(options: { page: number; limit: number }) {
    return OrderService.fetchRecentOrders(options);
  },

  async fetchAuditLogs(limit = 12) {
    const { data, error } = await supabase
      .from("audit_log")
      .select("id, action, created_at")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data || [];
  }
};
