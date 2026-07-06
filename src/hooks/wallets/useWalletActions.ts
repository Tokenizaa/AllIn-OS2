import { useMutation } from "@tanstack/react-query";
import { creditWallet, debitWallet } from "@/lib/api/wallet.functions";

export function useWalletActions(customerId?: string | null, onSettled?: () => void) {
  const credit = useMutation({
    mutationFn: async (amount: number) => {
      if (!customerId) throw new Error("No customer ID");
      return creditWallet({
        customerId,
        amount,
        description: "Adição de fundos via simulação",
        referenceType: "manual",
      });
    },
    onSuccess: onSettled,
  });

  const debit = useMutation({
    mutationFn: async (amount: number) => {
      if (!customerId) throw new Error("No customer ID");
      return debitWallet({
        customerId,
        amount,
        description: "Saque de fundos via simulação",
        referenceType: "withdrawal",
      });
    },
    onSuccess: onSettled,
  });

  return { credit, debit };
}
