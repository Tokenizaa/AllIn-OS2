import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import { NetworkService } from "@/services/network";
import { ProfileService } from "@/services/profiles";

export function useNetwork(limit = 12) {
  return useQuery({
    queryKey: queryKeys.network,
    queryFn: async () => {
      const [distributorData, relationshipData] = await Promise.all([
        ProfileService.fetchDistributors(20),
        NetworkService.fetchRecentNetworkRelationships(limit),
      ]);
      const legs = (relationshipData || []).map((r: any, i: number) => ({
        name: `G${i + 1}`,
        esquerda: Number(r.left_count || r.left_side_count || 0),
        direita: Number(r.right_count || r.right_side_count || 0),
      }));

      return { customers: distributorData || [], legs, relationships: relationshipData || [] };
    },
  });
}
