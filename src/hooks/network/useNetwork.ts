import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import { NetworkService } from "@/services/network";
import { CustomerService } from "@/services/customers";
import { ProfileService } from "@/services/profiles";

export function useNetwork(limit = 12) {
  return useQuery({
    queryKey: queryKeys.network,
    queryFn: async () => {
      // MIGRAÇÃO EM PROGRESSO: Usando ProfileService em vez de CustomerService
      // Quando a migração estiver completa, remover CustomerService completamente
      const [customerData, relationshipData] = await Promise.all([
        ProfileService.fetchRecentProfiles(20),
        NetworkService.fetchRecentNetworkRelationships(limit),
      ]);
      const legs = (relationshipData || []).map((r: any, i: number) => ({ name: `G${i + 1}`, esquerda: Number(r.left_count || r.left_side_count || 0), direita: Number(r.right_count || r.right_side_count || 0) }));
      return { customers: customerData || [], legs };
    },
  });
}
