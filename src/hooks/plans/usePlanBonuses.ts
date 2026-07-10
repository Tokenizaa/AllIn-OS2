import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import { PlanService } from "@/services/plans";

export function usePlanBonuses(planId: string) {
  return useQuery({
    queryKey: [...queryKeys.plans, "bonuses", planId],
    queryFn: () => PlanService.getPlanBonuses({ planId }),
    enabled: !!planId,
  });
}
