import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import { NetworkService } from "@/services/network";
import { CustomerService } from "@/services/customers";
import { OrderService } from "@/services/orders";

export function useNetwork(limit = 12) {
  return useQuery({
    queryKey: queryKeys.network,
    queryFn: async () => {
      const [customerData, relationshipData] = await Promise.all([
        CustomerService.fetchRecentCustomers(20),
        NetworkService.fetchRecentNetworkRelationships(limit),
      ]);
      const legs = OrderService.transformNetworkLegs(relationshipData);

      return { customers: customerData || [], legs, relationships: relationshipData || [] };
    },
  });
}
