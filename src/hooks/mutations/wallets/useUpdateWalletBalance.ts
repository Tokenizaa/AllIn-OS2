import { useMutation } from "@tanstack/react-query";
import { MlmEngineService } from "@/services/mlm-engine";

export function useUpdateWalletBalance() {
  return useMutation({
    mutationFn: async (data: { distribuidorId: string; balance: number }) => {
      const current = await MlmEngineService.wallet.getBalance(data.distribuidorId);
      const diff = data.balance - current.saldo;
      if (diff > 0) {
        return MlmEngineService.wallet.addFunds(data.distribuidorId, diff, "admin_adjustment");
      } else if (diff < 0) {
        return MlmEngineService.wallet.withdraw(data.distribuidorId, Math.abs(diff));
      }
      return current;
    },
  });
}
