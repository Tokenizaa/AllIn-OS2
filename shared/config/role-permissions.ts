/**
 * Centralized Role-Permission Matrix
 * 
 * This file contains the official role-to-permission mapping used across the entire application.
 * Both frontend and backend should import from this file to ensure consistency.
 * 
 * This replaces the duplicate ROLE_PERMISSIONS definitions in:
 * - src/modules/auth/permissions/permissions.ts (frontend)
 * - src/backend/modules/auth/guards/permission.guard.ts (backend)
 */

import { UserRole } from '../types/roles';
import { PermissionEnum } from '../types/permissions';

/**
 * Role to Permission mapping
 * Maps each user role to their allowed permissions
 */
export const ROLE_PERMISSIONS: Record<UserRole, PermissionEnum[]> = {
  [UserRole.ADMIN_MASTER]: [
    PermissionEnum.ADMIN_ALL,
  ],

  [UserRole.GESTAO_ADMIN]: [
    PermissionEnum.DASHBOARD_ALL,
    PermissionEnum.ANALYTICS_ALL,
    PermissionEnum.SUPPORT_ALL,
    PermissionEnum.ORDERS_ALL,
    PermissionEnum.PRODUCTS_ALL,
    PermissionEnum.MARKETING_ALL,
    PermissionEnum.SYSTEM_READ,
    PermissionEnum.INDUSTRIAL_MANAGE,
  ],

  [UserRole.FINANCEIRO]: [
    PermissionEnum.DASHBOARD_READ,
    PermissionEnum.ANALYTICS_READ,
    PermissionEnum.FINANCE_MANAGE,
    PermissionEnum.ORDERS_READ,
  ],

  [UserRole.SUPORTE]: [
    PermissionEnum.DASHBOARD_READ,
    PermissionEnum.SUPPORT_MANAGE,
    PermissionEnum.ORDERS_READ,
  ],

  [UserRole.LOGISTICA]: [
    PermissionEnum.DASHBOARD_READ,
    PermissionEnum.ORDERS_MANAGE,
    PermissionEnum.PRODUCTS_READ,
    PermissionEnum.INDUSTRIAL_READ,
  ],

  [UserRole.MARKETING]: [
    PermissionEnum.DASHBOARD_READ,
    PermissionEnum.MARKETING_MANAGE,
    PermissionEnum.PRODUCTS_READ,
  ],

  [UserRole.ANALYTICS]: [
    PermissionEnum.DASHBOARD_READ,
    PermissionEnum.ANALYTICS_ALL,
  ],

  [UserRole.AUDITOR]: [
    PermissionEnum.DASHBOARD_READ,
    PermissionEnum.ANALYTICS_READ,
    PermissionEnum.FINANCE_READ,
    PermissionEnum.SYSTEM_READ,
  ],

  [UserRole.OPERADOR]: [
    PermissionEnum.DASHBOARD_READ,
    PermissionEnum.ORDERS_WRITE,
    PermissionEnum.SUPPORT_READ,
  ],

  [UserRole.DISTRIBUIDOR]: [
    PermissionEnum.DASHBOARD_READ,
    PermissionEnum.NETWORK_READ,
    PermissionEnum.ORDERS_WRITE,
    PermissionEnum.FINANCE_WRITE,
  ],

  [UserRole.AFILIADO]: [
    PermissionEnum.DASHBOARD_READ,
    PermissionEnum.NETWORK_READ,
    PermissionEnum.ORDERS_READ,
  ],

  [UserRole.CLIENTE_FINAL]: [
    PermissionEnum.ORDERS_WRITE,
    PermissionEnum.DASHBOARD_READ,
  ],
};

/**
 * Get permissions for a specific role
 */
export const getPermissionsForRole = (role: UserRole): PermissionEnum[] => {
  return ROLE_PERMISSIONS[role] || [];
};

/**
 * Check if a role has a specific permission
 */
export const roleHasPermission = (role: UserRole, permission: PermissionEnum): boolean => {
  const permissions = getPermissionsForRole(role);
  
  // Admin master has all permissions
  if (role === UserRole.ADMIN_MASTER) return true;
  
  return permissions.includes(permission);
};

/**
 * Check if a role has permission for a specific module and action
 */
export const roleHasModulePermission = (
  role: UserRole,
  module: string,
  action: string
): boolean => {
  // Admin master has all permissions
  if (role === UserRole.ADMIN_MASTER) return true;
  
  const permissions = getPermissionsForRole(role);
  const requiredPermission = `${module}:${action}` as PermissionEnum;
  
  return permissions.includes(requiredPermission);
};
