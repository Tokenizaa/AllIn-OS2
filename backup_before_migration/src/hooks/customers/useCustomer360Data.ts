import { useCustomer360 } from "./useCustomer360";
import { useCreateWallet } from "@/hooks/mutations/wallets/useCreateWallet";
import { useCreatePointsWallet } from "@/hooks/mutations/wallets/useCreatePointsWallet";
import { useUpdateWalletBalance } from "@/hooks/mutations/wallets/useUpdateWalletBalance";
import { useCreateWalletTransaction } from "@/hooks/mutations/wallets/useCreateWalletTransaction";

const EMPTY_LIST: any[] = [];

export function useCustomer360Data(customerId?: string, sponsorId?: string, compradorId?: string) {
  const { data: queryData, isLoading, isError, error, refetch } = useCustomer360(
    customerId,
    sponsorId,
    compradorId
  );

  const createWallet = useCreateWallet();
  const createPointsWallet = useCreatePointsWallet();
  const updateWalletBalance = useUpdateWalletBalance();
  const createWalletTransaction = useCreateWalletTransaction();

  const customer = queryData?.customer;
  const orders = queryData?.orders ?? EMPTY_LIST;
  const sponsor = queryData?.sponsor || null;
  const wallet = queryData?.wallet || null;
  const pointsWallet = queryData?.pointsWallet || null;
  const walletTransactions = queryData?.walletTransactions ?? EMPTY_LIST;
  const downlines = queryData?.downlines ?? EMPTY_LIST;

  const handleCreateWallet = () => {
    if (!customer) return;
    createWallet.mutate(customer.id, {
      onSuccess: () => {
        refetch();
      },
    });
  };

  const handleCreatePointsWallet = () => {
    if (!customer) return;
    createPointsWallet.mutate(customer.id, {
      onSuccess: () => {
        refetch();
      },
    });
  };

  return {
    customer,
    orders,
    sponsor,
    wallet,
    pointsWallet,
    walletTransactions,
    downlines,
    isLoading,
    isError,
    error,
    refetch,
    handleCreateWallet,
    handleCreatePointsWallet,
    updateWalletBalance,
    createWalletTransaction,
  };
}
