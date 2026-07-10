import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";

export function useUpdateWalletBalance() {
  return useMutation({
    mutationFn: async ({ walletId, balance }: { walletId: string; balance: number }) => {
      const { data, error } = await supabase
        .from("wallets")
        .update({ balance, updated_at: new Date().toISOString() })
        .eq("id", walletId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
  });
}
