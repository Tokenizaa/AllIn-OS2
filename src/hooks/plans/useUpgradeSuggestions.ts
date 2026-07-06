import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";

export function useUpgradeSuggestions() {
  return useQuery({
    queryKey: ["upgrade-suggestions"],
    queryFn: async () => {
      // Query upgrade suggestions from the database
      // This would typically come from an AI-powered analysis or precomputed suggestions
      const { data, error } = await supabase
        .from("mlm.upgrade_suggestions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      
      // If no suggestions exist in the database, return empty array
      // The UI will show a "no suggestions" message
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
