import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import { CustomerService } from "@/services/customers";
import { OrderService } from "@/services/orders";
import { WalletService } from "@/services/wallets";

export function useCustomer360(customerId?: string, sponsorId?: string | null, idComprador?: string | null) {
  return useQuery({
    queryKey: queryKeys.customer360(customerId || ""),
    enabled: !!customerId,
    queryFn: async () => {
      if (!customerId) throw new Error("customerId is required");
      const [orderData, sponsorData, walletData, ptsData, customerData] = await Promise.all([
        OrderService.fetchOrdersByCustomerId(customerId),
        sponsorId ? CustomerService.fetchCustomerByCompradorId(sponsorId) : Promise.resolve(null),
        WalletService.fetchWalletByCustomerId(customerId),
        WalletService.fetchPointsWalletByCustomerId(customerId),
        CustomerService.fetchCustomerById(customerId),
      ]);
      const txData = walletData ? await WalletService.fetchWalletTransactionsByWalletId(walletData.id) : [];
      const downlineData = idComprador ? await CustomerService.fetchDownlines(idComprador) : [];
      return { customer: customerData, orders: orderData || [], sponsor: sponsorData, wallet: walletData || null, pointsWallet: ptsData || null, walletTransactions: txData, downlines: downlineData };
    },
  });
}
