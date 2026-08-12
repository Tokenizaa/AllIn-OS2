import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import { OrderService } from "@/services/orders";
import { CustomerService } from "@/services/customers";

export function useAnalytics() {
  const stats = useQuery({ queryKey: [...queryKeys.analytics, "orders", "stats"], queryFn: () => OrderService.fetchOrderStats() });
  const orders = useQuery({ queryKey: [...queryKeys.analytics, "orders", "recent"], queryFn: () => OrderService.fetchRecentOrders({ page: 1, limit: 50 }) });
  const customers = useQuery({ queryKey: [...queryKeys.analytics, "customers"], queryFn: () => CustomerService.fetchAnalyticsCustomers() });
  return { stats, orders, customers };
}
