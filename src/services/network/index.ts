import { supabase } from "@/lib/supabase-client";

export const NetworkService = {
  async fetchNetworkRelationships(limit = 12) {
    const { data, error } = await supabase
      .from("network_relationships")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data || [];
  },

  async fetchRecentNetworkRelationships(limit = 12) {
    const { data, error } = await supabase
      .from("network_relationships")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data || [];
  }
};
