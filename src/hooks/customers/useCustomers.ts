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
    queryFn: () => CustomerService.fetchCustomersWithOrderStats(page, pageSize) as any,
  });
}

/**
 * Hook para buscar distribuidores usando ProfileService (NOVO)
 * 
 * Este é o hook correto para usar quando a migração para profiles estiver completa
 */
export function useDistributors(page = 1, pageSize = 15) {
  return useQuery({
    queryKey: ["distributors", page, pageSize],
    queryFn: () => ProfileService.fetchProfilesWithStats(page, pageSize, "distribuidor") as any,
  });
}

/**
 * Hook para buscar clientes finais usando ProfileService (NOVO)
 */
export function useCustomerFinals(page = 1, pageSize = 15) {
  return useQuery({
    queryKey: ["customer-finals", page, pageSize],
    queryFn: () => ProfileService.fetchProfilesWithStats(page, pageSize, "customer_final") as any,
  });
}

/**
 * Hook para buscar clientes diretos usando ProfileService (NOVO)
 */
export function useClienteDiretos(page = 1, pageSize = 15) {
  return useQuery({
    queryKey: ["cliente-diretos", page, pageSize],
    queryFn: () => ProfileService.fetchProfilesWithStats(page, pageSize, "cliente_direto") as any,
  });
}

/**
 * Hook para buscar admins usando ProfileService (NOVO)
 */
export function useAdmins(page = 1, pageSize = 15) {
  return useQuery({
    queryKey: ["admins", page, pageSize],
    queryFn: () => ProfileService.fetchProfilesWithStats(page, pageSize, "admin") as any,
  });
}
