import { supabase } from "@/lib/supabase/client";

export const MarketingService = {
  async fetchCampaigns() {
    const { data, error } = await supabase
      .from("marketing.campaigns")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) throw error;
    return data || [];
  },

  async fetchUpgradeSuggestions() {
    const { data, error } = await supabase
      .from("mlm.upgrade_suggestions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10);
    if (error) throw error;
    return data || [];
  },

  async fetchDistributorProfile(userId: string) {
    const { data, error } = await supabase
      .from("distributor_profiles")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();
    if (error) throw error;
    return data;
  },
};
