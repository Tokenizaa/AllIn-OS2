import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/modules/auth";
import { SupabaseService } from "@/modules/auth/services/supabase.service";
import { DistributorProfile } from "@/modules/auth/context/auth.types";
import { supabase } from "@/lib/supabase/client";

// Sprint 4: Migrar distributorProfile do AuthProvider para TanStack Query
export function useDistributorProfileQuery() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["distributorProfile", user?.id],
    queryFn: () => SupabaseService.fetchDistributorProfile(user?.id || ""),
    enabled: !!user?.id && user.role === "DISTRIBUIDOR",
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (updates: Partial<DistributorProfile>) => {
      if (!user || user.role !== "DISTRIBUIDOR") {
        throw new Error("Perfil de distribuidor incorreto.");
      }

      const { error } = await supabase
        .schema("crm")
        .from("customers")
        .update({
          qualification: updates.qualification,
          status: updates.status,
        })
        .eq("auth_user_id", user.id);

      if (error) {
        throw new Error(error.message || "Erro ao atualizar perfil de distribuidor.");
      }

      return updates;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["distributorProfile"] });
    },
  });

  const activateOfficeMutation = useMutation({
    mutationFn: async (planId: string) => {
      if (!user) {
        throw new Error("User not authenticated");
      }

      const { error } = await supabase
        .schema("mlm")
        .from("planos_distribuidores")
        .insert({
          distribuidor_id: user.id,
          plano_id: planId,
          status: "active",
          data_ativacao: new Date().toISOString(),
        });

      if (error) {
        throw new Error(error.message || "Erro ao ativar escritório virtual");
      }

      return planId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["distributorProfile"] });
    },
  });

  const updateDistributorProfile = async (updates: Partial<DistributorProfile>) => {
    await updateProfileMutation.mutateAsync(updates);
    return query.data || null;
  };

  const activateDistributorOffice = async (planId: string) => {
    await activateOfficeMutation.mutateAsync(planId);
    await query.refetch();
    return query.data || null;
  };

  return {
    distributorProfile: query.data || null,
    loading: query.isLoading,
    error: query.error,
    updateDistributorProfile,
    activateDistributorOffice,
  };
}
