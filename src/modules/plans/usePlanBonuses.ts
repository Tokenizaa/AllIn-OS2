import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/hooks/queryKeys";
import { PlansRepository } from "./repository";
import type { BonusRule } from "./repository";

export function usePlanBonuses(planId: string) {
  return useQuery<BonusRule[]>({
    queryKey: [...queryKeys.bonus.rules, planId],
    queryFn: async () => {
      const { activeRules } = await PlansRepository.getPlansWithRules();
      return activeRules.filter((r) => r.plan_id === planId);
    },
    enabled: !!planId,
    staleTime: 10 * 60 * 1000,
  });
}