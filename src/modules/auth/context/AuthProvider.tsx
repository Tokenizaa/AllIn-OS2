import React, { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { AuthContextType } from "./auth.types";
import { User, DistributorProfile, AdminInvite } from "./auth.types";
import { AuthService } from "../services/auth.service";
import { ProfileService } from "../services/profile.service";
import { InviteService } from "../services/invite.service";
import { AuditService } from "../services/audit.service";
import { SupabaseService } from "../services/supabase.service";
import { referralTrackingService } from "@/services/referralTrackingService";
import { supabase } from "@/lib/supabase-client";
import { UserRole } from "@/shared/types/roles";

/**
 * AuthProvider - Main authentication provider
 * Manages authentication state and provides auth methods
 * Target: 250-300 lines
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State - Core authentication state only
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [distributorProfile, setDistributorProfile] = useState<DistributorProfile | null>(null);
  const [activeSponsor, setActiveSponsor] = useState<string | null>(null);
  const [activeReferralMetadata, setActiveReferralMetadata] = useState<any | null>(null);

  const isPublicAuthRoute = () => {
    if (typeof window === "undefined") return false;

    const pathname = window.location.pathname;
    return (
      pathname === "/login" ||
      pathname === "/cadastro" ||
      pathname === "/recuperar-senha" ||
      pathname === "/redefinir-senha" ||
      pathname.startsWith("/auth/invite/")
    );
  };

  // Initialization
  useEffect(() => {
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
          clicked_at: new Date().toISOString(),
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

  // Auth methods using services
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const userProfile = await AuthService.login(email, password);
      setUser(userProfile);
      return userProfile;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, role: UserRole, extra?: any) => {
    setLoading(true);
    try {
      const userProfile = await AuthService.register(
        name,
        email,
        role,
        extra,
        activeSponsor
      );
      setUser(userProfile);
      if (role === UserRole.DISTRIBUIDOR) {
        const dProf = await SupabaseService.fetchDistributorProfile(userProfile.id);
        setDistributorProfile(dProf);
      }
      return userProfile;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await AuthService.logout();
      setUser(null);
      setDistributorProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    return ProfileService.updateProfile(
      updates,
      user,
      setUser
    );
  };

  const updateDistributorProfile = async (updates: Partial<DistributorProfile>) => {
    return ProfileService.updateDistributorProfile(
      updates,
      user,
      distributorProfile,
      setDistributorProfile
    );
  };

  const changeUserRole = async (userId: string, targetRole: UserRole) => {
    const updatedProfile = await AuthService.changeUserRole(
      userId,
      targetRole,
      user
    );
    if (updatedProfile) {
      setUser(updatedProfile);
    }
  };

  const activateDistributorOffice = async (_planId: string) => {
    void _planId;
    throw new Error("activateDistributorOffice needs to be migrated to Supabase");
  };

  const createAdminInvite = async (invite: Omit<AdminInvite, "id" | "invite_token" | "invite_link" | "created_at" | "expires_at" | "status">) => {
    return InviteService.createAdminInvite(invite, user);
  };

  const revokeAdminInvite = async (inviteId: string) => {
    return InviteService.revokeAdminInvite(inviteId, user);
  };

  const resendAdminInvite = async (inviteId: string) => {
    return InviteService.resendAdminInvite(inviteId, user);
  };

  const getAdminInviteByToken = async (token: string) => {
    return InviteService.getAdminInviteByToken(token);
  };

  const acceptAdminInvite = async (token: string, name: string, password: string) => {
    return InviteService.acceptAdminInvite(token, name, password);
  };

  const deleteUserAndInviteSession = async (userId: string) => {
    return InviteService.deleteUserAndInviteSession(userId);
  };

  const simulateAuditLog = async (action: string, entity: string, details?: string) => {
    await AuditService.logAudit(action, entity, details, user);
  };

  const addAuditLog = async (logInput: any) => {
    await AuditService.addAuditLog(logInput, user);
  };

  const triggerBinomialBonusPay = async (points: number, commission: number, value: number) => {
    await AuditService.triggerBinomialBonusPay(points, commission, value, activeSponsor);
  };

  const clearSponsor = async () => {
    // MIGRATED: Use database referral tracking table
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

  // Context value
  const value: AuthContextType = {
    user,
    loading,
    distributorProfile,
    activeSponsor,
    activeReferralMetadata,
    auditLogs: [], // Deprecated - use AuditService.fetchAuditLogs() from Supabase
    usersList: [], // Deprecated - use Supabase profiles/customers tables
    adminInvites: [], // Deprecated - use Supabase admin_invites table
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
    deleteUserAndInviteSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
