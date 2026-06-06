import { useState, useEffect } from "react";
import { SupabaseService } from "@/modules/auth/services/supabase.service";

export function useDistributorPlans() {
  const [plans, setPlans] = useState<any[]>([]);

  useEffect(() => {
    void (async () => {
      const data = await SupabaseService.fetchPlans();
      setPlans(data);
    })();
  }, []);

  return { plans };
}
