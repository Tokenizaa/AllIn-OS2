import { User, DistributorProfile } from "../context/auth.types";
import { supabase } from "@/lib/supabase/client";
import { UserRole } from "@/shared/types/roles";

/**
 * Profile service for handling user and distributor profile updates
 * Now uses Supabase for real database operations
 */
export class ProfileService {
  /**
   * Update user profile in Supabase
   */
  static async updateProfile(
    updates: Partial<User>,
    user: User | null,
    setUser: (user: User) => void
  ): Promise<User> {
    if (!user) throw new Error("Não autenticado.");

    const { error } = await supabase
      .schema("crm")
      .from("customers")
      .update({
        nome: updates.name,
        email: updates.email,
        telefone: updates.phone,
        cpf: updates.cpf,
        avatar: updates.avatar,
        updated_at: new Date().toISOString()
      })
      .eq("auth_user_id", user.id);

    if (error) {
      throw new Error(error.message || "Erro ao atualizar perfil.");
    }

    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);

    return updatedUser;
  }

  /**
   * Update distributor profile in Supabase
   */
  static async updateDistributorProfile(
    updates: Partial<DistributorProfile>,
    user: User | null,
    distributorProfile: DistributorProfile | null,
    setDistributorProfile: (profile: DistributorProfile) => void
  ): Promise<DistributorProfile> {
    if (!user || user.role !== UserRole.DISTRIBUIDOR || !distributorProfile) {
      throw new Error("Perfil de distribuidor incorreto.");
    }

    const { error } = await supabase
      .schema("crm")
      .from("customers")
      .update({
        usuario: updates.referral_code,
        qualification: updates.qualification,
        metadata: updates,
        updated_at: new Date().toISOString()
      })
      .eq("auth_user_id", user.id);

    if (error) {
      throw new Error(error.message || "Erro ao atualizar perfil de distribuidor.");
    }

    const updatedProf = { ...distributorProfile, ...updates };
    setDistributorProfile(updatedProf);

    return updatedProf;
  }

}
