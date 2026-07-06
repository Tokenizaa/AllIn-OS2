import { Permission } from "../context/auth.types";
import { useAuth } from "./useAuth";
import { getUserPermissions } from "../permissions/permissions";
import { UserRole } from "@/shared/types/roles";
import { useState, useEffect } from "react";

/**
 * Hook to access permission system
 * Provides methods to check user permissions based on role
 * Permissions are loaded from identity.roles and identity.user_roles tables
 */
export const usePermissions = () => {
  const { user } = useAuth();
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPermissions = async () => {
      if (!user) {
        setPermissions([]);
        setIsLoading(false);
        return;
      }

      try {
        const userPerms = await getUserPermissions(user.id);
        setPermissions(userPerms);
      } catch (error) {
        console.error("[usePermissions] Error loading permissions:", error);
        setPermissions([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadPermissions();
  }, [user]);

  const hasPermission = (module: Permission["module"], action: Permission["action"] = "read"): boolean => {
    if (!user) return false;
    if (user.role === UserRole.ADMIN_MASTER) return true;

    return permissions.some(
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
    permissions,
    hasPermission,
    hasRole,
    canRead,
    canWrite,
    canDelete,
    canManage,
    isRole,
    isLoading,
    role: user?.role || null
  };
};
