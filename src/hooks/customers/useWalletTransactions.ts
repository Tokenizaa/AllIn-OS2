import { useState, useCallback } from "react";

interface UseWalletTransactionsProps {
  wallet: any;
  updateWalletBalance: any;
  createWalletTransaction: any;
  refetch: () => void;
}

interface UseWalletTransactionsReturn {
  showAddTx: boolean;
  setShowAddTx: (v: boolean) => void;
  txType: string;
  setTxType: (v: string) => void;
  txAmount: string;
  setTxAmount: (v: string) => void;
  txDesc: string;
  setTxDesc: (v: string) => void;
  handleAddTransaction: (e: React.FormEvent) => Promise<void>;
}

export function useWalletTransactions({
  wallet,
  updateWalletBalance,
  createWalletTransaction,
  refetch,
}: UseWalletTransactionsProps): UseWalletTransactionsReturn {
  const [showAddTx, setShowAddTx] = useState(false);
  const [txType, setTxType] = useState("credit");
  const [txAmount, setTxAmount] = useState("");
  const [txDesc, setTxDesc] = useState("");

  const handleAddTransaction = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!wallet || !txAmount) return;
      const amount = parseFloat(txAmount);
      if (isNaN(amount) || amount <= 0) return;

      try {
        await createWalletTransaction({
          wallet_id: wallet.id,
          type: txType,
          amount,
          description: txDesc || "Ajuste manual",
        });

        const balanceChange = txType === "credit" ? amount : -amount;
        await updateWalletBalance({
          wallet_id: wallet.id,
          balance_change: balanceChange,
        });

        setTxAmount("");
        setTxDesc("");
        setTxType("credit");
        setShowAddTx(false);
        refetch();
      } catch (err) {
        console.error("Erro ao adicionar transação:", err);
      }
    },
    [wallet, txType, txAmount, txDesc, createWalletTransaction, updateWalletBalance, refetch]
  );

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
