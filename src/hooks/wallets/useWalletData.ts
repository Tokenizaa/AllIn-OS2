import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import { getWalletBalance, getWalletTransactions, ensureWallet, creditWallet, debitWallet } from "@/lib/api/wallet.functions";
import { getBonusWalletBalance, getBonusTransactions, ensureBonusWallet } from "@/lib/api/bonus-wallet.functions";
import { getPointsWalletBalance, getPointsTransactions, ensurePointsWallet } from "@/lib/api/points-wallet.functions";

export function useWalletData(idComprador?: string | null) {
  return useQuery({
    queryKey: idComprador ? queryKeys.walletData(idComprador) : queryKeys.wallets,
    queryFn: async () => {
      if (!idComprador) return null;
      try {
        await Promise.all([ensureWallet({ idComprador }), ensureBonusWallet({ idComprador }), ensurePointsWallet({ idComprador })]);
      } catch {
        // Silently ignore wallet creation errors
      }
      const [walletRes, bonusRes, pointsRes, txsRes, bonusTxsRes, pointsTxsRes] = await Promise.all([
        getWalletBalance({ idComprador }),
        getBonusWalletBalance({ idComprador }),
        getPointsWalletBalance({ idComprador }),
        getWalletTransactions({ idComprador, limit: 10 }),
        getBonusTransactions({ idComprador, limit: 10 }),
        getPointsTransactions({ idComprador, limit: 10 }),
      ]);
      const balanceInfo = walletRes.success ? walletRes.data : { balance: 0, availableBalance: 0, frozenBalance: 0 };
      const bonusInfo = bonusRes.success ? bonusRes.data : { balance: 0, availableBalance: 0 };
      const pointsInfo = pointsRes.success ? pointsRes.data : { balance: 0, availableBalance: 0 };
      return {
        balance: Number((balanceInfo as any).balance || 0),
        availableBalance: Number((balanceInfo as any).availableBalance || 0),
        frozenBalance: Number((balanceInfo as any).frozenBalance || 0),
        currency: "BRL",
        bonusBalance: Number((bonusInfo as any).balance || 0),
        points: Number((pointsInfo as any).balance || 0),
        recentTransactions: txsRes.success && (txsRes.data as any)?.data ? (txsRes.data as any).data : [],
        bonusTransactions: bonusTxsRes.success && (bonusTxsRes.data as any)?.data ? (bonusTxsRes.data as any).data : [],
        pointsTransactions: pointsTxsRes.success && (pointsTxsRes.data as any)?.data ? (pointsTxsRes.data as any).data : [],
      };
    },
    enabled: !!idComprador,
  });
}
