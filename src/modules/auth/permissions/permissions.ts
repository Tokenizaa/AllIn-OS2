import { UserRole } from "@/shared/types/roles";
import { Permission } from "../context/auth.types";
import { getPermissionsForRole as getCentralizedPermissionsForRole } from "@shared/config/role-permissions";
import { PermissionEnum, enumToPermission } from "@shared/types/permissions";

/**
 * Role-based permission matrix
 * Maps each user role to their allowed permissions
 * 
 * This now uses the centralized configuration from @shared/config/role-permissions.ts
 * and converts PermissionEnum to Permission interface for frontend compatibility
 */
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin_master: getCentralizedPermissionsForRole(UserRole.ADMIN_MASTER).map(enumToPermission),
  gestao_admin: getCentralizedPermissionsForRole(UserRole.GESTAO_ADMIN).map(enumToPermission),
  financeiro: getCentralizedPermissionsForRole(UserRole.FINANCEIRO).map(enumToPermission),
  suporte: getCentralizedPermissionsForRole(UserRole.SUPORTE).map(enumToPermission),
  logistica: getCentralizedPermissionsForRole(UserRole.LOGISTICA).map(enumToPermission),
  marketing: getCentralizedPermissionsForRole(UserRole.MARKETING).map(enumToPermission),
  analytics: getCentralizedPermissionsForRole(UserRole.ANALYTICS).map(enumToPermission),
  auditor: getCentralizedPermissionsForRole(UserRole.AUDITOR).map(enumToPermission),
  operador: getCentralizedPermissionsForRole(UserRole.OPERADOR).map(enumToPermission),
  distribuidor: getCentralizedPermissionsForRole(UserRole.DISTRIBUIDOR).map(enumToPermission),
  afiliado: getCentralizedPermissionsForRole(UserRole.AFILIADO).map(enumToPermission),
  cliente_final: getCentralizedPermissionsForRole(UserRole.CLIENTE_FINAL).map(enumToPermission),
};

/**
 * Get permissions for a specific role
 * Uses centralized configuration
 */
export const getPermissionsForRole = (role: UserRole): Permission[] => {
  const permissions = getCentralizedPermissionsForRole(role);
  return permissions.map(enumToPermission);
};

/**
 * Check if a role has permission for a specific module and action
 */
export const hasPermissionForRole = (
  role: UserRole,
  module: Permission["module"],
  action: Permission["action"] = "read"
): boolean => {
  if (role === "admin_master") return true;
  
  const permissions = getPermissionsForRole(role);
  return permissions.some(
    (p) => p.module === module && (p.action === "all" || p.action === "manage" || p.action === action)
  );
};
