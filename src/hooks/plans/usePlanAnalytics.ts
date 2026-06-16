import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import { httpClient } from "@/lib/api-client/http-client";

export function usePlanAnalytics() {
  return useQuery({
    queryKey: [...queryKeys.plans, "analytics"],
    queryFn: async () => {
      const result = await httpClient.getPlanAnalytics();
      if (!result.success) {
        throw new Error(result.error || "Failed to fetch plan analytics");
      }
      return result.data;
    },
  });
}
