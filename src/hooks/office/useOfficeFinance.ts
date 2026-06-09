import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import { WalletService } from "@/services/wallets";
import { CustomerService } from "@/services/customers";

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

type CustomerBonus = {
  id_comprador?: string;
  total_bonus?: number;
  direct_bonus?: number;
  network_bonus?: number;
};

export function useOfficeFinance() {
  return useQuery({
    queryKey: queryKeys.office.finance,
    staleTime: 0,
    refetchOnMount: "always",
    queryFn: async () => {
      const [withdrawalsData, profileData, customersData] = await Promise.all([
        WalletService.fetchRecentWithdrawals(50),
        WalletService.fetchWorkspaceSettings(),
        CustomerService.fetchAnalyticsCustomers(),
      ]);

      const customers = customersData || [];
      const currentCustomer = customers[0];
      let customerBonus: CustomerBonus | null = null;

      if (currentCustomer?.id_comprador) {
        try {
          customerBonus = await CustomerService.fetchCustomerBonus(currentCustomer.id_comprador);
        } catch (error) {
          console.error("Error fetching customer bonus:", error);
        }
      }

      return {
        withdrawals: (withdrawalsData as WithdrawalRow[]) || [],
        wallet: (profileData as WalletRow) || {},
        customerBonus,
      };
    },
  });
}
