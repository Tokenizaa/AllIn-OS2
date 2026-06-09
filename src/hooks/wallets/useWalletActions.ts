import { useMutation } from "@tanstack/react-query";
import { creditWallet, debitWallet } from "@/lib/api/wallet.functions";

export function useWalletActions(idComprador?: string | null, onSettled?: () => void) {
  const credit = useMutation({
    mutationFn: async (amount: number) => {
      if (!idComprador) throw new Error("No ID Comprador");
      return creditWallet({
        idComprador,
        amount,
        description: "Adição de fundos via simulação",
        referenceType: "manual",
      });
    },
    onSuccess: onSettled,
  });

  const debit = useMutation({
    mutationFn: async (amount: number) => {
      if (!idComprador) throw new Error("No ID Comprador");
      return debitWallet({
        idComprador,
        amount,
        description: "Saque de fundos via simulação",
        referenceType: "withdrawal",
      });
    },
    onSuccess: onSettled,
  });

  return { credit, debit };
}
