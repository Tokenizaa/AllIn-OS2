/**
 * useFinance360
 * 
 * Hook para dados financeiros usando Finance360Service
 * Responsabilidades:
 * - Carteira monetária
 * - Carteira de pontos
 * - Transações da carteira
 */

import { useQuery } from "@tanstack/react-query";
import { Finance360Service } from "@/services/finance360";

export function useFinance360(profileId?: string, idComprador?: string) {
  return useQuery({
    queryKey: ["finance360", profileId, idComprador],
    enabled: !!profileId || !!idComprador,
    queryFn: () => {
      if (!profileId && !idComprador) throw new Error("profileId or idComprador is required");
      return Finance360Service.getFinance360(profileId || "", idComprador);
    },
  });
}
