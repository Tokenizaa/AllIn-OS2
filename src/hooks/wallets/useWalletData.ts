import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import { WalletService } from "@/services/wallets";

export function useWalletData(customerId?: string | null) {
  return useQuery({
    queryKey: customerId ? queryKeys.walletData(customerId) : queryKeys.wallets,
    queryFn: async () => {
      if (!customerId) return null;
      try {
        await Promise.all([WalletService.ensureWallet({ customerId }), WalletService.ensureBonusWallet({ customerId }), WalletService.ensurePointsWallet({ customerId })]);
      } catch {}
      const [walletRes, bonusRes, pointsRes, txsRes, bonusTxsRes, pointsTxsRes] = await Promise.all([
        WalletService.getWalletBalance({ customerId }),
        WalletService.getBonusWalletBalance({ customerId }),
        WalletService.getPointsWalletBalance({ customerId }),
        WalletService.getWalletTransactions({ customerId, limit: 10 }),
        WalletService.getBonusTransactions({ customerId, limit: 10 }),
        WalletService.getPointsTransactions({ customerId, limit: 10 }),
      ]);
      const balanceInfo: any = walletRes.success ? walletRes.data : { balance: 0, available_balance: 0, frozen_balance: 0 };
      const bonusInfo: any = bonusRes.success ? bonusRes.data : { balance: 0, available_balance: 0 };
      const pointsInfo: any = pointsRes.success ? pointsRes.data : { balance: 0, available_balance: 0 };
      return {
        balance: Number(balanceInfo.balance || 0),
        availableBalance: Number(balanceInfo.available_balance || 0),
        frozenBalance: Number(balanceInfo.frozen_balance || 0),
        currency: "BRL",
        bonusBalance: Number(bonusInfo.balance || 0),
        points: Number(pointsInfo.balance || 0),
        recentTransactions: txsRes.success && txsRes.data ? txsRes.data : [],
        bonusTransactions: bonusTxsRes.success && bonusTxsRes.data ? bonusTxsRes.data : [],
        pointsTransactions: pointsTxsRes.success && pointsTxsRes.data ? pointsTxsRes.data : [],
      };
    },
    enabled: !!customerId,
  });
}
