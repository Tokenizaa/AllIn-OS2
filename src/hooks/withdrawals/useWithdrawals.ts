import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import { WithdrawalService, SolicitacaoSaque, WithdrawalStatus } from "@/services/withdrawals";

export function useWithdrawals(options: { status?: WithdrawalStatus; limit?: number } = {}) {
  const { status, limit = 100 } = options;
  return useQuery<SolicitacaoSaque[]>({
    queryKey: queryKeys.withdrawals2.list(status, limit),
    queryFn: () => WithdrawalService.fetchWithdrawals({ status, limit }),
  });
}

export function useRecentWithdrawals(limit = 5) {
  return useQuery<SolicitacaoSaque[]>({
    queryKey: queryKeys.withdrawals2.recent(limit),
    queryFn: () => WithdrawalService.fetchRecentWithdrawals(limit),
  });
}

export function useWithdrawalsByDistribuidor(distribuidorId: string | null) {
  return useQuery<SolicitacaoSaque[]>({
    queryKey: queryKeys.withdrawals2.byDistribuidor(distribuidorId || undefined),
    queryFn: () => WithdrawalService.fetchWithdrawalsByDistribuidor(distribuidorId as string),
    enabled: !!distribuidorId,
  });
}
