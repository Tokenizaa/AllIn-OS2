import { useMutation } from "@tanstack/react-query";
import { PointsService } from "@/services/points";

export function useCreatePointsWallet() {
  return useMutation({
    mutationFn: async (customerId: string) => {
      return PointsService.fetchPointsByDistribuidor(customerId);
    },
  });
}
