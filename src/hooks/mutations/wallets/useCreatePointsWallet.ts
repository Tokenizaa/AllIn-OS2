import { useMutation } from "@tanstack/react-query";
import { WalletService } from "@/services/wallets";

export function useCreatePointsWallet() {
  return useMutation({
    mutationFn: async (customerId: string) => {
      return WalletService.ensurePointsWallet({ customerId });
    },
  });
}
