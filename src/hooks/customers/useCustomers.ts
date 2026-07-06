import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import { CustomerService } from "@/services/customers";
import { ProfileService } from "@/services/profiles";

/**
 * Hook para buscar customers/distribuidores
 * 
 * MIGRAÇÃO EM PROGRESSO: Este hook ainda usa CustomerService por compatibilidade
 * mas deveria usar ProfileService.fetchDistributors() quando a migração estiver completa
 */
export function useCustomers(page = 1, pageSize = 15) {
  return useQuery({
    queryKey: [...queryKeys.customers, page, pageSize],
    queryFn: async () => {
      try {
        const data = await CustomerService.fetchCustomersWithOrderStats(page, pageSize);
        return {
          customers: data?.customers || [],
          orderStats: data?.orderStats || {},
          totalCount: data?.totalCount || 0,
          page,
          pageSize,
        };
      } catch (error) {
        console.error('[useCustomers] Error fetching customers:', error);
        return { customers: [], orderStats: {}, totalCount: 0, page, pageSize };
      }
    },
  });
}

