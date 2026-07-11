import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import { WithdrawalService, SolicitacaoSaque } from "@/services/withdrawals";

export function useWithdrawals() {
  return useQuery({
    queryKey: [...queryKeys.wallets, "withdrawals"] as const,
    queryFn: async () => {
      const withdrawals = await WithdrawalService.fetchWithdrawals({});
      const transformedWithdrawals = withdrawals.map((w: SolicitacaoSaque) => ({
        id: w.id,
        user: w.distribuidor_nome,
        valor: Number(w.valor_solicitado || 0),
        metodo: w.tipo_conta,
        status: w.status_descricao,
        risco: false,
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