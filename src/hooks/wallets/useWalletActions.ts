import { useMutation } from "@tanstack/react-query";
import { httpClient } from "@/lib/api-client/http-client";

export function useWalletActions(idComprador?: string | null, onSettled?: () => void) {
  const credit = useMutation({
    mutationFn: async (amount: number) => {
      if (!idComprador) throw new Error("No ID Comprador");
      const result = await httpClient.creditWallet(
        idComprador,
        amount,
        "Adição de fundos via simulação",
        undefined,
        "manual"
      );
      if (!result.success) {
        throw new Error(result.error || "Failed to credit wallet");
      }
      return result.data;
    },
    onSuccess: onSettled,
  });

  const debit = useMutation({
    mutationFn: async (amount: number) => {
      if (!idComprador) throw new Error("No ID Comprador");
      const result = await httpClient.debitWallet(
        idComprador,
        amount,
        "Saque de fundos via simulação",
        undefined,
        "withdrawal"
      );
      if (!result.success) {
        throw new Error(result.error || "Failed to debit wallet");
      }
      return result.data;
    },
    onSuccess: onSettled,
  });

  return { credit, debit };
}
