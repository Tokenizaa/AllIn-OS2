import { supabase } from "@/lib/supabase-client";

export const PlanService = {
  async fetchActivePlans() {
    const { data, error } = await supabase
      .from("plans")
      .select("id, name, price, commission_percent, generations, benefits, is_active, sort_order")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return data || [];
  }
};
