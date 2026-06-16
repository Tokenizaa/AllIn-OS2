import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import { httpClient } from "@/lib/api-client/http-client";

export function usePlanBonuses(planId: string) {
  return useQuery({
    queryKey: [...queryKeys.plans, "bonuses", planId],
    queryFn: async () => {
      const result = await httpClient.getPlanBonuses(planId);
      if (!result.success) {
        throw new Error(result.error || "Failed to fetch plan bonuses");
      }
      return result.data;
    },
    enabled: !!planId,
  });
}
