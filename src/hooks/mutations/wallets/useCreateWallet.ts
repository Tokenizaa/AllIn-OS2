import { useMutation } from "@tanstack/react-query";
import { WalletService } from "@/services/wallets";

export function useCreateWallet() {
  return useMutation({
    mutationFn: async (customerId: string) => {
      return WalletService.ensureWallet({ customerId });
    },
  });
}
