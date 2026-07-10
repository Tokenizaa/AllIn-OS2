import { useQuery } from "@tanstack/react-query";
import { PointsService, PontosTransacao } from "@/services/points";

/**
 * usePoints (Sprint 6 — REDESIGN)
 *
 * Hook canônico para pontos de fidelidade.
 *
 * Usa mlm.pontos_saldo + mlm.pontos_transacoes (tabelas REAIS).
 *
 * Substitui WalletService.ensurePointsWallet e hooks de "points_wallets"
 * (tabela inexistente).
 */
export function usePointsByDistribuidor(distribuidorId: string | null) {
  return useQuery({
    queryKey: ["points", "saldo", distribuidorId],
    queryFn: () => PointsService.fetchPointsByDistribuidor(distribuidorId as string),
    enabled: !!distribuidorId,
  });
}

export function usePointsTransactions(distribuidorId: string | null, limit = 50) {
  return useQuery<PontosTransacao[]>({
    queryKey: ["points", "transactions", distribuidorId, limit],
    queryFn: () => PointsService.fetchTransactionsByDistribuidor(distribuidorId as string, { limit }),
    enabled: !!distribuidorId,
  });
}
