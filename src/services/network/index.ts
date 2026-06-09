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
  },

  async fetchSponsorRelationship(idComprador: string) {
    const { data, error } = await supabase
      .from("network_relationships")
      .select("id_comprador,sponsor_id_comprador,level")
      .eq("id_comprador", idComprador)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async fetchUplineRelationships(idComprador: string) {
    const { data, error } = await supabase
      .from("network_relationships")
      .select("id_comprador,sponsor_id_comprador,level")
      .eq("id_comprador", idComprador)
      .order("level", { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async countDirectRelationships(idComprador: string) {
    const { data, error } = await supabase
      .from("network_relationships")
      .select("id_comprador")
      .eq("sponsor_id_comprador", idComprador);
    if (error) throw error;
    return data?.length || 0;
  }
};
