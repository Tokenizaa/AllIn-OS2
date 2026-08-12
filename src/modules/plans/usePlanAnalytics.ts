import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/hooks/queryKeys";
import { PlansRepository } from "./repository";
import type { Plan } from "./repository";

export function usePlanAnalytics() {
  return useQuery<Plan[]>({
    queryKey: [...queryKeys.plans, "analytics"],
    queryFn: async () => {
      const { plans } = await PlansRepository.getPlansWithRules();
      return plans;
    },
    staleTime: 10 * 60 * 1000,
  });
}