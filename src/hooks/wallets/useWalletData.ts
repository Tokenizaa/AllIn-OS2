import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import { PointsService } from "@/services/points";
import { BonusService } from "@/services/bonus";
import { MlmEngineService } from "@/services/mlm-engine";

export function useWalletData(customerId?: string | null) {
  return useQuery({
    queryKey: customerId ? queryKeys.walletData(customerId) : queryKeys.wallets,
    queryFn: async () => {
      if (!customerId) return null;
      
      // Use MLM Engine wallet module for main wallet
      const [walletBalance, pointsBalance, bonusHistory, walletTxs, pointsTxs] = await Promise.all([
        MlmEngineService.wallet.getBalance(customerId),
        PointsService.fetchPointsByDistribuidor(customerId),
        BonusService.fetchBonusByDistribuidor(customerId),
        MlmEngineService.wallet.getTransactions(customerId, 10),
        PointsService.fetchTransactionsByDistribuidor(customerId, { limit: 10 }),
      ]);

      // Calculate bonus balance from bonus history (only approved/paid)
      const bonusBalance = bonusHistory
        .filter((b: any) => ['aprovado', 'pago'].includes(b.status))
        .reduce((sum: number, b: any) => sum + Number(b.valor_calculado || 0), 0);

      return {
        balance: walletBalance.saldo,
        availableBalance: walletBalance.disponivel,
        frozenBalance: walletBalance.bloqueado,
        currency: "BRL",
        bonusBalance,
        points: pointsBalance?.saldo_atual || 0,
        recentTransactions: walletTxs.map((tx: any) => ({
          id: tx.id,
          type: tx.valor >= 0 ? 'credit' : 'debit',
          amount: Math.abs(tx.valor),
          balance: tx.saldo_depois,
          description: tx.descricao,
          date: tx.created_at,
          created_at: tx.created_at,
        })),
        bonusTransactions: bonusHistory.map((b: any) => ({
          id: b.id,
          amount: b.valor_calculado,
          description: b.referencia_tipo || b.tipo,
          created_at: b.data_calculo,
          status: b.status,
        })),
        pointsTransactions: pointsTxs.map((tx: any) => ({
          id: tx.id,
          amount: tx.quantidade,
          description: tx.descricao || tx.origem || tx.tipo,
          created_at: tx.created_at,
          source_type: tx.tipo,
        })),
      };
    },
    enabled: !!customerId,
  });
}
