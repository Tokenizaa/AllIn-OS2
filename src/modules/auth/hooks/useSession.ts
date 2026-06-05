import { useAuth } from "./useAuth";

/**
 * Hook to access session management utilities
 * Provides methods to manage user session
 */
export const useSession = () => {
  const { user, loading } = useAuth();

  const isAuthenticated = (): boolean => {
    return !!user && !loading;
  };

  const isPending = (): boolean => {
    return user?.status === "pending";
  };

  const isSuspended = (): boolean => {
    return user?.status === "suspended";
  };

  const isActive = (): boolean => {
    return user?.status === "active" && user?.active === true;
  };

  const refreshSession = (): void => {
    // Session refresh is handled by Supabase auth state
  };

  const clearSession = (): void => {
    // Session clearing is handled by Supabase logout
  };

  return {
    isAuthenticated,
    isPending,
    isSuspended,
    isActive,
    refreshSession,
    clearSession,
    user,
    loading
  };
};
