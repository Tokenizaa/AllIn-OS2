import { supabase } from "@/lib/supabase/client";

export const AnalyticsService = {
  async fetchAuditLogs(limit = 12) {
    const { data, error } = await supabase
      .from("system.audit_log")
      .select("id, action, created_at")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data || [];
  }
};
