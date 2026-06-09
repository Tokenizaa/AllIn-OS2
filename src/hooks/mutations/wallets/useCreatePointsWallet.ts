import { useMutation } from "@tanstack/react-query";
import { ensurePointsWallet } from "@/lib/api/points-wallet.functions";

export function useCreatePointsWallet() {
  return useMutation({
    mutationFn: async (idComprador: string) => {
      const result = await ensurePointsWallet({ idComprador });
      if (!result.success) {
        throw new Error(result.error || "Failed to create points wallet");
      }
      return result.data;
    },
  });
}
