import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import { getPlanAnalytics } from "@/lib/api/plans.functions";

export function usePlanAnalytics() {
  return useQuery({
    queryKey: [...queryKeys.plans, "analytics"],
    queryFn: getPlanAnalytics,
  });
}
