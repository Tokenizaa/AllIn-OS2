import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import { OrderService } from "@/services/orders";

export function useOrderList(limit = 60) {
  return useQuery({
    queryKey: [...queryKeys.orders, "list", limit],
    queryFn: () => OrderService.fetchOrdersAndCustomers(limit),
  });
}
