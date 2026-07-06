import { UserRole } from "@/shared/types/roles";
import { Permission } from "../context/auth.types";
import { supabase } from "@/lib/supabase/client";

/**
 * Permission service
 * Permissions are loaded from identity.roles and identity.user_roles tables in the database
 * This replaces the hardcoded permission matrix
 */

/**
 * Get permissions for a specific role from database
 */
export const getPermissionsForRole = async (role: UserRole): Promise<Permission[]> => {
  try {
    // Fetch role ID from public.roles (view to identity.roles)
    const { data: roleData, error: roleError } = await supabase
      .from("roles")
      .select("id")
      .eq("name", role)
      .single();

    if (roleError || !roleData) {
      console.error("[Permissions] Error fetching role:", roleError);
      return [];
    }

    // Fetch permissions for this role from public.role_permissions (view to identity.role_permissions)
    const { data: permissionsData, error: permissionsError } = await supabase
      .from("role_permissions")
      .select(`
        permission_id,
        permissions (
          module,
          action,
          description
        )
      `)
      .eq("role_id", roleData.id);

    if (permissionsError) {
      console.error("[Permissions] Error fetching permissions:", permissionsError);
      return [];
    }

    return (permissionsData || []).map((p: any) => ({
      id: p.permission_id,
      module: p.permissions?.[0]?.module || "system",
      action: p.permissions?.[0]?.action || "read",
      description: p.permissions?.[0]?.description || "",
    }));
  } catch (error) {
    console.error("[Permissions] Error in getPermissionsForRole:", error);
    return [];
  }
};

/**
 * Check if a role has permission for a specific module and action
 * This queries the database directly
 */
export const hasPermissionForRole = async (
  role: UserRole,
  module: Permission["module"],
  action: Permission["action"] = "read"
): Promise<boolean> => {
  try {
    // Admin master has all permissions
    if (role === UserRole.ADMIN_MASTER) {
      return true;
    }

    // Fetch role ID from public.roles (view to identity.roles)
    const { data: roleData, error: roleError } = await supabase
      .from("roles")
      .select("id")
      .eq("name", role)
      .single();

    if (roleError || !roleData) {
      return false;
    }

    // Check if role has the specific permission from public.role_permissions (view to identity.role_permissions)
    const { data: permissionData, error: permissionError } = await supabase
      .from("role_permissions")
      .select(`
        permissions (
          module,
          action
        )
      `)
      .eq("role_id", roleData.id)
      .eq("permissions.module", module);

    if (permissionError) {
      console.error("[Permissions] Error checking permission:", permissionError);
      return false;
    }

    if (!permissionData || permissionData.length === 0) {
      return false;
    }

    // Check if any permission matches the action
    return permissionData.some((p: any) => {
      const permAction = p.permissions?.[0]?.action;
      return permAction === "all" || permAction === "manage" || permAction === action;
    });
  } catch (error) {
    console.error("[Permissions] Error in hasPermissionForRole:", error);
    return false;
  }
};

/**
 * Get all permissions for a user from database
 * This checks public.user_roles and public.role_permissions (views to identity schema)
 */
export const getUserPermissions = async (userId: string): Promise<Permission[]> => {
  try {
    // Fetch user's roles from public.user_roles (view to identity.user_roles)
    const { data: userRoles, error: userRolesError } = await supabase
      .from("user_roles")
      .select("role_id")
      .eq("user_id", userId);

    if (userRolesError || !userRoles || userRoles.length === 0) {
      return [];
    }

    // Fetch all permissions for all user roles from public.role_permissions (view to identity.role_permissions)
    const roleIds = userRoles.map(ur => ur.role_id);
    const { data: permissionsData, error: permissionsError } = await supabase
      .from("role_permissions")
      .select(`
        permissions (
          id,
          module,
          action,
          description
        )
      `)
      .in("role_id", roleIds);

    if (permissionsError) {
      console.error("[Permissions] Error fetching user permissions:", permissionsError);
      return [];
    }

    return (permissionsData || []).map((p: any) => ({
      id: p.permissions?.[0]?.id || "",
      module: p.permissions?.[0]?.module || "system",
      action: p.permissions?.[0]?.action || "read",
      description: p.permissions?.[0]?.description || "",
    }));
  } catch (error) {
    console.error("[Permissions] Error in getUserPermissions:", error);
    return [];
  }
};
