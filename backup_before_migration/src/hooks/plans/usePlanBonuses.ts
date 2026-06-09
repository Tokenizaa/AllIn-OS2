import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import { getPlanBonuses } from "@/lib/api/plans.functions";

export function usePlanBonuses(planId: string) {
  return useQuery({
    queryKey: [...queryKeys.plans, "bonuses", planId],
    queryFn: () => getPlanBonuses({ planId }),
    enabled: !!planId,
  });
}
