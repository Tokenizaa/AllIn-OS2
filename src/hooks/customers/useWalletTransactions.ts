import { useState, useCallback } from "react";
import { MlmEngineService } from "@/services/mlm-engine";

interface UseWalletTransactionsProps {
  wallet: any;
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
        if (txType === "credit") {
          await MlmEngineService.wallet.addFunds(
            wallet.id_comprador || wallet.distribuidor_id || wallet.id,
            amount,
            txDesc || "Lançamento manual"
          );
        } else {
          await MlmEngineService.wallet.withdraw(
            wallet.id_comprador || wallet.distribuidor_id || wallet.id,
            amount
          );
        }
        setTxAmount("");
        setTxDesc("");
        setTxType("credit");
        setShowAddTx(false);
        refetch();
      } catch (err: any) {
        console.error("Transaction failed:", err);
      }
    },
    [wallet, txType, txAmount, txDesc, refetch]
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
