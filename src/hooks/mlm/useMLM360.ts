/**
 * useMLM360
 * 
 * Hook para dados de MLM usando MLM360Service
 * Responsabilidades:
 * - Relacionamentos de rede
 * - Downlines (indicações diretas)
 * - Sponsor (patrocinador)
 */

import { useQuery } from "@tanstack/react-query";
import { MLM360Service } from "@/services/mlm360";

export function useMLM360(profileId?: string, idComprador?: string) {
  return useQuery({
    queryKey: ["mlm360", profileId, idComprador],
    enabled: !!profileId || !!idComprador,
    queryFn: () => {
      if (!profileId && !idComprador) throw new Error("profileId or idComprador is required");
      return MLM360Service.getMLM360(profileId || "", idComprador);
    },
  });
}
