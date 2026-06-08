import { supabase } from "@/lib/supabase-client";

export interface Automation {
  id: string;
  customer_id: string;
  name: string;
  description: string;
  type: string;
  active: boolean;
  runs: number;
  created_at?: string;
  updated_at?: string;
}

export const AutomationService = {
  async fetchCustomerAutomations(customerId: string): Promise<Automation[]> {
    const { data, error } = await supabase
      .from("customer_automations")
      .select("*")
      .eq("customer_id", customerId)
      .order("created_at", { ascending: false });
    
    if (error) {
      console.error("Error fetching customer automations:", error);
      return [];
    }
    
    return data || [];
  },

  async updateAutomationStatus(automationId: string, active: boolean): Promise<boolean> {
    const { error } = await supabase
      .from("customer_automations")
      .update({ 
        active, 
        updated_at: new Date().toISOString() 
      })
      .eq("id", automationId);
    
    if (error) {
      console.error("Error updating automation status:", error);
      return false;
    }
    
    return true;
  },

  async incrementAutomationRuns(automationId: string): Promise<boolean> {
    const { error } = await supabase.rpc('increment_automation_runs', {
      automation_id: automationId
    });
    
    if (error) {
      console.error("Error incrementing automation runs:", error);
      return false;
    }
    
    return true;
  }
};
