import { supabase } from "@/lib/supabase/client";

export const CustomerAutomationsService = {
  async fetchAutomations(customerId: string) {
    const { data, error } = await supabase
      .schema("crm")
      .from("customer_automations")
      .select("*")
      .eq("customer_id", customerId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async toggleAutomation(automationId: string, active: boolean) {
    const { error } = await supabase
      .schema("crm")
      .from("customer_automations")
      .update({ active })
      .eq("id", automationId);
    if (error) throw error;
  },

  async incrementRuns(automationId: string) {
    const { error } = await supabase.rpc("increment_automation_runs", {
      p_automation_id: automationId,
    });
    if (error) throw error;
  },
};
