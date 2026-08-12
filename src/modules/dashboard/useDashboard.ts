import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/hooks/queryKeys";
import { DashboardRepository } from "./repository";
import type { DashboardViewModel } from "./types";
import { useAuth } from "@/modules/auth";

export function useDashboard() {
  const { user } = useAuth();

  return useQuery<DashboardViewModel>({
    queryKey: queryKeys.office.dashboard,
    queryFn: async () => {
      if (!user?.id) {
        throw new Error("Usuário não autenticado");
      }
      return DashboardRepository.getDashboardData(user.id);
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000,
  });
}