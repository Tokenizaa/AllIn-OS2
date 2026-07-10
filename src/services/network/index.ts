import { supabase } from "@/lib/supabase/client";

export const NetworkService = {
  async fetchNetworkRelationships(limit = 12) {
    // TODO: Add method to HTTP client for network relationships
    throw new Error("fetchNetworkRelationships not yet implemented in HTTP client");
  },

  async fetchRecentNetworkRelationships(limit = 12) {
    const { data, error } = await supabase
      .from("network_relationships")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data || [];
  },

  async fetchSponsorRelationship(customerId: string) {
    const { data, error } = await supabase
      .from("network_relationships")
      .select("customer_id,sponsor_customer_id,level")
      .eq("customer_id", customerId)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async fetchUplineRelationships(customerId: string) {
    const { data, error } = await supabase
      .from("network_relationships")
      .select("customer_id,sponsor_customer_id,level")
      .eq("customer_id", customerId)
      .order("level", { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async countDirectRelationships(customerId: string) {
    const { data, error } = await supabase
      .from("network_relationships")
      .select("customer_id")
      .eq("sponsor_customer_id", customerId);
    if (error) throw error;
    return data?.length || 0;
  }
};
