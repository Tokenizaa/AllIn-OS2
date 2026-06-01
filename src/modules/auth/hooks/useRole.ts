import { UserRole } from "@/shared/types/roles";
import { useAuth } from "./useAuth";
import { isAdministrativeRole, isDepartmentalRole, isBusinessRole } from "@/shared/types/roles";

/**
 * Hook to access role-related utilities
 * Provides methods to check user role categories
 */
export const useRole = () => {
  const { user } = useAuth();

  const isAdmin = (): boolean => {
    if (!user) return false;
    return isAdministrativeRole(user.role);
  };

  const isDepartment = (): boolean => {
    if (!user) return false;
    return isDepartmentalRole(user.role);
  };

  const isBusiness = (): boolean => {
    if (!user) return false;
    return isBusinessRole(user.role);
  };

  const hasRole = (role: UserRole): boolean => {
    if (!user) return false;
    return user.role === role;
  };

  const hasAnyRole = (roles: UserRole[]): boolean => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  const getRole = (): UserRole | null => {
    return user?.role || null;
  };

  return {
    isAdmin,
    isDepartment,
    isBusiness,
    hasRole,
    hasAnyRole,
    getRole,
    currentRole: user?.role || null
  };
};
