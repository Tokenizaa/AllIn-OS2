import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import { supabase } from "@/lib/supabase/client";
import { MarketingService } from "@/services/marketing";

export function useDistributorProfileQuery() {
  return useQuery({
    queryKey: [...queryKeys.distributor, "profile"] as const,
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      return MarketingService.fetchDistributorProfile(user.id);
    },
  });
}

export function useDistributorDefault() {
  return useQuery({
    queryKey: [...queryKeys.distributor, "default"] as const,
    queryFn: () => ({ id: null, name: "Distribuidor" }),
  });
}
