import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/modules/auth";
import { referralTrackingService } from "@/services/referralTrackingService";

// Sprint 4: Migrar activeSponsor e activeReferralMetadata do AuthProvider para TanStack Query
export function useReferralTrackingQuery() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["referralTracking", user?.id],
    queryFn: () => referralTrackingService.getReferralTracking(user?.id || ""),
    enabled: !!user?.id && (user.role === "DISTRIBUIDOR" || user.role === "AFILIADO"),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  const clearSponsorMutation = useMutation({
    mutationFn: async () => {
      if (user?.id) {
        await referralTrackingService.clearReferralTracking(user.id);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["referralTracking"] });
    },
  });

  const clearSponsor = async () => {
    await clearSponsorMutation.mutateAsync();
  };

  return {
    activeSponsor: query.data?.distributor_slug || null,
    activeReferralMetadata: query.data?.metadata || null,
    loading: query.isLoading,
    error: query.error,
    clearSponsor,
  };
}
