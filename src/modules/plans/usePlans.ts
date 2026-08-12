import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/hooks/queryKeys";
import { PlansRepository } from "./repository";
import type { PlansViewModel } from "./repository";

export function usePlans() {
  return useQuery<PlansViewModel>({
    queryKey: queryKeys.plans,
    queryFn: () => PlansRepository.getPlansWithRules(),
    staleTime: 10 * 60 * 1000,
  });
}

export function usePlansList() {
  const { data } = usePlans();
  return data?.plans ?? [];
}