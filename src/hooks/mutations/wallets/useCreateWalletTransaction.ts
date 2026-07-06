import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";

export function useCreateWalletTransaction() {
  return useMutation({
    mutationFn: async (data: {
      walletId: string;
      transaction_type: "credit" | "debit";
      amount: number;
      balance_before: number;
      balance_after: number;
      description: string;
    }) => {
      const { data: txData, error } = await supabase
        .from("finance.wallet_transactions")
        .insert({
          wallet_id: data.walletId,
          transaction_type: data.transaction_type,
          amount: data.amount,
          balance_before: data.balance_before,
          balance_after: data.balance_after,
          description: data.description,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();
      
      if (error) throw error;
      return txData;
    },
  });
}
