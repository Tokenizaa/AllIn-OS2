import { useQuery } from "@tanstack/react-query";
import { WithdrawalService, SolicitacaoSaque, WithdrawalStatus } from "@/services/withdrawals";

/**
 * useWithdrawals (Sprint 6 — REDESIGN)
 *
 * Hook canônico para buscar solicitações de saque.
 *
 * Usa finance.solicitacoes_saque (tabela REAL).
 *
 * Migrado do antigo `WalletService.fetchWithdrawals` (método inexistente no
 * WalletService legado).
 */
export function useWithdrawals(options: { status?: WithdrawalStatus; limit?: number } = {}) {
  const { status, limit = 100 } = options;
  return useQuery<SolicitacaoSaque[]>({
    queryKey: ["withdrawals", "real", status, limit],
    queryFn: () => WithdrawalService.fetchWithdrawals({ status, limit }),
  });
}

export function useRecentWithdrawals(limit = 5) {
  return useQuery<SolicitacaoSaque[]>({
    queryKey: ["withdrawals", "real", "recent", limit],
    queryFn: () => WithdrawalService.fetchRecentWithdrawals(limit),
  });
}

export function useWithdrawalsByDistribuidor(distribuidorId: string | null) {
  return useQuery<SolicitacaoSaque[]>({
    queryKey: ["withdrawals", "real", "distribuidor", distribuidorId],
    queryFn: () => WithdrawalService.fetchWithdrawalsByDistribuidor(distribuidorId as string),
    enabled: !!distribuidorId,
  });
}
