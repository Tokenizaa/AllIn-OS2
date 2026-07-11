import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/hooks/queryKeys";
import { CommissionsRepository } from "./repository";
import type { CommissionsViewModel } from "./types";

export function useCommissionsDashboard(limit = 100) {
  return useQuery<CommissionsViewModel>({
    queryKey: [...queryKeys.commissions, limit] as const,
    queryFn: () => CommissionsRepository.getDashboardData(limit),
    staleTime: 5 * 60 * 1000,
  });
}
