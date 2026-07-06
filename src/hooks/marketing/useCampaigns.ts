import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";

export function useCampaigns() {
  return useQuery({
    queryKey: ["campaigns"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("marketing.campaigns")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      
      return data || [];
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}
