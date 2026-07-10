import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import { PlanService } from "@/services/plans";

export function usePlanAnalytics() {
  return useQuery({
    queryKey: [...queryKeys.plans, "analytics"],
    queryFn: () => PlanService.getPlanAnalytics(),
  });
}
