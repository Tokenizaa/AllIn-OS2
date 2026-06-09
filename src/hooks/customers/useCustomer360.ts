import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import { CustomerService } from "@/services/customers";
import { OrderService } from "@/services/orders";
import { WalletService } from "@/services/wallets";

export function useCustomer360(idComprador?: string, sponsorId?: string | null) {
  return useQuery({
    queryKey: queryKeys.customer360(idComprador || ""),
    enabled: !!idComprador,
    queryFn: async () => {
      if (!idComprador) throw new Error("idComprador is required");
      const [orderData, sponsorData, walletData, ptsData, customerData] = await Promise.all([
        OrderService.fetchOrdersByidComprador(idComprador),
        sponsorId ? CustomerService.fetchCustomerByCompradorId(sponsorId) : Promise.resolve(null),
        WalletService.fetchWalletByidComprador(idComprador),
        WalletService.fetchPointsWalletByidComprador(idComprador),
        CustomerService.fetchCustomerByCompradorId(idComprador),
      ]);
      const txData = walletData ? await WalletService.fetchWalletTransactionsByWalletId(walletData.id) : [];
      const downlineData = idComprador ? await CustomerService.fetchDownlines(idComprador) : [];
      return { customer: customerData, orders: orderData || [], sponsor: sponsorData, wallet: walletData || null, pointsWallet: ptsData || null, walletTransactions: txData, downlines: downlineData };
    },
  });
}
