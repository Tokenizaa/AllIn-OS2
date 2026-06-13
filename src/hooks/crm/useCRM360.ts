/**
 * useCRM360
 * 
 * Hook para dados de CRM usando CRM360Service
 * Responsabilidades:
 * - Pedidos do cliente
 * - Itens de pedido
 * - Produtos comprados
 */

import { useQuery } from "@tanstack/react-query";
import { CRM360Service } from "@/services/crm360";

export function useCRM360(profileId?: string, idComprador?: string) {
  return useQuery({
    queryKey: ["crm360", profileId, idComprador],
    enabled: !!profileId || !!idComprador,
    queryFn: () => {
      if (!profileId && !idComprador) throw new Error("profileId or idComprador is required");
      return CRM360Service.getCRM360(profileId || "", idComprador);
    },
  });
}
