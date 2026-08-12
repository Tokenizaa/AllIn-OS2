import { useMutation } from "@tanstack/react-query";
import { MlmEngineService } from "@/services/mlm-engine";

export function useCreateWallet() {
  return useMutation({
    mutationFn: async (customerId: string) => {
      return MlmEngineService.wallet.getBalance(customerId);
    },
  });
}
