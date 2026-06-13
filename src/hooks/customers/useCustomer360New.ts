/**
 * useCustomer360New
 * 
 * Hook unificado para dados Customer360
 * MIGRAÇÃO EM PROGRESSO: Agora usa Profile360Service para dados de perfil
 * Mantém compatibilidade com Customer360Service para dados adicionais
 * Elimina queries duplicadas e centraliza agregação
 */

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import { Customer360Service } from "@/services/customer360";
import { Profile360Service } from "@/services/profile360";
import type { Customer360, Customer360Params } from "@/services/customer360/types";

export function useCustomer360New(
  idComprador?: string,
  params: Customer360Params = {}
) {
  return useQuery({
    queryKey: queryKeys.customer360(idComprador || ""),
    enabled: !!idComprador,
    queryFn: () => {
      if (!idComprador) throw new Error("idComprador is required");
      // MIGRAÇÃO EM PROGRESSO: Ainda usa Customer360Service para compatibilidade
      // Futuramente deve usar Profile360Service + CRM360Service + MLM360Service + Finance360Service
      return Customer360Service.getCustomer360ByIdComprador(idComprador, params);
    },
  });
}

export function useCustomer360ByCustomerId(
  customerId?: string,
  params: Customer360Params = {}
) {
  return useQuery({
    queryKey: ["customer360-by-id", customerId, params],
    enabled: !!customerId,
    queryFn: () => {
      if (!customerId) throw new Error("customerId is required");
      // MIGRAÇÃO EM PROGRESSO: Ainda usa Customer360Service para compatibilidade
      // Futuramente deve usar Profile360Service + CRM360Service + MLM360Service + Finance360Service
      return Customer360Service.getCustomer360ByCustomerId(customerId, params);
    },
  });
}
