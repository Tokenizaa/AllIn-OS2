import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import { AnalyticsService } from "@/services/analytics";
import { CustomerService } from "@/services/customers";
import { ProfileService } from "@/services/profiles";

export function useAnalytics() {
  const stats = useQuery({ queryKey: [...queryKeys.analytics, "orders", "stats"], queryFn: () => AnalyticsService.fetchOrderStats() });
  const orders = useQuery({ queryKey: [...queryKeys.analytics, "orders", "recent"], queryFn: () => AnalyticsService.fetchRecentOrders({ page: 1, limit: 50 }) });
  
  // MIGRAÇÃO EM PROGRESSO: Usando ProfileService em vez de CustomerService
  // Quando a migração estiver completa, remover CustomerService completamente
  const customers = useQuery({ 
    queryKey: [...queryKeys.analytics, "customers"], 
    queryFn: () => ProfileService.fetchAnalyticsProfiles() 
  });
  
  return { stats, orders, customers };
}
