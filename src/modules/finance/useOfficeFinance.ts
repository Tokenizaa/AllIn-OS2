import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/hooks/queryKeys";
import { OfficeFinanceRepository } from "./repository";
import type { OfficeFinanceViewModel } from "./repository";
import { useAuth } from "@/modules/auth";

export function useOfficeFinance() {
  const { user } = useAuth();

  return useQuery<OfficeFinanceViewModel>({
    queryKey: queryKeys.office.finance,
    queryFn: async () => {
      if (!user?.id) throw new Error("Usuário não autenticado");
      return OfficeFinanceRepository.getDashboardData(user.id);
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000,
  });
}