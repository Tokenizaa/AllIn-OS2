import { useMutation } from "@tanstack/react-query";
import { httpClient } from "@/lib/api-client/http-client";

export function useCreatePointsWallet() {
  return useMutation({
    mutationFn: async (idComprador: string) => {
      const result = await httpClient.ensurePointsWallet(idComprador);
      if (!result.success) {
        throw new Error(result.error || "Failed to create points wallet");
      }
      return result.data;
    },
  });
}
