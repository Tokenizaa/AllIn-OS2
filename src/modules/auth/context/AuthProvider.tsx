import React, { useState, useEffect, useRef } from "react";
import { AuthContext } from "./AuthContext";
import { AuthContextType } from "./auth.types";
import { User } from "./auth.types";
import { AuthService } from "../services/auth.service";
import { ProfileService } from "../services/profile.service";
import { SupabaseService } from "../services/supabase.service";
import { referralTrackingService } from "@/services/referralTrackingService";
import { authService } from "@/services/auth/auth.service";
import { UserRole } from "@/shared/types/roles";

/**
 * AuthProvider - Main authentication provider
 * Manages authentication state and provides auth methods
 * Target: 250-300 lines
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Sprint 4: Manter apenas estado de autenticação core
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Ref to track loaded user ID to prevent unnecessary reloads
  const loadedUserIdRef = useRef<string | null>(null);

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

  // Sprint 4: Simplificar initialization - carregar apenas session
  useEffect(() => {
    if (typeof window === "undefined") {
      setLoading(false);
      return;
    }

    let isMounted = true;
    const skipHeavyBootstrap = isPublicAuthRoute();

    (async () => {
      try {
        if (skipHeavyBootstrap) {
          setLoading(false);
          return;
        }

        const { data: { session } } = await authService.getSession();
        const currentUser = session?.user ? await SupabaseService.fetchUserProfile(session.user.id) : null;

        if (sessionError) {
          console.error("[AuthProvider] Session error:", sessionError);
        }

        if (!session?.user) {
          setLoading(false);
          return;
        }

        // Set loadedUserIdRef immediately to prevent onAuthStateChange from refetching
        loadedUserIdRef.current = session.user.id;

        // Fetch user profile with timeout protection
        const profilePromise = SupabaseService.fetchUserProfile(session.user.id);
        const timeoutPromise = new Promise<null>((_, reject) =>
          setTimeout(() => reject(new Error("Profile fetch timeout")), 20000)
        );

        const currentUser = await Promise.race([profilePromise, timeoutPromise]) as User | null;

        if (!isMounted || !currentUser) {
          setLoading(false);
          return;
        }

        setUser(currentUser);
      } catch (error) {
        console.error("[AuthProvider] Fatal error during initialization:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    })();

    const { data: authListener } = authService.onAuthStateChange(async (_event, session) => {
      if (!isMounted) return;

      // Set loadedUserIdRef immediately when session exists to prevent refetch
      if (session?.user && !loadedUserIdRef.current) {
        loadedUserIdRef.current = session.user.id;
        console.log("[AuthProvider] onAuthStateChange - set loadedUserIdRef to prevent refetch");
      }

      // Verificar se estamos em rota pública para evitar loops
      if (isPublicAuthRoute()) {
        console.log("[AuthProvider] onAuthStateChange - public route, skipping");
        return;
      }

      if (!session?.user) {
        console.log("[AuthProvider] onAuthStateChange - no session, clearing user");
        setUser(null);
        loadedUserIdRef.current = null;
        return;
      }

      // Evitar recarregar perfil se o usuário já foi carregado (usando ref para persistência)
      if (loadedUserIdRef.current === session.user.id) {
        console.log("[AuthProvider] onAuthStateChange - user already loaded (ref check), skipping");
        return;
      }

      console.log("[AuthProvider] onAuthStateChange - loading profile for user:", session.user.id);

      // Add timeout protection to prevent hanging
      const profilePromise = SupabaseService.fetchUserProfile(session.user.id);
      const timeoutPromise = new Promise<null>((_, reject) =>
        setTimeout(() => reject(new Error("Profile fetch timeout in listener")), 10000)
      );

      let currentUser;
      try {
        currentUser = await Promise.race([profilePromise, timeoutPromise]) as User | null;
      } catch (error) {
        console.error("[AuthProvider] onAuthStateChange - Profile fetch timeout or error:", error);
        return;
      }

      if (!isMounted || !currentUser) return;

      console.log("[AuthProvider] onAuthStateChange - profile loaded:", currentUser.email);
      loadedUserIdRef.current = currentUser.id;
      setUser(currentUser);
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
        null // Sprint 4: activeSponsor migrado para useReferralTrackingQuery
      );
      setUser(userProfile);
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

  // Sprint 4: Context value - manter apenas funcionalidades core
  const value: AuthContextType = {
    user,
    loading,
    distributorProfile: null, // Sprint 4: Migrado para useDistributorProfileQuery
    activeSponsor: null, // Sprint 4: Migrado para useReferralTrackingQuery
    activeReferralMetadata: null, // Sprint 4: Migrado para useReferralTrackingQuery
    login,
    register,
    logout,
    updateProfile,
    updateDistributorProfile: async () => { throw new Error("Use useDistributorProfileQuery instead"); },
    changeUserRole,
    clearSponsor: async () => { throw new Error("Use useReferralTrackingQuery instead"); },
    activateDistributorOffice: async () => { throw new Error("Use useDistributorProfileQuery instead"); },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
