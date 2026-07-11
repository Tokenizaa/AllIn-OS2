import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import { WithdrawalService } from "@/services/withdrawals";

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
    queryFn: async () => {
      const withdrawalsData = await WithdrawalService.fetchRecentWithdrawals(50);
      return {
        withdrawals: withdrawalsData as WithdrawalRow[],
        wallet: {} as WalletRow,
      };
    },
  });
}
