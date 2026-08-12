import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import { PointsService, PontosTransacao } from "@/services/points";

export function usePointsByDistribuidor(distribuidorId: string | null) {
  return useQuery({
    queryKey: queryKeys.points.saldo(distribuidorId || undefined),
    queryFn: () => PointsService.fetchPointsByDistribuidor(distribuidorId as string),
    enabled: !!distribuidorId,
  });
}

export function usePointsTransactions(distribuidorId: string | null, limit = 50) {
  return useQuery<PontosTransacao[]>({
    queryKey: queryKeys.points.transactions(distribuidorId || undefined, limit),
    queryFn: () => PointsService.fetchTransactionsByDistribuidor(distribuidorId as string, { limit }),
    enabled: !!distribuidorId,
  });
}
