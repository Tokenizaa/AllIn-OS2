import { useMutation } from "@tanstack/react-query";
import { httpClient } from "@/lib/api-client/http-client";

export function useCreateWallet() {
  return useMutation({
    mutationFn: async (idComprador: string) => {
      const result = await httpClient.ensureWallet(idComprador);
      if (!result.success) {
        throw new Error(result.error || "Failed to create wallet");
      }
      return result.data;
    },
  });
}
