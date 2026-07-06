import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import { WalletService } from "@/services/wallets";
import { ProfileService } from "@/services/profiles";

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
      // MIGRAÇÃO EM PROGRESSO: Usando ProfileService em vez de CustomerService
      const [withdrawalsData, profileData, profilesData] = await Promise.all([
        WalletService.fetchRecentWithdrawals(50),
        WalletService.fetchWorkspaceSettings(),
        ProfileService.fetchAnalyticsProfiles(),
      ]);

      const profiles = profilesData || [];
      const currentProfile = profiles[0];
      let customerBonus: CustomerBonus | null = null;

      // MIGRAÇÃO EM PROGRESSO: Usando ProfileService em vez de CustomerService
      if (currentProfile?.id) {
        try {
          // fetchProfileBonus is deprecated - skip for now
          // customerBonus = await ProfileService.fetchProfileBonus(currentProfile.id);
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
