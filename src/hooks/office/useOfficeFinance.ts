import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import { WalletService } from "@/services/wallets";

type WalletRow = {
  balance_available?: number | null;
  balance_blocked?: number | null;
  balance_pending?: number | null;
  total_year?: number | null;
  total_month?: number | null;
};

type WithdrawalRow = {
  id: string;
  description?: string | null;
  type?: string | null;
  amount?: number | null;
  created_at?: string | null;
};

export function useOfficeFinance() {
  return useQuery({
    queryKey: queryKeys.office.finance,
    staleTime: 0,
    refetchOnMount: "always",
    queryFn: async () => {
      const [withdrawalsRes, profileData] = await Promise.all([
        WalletService.fetchWithdrawals(50),
        Promise.resolve({}),
      ]);
      const withdrawalsData = ((withdrawalsRes as any)?.data as any[]) || [];
      return {
        withdrawals: withdrawalsData as WithdrawalRow[],
        wallet: (profileData as WalletRow) || {},
      };
    },
  });
}
