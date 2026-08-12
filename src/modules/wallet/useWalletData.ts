import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/hooks/queryKeys";
import { WalletRepository } from "./repository/wallet.repository";
import type { WalletViewModel } from "./types";
import { useAuth } from "@/modules/auth";

export function useWalletData(customerId?: string | null) {
  const { user } = useAuth();
  const targetId = customerId ?? user?.id;

  return useQuery<WalletViewModel>({
    queryKey: targetId ? queryKeys.walletData(targetId) : queryKeys.wallets,
    queryFn: async () => {
      if (!targetId) throw new Error("Customer ID não disponível");
      return WalletRepository.getWalletData(targetId);
    },
    enabled: !!targetId,
    staleTime: 5 * 60 * 1000,
  });
}