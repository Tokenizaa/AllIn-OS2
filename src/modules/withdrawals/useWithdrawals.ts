import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/hooks/queryKeys";
import { WithdrawalsRepository } from "./repository";
import type { WithdrawalsViewModel } from "./repository";

export function useWithdrawalsDashboard() {
  return useQuery<WithdrawalsViewModel>({
    queryKey: queryKeys.withdrawals2.list("all", 100),
    queryFn: () => WithdrawalsRepository.getDashboardData(),
    staleTime: 5 * 60 * 1000,
  });
}