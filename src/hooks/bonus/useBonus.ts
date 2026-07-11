import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import { BonusService, BonusHistorico } from "@/services/bonus";

export function useBonusHistory(distribuidorId?: string, limit = 100) {
  return useQuery<BonusHistorico[]>({
    queryKey: queryKeys.bonus.history(distribuidorId, limit),
    queryFn: () => BonusService.fetchBonusHistory({ distribuidor_id: distribuidorId, limit }),
  });
}

export function useActiveBonusRules() {
  return useQuery({
    queryKey: queryKeys.bonus.rules,
    queryFn: () => BonusService.fetchActiveRules(),
  });
}
