import { supabase } from "@/lib/supabase-client";

export interface CommissionCycle {
  id: string;
  ciclo: string;
  qualificados: number;
  pago: number;
  status: string;
  created_at?: string;
}

export const CommissionService = {
  async fetchCommissionCycles(limit = 50): Promise<CommissionCycle[]> {
    const { data, error } = await supabase
      .from("commission_cycles")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data || [];
  },

  async runCycle(): Promise<void> {
    // Implement real cycle execution logic
    // This would:
    // 1. Calculate commissions based on MLM rules
    // 2. Update payment statuses
    // 3. Create commission records
    
    const { error } = await supabase.rpc('run_commission_cycle');
    
    if (error) {
      console.error("Error running commission cycle:", error);
      throw error;
    }
  },

  async updateCycleStatus(cycleId: string, status: string): Promise<void> {
    const { error } = await supabase
      .from("commission_cycles")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", cycleId);
    
    if (error) throw error;
  }
};
