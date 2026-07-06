import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import { getWalletBalance, getWalletTransactions, ensureWallet, creditWallet, debitWallet } from "@/lib/api/wallet.functions";
import { getBonusWalletBalance, getBonusTransactions, ensureBonusWallet } from "@/lib/api/bonus-wallet.functions";
import { getPointsWalletBalance, getPointsTransactions, ensurePointsWallet } from "@/lib/api/points-wallet.functions";

export function useWalletData(customerId?: string | null) {
  return useQuery({
    queryKey: customerId ? queryKeys.walletData(customerId) : queryKeys.wallets,
    queryFn: async () => {
      if (!customerId) return null;
      try {
        await Promise.all([ensureWallet({ customerId }), ensureBonusWallet({ customerId }), ensurePointsWallet({ customerId })]);
      } catch {}
      const [walletRes, bonusRes, pointsRes, txsRes, bonusTxsRes, pointsTxsRes] = await Promise.all([
        getWalletBalance({ customerId }),
        getBonusWalletBalance({ customerId }),
        getPointsWalletBalance({ customerId }),
        getWalletTransactions({ customerId, limit: 10 }),
        getBonusTransactions({ customerId, limit: 10 }),
        getPointsTransactions({ customerId, limit: 10 }),
      ]);
      const balanceInfo = walletRes.success ? walletRes.data : { balance: 0, availableBalance: 0, frozenBalance: 0 };
      const bonusInfo = bonusRes.success ? bonusRes.data : { balance: 0, availableBalance: 0 };
      const pointsInfo = pointsRes.success ? pointsRes.data : { balance: 0, availableBalance: 0 };
      return {
        balance: Number(balanceInfo.balance || 0),
        availableBalance: Number(balanceInfo.availableBalance || 0),
        frozenBalance: Number(balanceInfo.frozenBalance || 0),
        currency: "BRL",
        bonusBalance: Number(bonusInfo.balance || 0),
        points: Number(pointsInfo.balance || 0),
        recentTransactions: txsRes.success && txsRes.data?.data ? txsRes.data.data : [],
        bonusTransactions: bonusTxsRes.success && bonusTxsRes.data?.data ? bonusTxsRes.data.data : [],
        pointsTransactions: pointsTxsRes.success && pointsTxsRes.data?.data ? pointsTxsRes.data.data : [],
      };
    },
    enabled: !!customerId,
  });
}
