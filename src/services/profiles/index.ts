import { supabase } from "@/lib/supabase-client";

export const ProfileService = {
  async fetchUserProfile(userId: string) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async fetchLastProfile() {
    const { data, error } = await supabase
      .from("profiles")
      .select("name, role, created_at")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async fetchMyProfile() {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, name, email, phone, cpf, sponsor_id, city, state, role")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return data;
  }
};
