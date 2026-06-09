import { Permission } from "../context/auth.types";
import { useAuth } from "./useAuth";
import { ROLE_PERMISSIONS } from "../permissions/permissions";
import { UserRole } from "@/shared/types/roles";

/**
 * Hook to access permission system
 * Provides methods to check user permissions based on role
 */
export const usePermissions = () => {
  const { user } = useAuth();
  
  const getPermissions = (): Permission[] => {
    if (!user) return [];
    return ROLE_PERMISSIONS[user.role] || [];
  };

  const hasPermission = (module: Permission["module"], action: Permission["action"] = "read"): boolean => {
    if (!user) return false;
    if (user.role === "admin_master") return true; // full global access
    
    const perms = getPermissions();
    return perms.some(
      (p) => p.module === module && (p.action === "all" || p.action === "manage" || p.action === action)
    );
  };

  const hasRole = (role: string): boolean => {
    if (!user) return false;
    return user.role === role;
  };

  const isRole = (role: UserRole): boolean => hasRole(role);

  const canRead = (module: Permission["module"]): boolean => {
    return hasPermission(module, "read");
  };

  const canWrite = (module: Permission["module"]): boolean => {
    return hasPermission(module, "write");
  };

  const canDelete = (module: Permission["module"]): boolean => {
    return hasPermission(module, "delete");
  };

  const canManage = (module: Permission["module"]): boolean => {
    return hasPermission(module, "manage") || hasPermission(module, "all");
  };

  return {
    permissions: getPermissions(),
    hasPermission,
    hasRole,
    canRead,
    canWrite,
    canDelete,
    canManage,
    isRole,
    isLoading: false,
    role: user?.role || null
  };
};
