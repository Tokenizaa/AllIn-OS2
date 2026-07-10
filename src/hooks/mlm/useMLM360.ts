/**
 * useMLM360
 * 
 * Hook para dados de MLM usando Customer360Service
 * Responsabilidades:
 * - Relacionamentos de rede
 * - Downlines (indicações diretas)
 * - Sponsor (patrocinador)
 */

import { useQuery } from "@tanstack/react-query";
import { Customer360Service } from "@/services/customer360";

export function useMLM360(profileId?: string, idComprador?: string) {
  return useQuery({
    queryKey: ["mlm360", profileId, idComprador],
    enabled: !!profileId || !!idComprador,
    queryFn: async () => {
      if (!profileId && !idComprador) throw new Error("profileId or idComprador is required");

      const identifier = idComprador || profileId || "";
      const isUuid = identifier && identifier.length > 20;

      const data = await (isUuid
        ? Customer360Service.getCustomer360ByIdComprador(identifier, {
            includeOrders: false,
            includeOrderItems: false,
            includeProducts: false,
            includeAffinities: false,
            includeWalletTransactions: false,
            includeNetwork: true,
            includeDownlines: true,
            includeSponsor: true,
          })
        : Customer360Service.getCustomer360ByIdComprador(identifier, {
            includeOrders: false,
            includeOrderItems: false,
            includeProducts: false,
            includeAffinities: false,
            includeWalletTransactions: false,
            includeNetwork: true,
            includeDownlines: true,
            includeSponsor: true,
          }));

      return {
        networkRelationships: data.networkRelationships || [],
        downlines: data.downlines || [],
        sponsor: data.sponsor || null,
      };
    },
  });
}
