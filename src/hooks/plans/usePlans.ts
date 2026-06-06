import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import { PlanService } from "@/services/plans";

export function usePlans() {
  return useQuery({ queryKey: queryKeys.plans, queryFn: () => PlanService.fetchActivePlans() });
}
