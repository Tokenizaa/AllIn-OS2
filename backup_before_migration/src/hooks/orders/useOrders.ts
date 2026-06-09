import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import { OrderService } from "@/services/orders";

export function useOrders(page = 1, pageSize = 15) {
  return useQuery({
    queryKey: [...queryKeys.orders, page, pageSize],
    queryFn: () => OrderService.fetchOrdersList(page, pageSize) as any,
  });
}
