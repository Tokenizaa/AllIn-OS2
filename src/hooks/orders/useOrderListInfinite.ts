import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import { OrderService } from "@/services/orders";

export function useOrderListInfinite(pageSize = 20) {
  const customersQuery = useQuery({
    queryKey: [...queryKeys.customers, "lookup"],
    queryFn: () => OrderService.fetchAllCustomers(),
    staleTime: 5 * 60 * 1000,
  });

  const ordersQuery = useInfiniteQuery({
    queryKey: [...queryKeys.orders, "infinite", pageSize],
    queryFn: ({ pageParam = 1 }) => OrderService.fetchOrdersPage(pageParam, pageSize),
    getNextPageParam: (lastPage, allPages) => {
      const totalFetched = allPages.reduce((sum, p) => sum + p.orders.length, 0);
      if (totalFetched >= lastPage.totalCount) return undefined;
      return allPages.length + 1;
    },
    initialPageParam: 1,
  });

  const orders = ordersQuery.data?.pages.flatMap((p) => p.orders) ?? [];
  const totalCount = ordersQuery.data?.pages[0]?.totalCount ?? 0;

  const pendingOrders = orders.filter(
    (o) => (o.status_pedido || o.status || "").toLowerCase() === "pendente"
  ).length;
  const processingOrders = orders.filter(
    (o) => (o.status_pedido || o.status || "").toLowerCase() === "processando"
  ).length;
  const totalRevenue = orders.reduce(
    (sum, o) => sum + Number(o.valor_total_pedido || o.valor_total || 0),
    0
  );

  return {
    ...ordersQuery,
    orders,
    customers: customersQuery.data ?? [],
    customersQuery,
    totalCount,
    orderStats: {
      totalOrders: totalCount,
      pendingOrders,
      processingOrders,
      totalRevenue,
    },
  };
}
