import { b as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { Q as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { c as createRouter, a as createRootRouteWithContext, u as useRouter, L as Link, H as HeadContent, O as Outlet, S as Scripts, b as createFileRoute, l as lazyRouteComponent, d as useParams, e as useLocation } from "../_libs/tanstack__react-router.mjs";
import { S as notFound } from "../_libs/tanstack__router-core.mjs";
import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { s as supabase } from "./supabase-client-BdpvIS_G.mjs";
import { U as UserRole } from "./roles-DEW722fr.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { c as cva } from "../_libs/class-variance-authority.mjs";
import { c as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { S as Slot } from "../_libs/radix-ui__react-slot.mjs";
import { C as ChevronRight, S as ShoppingBag, M as Minus, P as Plus, T as Trash2, A as ArrowRight, a as ArrowLeft, Q as QrCode, b as CreditCard, c as CircleCheck, d as ShieldCheck, X, e as Menu, f as Sun, g as Moon } from "../_libs/lucide-react.mjs";
import { A as AnimatePresence, m as motion } from "../_libs/framer-motion.mjs";
import "../_libs/react-dom.mjs";

import "../_libs/isbot.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/unenv.mjs";



import "../_libs/seroval-plugins.mjs";

import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/tslib.mjs";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
const AuthContext = reactExports.createContext(void 0);
class SupabaseService {
  /**
   * Fetch user profile from auth.users + profiles
   */
  static async fetchUserProfile(userId) {
    try {
      const { data: authUser, error: authError } = await supabase.auth.getUser();
      if (authError || !authUser.user) {
        console.error("[SupabaseService] Error fetching auth user:", authError);
        return null;
      }
      const { data: profile, error: profileError } = await supabase.from("profiles").select("*").eq("user_id", userId).single();
      if (profileError && profileError.code !== "PGRST116") {
        console.error("[SupabaseService] Error fetching profile:", profileError);
        return null;
      }
      return {
        id: authUser.user.id,
        email: authUser.user.email || "",
        name: profile?.name || authUser.user.email?.split("@")[0] || "",
        role: profile?.role || UserRole.CLIENTE_FINAL,
        status: profile?.status || "active",
        active: profile?.status === "active",
        avatar: profile?.avatar || null,
        phone: profile?.phone || null,
        cpf: profile?.cpf || null,
        created_at: authUser.user.created_at,
        last_login: authUser.user.last_sign_in_at || authUser.user.created_at,
        referral_code: profile?.referral_code || null,
        sponsor_id: profile?.sponsor_id || null
      };
    } catch (error) {
      console.error("[SupabaseService] Error in fetchUserProfile:", error);
      return null;
    }
  }
  /**
   * Fetch current session user
   */
  static async fetchCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        return null;
      }
      return this.fetchUserProfile(user.id);
    } catch (error) {
      console.error("[SupabaseService] Error in fetchCurrentUser:", error);
      return null;
    }
  }
  /**
   * Fetch distributor profile from customers table
   */
  static async fetchDistributorProfile(userId) {
    try {
      const { data, error } = await supabase.from("customers").select("id, user_id, usuario, id_comprador, patrocinador_comprador, qualification, status, plan_id, metadata").eq("user_id", userId).maybeSingle();
      if (error) {
        console.error("[SupabaseService] Error fetching distributor profile:", error);
        return null;
      }
      if (!data) {
        return null;
      }
      return {
        id: data.id,
        customer_id: data.user_id,
        sponsor_id: data.patrocinador_comprador || null,
        referral_code: data.usuario || data.id_comprador || "",
        referral_link: `/loja/ref/${data.usuario || data.id_comprador}`,
        plan_id: data.plan_id || "none",
        qualification: data.qualification || "Associado",
        wallet_balance: 0,
        // Would need to fetch from wallets table
        bonus_balance: 0,
        // Would need to fetch from wallets table
        status: data.status || "active"
      };
    } catch (error) {
      console.error("[SupabaseService] Error in fetchDistributorProfile:", error);
      return null;
    }
  }
  /**
   * Check if user is admin based on admin_users table
   */
  static async isAdminUser(userId) {
    try {
      const { data, error } = await supabase.from("admin_users").select("id").eq("user_id", userId).eq("status", "active").single();
      return !error && !!data;
    } catch (error) {
      console.error("[SupabaseService] Error in isAdminUser:", error);
      return false;
    }
  }
  /**
   * Fetch admin user details
   */
  static async fetchAdminUser(userId) {
    try {
      const { data, error } = await supabase.from("admin_users").select("*").eq("user_id", userId).single();
      if (error) {
        console.error("[SupabaseService] Error fetching admin user:", error);
        return null;
      }
      return data;
    } catch (error) {
      console.error("[SupabaseService] Error in fetchAdminUser:", error);
      return null;
    }
  }
  /**
   * Fetch distributor by slug (usuario)
   */
  static async fetchDistributorBySlug(slug) {
    try {
      const normSlug = slug.toLowerCase().trim();
      const { data, error } = await supabase.from("customers").select(`
          id,
          user_id,
          usuario,
          id_comprador,
          qualification,
          patrocinador_comprador,
          metadata,
          created_at,
          updated_at
        `).eq("usuario", normSlug).maybeSingle();
      if (error) {
        console.error("[SupabaseService] Error fetching distributor by slug:", error);
        return null;
      }
      return data;
    } catch (error) {
      console.error("[SupabaseService] Error in fetchDistributorBySlug:", error);
      return null;
    }
  }
  /**
   * Fetch all active plans from database
   */
  static async fetchPlans() {
    try {
      const { data, error } = await supabase.from("plans").select("*").eq("is_active", true).order("sort_order", { ascending: true });
      if (error) {
        console.error("[SupabaseService] Error fetching plans:", error);
        return [];
      }
      return data || [];
    } catch (error) {
      console.error("[SupabaseService] Error in fetchPlans:", error);
      return [];
    }
  }
  /**
   * Fetch withdrawals for a user or all withdrawals (admin)
   */
  static async fetchWithdrawals(userId) {
    try {
      let query = supabase.from("withdrawals").select("*").order("created_at", { ascending: false });
      if (userId) {
        query = query.eq("user_id", userId);
      }
      const { data, error } = await query;
      if (error) {
        console.error("[SupabaseService] Error fetching withdrawals:", error);
        return [];
      }
      return data || [];
    } catch (error) {
      console.error("[SupabaseService] Error in fetchWithdrawals:", error);
      return [];
    }
  }
  /**
   * Fetch leads for a user
   */
  static async fetchLeads(userId) {
    try {
      let query = supabase.from("leads").select("*").order("created_at", { ascending: false });
      if (userId) {
        query = query.eq("user_id", userId);
      }
      const { data, error } = await query;
      if (error) {
        console.error("[SupabaseService] Error fetching leads:", error);
        return [];
      }
      return data || [];
    } catch (error) {
      console.error("[SupabaseService] Error in fetchLeads:", error);
      return [];
    }
  }
  /**
   * Fetch distributor theme by distributor_id or default theme
   */
  static async fetchDistributorTheme(distributorId) {
    try {
      if (distributorId) {
        const { data: data2, error: error2 } = await supabase.from("distributor_themes").select("*").eq("distributor_id", distributorId).single();
        if (!error2 && data2) {
          return data2;
        }
      }
      const { data, error } = await supabase.from("distributor_themes").select("*").eq("is_default", true).single();
      if (error) {
        console.error("[SupabaseService] Error fetching default theme:", error);
        return null;
      }
      return data;
    } catch (error) {
      console.error("[SupabaseService] Error in fetchDistributorTheme:", error);
      return null;
    }
  }
}
class AuthService {
  /**
   * Login user with email and password using Supabase
   */
  static async login(email, password, setUser, setLoading) {
    setLoading(true);
    try {
      const { data: { user }, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) {
        setLoading(false);
        throw new Error(error.message || "Credenciais inválidas.");
      }
      if (!user) {
        setLoading(false);
        throw new Error("Credenciais inválidas: usuário não encontrado.");
      }
      const userProfile = await SupabaseService.fetchUserProfile(user.id);
      if (!userProfile) {
        setLoading(false);
        throw new Error("Perfil de usuário não encontrado.");
      }
      if (userProfile.status === "suspended") {
        setLoading(false);
        throw new Error("Conta bloqueada por políticas de conformidade interna.");
      }
      setUser(userProfile);
      return userProfile;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  }
  /**
   * Register new user using Supabase
   */
  static async register(name, email, role, extra, activeSponsor, activeReferralMetadata, setUser, setDistributorProfile, setLoading) {
    if (setLoading) setLoading(true);
    try {
      const { data: { user }, error } = await supabase.auth.signUp({
        email,
        password: extra?.password || (() => {
          throw new Error("Senha obrigatória para registro.");
        })(),
        options: {
          data: {
            name,
            role,
            phone: extra?.phone,
            cpf: extra?.cpf,
            sponsor_id: extra?.sponsor_id || activeSponsor
          }
        }
      });
      if (error) {
        if (setLoading) setLoading(false);
        throw new Error(error.message || "Erro ao registrar usuário.");
      }
      if (!user) {
        if (setLoading) setLoading(false);
        throw new Error("Erro ao criar usuário.");
      }
      const { error: profileError } = await supabase.from("profiles").insert({
        user_id: user.id,
        name,
        email,
        role,
        status: role === UserRole.DISTRIBUIDOR ? "pending" : "active",
        phone: extra?.phone,
        cpf: extra?.cpf,
        sponsor_id: extra?.sponsor_id || activeSponsor,
        referral_code: role === UserRole.DISTRIBUIDOR ? name.toLowerCase().replace(/\s+/g, "") : null
      });
      if (profileError) {
        if (setLoading) setLoading(false);
        throw new Error("Erro ao criar perfil de usuário.");
      }
      const userProfile = await SupabaseService.fetchUserProfile(user.id);
      if (!userProfile) {
        if (setLoading) setLoading(false);
        throw new Error("Erro ao recuperar perfil criado.");
      }
      if (setUser) setUser(userProfile);
      if (setLoading) setLoading(false);
      return userProfile;
    } catch (error) {
      if (setLoading) setLoading(false);
      throw error;
    }
  }
  /**
   * Logout user using Supabase
   */
  static async logout(user, setUser, setDistributorProfile, setLoading) {
    setLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setDistributorProfile(null);
    setLoading(false);
  }
  /**
   * Change user role (admin only) using Supabase
   */
  static async changeUserRole(userId, targetRole, user, setUser) {
    if (!user || user.role !== UserRole.ADMIN_MASTER) {
      throw new Error("Acesso negado: Requer privilégio Admin Master.");
    }
    const { error } = await supabase.from("profiles").update({ role: targetRole, updated_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("user_id", userId);
    if (error) {
      throw new Error(error.message || "Erro ao alterar role do usuário.");
    }
    if (user.id === userId) {
      const updatedProfile = await SupabaseService.fetchUserProfile(userId);
      if (updatedProfile) {
        setUser(updatedProfile);
      }
    }
  }
  /**
   * Clear sponsor tracking
   */
  static clearSponsor(setActiveSponsor, setActiveReferralMetadata) {
    setActiveSponsor(null);
    setActiveReferralMetadata(null);
  }
}
class ProfileService {
  /**
   * Update user profile in Supabase
   */
  static async updateProfile(updates, user, setUser) {
    if (!user) throw new Error("Não autenticado.");
    const { error } = await supabase.from("profiles").update({
      ...updates,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    }).eq("user_id", user.id);
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
  static async updateDistributorProfile(updates, user, distributorProfile, setDistributorProfile) {
    if (!user || user.role !== UserRole.DISTRIBUIDOR || !distributorProfile) {
      throw new Error("Perfil de distribuidor incorreto.");
    }
    const { error } = await supabase.from("customers").update({
      ...updates,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    }).eq("user_id", user.id);
    if (error) {
      throw new Error(error.message || "Erro ao atualizar perfil de distribuidor.");
    }
    const updatedProf = { ...distributorProfile, ...updates };
    setDistributorProfile(updatedProf);
    return updatedProf;
  }
  /**
   * Activate distributor office with selected plan
   * TODO: Migrate to Supabase - currently disabled
   */
  static async activateDistributorOffice(planId, user, setDistributorProfile, setUser) {
    throw new Error("activateDistributorOffice needs to be migrated to Supabase");
  }
}
class AuditService {
  /**
   * Log audit entry to Supabase
   */
  static async logAudit(action, entity, details, user) {
    try {
      const userId = user ? user.id : null;
      const { error } = await supabase.from("audit_log").insert({
        user_id: userId,
        action,
        entity_type: entity,
        metadata: details ? { details } : {},
        ip_address: null,
        // TODO: Get real IP from server
        user_agent: typeof window !== "undefined" ? navigator.userAgent : null,
        success: true
      });
      if (error) {
        console.error("[AuditService] Error logging audit:", error);
      }
    } catch (error) {
      console.error("[AuditService] Error in logAudit:", error);
    }
  }
  /**
   * Add custom audit log to Supabase
   */
  static async addAuditLog(logInput, user) {
    try {
      const { error } = await supabase.from("audit_log").insert({
        user_id: logInput.userId || user?.id || null,
        action: logInput.action || "PAY_ORDER",
        entity_type: logInput.module || "orders",
        metadata: logInput.details ? { details: logInput.details } : {},
        ip_address: logInput.ip || null,
        user_agent: typeof window !== "undefined" ? navigator.userAgent : null,
        success: true
      });
      if (error) {
        console.error("[AuditService] Error adding audit log:", error);
      }
    } catch (error) {
      console.error("[AuditService] Error in addAuditLog:", error);
    }
  }
  /**
   * Trigger binomial bonus payment
   * TODO: Implement business logic for binomial bonus
   */
  static async triggerBinomialBonusPay(points, commission, value, activeSponsor) {
    try {
      const { error } = await supabase.from("audit_log").insert({
        user_id: null,
        // System action
        action: "BINOMIAL_BONUS_PAY",
        entity_type: "bonus",
        metadata: {
          points,
          commission,
          value,
          sponsor: activeSponsor
        },
        success: true
      });
      if (error) {
        console.error("[AuditService] Error logging binomial bonus:", error);
      }
    } catch (error) {
      console.error("[AuditService] Error in triggerBinomialBonusPay:", error);
    }
  }
  /**
   * Fetch audit logs for a user
   */
  static async fetchAuditLogs(userId, limit = 50) {
    try {
      const { data, error } = await supabase.from("audit_log").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(limit);
      if (error) {
        console.error("[AuditService] Error fetching audit logs:", error);
        return [];
      }
      return data || [];
    } catch (error) {
      console.error("[AuditService] Error in fetchAuditLogs:", error);
      return [];
    }
  }
}
class InviteService {
  /**
   * Create new admin invite in Supabase
   */
  static async createAdminInvite(inviteInput, user) {
    const token = `inv-${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`;
    const inviteLink = `${window.location.origin}/auth/invite/${token}`;
    const expiresAt = new Date(Date.now() + 48 * 36e5).toISOString();
    const newInvite = {
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
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    const { error } = await supabase.from("admin_invites").insert(newInvite);
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
  static async revokeAdminInvite(inviteId, user) {
    const { error } = await supabase.from("admin_invites").update({
      status: "revoked",
      revoked_at: (/* @__PURE__ */ new Date()).toISOString()
    }).eq("id", inviteId);
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
  static async resendAdminInvite(inviteId, user) {
    const token = `inv-${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`;
    const inviteLink = `${window.location.origin}/auth/invite/${token}`;
    const expiresAt = new Date(Date.now() + 48 * 36e5).toISOString();
    const { error } = await supabase.from("admin_invites").update({
      invite_token: token,
      invite_link: inviteLink,
      expires_at: expiresAt,
      status: "pending",
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    }).eq("id", inviteId);
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
  static async getAdminInviteByToken(token) {
    try {
      const { data, error } = await supabase.from("admin_invites").select("*").eq("invite_token", token).single();
      if (error || !data) {
        return null;
      }
      if (data.status === "pending" && new Date(data.expires_at) < /* @__PURE__ */ new Date()) {
        await supabase.from("admin_invites").update({ status: "expired" }).eq("id", data.id);
        return { ...data, status: "expired" };
      }
      return data;
    } catch (error) {
      console.error("[InviteService] Error fetching invite by token:", error);
      return null;
    }
  }
  /**
   * Accept admin invite and create user in Supabase
   */
  static async acceptAdminInvite(token, name, password) {
    const invite = await this.getAdminInviteByToken(token);
    if (!invite) throw new Error("Convite inválido ou token inexistente.");
    if (invite.status === "revoked") throw new Error("Acesso negado: Este convite foi cancelado pelo administrador.");
    if (invite.status === "accepted") throw new Error("Acesso negado: Este convite já foi utilizado para ativar uma conta.");
    if (invite.status === "expired") throw new Error("Acesso negado: A validade deste convite expirou.");
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: invite.email,
        password,
        options: {
          data: {
            full_name: name,
            role: invite.role
          }
        }
      });
      if (authError || !authData.user) {
        throw new Error(authError?.message || "Erro ao criar usuário no Supabase Auth");
      }
      const { error: profileError } = await supabase.from("profiles").insert({
        user_id: authData.user.id,
        name,
        email: invite.email,
        role: invite.role,
        status: "active"
      });
      if (profileError) {
        console.error("[InviteService] Error creating profile:", profileError);
      }
      const { error: adminError } = await supabase.from("admin_users").insert({
        user_id: authData.user.id,
        name,
        email: invite.email,
        role: invite.role,
        status: "active",
        permissions: invite.permissions || []
      });
      if (adminError) {
        console.error("[InviteService] Error creating admin user:", adminError);
      }
      await supabase.from("admin_invites").update({
        status: "accepted",
        accepted_at: (/* @__PURE__ */ new Date()).toISOString()
      }).eq("id", invite.id);
      await AuditService.logAudit(
        "ACCEPT_ADMIN_INVITE",
        "admin_invites",
        `Convite aceito por ${invite.email}, role: ${invite.role}`,
        null
      );
      return {
        id: authData.user.id,
        email: invite.email,
        name,
        role: invite.role,
        status: "active",
        active: true,
        created_at: authData.user.created_at,
        last_login: authData.user.last_sign_in_at || authData.user.created_at
      };
    } catch (error) {
      console.error("[InviteService] Error in acceptAdminInvite:", error);
      throw error;
    }
  }
  /**
   * Delete user and invite session
   */
  static async deleteUserAndInviteSession(userId) {
    try {
      const { error: adminError } = await supabase.from("admin_users").delete().eq("user_id", userId);
      if (adminError) {
        console.error("[InviteService] Error deleting from admin_users:", adminError);
      }
      const { error: profileError } = await supabase.from("profiles").delete().eq("user_id", userId);
      if (profileError) {
        console.error("[InviteService] Error deleting from profiles:", profileError);
      }
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
const referralTrackingService = {
  /**
   * Get referral tracking for user
   */
  getReferralTracking: async (userId) => {
    const { data, error } = await supabase.from("referral_tracking").select("*").eq("user_id", userId).single();
    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }
      console.error("[referralTrackingService] Error fetching referral tracking:", error);
      throw error;
    }
    return data;
  },
  /**
   * Set referral tracking for user
   */
  setReferralTracking: async (input) => {
    const existing = await referralTrackingService.getReferralTracking(input.user_id);
    if (existing) {
      const { data: data2, error: error2 } = await supabase.from("referral_tracking").update({
        referrer_id: input.referrer_id,
        distributor_slug: input.distributor_slug,
        metadata: { ...existing.metadata, ...input.metadata }
      }).eq("user_id", input.user_id).select("*").single();
      if (error2) {
        console.error("[referralTrackingService] Error updating referral tracking:", error2);
        throw error2;
      }
      return data2;
    }
    const { data, error } = await supabase.from("referral_tracking").insert({
      user_id: input.user_id,
      referrer_id: input.referrer_id || null,
      distributor_slug: input.distributor_slug || null,
      metadata: input.metadata || {}
    }).select("*").single();
    if (error) {
      console.error("[referralTrackingService] Error setting referral tracking:", error);
      throw error;
    }
    return data;
  },
  /**
   * Clear referral tracking for user
   */
  clearReferralTracking: async (userId) => {
    const { error } = await supabase.from("referral_tracking").delete().eq("user_id", userId);
    if (error) {
      console.error("[referralTrackingService] Error clearing referral tracking:", error);
      throw error;
    }
  },
  /**
   * Get active distributor slug for user
   */
  getActiveDistributorSlug: async (userId) => {
    const tracking = await referralTrackingService.getReferralTracking(userId);
    return tracking?.distributor_slug || null;
  },
  /**
   * Get referrer for user
   */
  getReferrer: async (userId) => {
    const tracking = await referralTrackingService.getReferralTracking(userId);
    return tracking?.referrer_id || null;
  }
};
const AuthProvider = ({ children }) => {
  const [user, setUser] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const [distributorProfile, setDistributorProfile] = reactExports.useState(null);
  const [activeSponsor, setActiveSponsor] = reactExports.useState(null);
  const [activeReferralMetadata, setActiveReferralMetadata] = reactExports.useState(null);
  const isPublicAuthRoute = () => {
    if (typeof window === "undefined") return false;
    const pathname = window.location.pathname;
    return pathname === "/login" || pathname === "/cadastro" || pathname === "/recuperar-senha" || pathname === "/redefinir-senha" || pathname.startsWith("/auth/invite/");
  };
  reactExports.useEffect(() => {
    if (typeof window === "undefined") {
      setLoading(false);
      return;
    }
    let isMounted = true;
    const skipHeavyBootstrap = isPublicAuthRoute();
    const loadPublicSponsor = () => {
      const params = new URLSearchParams(window.location.search);
      const refParam = params.get("ref");
      const currentPath = window.location.pathname;
      let potentialSponsor = refParam;
      if (!potentialSponsor && currentPath.includes("/ref/")) {
        const parts = currentPath.split("/ref/");
        if (parts[1]) {
          potentialSponsor = parts[1].split(/[/?#]/)[0];
        }
      }
      if (potentialSponsor) {
        const cleanRef = potentialSponsor.trim().toLowerCase();
        setActiveSponsor(cleanRef);
        setActiveReferralMetadata({
          clicked_at: (/* @__PURE__ */ new Date()).toISOString(),
          landing_url: window.location.href,
          referrer_code: cleanRef
        });
      }
    };
    (async () => {
      try {
        if (skipHeavyBootstrap) {
          loadPublicSponsor();
          return;
        }
        const { data: { session } } = await supabase.auth.getSession();
        const currentUser = session?.user ? await SupabaseService.fetchUserProfile(session.user.id) : null;
        if (!isMounted) return;
        if (currentUser) {
          setUser(currentUser);
          if (currentUser.role === UserRole.DISTRIBUIDOR) {
            const dProf = await SupabaseService.fetchDistributorProfile(currentUser.id);
            if (isMounted) {
              setDistributorProfile(dProf);
            }
          }
          try {
            const tracking = await referralTrackingService.getReferralTracking(currentUser.id);
            if (isMounted && tracking) {
              setActiveSponsor(tracking.distributor_slug);
              setActiveReferralMetadata(tracking.metadata);
            }
          } catch (error) {
            console.error("[AuthProvider] Error loading referral tracking:", error);
          }
        }
        loadPublicSponsor();
      } catch (error) {
        console.error("[AuthProvider] Fatal error during initialization:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    })();
    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!isMounted) return;
      if (!session?.user) {
        setUser(null);
        setDistributorProfile(null);
        return;
      }
      if (skipHeavyBootstrap) {
        return;
      }
      const currentUser = await SupabaseService.fetchUserProfile(session.user.id);
      if (!isMounted || !currentUser) return;
      setUser(currentUser);
      if (currentUser.role === UserRole.DISTRIBUIDOR) {
        const dProf = await SupabaseService.fetchDistributorProfile(currentUser.id);
        if (isMounted) {
          setDistributorProfile(dProf);
        }
      }
    });
    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);
  const login = async (email, password) => {
    return AuthService.login(
      email,
      password,
      setUser,
      setLoading
    );
  };
  const register = async (name, email, role, extra) => {
    return AuthService.register(
      name,
      email,
      role,
      extra,
      activeSponsor,
      activeReferralMetadata,
      setUser,
      setDistributorProfile,
      setLoading
    );
  };
  const logout = async () => {
    return AuthService.logout(
      user,
      setUser,
      setDistributorProfile,
      setLoading
    );
  };
  const updateProfile = async (updates) => {
    return ProfileService.updateProfile(
      updates,
      user,
      setUser
    );
  };
  const updateDistributorProfile = async (updates) => {
    return ProfileService.updateDistributorProfile(
      updates,
      user,
      distributorProfile,
      setDistributorProfile
    );
  };
  const changeUserRole = async (userId, targetRole) => {
    return AuthService.changeUserRole(
      userId,
      targetRole,
      user,
      setUser
    );
  };
  const activateDistributorOffice = async (_planId) => {
    throw new Error("activateDistributorOffice needs to be migrated to Supabase");
  };
  const createAdminInvite = async (invite) => {
    return InviteService.createAdminInvite(invite, user);
  };
  const revokeAdminInvite = async (inviteId) => {
    return InviteService.revokeAdminInvite(inviteId, user);
  };
  const resendAdminInvite = async (inviteId) => {
    return InviteService.resendAdminInvite(inviteId, user);
  };
  const getAdminInviteByToken = async (token) => {
    return InviteService.getAdminInviteByToken(token);
  };
  const acceptAdminInvite = async (token, name, password) => {
    return InviteService.acceptAdminInvite(token, name, password);
  };
  const deleteUserAndInviteSession = async (userId) => {
    return InviteService.deleteUserAndInviteSession(userId);
  };
  const simulateAuditLog = async (action, entity, details) => {
    await AuditService.logAudit(action, entity, details, user);
  };
  const addAuditLog = async (logInput) => {
    await AuditService.addAuditLog(logInput, user);
  };
  const triggerBinomialBonusPay = async (points, commission, value2) => {
    await AuditService.triggerBinomialBonusPay(points, commission, value2, activeSponsor);
  };
  const clearSponsor = async () => {
    if (user?.id) {
      try {
        await referralTrackingService.clearReferralTracking(user.id);
      } catch (error) {
        console.error("[AuthProvider] Error clearing referral tracking:", error);
      }
    }
    setActiveSponsor(null);
    setActiveReferralMetadata(null);
  };
  const value = {
    user,
    loading,
    distributorProfile,
    activeSponsor,
    activeReferralMetadata,
    auditLogs: [],
    // Deprecated - use AuditService.fetchAuditLogs() from Supabase
    usersList: [],
    // Deprecated - use Supabase profiles/customers tables
    adminInvites: [],
    // Deprecated - use Supabase admin_invites table
    login,
    register,
    logout,
    updateProfile,
    updateDistributorProfile,
    changeUserRole,
    simulateAuditLog,
    clearSponsor,
    activateDistributorOffice,
    addAuditLog,
    triggerBinomialBonusPay,
    createAdminInvite,
    revokeAdminInvite,
    resendAdminInvite,
    getAdminInviteByToken,
    acceptAdminInvite,
    deleteUserAndInviteSession
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AuthContext.Provider, { value, children });
};
const useAuth = () => {
  const context = reactExports.useContext(AuthContext);
  if (!context) {
    throw new Error("AuthProvider not found");
  }
  return context;
};
const ROLE_REDIRECT_PATHS = {
  [UserRole.ADMIN_MASTER]: "/analytics",
  [UserRole.GESTAO_ADMIN]: "/analytics",
  [UserRole.FINANCEIRO]: "/wallets",
  [UserRole.SUPORTE]: "/customers",
  [UserRole.LOGISTICA]: "/office",
  [UserRole.MARKETING]: "/office",
  [UserRole.ANALYTICS]: "/office",
  [UserRole.AUDITOR]: "/office",
  [UserRole.OPERADOR]: "/office",
  [UserRole.DISTRIBUIDOR]: "/office",
  [UserRole.AFILIADO]: "/office",
  [UserRole.CLIENTE_FINAL]: "/loja"
};
const ROLE_DEMO_PATHS = {
  [UserRole.ADMIN_MASTER]: "/analytics",
  [UserRole.GESTAO_ADMIN]: "/analytics",
  [UserRole.FINANCEIRO]: "/wallets",
  [UserRole.SUPORTE]: "/customers",
  [UserRole.LOGISTICA]: "/office/orders",
  [UserRole.MARKETING]: "/marketing",
  [UserRole.ANALYTICS]: "/analytics",
  [UserRole.AUDITOR]: "/insights",
  [UserRole.OPERADOR]: "/office",
  [UserRole.DISTRIBUIDOR]: "/office/network",
  [UserRole.AFILIADO]: "/office/network",
  [UserRole.CLIENTE_FINAL]: "/loja"
};
function getRoleRedirectPath(user) {
  const basePath = ROLE_REDIRECT_PATHS[user.role] || "/";
  if (user.status === "pending" && basePath === "/office") {
    return "/ativacao";
  }
  return basePath;
}
function getDemoRedirectPath(role) {
  return ROLE_DEMO_PATHS[role] || "/";
}
function getPrimaryPathForRole(role) {
  return ROLE_REDIRECT_PATHS[role] || "/";
}
const EMPTY_THEME = {
  color: "",
  gradient: "",
  badgeBg: "",
  btnBg: "",
  accentText: "",
  slogan: "",
  bio: "",
  quote: ""
};
function emptyDistributor(slug = "") {
  return {
    slug,
    name: "Distribuidor",
    rank: "",
    avatar: "",
    theme: EMPTY_THEME,
    isFallback: true
  };
}
async function resolveDistributor(slug) {
  const activeSlug = (slug || "").toLowerCase().trim();
  const reservedSlugs = /* @__PURE__ */ new Set(["_", "_app", "login", "cadastro", "recuperar-senha", "redefinir-senha", "office", "loja"]);
  if (!activeSlug || reservedSlugs.has(activeSlug) || activeSlug.startsWith("_app")) {
    return emptyDistributor();
  }
  const distributorData = await SupabaseService.fetchDistributorBySlug(activeSlug);
  if (distributorData) {
    const themeData = await SupabaseService.fetchDistributorTheme(distributorData.user_id);
    return {
      slug: activeSlug,
      name: distributorData.usuario || distributorData.id_comprador || "Distribuidor",
      rank: distributorData.qualification || "",
      avatar: "",
      theme: {
        color: themeData?.color || "",
        gradient: themeData?.gradient || "",
        badgeBg: themeData?.badge_bg || "",
        btnBg: themeData?.btn_bg || "",
        accentText: themeData?.accent_text || "",
        slogan: themeData?.slogan || "",
        bio: themeData?.bio || "",
        quote: themeData?.quote || "",
        videoUrl: themeData?.video_url || void 0
      },
      isFallback: false
    };
  }
  const defaultThemeData = await SupabaseService.fetchDistributorTheme();
  return {
    slug: activeSlug,
    name: "Distribuidor",
    rank: "",
    avatar: "",
    theme: {
      color: defaultThemeData?.color || "",
      gradient: defaultThemeData?.gradient || "",
      badgeBg: defaultThemeData?.badge_bg || "",
      btnBg: defaultThemeData?.btn_bg || "",
      accentText: defaultThemeData?.accent_text || "",
      slogan: defaultThemeData?.slogan || "",
      bio: defaultThemeData?.bio || "",
      quote: defaultThemeData?.quote || "",
      videoUrl: defaultThemeData?.video_url || void 0
    },
    isFallback: true
  };
}
const DistributorContext = reactExports.createContext(void 0);
const DistributorProvider = ({
  children,
  initialSlug
}) => {
  const [slug, setSlug] = reactExports.useState(() => initialSlug || "");
  const [currentDistributor, setCurrentDistributor] = reactExports.useState(() => emptyDistributor(initialSlug || ""));
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const currentPath = typeof window !== "undefined" ? window.location.pathname : "";
        if (currentPath === "/" || currentPath === "") {
          setCurrentDistributor(emptyDistributor(slug));
          return;
        }
        setCurrentDistributor(await resolveDistributor(slug));
      } catch (error) {
        console.error("[DistributorContext] Error resolving distributor:", error);
        setCurrentDistributor(emptyDistributor(slug));
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(DistributorContext.Provider, { value: { currentDistributor, setDistributorBySlug: setSlug, loading }, children });
};
const useDistributor = () => {
  const context = reactExports.useContext(DistributorContext);
  if (!context) {
    throw new Error("DistributorProvider not found");
  }
  return context;
};
const defaultSettings = {
  whatsapp: "",
  sponsorLink: "",
  storeName: "",
  storeSlug: ""
};
const StoreSettingsContext = reactExports.createContext(void 0);
const StoreSettingsProvider = ({ children }) => {
  const [settings, setSettings] = reactExports.useState(defaultSettings);
  const updateSettings = (newSettings) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(StoreSettingsContext.Provider, { value: { settings, updateSettings, whatsapp: settings.whatsapp, sponsorLink: settings.sponsorLink }, children });
};
const useStoreSettings = () => {
  const context = reactExports.useContext(StoreSettingsContext);
  if (context === void 0) {
    return {
      settings: defaultSettings,
      updateSettings: () => {
      },
      whatsapp: defaultSettings.whatsapp,
      sponsorLink: defaultSettings.sponsorLink
    };
  }
  return context;
};
const cartService = {
  /**
   * Get all cart items for current user
   */
  getCartItems: async (userId) => {
    const { data, error } = await supabase.from("cart_items").select(`
        *,
        products (
          id,
          name,
          price,
          images,
          category
        )
      `).eq("user_id", userId).order("created_at", { ascending: false });
    if (error) {
      console.error("[cartService] Error fetching cart items:", error);
      throw error;
    }
    return (data || []).map((item) => ({
      id: item.id,
      user_id: item.user_id,
      product_id: item.product_id,
      quantity: item.quantity,
      metadata: item.metadata || {},
      created_at: item.created_at,
      updated_at: item.updated_at,
      product: item.products
    }));
  },
  /**
   * Add item to cart
   */
  addItem: async (userId, item) => {
    const { data: existing } = await supabase.from("cart_items").select("*").eq("user_id", userId).eq("product_id", item.product_id).single();
    if (existing) {
      const { data: data2, error: error2 } = await supabase.from("cart_items").update({
        quantity: existing.quantity + item.quantity,
        metadata: { ...existing.metadata, ...item.metadata }
      }).eq("id", existing.id).select(`
          *,
          products (
            id,
            name,
            price,
            images,
            category
          )
        `).single();
      if (error2) {
        console.error("[cartService] Error updating cart item:", error2);
        throw error2;
      }
      return {
        id: data2.id,
        user_id: data2.user_id,
        product_id: data2.product_id,
        quantity: data2.quantity,
        metadata: data2.metadata || {},
        created_at: data2.created_at,
        updated_at: data2.updated_at,
        product: data2.products
      };
    }
    const { data, error } = await supabase.from("cart_items").insert({
      user_id: userId,
      product_id: item.product_id,
      quantity: item.quantity,
      metadata: item.metadata || {}
    }).select(`
        *,
        products (
          id,
          name,
          price,
          images,
          category
        )
      `).single();
    if (error) {
      console.error("[cartService] Error adding cart item:", error);
      throw error;
    }
    return {
      id: data.id,
      user_id: data.user_id,
      product_id: data.product_id,
      quantity: data.quantity,
      metadata: data.metadata || {},
      created_at: data.created_at,
      updated_at: data.updated_at,
      product: data.products
    };
  },
  /**
   * Update item quantity
   */
  updateItemQuantity: async (cartItemId, quantity) => {
    if (quantity <= 0) {
      await cartService.removeItem(cartItemId);
      return;
    }
    const { error } = await supabase.from("cart_items").update({ quantity }).eq("id", cartItemId);
    if (error) {
      console.error("[cartService] Error updating cart item quantity:", error);
      throw error;
    }
  },
  /**
   * Remove item from cart
   */
  removeItem: async (cartItemId) => {
    const { error } = await supabase.from("cart_items").delete().eq("id", cartItemId);
    if (error) {
      console.error("[cartService] Error removing cart item:", error);
      throw error;
    }
  },
  /**
   * Clear all cart items for user
   */
  clearCart: async (userId) => {
    const { error } = await supabase.from("cart_items").delete().eq("user_id", userId);
    if (error) {
      console.error("[cartService] Error clearing cart:", error);
      throw error;
    }
  },
  /**
   * Get cart total
   */
  getCartTotal: async (userId) => {
    const items = await cartService.getCartItems(userId);
    return items.reduce((total, item) => {
      const price = parseFloat(item.product?.price || "0");
      return total + price * item.quantity;
    }, 0);
  },
  /**
   * Get cart item count
   */
  getCartItemCount: async (userId) => {
    const items = await cartService.getCartItems(userId);
    return items.reduce((count, item) => count + item.quantity, 0);
  }
};
const CartContext = reactExports.createContext(void 0);
const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(false);
  const [isOpen, setIsOpen] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (!user?.id) {
      setItems([]);
      return;
    }
    const loadCart = async () => {
      setLoading(true);
      try {
        const supabaseItems = await cartService.getCartItems(user.id);
        const mappedItems = supabaseItems.map((item) => ({
          id: item.id,
          productId: item.product_id,
          name: item.product?.name || "Produto",
          imageUrl: item.product?.images?.[0] || "",
          price: item.product?.price || "0",
          quantity: item.quantity
        }));
        setItems(mappedItems);
      } catch (error) {
        console.error("[CartContext] Error loading cart:", error);
      } finally {
        setLoading(false);
      }
    };
    loadCart();
  }, [user?.id]);
  const addItem = reactExports.useCallback(async (productId, quantity = 1) => {
    if (!user?.id) {
      console.warn("[CartContext] User not logged in, cannot add to cart");
      return;
    }
    setLoading(true);
    try {
      await cartService.addItem(user.id, { product_id: productId, quantity });
      const supabaseItems = await cartService.getCartItems(user.id);
      const mappedItems = supabaseItems.map((item) => ({
        id: item.id,
        productId: item.product_id,
        name: item.product?.name || "Produto",
        imageUrl: item.product?.images?.[0] || "",
        price: item.product?.price || "0",
        quantity: item.quantity
      }));
      setItems(mappedItems);
      setIsOpen(true);
      setTimeout(() => setIsOpen(false), 3e3);
    } catch (error) {
      console.error("[CartContext] Error adding item to cart:", error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);
  const removeItem = reactExports.useCallback(async (cartItemId, _selectedSize) => {
    if (!user?.id) return;
    setLoading(true);
    try {
      await cartService.removeItem(cartItemId);
      setItems((prev) => prev.filter((item) => item.id !== cartItemId));
    } catch (error) {
      console.error("[CartContext] Error removing item from cart:", error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);
  const updateQuantity = reactExports.useCallback(async (cartItemId, selectedSizeOrQuantity, quantity) => {
    if (!user?.id) return;
    const nextQuantity = typeof selectedSizeOrQuantity === "number" ? selectedSizeOrQuantity : quantity ?? 1;
    setLoading(true);
    try {
      await cartService.updateItemQuantity(cartItemId, nextQuantity);
      setItems(
        (prev) => prev.map(
          (item) => item.id === cartItemId ? { ...item, quantity: nextQuantity } : item
        )
      );
    } catch (error) {
      console.error("[CartContext] Error updating cart item quantity:", error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);
  const clearCart = reactExports.useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      await cartService.clearCart(user.id);
      setItems([]);
    } catch (error) {
      console.error("[CartContext] Error clearing cart:", error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);
  const getTotalItems = reactExports.useCallback(() => {
    return items.reduce((total, item) => total + item.quantity, 0);
  }, [items]);
  const getTotalPrice = reactExports.useCallback(() => {
    return items.reduce((total, item) => total + parseFloat(item.price) * item.quantity, 0);
  }, [items]);
  const contextValue = reactExports.useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      getTotalItems,
      getTotalPrice,
      loading,
      isOpen,
      setIsOpen
    }),
    [items, addItem, removeItem, updateQuantity, clearCart, getTotalItems, getTotalPrice, loading, isOpen]
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsx(CartContext.Provider, { value: contextValue, children });
};
const useCart = () => {
  const context = reactExports.useContext(CartContext);
  if (!context) {
    console.warn("CartProvider not found, returning empty cart.");
    return {
      items: [],
      addItem: async () => console.warn("CartProvider not found"),
      removeItem: async () => console.warn("CartProvider not found"),
      updateQuantity: async () => console.warn("CartProvider not found"),
      clearCart: async () => console.warn("CartProvider not found"),
      getTotalItems: () => 0,
      getTotalPrice: () => 0,
      loading: false,
      isOpen: false,
      setIsOpen: () => console.warn("CartProvider not found")
    };
  }
  return context;
};
const productsService = {
  /**
   * Get all products from Supabase
   */
  getAllProducts: async () => {
    const { data, error } = await supabase.from("products").select("*").eq("is_active", true).order("created_at", { ascending: false });
    if (error) {
      console.error("[productsService] Error fetching products:", error);
      throw error;
    }
    return (data || []).map((product) => ({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price?.toString() || "0",
      images: product.images || [],
      description: product.description,
      sku: product.sku,
      manufacturer: product.manufacturer,
      stock: product.stock || 0,
      is_active: product.is_active ?? true,
      metadata: product.metadata || {},
      created_at: product.created_at,
      updated_at: product.updated_at,
      // Legacy fields for backward compatibility
      linkProduto: product.metadata?.linkProduto,
      imgSrc: product.images?.[0],
      imgSrc2: product.images?.[1],
      caption: product.name,
      caption2: product.description,
      promotion: product.metadata?.promotion,
      parcelasValor: product.metadata?.parcelasValor,
      produtoTag: product.metadata?.produtoTag,
      categorias: product.category
    }));
  },
  /**
   * Get products by category
   */
  getProductsByCategory: async (categoryName) => {
    const { data, error } = await supabase.from("products").select("*").eq("category", categoryName).eq("is_active", true).order("created_at", { ascending: false });
    if (error) {
      console.error("[productsService] Error fetching products by category:", error);
      throw error;
    }
    return (data || []).map((product) => ({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price?.toString() || "0",
      images: product.images || [],
      description: product.description,
      sku: product.sku,
      manufacturer: product.manufacturer,
      stock: product.stock || 0,
      is_active: product.is_active ?? true,
      metadata: product.metadata || {},
      created_at: product.created_at,
      updated_at: product.updated_at,
      // Legacy fields for backward compatibility
      linkProduto: product.metadata?.linkProduto,
      imgSrc: product.images?.[0],
      imgSrc2: product.images?.[1],
      caption: product.name,
      caption2: product.description,
      promotion: product.metadata?.promotion,
      parcelasValor: product.metadata?.parcelasValor,
      produtoTag: product.metadata?.produtoTag,
      categorias: product.category
    }));
  },
  /**
   * Get product by ID
   */
  getProductById: async (id) => {
    const { data, error } = await supabase.from("products").select("*").eq("id", id).single();
    if (error) {
      console.error("[productsService] Error fetching product by ID:", error);
      return void 0;
    }
    if (!data) return void 0;
    return {
      id: data.id,
      name: data.name,
      category: data.category,
      price: data.price?.toString() || "0",
      images: data.images || [],
      description: data.description,
      sku: data.sku,
      manufacturer: data.manufacturer,
      stock: data.stock || 0,
      is_active: data.is_active ?? true,
      metadata: data.metadata || {},
      created_at: data.created_at,
      updated_at: data.updated_at,
      // Legacy fields for backward compatibility
      linkProduto: data.metadata?.linkProduto,
      imgSrc: data.images?.[0],
      imgSrc2: data.images?.[1],
      caption: data.name,
      caption2: data.description,
      promotion: data.metadata?.promotion,
      parcelasValor: data.metadata?.parcelasValor,
      produtoTag: data.metadata?.produtoTag,
      categorias: data.category
    };
  },
  /**
   * Get unique categories
   */
  getCategories: async () => {
    const { data, error } = await supabase.from("products").select("category").not("category", "is", null).eq("is_active", true);
    if (error) {
      console.error("[productsService] Error fetching categories:", error);
      return [];
    }
    const categories = [...new Set((data || []).map((p) => p.category).filter(Boolean))];
    return categories;
  },
  /**
   * Clear the cache (no longer needed with database)
   */
  clearCache: () => {
  }
};
const ProductsContext = reactExports.createContext(void 0);
const ProductsProvider = ({ children }) => {
  const [products, setProducts] = reactExports.useState([]);
  const [categories, setCategories] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState(null);
  const loadData = reactExports.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const productsData = await productsService.getAllProducts();
      setProducts(productsData);
      const categoryMap = /* @__PURE__ */ new Map();
      productsData.forEach((product) => {
        const categoryName = product.categorias;
        if (categoryName) {
          categoryMap.set(categoryName, (categoryMap.get(categoryName) || 0) + 1);
        }
      });
      const categoriesData = Array.from(categoryMap.entries()).map(([name, count], index) => ({
        id: index + 1,
        name,
        productCount: count
      }));
      setCategories(categoriesData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido ao carregar dados";
      setError(errorMessage);
      console.error("Erro no ProductsProvider:", err);
    } finally {
      setLoading(false);
    }
  }, []);
  const refreshProducts = reactExports.useCallback(async () => {
    await loadData();
  }, [loadData]);
  const getProductsByCategory = reactExports.useCallback((categoryName, limit = 4) => {
    const filteredProducts = products.filter(
      (product) => product.categorias.trim().toLowerCase() === categoryName.toLowerCase()
    );
    return limit ? filteredProducts.slice(0, limit) : filteredProducts;
  }, [products]);
  reactExports.useEffect(() => {
    loadData();
  }, [loadData]);
  const contextValue = reactExports.useMemo(() => ({
    products,
    categories,
    loading,
    error,
    refreshProducts,
    getProductsByCategory
  }), [products, categories, loading, error, refreshProducts, getProductsByCategory]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ProductsContext.Provider, { value: contextValue, children });
};
const useProducts = () => {
  const context = reactExports.useContext(ProductsContext);
  if (!context) {
    throw new Error("useProducts deve ser usado dentro de um ProductsProvider");
  }
  return context;
};
const defaultStyles = {
  section: "py-16 px-4",
  card: "bg-white/30 dark:bg-allin-bg-dark-2/30 rounded-lg border border-allin-orange/10",
  title: "text-3xl md:text-4xl font-bold text-allin-dark dark:text-allin-white mb-4",
  subtitle: "text-lg text-allin-dark/70 dark:text-allin-white/70"
};
const StyleContext = reactExports.createContext(defaultStyles);
const StyleProvider = ({
  children,
  styles = {}
}) => {
  const mergedStyles = { ...defaultStyles, ...styles };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(StyleContext.Provider, { value: mergedStyles, children });
};
const useSharedStyles = () => {
  const context = reactExports.useContext(StyleContext);
  return context || defaultStyles;
};
const ThemeContext = reactExports.createContext(void 0);
const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = reactExports.useState("light");
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ThemeContext.Provider, { value: { theme, toggleTheme }, children });
};
const useTheme = () => {
  const context = reactExports.useContext(ThemeContext);
  if (context === void 0) {
    return {
      theme: "light",
      toggleTheme: () => {
      }
    };
  }
  return context;
};
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-7xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "Page not found" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist or has been moved." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
        children: "Go home"
      }
    ) })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router2 = useRouter();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold tracking-tight text-foreground", children: "This page didn't load" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Something went wrong on our end. You can try refreshing or head back home." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const Route$K = createRootRouteWithContext()({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootComponent() {
  const { queryClient } = Route$K.useRouteContext();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("head", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("meta", { charSet: "UTF-8" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("meta", { name: "viewport", content: "width=device-width, initial-scale=1.0" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {})
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { className: "dark bg-[#06080d] text-white", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ThemeProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(AuthProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DistributorProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(StoreSettingsProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CartProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(ProductsProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(StyleProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) }) }) }) }) }) }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
const $$splitComponentImporter$I = () => import("./seja-distribuidor-Dbg4nq9Z.mjs");
const Route$J = createFileRoute("/seja-distribuidor")({
  component: lazyRouteComponent($$splitComponentImporter$I, "component")
});
const $$splitComponentImporter$H = () => import("./redefinir-senha-QiJErt6w.mjs");
const Route$I = createFileRoute("/redefinir-senha")({
  component: lazyRouteComponent($$splitComponentImporter$H, "component")
});
const $$splitComponentImporter$G = () => import("./recuperar-senha-Dt02yEHc.mjs");
const Route$H = createFileRoute("/recuperar-senha")({
  component: lazyRouteComponent($$splitComponentImporter$G, "component")
});
const $$splitComponentImporter$F = () => import("./office-wPyevLkS.mjs");
const Route$G = createFileRoute("/office")({
  component: lazyRouteComponent($$splitComponentImporter$F, "component")
});
const $$splitComponentImporter$E = () => import("./loja-CvSEUolZ.mjs");
const Route$F = createFileRoute("/loja")({
  component: lazyRouteComponent($$splitComponentImporter$E, "component")
});
const $$splitComponentImporter$D = () => import("./login-zc3vrhfi.mjs");
const Route$E = createFileRoute("/login")({
  component: lazyRouteComponent($$splitComponentImporter$D, "component")
});
const $$splitComponentImporter$C = () => import("./doencas-CmDuPDo6.mjs");
const Route$D = createFileRoute("/doencas")({
  component: lazyRouteComponent($$splitComponentImporter$C, "component")
});
const $$splitComponentImporter$B = () => import("./checkout-D4LXcKuH.mjs");
const Route$C = createFileRoute("/checkout")({
  component: lazyRouteComponent($$splitComponentImporter$B, "component")
});
const $$splitComponentImporter$A = () => import("./cadastro-CzqnZ9q7.mjs");
const Route$B = createFileRoute("/cadastro")({
  component: lazyRouteComponent($$splitComponentImporter$A, "component")
});
const $$splitComponentImporter$z = () => import("./busca-produtos-D4y-isE_.mjs");
const Route$A = createFileRoute("/busca-produtos")({
  component: lazyRouteComponent($$splitComponentImporter$z, "component")
});
const $$splitComponentImporter$y = () => import("./ativacao-CmuxExuh.mjs");
const Route$z = createFileRoute("/ativacao")({
  component: lazyRouteComponent($$splitComponentImporter$y, "component")
});
const $$splitComponentImporter$x = () => import("../_app-CLlHWPu3.mjs");
const Route$y = createFileRoute("/_app")({
  component: lazyRouteComponent($$splitComponentImporter$x, "component")
});
const $$splitComponentImporter$w = () => import("../_slug-R4rKYYRy.mjs");
const Route$x = createFileRoute("/$slug")({
  component: lazyRouteComponent($$splitComponentImporter$w, "component")
});
const $$splitComponentImporter$v = () => import("./index-1Y4FO1go.mjs");
const Route$w = createFileRoute("/")({
  component: lazyRouteComponent($$splitComponentImporter$v, "component")
});
const $$splitComponentImporter$u = () => import("./index-C-hExo-L.mjs");
const Route$v = createFileRoute("/office/")({
  component: lazyRouteComponent($$splitComponentImporter$u, "component")
});
const $$splitComponentImporter$t = () => import("./seja-distribuidor._slug-_zjA6xc3.mjs");
const Route$u = createFileRoute("/seja-distribuidor/$slug")({
  component: lazyRouteComponent($$splitComponentImporter$t, "component")
});
const $$splitComponentImporter$s = () => import("./produto._id-DRQ-0ez5.mjs");
const Route$t = createFileRoute("/produto/$id")({
  component: lazyRouteComponent($$splitComponentImporter$s, "component")
});
const $$splitComponentImporter$r = () => import("./verification-DG2gAhvQ.mjs");
const Route$s = createFileRoute("/office/verification")({
  component: lazyRouteComponent($$splitComponentImporter$r, "component")
});
const $$splitComponentImporter$q = () => import("./store-DRnNwgdT.mjs");
const Route$r = createFileRoute("/office/store")({
  component: lazyRouteComponent($$splitComponentImporter$q, "component")
});
const $$splitComponentImporter$p = () => import("./reports-Y8h31z9x.mjs");
const Route$q = createFileRoute("/office/reports")({
  component: lazyRouteComponent($$splitComponentImporter$p, "component")
});
const $$splitComponentImporter$o = () => import("./profile-C3T2FrMW.mjs");
const Route$p = createFileRoute("/office/profile")({
  component: lazyRouteComponent($$splitComponentImporter$o, "component")
});
const $$splitComponentImporter$n = () => import("./plan-BPaEWDJF.mjs");
const Route$o = createFileRoute("/office/plan")({
  component: lazyRouteComponent($$splitComponentImporter$n, "component")
});
const $$splitComponentImporter$m = () => import("./orders-TYZMsst8.mjs");
const Route$n = createFileRoute("/office/orders")({
  component: lazyRouteComponent($$splitComponentImporter$m, "component")
});
const $$splitComponentImporter$l = () => import("./network-DjzE6ulB.mjs");
const Route$m = createFileRoute("/office/network")({
  component: lazyRouteComponent($$splitComponentImporter$l, "component")
});
const $$splitComponentImporter$k = () => import("./finance-CKDypyuK.mjs");
const Route$l = createFileRoute("/office/finance")({
  component: lazyRouteComponent($$splitComponentImporter$k, "component")
});
const $$splitComponentImporter$j = () => import("./downloads-De_vUAHD.mjs");
const Route$k = createFileRoute("/office/downloads")({
  component: lazyRouteComponent($$splitComponentImporter$j, "component")
});
const $$splitComponentImporter$i = () => import("./copilot-D2hD3_oh.mjs");
const Route$j = createFileRoute("/office/copilot")({
  component: lazyRouteComponent($$splitComponentImporter$i, "component")
});
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Badge({ className, variant, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn(badgeVariants({ variant }), className), ...props });
}
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        hero: "bg-allin-orange text-allin-dark font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 hover:bg-allin-orange/90",
        cta: "bg-allin-orange text-allin-dark font-semibold px-8 py-4 text-lg rounded-full shadow-2xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 hover:bg-allin-orange/90",
        vibrant: "bg-allin-orange text-allin-dark font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 hover:bg-allin-orange/90 dark:bg-allin-orange dark:text-allin-dark dark:hover:bg-allin-orange/80 dark:hover:shadow-2xl",
        vibrantOutline: "border-2 border-allin-orange text-allin-orange hover:bg-allin-orange/10 font-semibold dark:border-allin-bg-dark-2 dark:text-allin-orange dark:hover:bg-allin-orange/20"
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const Button = reactExports.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Comp, { className: cn(buttonVariants({ variant, size, className })), ref, ...props });
  }
);
Button.displayName = "Button";
function ThemeToggle() {
  const { toggleTheme } = useTheme();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Button,
    {
      variant: "ghost",
      size: "icon",
      onClick: toggleTheme,
      className: "relative",
      "aria-label": "Alternar tema",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Sun, { className: "h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Moon, { className: "absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children: "Alternar tema" })
      ]
    }
  );
}
const useSponsorLink = () => {
  const { settings } = useStoreSettings();
  const handleCadastro = () => {
    if (settings.sponsorLink) {
      window.open(settings.sponsorLink, "_blank");
    }
  };
  return { handleCadastro };
};
function PublicHeader() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = reactExports.useState(false);
  const { handleCadastro } = useSponsorLink();
  const { user } = useAuth();
  const dashboardHref = user ? getRoleRedirectPath(user) : "/login";
  const navItems = [
    { label: "Inicio", href: "/" },
    { label: "Loja", href: "/loja" },
    { label: "Distribuidor", href: "/seja-distribuidor" }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "fixed top-0 z-40 w-full border-b border-allin-orange/20 bg-allin-bg-light-1/95 shadow-sm backdrop-blur-md dark:border-allin-bg-dark-2 dark:bg-allin-bg-dark-1/95", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 py-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: "https://s3-sa-east-1.amazonaws.com/public-http-files/UploadArquivo/Arquivos/all_in_esp_br/Configuracao/logomarca_sistema_5eee718d4c5bf_logo-h.png",
            alt: "Logo All-In",
            className: "h-10 w-10 rounded-lg object-contain md:h-12 md:w-12"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl font-bold text-allin-orange md:text-2xl", children: "All-In" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "hidden items-center gap-6 md:flex", children: navItems.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        Link,
        {
          to: item.href,
          className: `font-medium transition-colors ${location.pathname === item.href || location.pathname.startsWith(`${item.href}/`) ? "text-allin-orange" : "text-allin-dark hover:text-allin-orange dark:text-allin-white dark:hover:text-allin-orange"}`,
          children: item.label
        },
        item.href
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden items-center gap-3 md:flex", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ThemeToggle, {}),
        user ? /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: dashboardHref, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", className: "border-allin-orange text-allin-orange hover:bg-allin-orange/10 font-semibold", children: "Dashboard" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", className: "border-allin-orange text-allin-orange hover:bg-allin-orange/10 font-semibold", children: "Entrar" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: handleCadastro,
              className: "bg-allin-orange font-semibold text-allin-white shadow-md hover:bg-allin-orange/90 hover:shadow-lg",
              children: "Cadastrar gratis"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 md:hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ThemeToggle, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "ghost",
            size: "icon",
            onClick: () => setIsMobileMenuOpen((value) => !value),
            className: "text-allin-dark transition-colors hover:text-allin-orange dark:text-allin-white",
            "aria-label": "Alternar menu",
            children: isMobileMenuOpen ? /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-6 w-6" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { className: "h-6 w-6" })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: isMobileMenuOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { height: 0, opacity: 0 },
        animate: { height: "auto", opacity: 1 },
        exit: { height: 0, opacity: 0 },
        className: "md:hidden",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 space-y-3 border-t border-allin-orange/20 pt-4 dark:border-allin-bg-dark-2", children: [
          navItems.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link,
            {
              to: item.href,
              onClick: () => setIsMobileMenuOpen(false),
              className: "block rounded-md px-3 py-2 text-base font-medium text-foreground/80 hover:bg-accent hover:text-accent-foreground",
              children: item.label
            },
            item.href
          )),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-2", children: user ? /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: dashboardHref, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              className: "w-full border-allin-orange text-allin-orange hover:bg-allin-orange/10 font-semibold",
              onClick: () => setIsMobileMenuOpen(false),
              children: "Dashboard"
            }
          ) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                className: "w-full border-allin-orange text-allin-orange hover:bg-allin-orange/10 font-semibold",
                onClick: () => setIsMobileMenuOpen(false),
                children: "Entrar"
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                onClick: () => {
                  handleCadastro();
                  setIsMobileMenuOpen(false);
                },
                className: "w-full bg-allin-orange font-semibold text-allin-white hover:bg-allin-orange/90",
                children: "Cadastrar gratis"
              }
            )
          ] }) })
        ] })
      }
    ) })
  ] }) });
}
const Route$i = createFileRoute("/loja/$slug")({
  component: DistributorStorePage
});
function DistributorStorePage() {
  const params = useParams({ strict: false });
  const { currentDistributor, setDistributorBySlug } = useDistributor();
  const { triggerBinomialBonusPay, addAuditLog } = useAuth();
  const { products } = useProducts();
  const formatBRL = (value) => {
    const num = parseFloat(value);
    return num.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };
  const routeSlug = params.slug?.toLowerCase().trim();
  reactExports.useEffect(() => {
    if (routeSlug) {
      setDistributorBySlug(routeSlug);
    }
  }, [routeSlug, setDistributorBySlug]);
  const sponsorSlug = currentDistributor.slug;
  const distName = currentDistributor.name;
  const distRank = currentDistributor.rank;
  const distAvatar = currentDistributor.avatar;
  const [cart, setCart] = reactExports.useState(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(`cart_retail_${routeSlug || "default"}`);
        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    }
    return [];
  });
  const saveCart = (newCart) => {
    setCart(newCart);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(`cart_retail_${routeSlug || "default"}`, JSON.stringify(newCart));
      } catch (e) {
        console.error(e);
      }
    }
  };
  const [selectedProductDetails, setSelectedProductDetails] = reactExports.useState(null);
  const [coupon, setCoupon] = reactExports.useState("");
  const [discount, setDiscount] = reactExports.useState(0);
  const location = useLocation();
  const [checkoutStep, setCheckoutStep] = reactExports.useState(() => {
    return location.pathname === "/checkout" ? "checkout" : "catalog";
  });
  const [custName, setCustName] = reactExports.useState("");
  const [custEmail, setCustEmail] = reactExports.useState("");
  const [custPhone, setCustPhone] = reactExports.useState("");
  const [custCPF, setCustCPF] = reactExports.useState("");
  const [deliveryType, setDeliveryType] = reactExports.useState("sedex");
  const [payMethod, setPayMethod] = reactExports.useState("pix");
  const [cardNumber, setCardNumber] = reactExports.useState("");
  const [cardExpiry, setCardExpiry] = reactExports.useState("");
  const [cardCVC, setCardCVC] = reactExports.useState("");
  const addToCart = (prod) => {
    const existing = cart.find((item) => item.product.id === prod.id);
    let updated;
    if (existing) {
      updated = cart.map((item) => item.product.id === prod.id ? { ...item, quantity: item.quantity + 1 } : item);
    } else {
      updated = [...cart, { product: prod, quantity: 1 }];
    }
    saveCart(updated);
    toast.success(`${prod.name} adicionado ao seu carrinho.`);
  };
  const removeFromCart = (prodId) => {
    const updated = cart.filter((item) => item.product.id !== prodId);
    saveCart(updated);
  };
  const updateQty = (prodId, delta) => {
    const updated = cart.map((item) => {
      if (item.product.id === prodId) {
        const nQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: nQty };
      }
      return item;
    });
    saveCart(updated);
  };
  const clearCart = () => saveCart([]);
  const subtotal = cart.reduce((acc, item) => acc + parseFloat(item.product.price) * item.quantity, 0);
  const deliveryCost = subtotal > 300 || subtotal === 0 ? 0 : 25;
  const finalTotal = Math.max(0, subtotal - discount + deliveryCost);
  const applyCouponHandler = () => {
    if (coupon.trim().toUpperCase() === "ALLIN10") {
      setDiscount(subtotal * 0.1);
      toast.success("Cupom de 10% de desconto aplicado!");
    } else {
      toast.error("Cupom inválido.");
    }
  };
  const startCheckout = () => {
    if (cart.length === 0) {
      toast.error("Seu carrinho está vazio.");
      return;
    }
    setCheckoutStep("checkout");
  };
  const handlePurchaseSubmit = (e) => {
    e.preventDefault();
    if (!custName || !custEmail || !custPhone || !custCPF) {
      toast.error("Por favor, preencha todos os dados de cobrança.");
      return;
    }
    setCheckoutStep("processing");
    setTimeout(async () => {
      try {
        const totalPoints = cart.reduce((acc, item) => {
          const points = item.product.bonus_payment_percentage || 20;
          return acc + points * item.quantity;
        }, 0);
        const totalCommission = cart.reduce((acc, item) => {
          const comm = parseFloat(item.product.price) * 0.25 * item.quantity;
          return acc + comm;
        }, 0);
        await triggerBinomialBonusPay(totalPoints, totalCommission, finalTotal);
        addAuditLog({
          id: `tx-${Math.random().toString(36).substring(3, 11)}`,
          action: "RETAIL_SALE",
          userId: "anonymous-guest-customer",
          userName: custName,
          userRole: "customer",
          module: "orders",
          details: `Venda de varejo via loja de @${sponsorSlug}. Comprador: ${custName} (${custEmail}). Itens: ${cart.map((i) => `${i.product.name} (x${i.quantity})`).join(", ")}. Total: R$ ${finalTotal.toFixed(2)}. Distribuindo ${totalPoints} pontos e comissão de R$ ${totalCommission.toFixed(2)} ao sponsor.`,
          ip: "187.12.92.54"
        });
        toast.success("Pedido faturado! Comissões vinculadas instantaneamente.");
        setCheckoutStep("receipt");
      } catch {
        toast.error("Erro no processamento da transação.");
        setCheckoutStep("checkout");
      }
    }, 3e3);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-[#06080d] text-white selection:bg-emerald-500/30 overflow-x-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-r from-[#0d1627] to-[#070b13] border-b border-border/10 px-4 py-2.5 text-center flex flex-wrap items-center justify-center gap-2 text-xs relative z-40", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-zinc-300 font-sans", children: [
        "Você está navegando na loja virtual oficial de",
        /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { className: "text-white hover:underline cursor-pointer", children: [
          " ",
          distName
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-[10px] font-mono leading-none py-0.5 uppercase", children: distRank }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to: "/$slug",
          params: { slug: sponsorSlug },
          className: "text-emerald-400 hover:text-emerald-300 ml-1.5 underline inline-flex items-center gap-0.5",
          children: [
            "Consultar Perfil ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-3 w-3" })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(PublicHeader, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-12 relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AnimatePresence, { mode: "wait", children: [
        checkoutStep === "catalog" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
            className: "space-y-12",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-indigo-950/20 via-zinc-900/40 to-transparent p-6 sm:p-10", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 right-0 h-96 w-96 bg-gradient-to-b from-purple-500/10 to-transparent blur-3xl pointer-events-none rounded-full" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative max-w-2xl space-y-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold tracking-widest font-mono text-emerald-400 border border-emerald-500/25 px-2.5 py-1 rounded-full uppercase", children: "PRODUTOS HOMOLOGADOS COM PATENTE" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl sm:text-4xl font-black tracking-tight leading-snug", children: "Ciência Bioativa Aplicada à Longevidade Saudável" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-zinc-400 leading-relaxed", children: [
                    "Explore suplementos que operam na modulação de radicais livres, suporte mitocondrial avançado e reversão estética. Compre direto da rede All-In com suporte garantido de @",
                    sponsorSlug,
                    "."
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-xl font-bold tracking-tight text-white flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "h-4 w-4 text-emerald-400" }),
                  " Vitrina de Compras"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-4 gap-6", children: products.map((prod) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "rounded-2xl border border-border/45 bg-[#090d16]/95 overflow-hidden flex flex-col justify-between hover:border-zinc-700 hover:scale-[1.01] transition-all p-1",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "img",
                          {
                            src: prod.imgSrc,
                            alt: prod.caption,
                            className: "w-full h-48 object-cover rounded-xl"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-2 right-2 flex flex-col gap-1 items-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[8px] font-bold font-mono text-emerald-400 bg-background/90 px-2 py-0.5 rounded-md border border-emerald-500/25 uppercase", children: prod.categorias }) })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-4 flex-1 flex flex-col justify-between", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-bold text-white line-clamp-1 leading-snug", children: prod.caption }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed line-clamp-2 mt-1", children: prod.caption2 })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 pt-3 border-t border-border/20", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-baseline", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground font-mono", children: "Valor Comercial:" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-md font-bold text-white", children: formatBRL(prod.price) })
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-5 gap-2", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "button",
                              {
                                onClick: () => setSelectedProductDetails(prod),
                                className: "col-span-2 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold transition-all flex items-center justify-center cursor-pointer",
                                children: "Saiba Mais"
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "button",
                              {
                                onClick: () => addToCart(prod),
                                className: "col-span-3 h-8 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-black text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer pt-0.5",
                                children: "Adicionar"
                              }
                            )
                          ] })
                        ] })
                      ] })
                    ]
                  },
                  prod.id
                )) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { id: "cart-drawer", className: "rounded-3xl border border-zinc-800 bg-[#090d16]/85 p-6 md:p-8 grid md:grid-cols-12 gap-8 scroll-mt-24", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-7 space-y-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-md font-bold text-white flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "h-4.5 w-4.5 text-emerald-400" }),
                    " Seu Carrinho de Compras"
                  ] }),
                  cart.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-12 space-y-3 border border-dashed border-border/40 rounded-2xl bg-background/20", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-zinc-500", children: "Seu carrinho está vazio." }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        onClick: () => addToCart(products[0]),
                        className: "h-8 px-4 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 text-xs font-semibold cursor-pointer",
                        children: "Começar com Vita Complex"
                      }
                    )
                  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3.5 divide-y divide-border/25", children: cart.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4 items-center pt-3.5 first:pt-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "img",
                      {
                        src: item.product.id === "prd_1" ? "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=100" : item.product.id === "prd_2" ? "https://images.unsplash.com/photo-1512152272829-e3139592d56f?auto=format&fit=crop&q=80&w=100" : "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&q=80&w=100",
                        alt: item.product.name,
                        className: "h-12 w-12 rounded-lg object-cover bg-zinc-800"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-xs font-bold text-white truncate", children: item.product.name }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-emerald-400 font-mono", children: [
                        "+",
                        item.product.bonus_payment_percentage || 20,
                        " Pontos MLM por unidade"
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 bg-[#06080d] border border-border/80 rounded-lg p-0.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => updateQty(item.product.id, -1), className: "h-6 w-6 rounded-md hover:bg-background/80 flex items-center justify-center shrink-0 text-zinc-400 hover:text-white cursor-pointer", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { className: "h-3 w-3" }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold font-mono px-2 w-6 text-center", children: item.quantity }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => updateQty(item.product.id, 1), className: "h-6 w-6 rounded-md hover:bg-background/80 flex items-center justify-center shrink-0 text-zinc-400 hover:text-white cursor-pointer", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3 w-3" }) })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right pl-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-white", children: formatBRL(item.product.price * item.quantity) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => removeFromCart(item.product.id), className: "text-[10px] text-rose-400 hover:underline inline-flex items-center gap-0.5 mt-0.5 cursor-pointer", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3 w-3" }),
                        " Excluir"
                      ] })
                    ] })
                  ] }, item.product.id)) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "md:col-span-1 border-r border-border/10 hidden md:block" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-4 space-y-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 bg-background/50 rounded-xl border border-border/30 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase font-bold text-muted-foreground tracking-wider font-mono", children: "Resumo Financeiro" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] uppercase font-bold text-muted-foreground tracking-widest block font-mono", children: "Cupom Cadastrado" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "input",
                        {
                          type: "text",
                          value: coupon,
                          onChange: (e) => setCoupon(e.target.value),
                          placeholder: "ALLIN10",
                          className: "flex-1 h-8 rounded-lg bg-[#06080d] border border-border px-3 text-xs uppercase font-mono"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          onClick: applyCouponHandler,
                          className: "h-8 px-4 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/35 text-emerald-400 text-xs font-bold cursor-pointer font-mono",
                          children: "Aplicar"
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 rounded-xl bg-background/50 border border-border/30 space-y-2 text-xs font-mono", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-zinc-400", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Subtotal:" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white", children: formatBRL(subtotal) })
                    ] }),
                    discount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-rose-400", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Desconto ALLIN10 (-10%):" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                        "-",
                        formatBRL(discount)
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-zinc-400", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Frete Internacional (Sedex):" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white", children: deliveryCost === 0 ? "Grátis" : formatBRL(deliveryCost) })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-zinc-800 pt-3 flex justify-between font-bold text-sm", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white font-sans font-bold", children: "Total Geral:" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-emerald-400 font-extrabold", children: formatBRL(finalTotal) })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      onClick: startCheckout,
                      className: "w-full h-10 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-black text-xs font-bold uppercase tracking-wider h-11 flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/10 pt-0.5 cursor-pointer",
                      children: [
                        "Seguir para Pagamento",
                        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4" })
                      ]
                    }
                  )
                ] })
              ] })
            ]
          },
          "catalog-view"
        ),
        checkoutStep === "checkout" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, scale: 0.98 },
            animate: { opacity: 1, scale: 1 },
            exit: { opacity: 0 },
            className: "max-w-4xl mx-auto rounded-3xl border border-zinc-800 bg-[#090d16] p-6 md:p-10 shadow-2xl space-y-8",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center border-b border-border/20 pb-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-bold text-white leading-tight", children: "Checkout do Consumidor Final" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-zinc-400 mt-1", children: "Inscreva seus dados para calcular entrega e processar cashback de rede All-In." })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    onClick: () => setCheckoutStep("catalog"),
                    className: "inline-flex items-center gap-1 text-xs text-emerald-400 hover:underline cursor-pointer font-mono",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-3.5 w-3.5" }),
                      " Voltar à loja"
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handlePurchaseSubmit, className: "grid md:grid-cols-12 gap-8", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-7 space-y-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-bold font-mono uppercase tracking-widest text-[#a855f7] bg-purple-500/15 border border-purple-500/20 px-2 rounded-md py-0.5 inline-block", children: "1. Dados Governamentais & Cobrança" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] uppercase font-bold text-muted-foreground font-mono", children: "Nome Completo do Destinatário" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "input",
                        {
                          type: "text",
                          required: true,
                          value: custName,
                          onChange: (e) => setCustName(e.target.value),
                          placeholder: "Ex: Carlos Heitor",
                          className: "w-full h-9 rounded-lg bg-background border border-border px-3 text-xs text-white"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-2 gap-3", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] uppercase font-bold text-muted-foreground font-mono", children: "E-mail para Nota Fiscal" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "input",
                          {
                            type: "email",
                            required: true,
                            value: custEmail,
                            onChange: (e) => setCustEmail(e.target.value),
                            placeholder: "carlos@allin.io",
                            className: "w-full h-9 rounded-lg bg-background border border-border px-3 text-xs text-white"
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] uppercase font-bold text-muted-foreground font-mono", children: "CPF para Registros Fiscais" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "input",
                          {
                            type: "text",
                            required: true,
                            value: custCPF,
                            onChange: (e) => setCustCPF(e.target.value),
                            placeholder: "000.000.000-00",
                            className: "w-full h-9 rounded-lg bg-background border border-border px-3 text-xs text-white"
                          }
                        )
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-2 gap-3", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] uppercase font-bold text-muted-foreground font-mono", children: "Telefone WhatsApp" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "input",
                          {
                            type: "tel",
                            required: true,
                            value: custPhone,
                            onChange: (e) => setCustPhone(e.target.value),
                            placeholder: "(11) 99312-0000",
                            className: "w-full h-9 rounded-lg bg-background border border-border px-3 text-xs text-white"
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] uppercase font-bold text-muted-foreground font-mono", children: "Modalidade de Frete" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "select",
                          {
                            value: deliveryType,
                            onChange: (e) => setDeliveryType(e.target.value),
                            className: "w-full h-9 rounded-lg bg-[#06080d] border border-border px-3 text-xs text-white cursor-pointer",
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "sedex", children: "Sedex Expresso Internacional (3 dias úteis)" }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "pac", children: "PAC Standart (8 dias úteis)" })
                            ]
                          }
                        )
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 pt-4 border-t border-border/15", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-bold font-mono uppercase tracking-widest text-[#a855f7] bg-purple-500/15 border border-purple-500/20 px-2 rounded-md py-0.5 inline-block", children: "2. Escolha o Método de Liquidação" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "button",
                        {
                          type: "button",
                          onClick: () => setPayMethod("pix"),
                          className: `py-3 px-4 text-xs font-bold rounded-xl border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${payMethod === "pix" ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400" : "border-zinc-800 bg-[#06080d] text-zinc-400"}`,
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(QrCode, { className: "h-4 w-4" }),
                            " Pix QR Code Autogerado"
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "button",
                        {
                          type: "button",
                          onClick: () => setPayMethod("card"),
                          className: `py-3 px-4 text-xs font-bold rounded-xl border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${payMethod === "card" ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400" : "border-zinc-800 bg-[#06080d] text-zinc-400"}`,
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "h-4 w-4" }),
                            " Cartão Certificado"
                          ]
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: payMethod === "card" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      motion.div,
                      {
                        initial: { opacity: 0, height: 0 },
                        animate: { opacity: 1, height: "auto" },
                        exit: { opacity: 0, height: 0 },
                        className: "p-4 bg-background/50 rounded-xl border border-border/40 space-y-3 overflow-hidden",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[9px] uppercase font-bold text-muted-foreground font-mono", children: "Número do Cartão de Crédito" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "input",
                              {
                                type: "text",
                                value: cardNumber,
                                onChange: (e) => setCardNumber(e.target.value),
                                placeholder: "0000 0000 0000 0000",
                                className: "w-full h-9 rounded-lg bg-[#06080d] border border-zinc-800 px-3 text-xs text-white"
                              }
                            )
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[9px] uppercase font-bold text-muted-foreground font-mono font-mono", children: "Expiração (MM/AA)" }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                "input",
                                {
                                  type: "text",
                                  value: cardExpiry,
                                  onChange: (e) => setCardExpiry(e.target.value),
                                  placeholder: "12/29",
                                  className: "w-full h-9 rounded-lg bg-[#06080d] border border-zinc-800 px-3 text-xs text-white"
                                }
                              )
                            ] }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[9px] uppercase font-bold text-muted-foreground font-mono font-mono", children: "CVC de Segurança" }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                "input",
                                {
                                  type: "text",
                                  value: cardCVC,
                                  onChange: (e) => setCardCVC(e.target.value),
                                  placeholder: "123",
                                  className: "w-full h-9 rounded-lg bg-[#06080d] border border-zinc-800 px-3 text-xs text-white"
                                }
                              )
                            ] })
                          ] })
                        ]
                      }
                    ) })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-5 space-y-5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-zinc-800 bg-[#06080d] p-5 space-y-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-xs font-bold uppercase tracking-widest text-[#a855f7] bg-purple-500/15 border border-purple-500/20 px-2 rounded-md py-0.5 inline-block", children: "3. Resumo dos Itens" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3/5 max-h-48 overflow-y-auto divide-y divide-border/15 pr-1", children: cart.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2.5 items-center pt-2.5 first:pt-0 text-xs", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-emerald-400 font-mono text-[11px] shrink-0", children: [
                        "x",
                        item.quantity
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white font-medium truncate flex-1", children: item.product.caption }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-zinc-400 shrink-0", children: formatBRL(item.product.price) })
                    ] }, item.product.id)) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-emerald-500/5 rounded-xl border border-emerald-500/20 text-xs text-zinc-300 space-y-1.5 leading-relaxed font-sans", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-emerald-400 uppercase tracking-widest text-[9px] font-mono select-none", children: "Bônus & Patrocínio Direto" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                        "Estas aquisições faturam ",
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { className: "text-white", children: [
                          "R$ ",
                          (subtotal * 0.25).toFixed(2)
                        ] }),
                        " de cashback imediato e acumulam volume binário de rede para:"
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 pt-1 border-t border-emerald-500/10 mt-1", children: [
                        distAvatar ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: distAvatar, alt: distName, className: "h-6 w-6 rounded-full border border-emerald-500/30 object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-6 w-6 rounded-full border border-emerald-500/30 bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-xs font-bold", children: distName.charAt(0) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-white text-[11px]", children: distName }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[9px] text-emerald-400 font-mono leading-none", children: [
                            "@",
                            sponsorSlug
                          ] })
                        ] })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 border-t border-zinc-800 pt-3 text-xs font-mono", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-zinc-500", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Produtos:" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white", children: formatBRL(subtotal) })
                      ] }),
                      discount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-rose-400", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Desconto Promo:" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                          "-",
                          formatBRL(discount)
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-zinc-500", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Inoculação Sedex:" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white", children: deliveryCost === 0 ? "Grátis" : formatBRL(deliveryCost) })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-zinc-900 pt-2 flex justify-between font-bold text-sm", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white font-sans font-bold", children: "Total Final:" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-emerald-400 font-extrabold", children: formatBRL(finalTotal) })
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      type: "submit",
                      className: "w-full h-11 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-black text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/15 pt-0.5 cursor-pointer",
                      children: [
                        "Confirmar e Contratar Gateway (R$ ",
                        finalTotal.toFixed(2),
                        ")"
                      ]
                    }
                  )
                ] })
              ] })
            ]
          },
          "checkout-view"
        ),
        checkoutStep === "processing" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
            className: "max-w-md mx-auto text-center py-20 space-y-4 rounded-3xl border border-zinc-900 bg-[#090d16]",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 rounded-full border-2 border-t-emerald-400 border-r-transparent border-b-transparent border-l-transparent animate-spin mx-auto" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-bold text-white", children: "Segurando Gateway de Pagamento All-In..." }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed", children: [
                "Liquidanado operação junto aos nós bancários. Atribuindo cashback imediato e alocando pontos binários MLM para @",
                sponsorSlug,
                " no Ledger."
              ] })
            ]
          },
          "processing-view"
        ),
        checkoutStep === "receipt" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, scale: 0.95 },
            animate: { opacity: 1, scale: 1 },
            className: "max-w-md mx-auto border border-emerald-500/30 bg-[#081210]/95 p-8 rounded-3xl shadow-emerald-500/10 shadow-2xl space-y-6",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 rounded-full bg-emerald-500/15 border border-emerald-500/25 grid place-items-center text-emerald-400 mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-6 w-6" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 text-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-md font-bold text-white", children: "Transação Faturada com Sucesso!" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground leading-relaxed max-w-sm mx-auto", children: [
                  "Olá, ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-white", children: custName }),
                  "! Seu pedido foi faturado. Um e-mail de conformidade fiscal e código de rastreio Sedex foi encaminhado para ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-white", children: custEmail }),
                  "."
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 border border-border/45 rounded-xl bg-background/50 text-[10px] text-muted-foreground font-mono space-y-1.5 text-center select-all", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-sans text-[9px] uppercase tracking-wider text-muted-foreground mb-1", children: "Assinatura Digital de Ledger Criptográfico" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-3.5 w-3.5 text-emerald-400 shrink-0" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    "BLOCK_HASH: sha256-",
                    Math.random().toString(36).substring(3, 11).toUpperCase(),
                    "..."
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[9px] text-emerald-500", children: [
                  "Transação vinculada ao patrocinador @",
                  sponsorSlug
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => {
                    clearCart();
                    setCheckoutStep("catalog");
                  },
                  className: "w-full h-10 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black text-xs font-bold uppercase tracking-wider transition-all cursor-pointer",
                  children: "Voltar à Vitrine"
                }
              )
            ]
          },
          "receipt-view"
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: selectedProductDetails && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, scale: 0.95 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 0.95 },
          className: "rounded-2xl border border-zinc-800 bg-[#090d16] p-6 max-w-md w-full space-y-5",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] bg-emerald-500/15 text-emerald-400 font-mono font-bold px-2 py-0.5 rounded-md border border-emerald-500/20", children: selectedProductDetails.category }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-md font-bold text-white mt-1.5", children: selectedProductDetails.name })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => setSelectedProductDetails(null),
                  className: "text-xs text-zinc-400 hover:text-white font-mono bg-[#06080d] px-2 py-0.5 rounded-md cursor-pointer border border-border/30",
                  children: "Fechar"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: selectedProductDetails.id === "prd_1" ? "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=300" : selectedProductDetails.id === "prd_2" ? "https://images.unsplash.com/photo-1512152272829-e3139592d56f?auto=format&fit=crop&q=80&w=300" : "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&q=80&w=300",
                alt: selectedProductDetails.name,
                className: "w-full h-36 object-cover rounded-xl"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 text-xs text-zinc-300 leading-relaxed", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: selectedProductDetails.description }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-background border border-border/40 rounded-xl grid grid-cols-2 gap-2 text-center text-xs", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground font-mono", children: "Fabricante" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-white", children: selectedProductDetails.manufacturer })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground font-mono", children: "Pontos MLM" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-semibold text-emerald-400 font-mono", children: [
                    "+",
                    selectedProductDetails.bonus_payment_percentage || 20,
                    " pts"
                  ] })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-2 flex justify-between items-center border-t border-zinc-800", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-md text-white font-bold", children: formatBRL(selectedProductDetails.price) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => {
                    addToCart(selectedProductDetails);
                    setSelectedProductDetails(null);
                  },
                  className: "h-9 px-6 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-black text-xs font-bold flex items-center justify-center cursor-pointer",
                  children: "Adicionar no Carrinho"
                }
              )
            ] })
          ]
        }
      ) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "border-t border-zinc-900 bg-[#040609] py-12 relative z-10 text-xs text-zinc-500", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-semibold text-white uppercase tracking-widest text-[11px]", children: [
        "All-In Life · Loja Autorizada de ",
        distName
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "max-w-md mx-auto leading-relaxed", children: "Plataforma de varejo integrada à estrutura da All-In Brasil. Suas transações faturam cashback direto e volume de perna de rede em conformidade com as diretivas MLM oficiais." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px]", children: [
        "Patrocinador: ",
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-zinc-400 font-mono", children: [
          "@",
          sponsorSlug
        ] }),
        " · ID: ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-zinc-400 font-mono", children: currentDistributor.slug || "dist_001" })
      ] })
    ] }) })
  ] });
}
const $$splitComponentImporter$h = () => import("./doencas._slug-DnU8fWME.mjs");
const Route$h = createFileRoute("/doencas/$slug")({
  component: lazyRouteComponent($$splitComponentImporter$h, "component")
});
const $$splitComponentImporter$g = () => import("./busca-produtos._slug-CnFJsvdR.mjs");
const Route$g = createFileRoute("/busca-produtos/$slug")({
  component: lazyRouteComponent($$splitComponentImporter$g, "component")
});
const $$splitComponentImporter$f = () => import("./wallets-8rh2CV15.mjs");
const Route$f = createFileRoute("/_app/wallets")({
  component: lazyRouteComponent($$splitComponentImporter$f, "component")
});
const $$splitComponentImporter$e = () => import("./system-DOz2AmmM.mjs");
const Route$e = createFileRoute("/_app/system")({
  component: lazyRouteComponent($$splitComponentImporter$e, "component")
});
const $$splitComponentImporter$d = () => import("./settings-ASpqtUd9.mjs");
const Route$d = createFileRoute("/_app/settings")({
  component: lazyRouteComponent($$splitComponentImporter$d, "component")
});
const $$splitComponentImporter$c = () => import("./plans-BIUfn27P.mjs");
const Route$c = createFileRoute("/_app/plans")({
  component: lazyRouteComponent($$splitComponentImporter$c, "component")
});
const $$splitComponentImporter$b = () => import("./network-DT3iDlcY.mjs");
const Route$b = createFileRoute("/_app/network")({
  component: lazyRouteComponent($$splitComponentImporter$b, "component")
});
const $$splitComponentImporter$a = () => import("./marketing-CKMk2YYn.mjs");
const Route$a = createFileRoute("/_app/marketing")({
  component: lazyRouteComponent($$splitComponentImporter$a, "component")
});
const $$splitComponentImporter$9 = () => import("./insights-DoIn2Tg7.mjs");
const Route$9 = createFileRoute("/_app/insights")({
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const $$splitComponentImporter$8 = () => import("./copilot-C5HNZe-Z.mjs");
const Route$8 = createFileRoute("/_app/copilot")({
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("./commissions-D3UC1Mkl.mjs");
const Route$7 = createFileRoute("/_app/commissions")({
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./analytics-kp6pNW92.mjs");
const Route$6 = createFileRoute("/_app/analytics")({
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./alerts-CFVLzWiw.mjs");
const Route$5 = createFileRoute("/_app/alerts")({
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./index-C2KIsezd.mjs");
const Route$4 = createFileRoute("/_app/products/")({
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./index-DJaPn_et.mjs");
const Route$3 = createFileRoute("/_app/orders/")({
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./index-CuSTBn_I.mjs");
const Route$2 = createFileRoute("/_app/customers/")({
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./auth.invite._token-B2oN9EIB.mjs");
const Route$1 = createFileRoute("/auth/invite/$token")({
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("../_id-BZ5GrEKy.mjs");
const Route = createFileRoute("/_app/customers/$id")({
  component: lazyRouteComponent($$splitComponentImporter, "component"),
  loader: async ({
    params
  }) => {
    const {
      data
    } = await supabase.from("customers").select("*").eq("id", params.id).maybeSingle();
    if (!data) throw notFound();
    return {
      customer: data
    };
  }
});
const SejaDistribuidorRoute = Route$J.update({
  id: "/seja-distribuidor",
  path: "/seja-distribuidor",
  getParentRoute: () => Route$K
});
const RedefinirSenhaRoute = Route$I.update({
  id: "/redefinir-senha",
  path: "/redefinir-senha",
  getParentRoute: () => Route$K
});
const RecuperarSenhaRoute = Route$H.update({
  id: "/recuperar-senha",
  path: "/recuperar-senha",
  getParentRoute: () => Route$K
});
const OfficeRoute = Route$G.update({
  id: "/office",
  path: "/office",
  getParentRoute: () => Route$K
});
const LojaRoute = Route$F.update({
  id: "/loja",
  path: "/loja",
  getParentRoute: () => Route$K
});
const LoginRoute = Route$E.update({
  id: "/login",
  path: "/login",
  getParentRoute: () => Route$K
});
const DoencasRoute = Route$D.update({
  id: "/doencas",
  path: "/doencas",
  getParentRoute: () => Route$K
});
const CheckoutRoute = Route$C.update({
  id: "/checkout",
  path: "/checkout",
  getParentRoute: () => Route$K
});
const CadastroRoute = Route$B.update({
  id: "/cadastro",
  path: "/cadastro",
  getParentRoute: () => Route$K
});
const BuscaProdutosRoute = Route$A.update({
  id: "/busca-produtos",
  path: "/busca-produtos",
  getParentRoute: () => Route$K
});
const AtivacaoRoute = Route$z.update({
  id: "/ativacao",
  path: "/ativacao",
  getParentRoute: () => Route$K
});
const AppRoute = Route$y.update({
  id: "/_app",
  getParentRoute: () => Route$K
});
const SlugRoute = Route$x.update({
  id: "/$slug",
  path: "/$slug",
  getParentRoute: () => Route$K
});
const IndexRoute = Route$w.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$K
});
const OfficeIndexRoute = Route$v.update({
  id: "/",
  path: "/",
  getParentRoute: () => OfficeRoute
});
const SejaDistribuidorSlugRoute = Route$u.update({
  id: "/$slug",
  path: "/$slug",
  getParentRoute: () => SejaDistribuidorRoute
});
const ProdutoIdRoute = Route$t.update({
  id: "/produto/$id",
  path: "/produto/$id",
  getParentRoute: () => Route$K
});
const OfficeVerificationRoute = Route$s.update({
  id: "/verification",
  path: "/verification",
  getParentRoute: () => OfficeRoute
});
const OfficeStoreRoute = Route$r.update({
  id: "/store",
  path: "/store",
  getParentRoute: () => OfficeRoute
});
const OfficeReportsRoute = Route$q.update({
  id: "/reports",
  path: "/reports",
  getParentRoute: () => OfficeRoute
});
const OfficeProfileRoute = Route$p.update({
  id: "/profile",
  path: "/profile",
  getParentRoute: () => OfficeRoute
});
const OfficePlanRoute = Route$o.update({
  id: "/plan",
  path: "/plan",
  getParentRoute: () => OfficeRoute
});
const OfficeOrdersRoute = Route$n.update({
  id: "/orders",
  path: "/orders",
  getParentRoute: () => OfficeRoute
});
const OfficeNetworkRoute = Route$m.update({
  id: "/network",
  path: "/network",
  getParentRoute: () => OfficeRoute
});
const OfficeFinanceRoute = Route$l.update({
  id: "/finance",
  path: "/finance",
  getParentRoute: () => OfficeRoute
});
const OfficeDownloadsRoute = Route$k.update({
  id: "/downloads",
  path: "/downloads",
  getParentRoute: () => OfficeRoute
});
const OfficeCopilotRoute = Route$j.update({
  id: "/copilot",
  path: "/copilot",
  getParentRoute: () => OfficeRoute
});
const LojaSlugRoute = Route$i.update({
  id: "/$slug",
  path: "/$slug",
  getParentRoute: () => LojaRoute
});
const DoencasSlugRoute = Route$h.update({
  id: "/$slug",
  path: "/$slug",
  getParentRoute: () => DoencasRoute
});
const BuscaProdutosSlugRoute = Route$g.update({
  id: "/$slug",
  path: "/$slug",
  getParentRoute: () => BuscaProdutosRoute
});
const AppWalletsRoute = Route$f.update({
  id: "/wallets",
  path: "/wallets",
  getParentRoute: () => AppRoute
});
const AppSystemRoute = Route$e.update({
  id: "/system",
  path: "/system",
  getParentRoute: () => AppRoute
});
const AppSettingsRoute = Route$d.update({
  id: "/settings",
  path: "/settings",
  getParentRoute: () => AppRoute
});
const AppPlansRoute = Route$c.update({
  id: "/plans",
  path: "/plans",
  getParentRoute: () => AppRoute
});
const AppNetworkRoute = Route$b.update({
  id: "/network",
  path: "/network",
  getParentRoute: () => AppRoute
});
const AppMarketingRoute = Route$a.update({
  id: "/marketing",
  path: "/marketing",
  getParentRoute: () => AppRoute
});
const AppInsightsRoute = Route$9.update({
  id: "/insights",
  path: "/insights",
  getParentRoute: () => AppRoute
});
const AppCopilotRoute = Route$8.update({
  id: "/copilot",
  path: "/copilot",
  getParentRoute: () => AppRoute
});
const AppCommissionsRoute = Route$7.update({
  id: "/commissions",
  path: "/commissions",
  getParentRoute: () => AppRoute
});
const AppAnalyticsRoute = Route$6.update({
  id: "/analytics",
  path: "/analytics",
  getParentRoute: () => AppRoute
});
const AppAlertsRoute = Route$5.update({
  id: "/alerts",
  path: "/alerts",
  getParentRoute: () => AppRoute
});
const AppProductsIndexRoute = Route$4.update({
  id: "/products/",
  path: "/products/",
  getParentRoute: () => AppRoute
});
const AppOrdersIndexRoute = Route$3.update({
  id: "/orders/",
  path: "/orders/",
  getParentRoute: () => AppRoute
});
const AppCustomersIndexRoute = Route$2.update({
  id: "/customers/",
  path: "/customers/",
  getParentRoute: () => AppRoute
});
const AuthInviteTokenRoute = Route$1.update({
  id: "/auth/invite/$token",
  path: "/auth/invite/$token",
  getParentRoute: () => Route$K
});
const AppCustomersIdRoute = Route.update({
  id: "/customers/$id",
  path: "/customers/$id",
  getParentRoute: () => AppRoute
});
const AppRouteChildren = {
  AppAlertsRoute,
  AppAnalyticsRoute,
  AppCommissionsRoute,
  AppCopilotRoute,
  AppInsightsRoute,
  AppMarketingRoute,
  AppNetworkRoute,
  AppPlansRoute,
  AppSettingsRoute,
  AppSystemRoute,
  AppWalletsRoute,
  AppCustomersIdRoute,
  AppCustomersIndexRoute,
  AppOrdersIndexRoute,
  AppProductsIndexRoute
};
const AppRouteWithChildren = AppRoute._addFileChildren(AppRouteChildren);
const BuscaProdutosRouteChildren = {
  BuscaProdutosSlugRoute
};
const BuscaProdutosRouteWithChildren = BuscaProdutosRoute._addFileChildren(
  BuscaProdutosRouteChildren
);
const DoencasRouteChildren = {
  DoencasSlugRoute
};
const DoencasRouteWithChildren = DoencasRoute._addFileChildren(DoencasRouteChildren);
const LojaRouteChildren = {
  LojaSlugRoute
};
const LojaRouteWithChildren = LojaRoute._addFileChildren(LojaRouteChildren);
const OfficeRouteChildren = {
  OfficeCopilotRoute,
  OfficeDownloadsRoute,
  OfficeFinanceRoute,
  OfficeNetworkRoute,
  OfficeOrdersRoute,
  OfficePlanRoute,
  OfficeProfileRoute,
  OfficeReportsRoute,
  OfficeStoreRoute,
  OfficeVerificationRoute,
  OfficeIndexRoute
};
const OfficeRouteWithChildren = OfficeRoute._addFileChildren(OfficeRouteChildren);
const SejaDistribuidorRouteChildren = {
  SejaDistribuidorSlugRoute
};
const SejaDistribuidorRouteWithChildren = SejaDistribuidorRoute._addFileChildren(SejaDistribuidorRouteChildren);
const rootRouteChildren = {
  IndexRoute,
  SlugRoute,
  AppRoute: AppRouteWithChildren,
  AtivacaoRoute,
  BuscaProdutosRoute: BuscaProdutosRouteWithChildren,
  CadastroRoute,
  CheckoutRoute,
  DoencasRoute: DoencasRouteWithChildren,
  LoginRoute,
  LojaRoute: LojaRouteWithChildren,
  OfficeRoute: OfficeRouteWithChildren,
  RecuperarSenhaRoute,
  RedefinirSenhaRoute,
  SejaDistribuidorRoute: SejaDistribuidorRouteWithChildren,
  ProdutoIdRoute,
  AuthInviteTokenRoute
};
const routeTree = Route$K._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  Button as B,
  DistributorStorePage as D,
  PublicHeader as P,
  Route$t as R,
  StyleProvider as S,
  Badge as a,
  useAuth as b,
  cn as c,
  useDistributor as d,
  useSharedStyles as e,
  getRoleRedirectPath as f,
  getDemoRedirectPath as g,
  useProducts as h,
  SupabaseService as i,
  getPrimaryPathForRole as j,
  useCart as k,
  useStoreSettings as l,
  Route$1 as m,
  Route as n,
  productsService as p,
  router as r,
  useSponsorLink as u
};
