import { useMutation } from "@tanstack/react-query";
import { MlmEngineService } from "@/services/mlm-engine";

export function useCreateWalletTransaction() {
  return useMutation({
    mutationFn: async (data: {
      distribuidorId: string;
      transaction_type: "credit" | "debit";
      amount: number;
      balance_before: number;
      balance_after: number;
      description: string;
    }) => {
      if (data.transaction_type === "credit") {
        return MlmEngineService.wallet.addFunds(
          data.distribuidorId,
          data.amount,
          data.description
        );
      } else {
        return MlmEngineService.wallet.withdraw(data.distribuidorId, data.amount);
      }
    },
  });
}