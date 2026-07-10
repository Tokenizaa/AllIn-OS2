import { useQuery } from "@tanstack/react-query";
import { BonusService, BonusHistorico } from "@/services/bonus";

/**
 * useBonus (Sprint 6 — REDESIGN)
 *
 * Hook canônico para bônus MLM.
 *
 * Usa mlm.bonus_historico + mlm.bonus_regras (tabelas REAIS).
 */
export function useBonusHistory(distribuidorId?: string, limit = 100) {
  return useQuery<BonusHistorico[]>({
    queryKey: ["bonus", "history", distribuidorId, limit],
    queryFn: () => BonusService.fetchBonusHistory({ distribuidor_id: distribuidorId, limit }),
  });
}

export function useActiveBonusRules() {
  return useQuery({
    queryKey: ["bonus", "rules", "active"],
    queryFn: () => BonusService.fetchActiveRules(),
    staleTime: 10 * 60 * 1000,
  });
}
