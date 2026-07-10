import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";

export function useDistributorProfileQuery() {
  return useQuery({
    queryKey: ["distributor", "profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      const { data } = await supabase
        .from("distributor_profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      return data;
    },
  });
}

export function useDistributorDefault() {
  return useQuery({
    queryKey: ["distributor", "default"],
    queryFn: async () => {
      return { id: null, name: "Distribuidor" };
    },
  });
}
