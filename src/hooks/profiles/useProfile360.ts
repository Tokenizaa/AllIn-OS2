/**
 * useProfile360
 * 
 * Hook para dados de perfil básico usando Profile360Service
 * Responsabilidades:
 * - Dados básicos do perfil
 * - Métricas de negócio
 * - Métricas de rede
 * - Score de engajamento
 */

import { useQuery } from "@tanstack/react-query";
import { Profile360Service } from "@/services/profile360";

export function useProfile360(profileId?: string) {
  return useQuery({
    queryKey: ["profile360", profileId],
    enabled: !!profileId,
    queryFn: () => {
      if (!profileId) throw new Error("profileId is required");
      return Profile360Service.getProfile360(profileId);
    },
  });
}

export function useProfile360ByIdComprador(idComprador?: string) {
  return useQuery({
    queryKey: ["profile360-by-id-comprador", idComprador],
    enabled: !!idComprador,
    queryFn: () => {
      if (!idComprador) throw new Error("idComprador is required");
      return Profile360Service.getProfile360ByIdComprador(idComprador);
    },
  });
}
