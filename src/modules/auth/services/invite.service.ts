import { UserRole } from "@/shared/types/roles";
import { User, AdminInvite } from "../context/auth.types";
import { supabase } from "@/lib/supabase-client";
import { AuditService } from "./audit.service";

/**
 * Invite service for handling admin invitations
 * Now uses Supabase admin_invites table
 */
export class InviteService {
  /**
   * Create new admin invite in Supabase
   */
  static async createAdminInvite(
    inviteInput: Omit<AdminInvite, "id" | "invite_token" | "invite_link" | "created_at" | "expires_at" | "status">,
    user: User | null
  ): Promise<AdminInvite> {
    const token = `inv-${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`;
    const inviteLink = `${window.location.origin}/auth/invite/${token}`;
    const expiresAt = new Date(Date.now() + 48 * 3600000).toISOString(); // 48 hours validity

    const newInvite: AdminInvite = {
      id: `invite-${Date.now()}`,
      email: inviteInput.email.toLowerCase().trim(),
      full_name: inviteInput.full_name,
      role: inviteInput.role,
      permissions: inviteInput.permissions || [],
      invite_token: token,
      invite_link: inviteLink,
      invited_by: user?.email || "admin@allin.io",
      expires_at: expiresAt,
      status: "pending",
      notes: inviteInput.notes,
      created_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from("admin_invites")
      .insert(newInvite);

    if (error) {
      throw new Error(error.message || "Erro ao criar convite.");
    }

    await AuditService.logAudit(
      "CREATE_ADMIN_INVITE",
      "admin_invites",
      `Convite criado para ${newInvite.email} com a role: ${newInvite.role.toUpperCase()}.`,
      user
    );

    return newInvite;
  }

  /**
   * Revoke admin invite in Supabase
   */
  static async revokeAdminInvite(
    inviteId: string,
    user: User | null
  ): Promise<void> {
    const { error } = await supabase
      .from("admin_invites")
      .update({
        status: "revoked",
        revoked_at: new Date().toISOString()
      })
      .eq("id", inviteId);

    if (error) {
      throw new Error(error.message || "Erro ao revogar convite.");
    }

    await AuditService.logAudit(
      "REVOKE_ADMIN_INVITE",
      "admin_invites",
      `Convite de Id: ${inviteId} revogado com sucesso.`,
      user
    );
  }

  /**
   * Resend admin invite with new token in Supabase
   */
  static async resendAdminInvite(
    inviteId: string,
    user: User | null
  ): Promise<void> {
    const token = `inv-${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`;
    const inviteLink = `${window.location.origin}/auth/invite/${token}`;
    const expiresAt = new Date(Date.now() + 48 * 3600000).toISOString();

    const { error } = await supabase
      .from("admin_invites")
      .update({
        invite_token: token,
        invite_link: inviteLink,
        expires_at: expiresAt,
        status: "pending",
        created_at: new Date().toISOString()
      })
      .eq("id", inviteId);

    if (error) {
      throw new Error(error.message || "Erro ao reenviar convite.");
    }

    await AuditService.logAudit(
      "RESEND_ADMIN_INVITE",
      "admin_invites",
      `Convite reenviado e renovado por 48h.`,
      user
    );
  }

  /**
   * Get admin invite by token from Supabase
   */
  static async getAdminInviteByToken(token: string): Promise<AdminInvite | null> {
    try {
      const { data, error } = await supabase
        .from("admin_invites")
        .select("*")
        .eq("invite_token", token)
        .single();

      if (error || !data) {
        return null;
      }

      // Check if expired
      if (data.status === "pending" && new Date(data.expires_at) < new Date()) {
        // Update status to expired in database
        await supabase
          .from("admin_invites")
          .update({ status: "expired" })
          .eq("id", data.id);
        return { ...data, status: "expired" };
      }

      return data as AdminInvite;
    } catch (error) {
      console.error("[InviteService] Error fetching invite by token:", error);
      return null;
    }
  }

  /**
   * Accept admin invite and create user in Supabase
   */
  static async acceptAdminInvite(
    token: string,
    name: string,
    password: string
  ): Promise<User> {
    const invite = await this.getAdminInviteByToken(token);
    if (!invite) throw new Error("Convite inválido ou token inexistente.");

    if (invite.status === "revoked") throw new Error("Acesso negado: Este convite foi cancelado pelo administrador.");
    if (invite.status === "accepted") throw new Error("Acesso negado: Este convite já foi utilizado para ativar uma conta.");
    if (invite.status === "expired") throw new Error("Acesso negado: A validade deste convite expirou.");

    try {
      // Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: invite.email,
        password: password,
        options: {
          data: {
            full_name: name,
            role: invite.role,
          }
        }
      });

      if (authError || !authData.user) {
        throw new Error(authError?.message || "Erro ao criar usuário no Supabase Auth");
      }

      // Create profile in profiles table
      const { error: profileError } = await supabase
        .from("profiles")
        .insert({
          user_id: authData.user.id,
          name: name,
          email: invite.email,
          role: invite.role as UserRole,
          status: "active",
        });

      if (profileError) {
        console.error("[InviteService] Error creating profile:", profileError);
        // Continue anyway, RLS might handle this
      }

      // Create entry in admin_users table
      const { error: adminError } = await supabase
        .from("admin_users")
        .insert({
          user_id: authData.user.id,
          name: name,
          email: invite.email,
          role: invite.role,
          status: "active",
          permissions: invite.permissions || [],
        });

      if (adminError) {
        console.error("[InviteService] Error creating admin user:", adminError);
        // Continue anyway
      }

      // Update invite status to accepted
      await supabase
        .from("admin_invites")
        .update({
          status: "accepted",
          accepted_at: new Date().toISOString()
        })
        .eq("id", invite.id);

      // Log the action
      await AuditService.logAudit(
        "ACCEPT_ADMIN_INVITE",
        "admin_invites",
        `Convite aceito por ${invite.email}, role: ${invite.role}`,
        null
      );

      // Return user object
      return {
        id: authData.user.id,
        email: invite.email,
        name: name,
        role: invite.role as UserRole,
        status: "active",
        active: true,
        created_at: authData.user.created_at,
        last_login: authData.user.last_sign_in_at || authData.user.created_at,
      };
    } catch (error) {
      console.error("[InviteService] Error in acceptAdminInvite:", error);
      throw error;
    }
  }

  /**
   * Delete user and invite session
   */
  static async deleteUserAndInviteSession(userId: string): Promise<void> {
    try {
      // Delete from admin_users table
      const { error: adminError } = await supabase
        .from("admin_users")
        .delete()
        .eq("user_id", userId);

      if (adminError) {
        console.error("[InviteService] Error deleting from admin_users:", adminError);
      }

      // Delete from profiles table
      const { error: profileError } = await supabase
        .from("profiles")
        .delete()
        .eq("user_id", userId);

      if (profileError) {
        console.error("[InviteService] Error deleting from profiles:", profileError);
      }

      // Delete from auth.users (requires admin privileges, might need to be done via edge function)
      // For now, we'll just log this action
      await AuditService.logAudit(
        "DELETE_USER_AND_INVITE",
        "users",
        `Usuário ${userId} marcado para deleção (auth.users requer admin privileges)`,
        null
      );

      console.log("[InviteService] User data deleted from tables, auth.users deletion requires admin privileges");
    } catch (error) {
      console.error("[InviteService] Error in deleteUserAndInviteSession:", error);
      throw error;
    }
  }
}
