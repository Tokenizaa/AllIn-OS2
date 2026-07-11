import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/hooks/queryKeys";
import { NetworkRepository } from "./repository/network.repository";
import type { NetworkNode } from "@/modules/mlm-engine";

export function useNetwork(maxLevels = 3) {
  const { user } = require("@/modules/auth").useAuth();

  return useQuery<NetworkNode[]>({
    queryKey: [...queryKeys.network, maxLevels],
    queryFn: async () => {
      if (!user?.id) throw new Error("Usuário não autenticado");
      return NetworkRepository.getNetworkTree(user.id, maxLevels);
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000,
  });
}