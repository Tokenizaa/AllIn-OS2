import { useState } from "react";
import { toast } from "sonner";

interface UseWalletTransactionsProps {
  wallet: any;
  updateWalletBalance: any;
  createWalletTransaction: any;
  refetch: () => void;
}

export function useWalletTransactions({
  wallet,
  updateWalletBalance,
  createWalletTransaction,
  refetch,
}: UseWalletTransactionsProps) {
  const [showAddTx, setShowAddTx] = useState(false);
  const [txType, setTxType] = useState<"credit" | "debit">("credit");
  const [txAmount, setTxAmount] = useState<string>("");
  const [txDesc, setTxDesc] = useState<string>("");

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wallet) {
      toast.error("Inicialize a carteira antes de lançar movimentações.");
      return;
    }
    const amt = parseFloat(txAmount);
    if (!amt || amt <= 0) {
      toast.error("Por favor, digite um valor numérico válido.");
      return;
    }

    const change = txType === "credit" ? amt : -amt;
    const balanceBefore = wallet.balance || 0;
    const balanceAfter = balanceBefore + change;

    updateWalletBalance.mutate(
      { walletId: wallet.id, balance: balanceAfter },
      {
        onSuccess: () => {
          createWalletTransaction.mutate(
            {
              walletId: wallet.id,
              transaction_type: txType,
              amount: amt,
              balance_before: balanceBefore,
              balance_after: balanceAfter,
              description: txDesc || "Lançamento de ajuste administrativo",
            },
            {
              onSuccess: () => {
                refetch();
                setTxAmount("");
                setTxDesc("");
                setShowAddTx(false);
              },
            }
          );
        },
      }
    );
  };

  return {
    showAddTx,
    setShowAddTx,
    txType,
    setTxType,
    txAmount,
    setTxAmount,
    txDesc,
    setTxDesc,
    handleAddTransaction,
  };
}
