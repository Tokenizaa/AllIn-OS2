import { useMutation } from "@tanstack/react-query";
import { ensureWallet } from "@/lib/api/wallet.functions";

export function useCreateWallet() {
  return useMutation({
    mutationFn: async (customerId: string) => {
      const result = await ensureWallet({ customerId });
      if (!result.success) {
        throw new Error(result.error || "Failed to create wallet");
      }
      return result.data;
    },
  });
}
