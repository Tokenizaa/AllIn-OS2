import { supabase } from "@/lib/supabase-client";

export const PaymentService = {
  async fetchPaymentsForDashboard() {
    const { data, error } = await supabase
      .from("payments")
      .select("id, amount, created_at, status")
      .order("created_at", { ascending: false })
      .limit(300);
    if (error) throw error;
    return data || [];
  },

  async fetchRecentPayments(limit = 5) {
    const { data, error } = await supabase
      .from("payments")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data || [];
  },

  async fetchPaymentsForCommissions(limit = 18) {
    const { data, error } = await supabase
      .from("payments")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data || [];
  },

  async fetchPaymentsForReports(limit = 500) {
    const { data, error } = await supabase
      .from("payments")
      .select("amount, created_at, status")
      .order("created_at", { ascending: true })
      .limit(limit);
    if (error) throw error;
    return data || [];
  }
};
