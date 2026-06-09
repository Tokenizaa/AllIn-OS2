import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import { WalletService } from "@/services/wallets";

export function useWithdrawals() {
  return useQuery({
    queryKey: queryKeys.wallets,
    staleTime: 0,
    refetchOnMount: "always",
    queryFn: async () => {
      const withdrawalsData = await WalletService.fetchWithdrawals();
      const transformedWithdrawals = withdrawalsData.map(w => ({
        id: w.id,
        user: w.user_name,
        valor: Number(w.valor || 0),
        metodo: w.metodo,
        status: w.status,
        risco: w.risco,
      }));
      const summary = {
        total: transformedWithdrawals.reduce((sum, w) => sum + Number(w.valor || 0), 0),
        pending: transformedWithdrawals.filter(w => w.status === "pendente").length,
        approved: transformedWithdrawals.filter(w => w.status === "aprovado").length,
        anomalies: transformedWithdrawals.filter(w => w.risco).length,
      };
      return { saques: transformedWithdrawals, summary };
    },
  });
}
