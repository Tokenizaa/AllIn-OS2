import { useMutation } from "@tanstack/react-query";
import { MlmEngineService } from "@/services/mlm-engine";

export function useWalletActions(customerId?: string | null, onSettled?: () => void) {
  const credit = useMutation({
    mutationFn: async (amount: number) => {
      if (!customerId) throw new Error("No customer ID");
      return MlmEngineService.wallet.addFunds(customerId, amount, "manual", undefined);
    },
    onSuccess: onSettled,
  });

  const debit = useMutation({
    mutationFn: async (amount: number) => {
      if (!customerId) throw new Error("No customer ID");
      return MlmEngineService.wallet.withdraw(customerId, amount);
    },
    onSuccess: onSettled,
  });

  return { credit, debit };
}
