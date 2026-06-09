import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import { OrderService } from "@/services/orders";

export function useOrderList(page = 1, pageSize = 15) {
  return useQuery({
    queryKey: [...queryKeys.orders, "list", page, pageSize],
    queryFn: () => OrderService.fetchOrdersAndCustomers(page, pageSize) as any,
  });
}
