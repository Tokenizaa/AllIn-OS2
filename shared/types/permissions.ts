/**
 * Centralized Permission Types
 * 
 * This file contains the official permission definitions used across the entire application.
 * Both frontend and backend should import from this file to ensure consistency.
 */

import { UserRole } from './roles.ts';

/**
 * Permission action types
 */
export type PermissionAction = 'read' | 'write' | 'delete' | 'manage' | 'all';

/**
 * Permission module types
 */
export type PermissionModule = 
  | 'dashboard'
  | 'analytics'
  | 'finance'
  | 'support'
  | 'network'
  | 'orders'
  | 'products'
  | 'marketing'
  | 'settings'
  | 'system'
  | 'industrial';

/**
 * Permission interface
 */
export interface Permission {
  id: string;
  module: PermissionModule;
  action: PermissionAction;
  description: string;
}

/**
 * Permission enum for backend use
 * This provides a more structured approach for backend permissions
 */
export enum PermissionEnum {
  // Dashboard
  DASHBOARD_READ = 'dashboard:read',
  DASHBOARD_WRITE = 'dashboard:write',
  DASHBOARD_ALL = 'dashboard:all',

  // Analytics
  ANALYTICS_READ = 'analytics:read',
  ANALYTICS_WRITE = 'analytics:write',
  ANALYTICS_ALL = 'analytics:all',

  // Finance
  FINANCE_READ = 'finance:read',
  FINANCE_WRITE = 'finance:write',
  FINANCE_DELETE = 'finance:delete',
  FINANCE_MANAGE = 'finance:manage',
  FINANCE_ALL = 'finance:all',

  // Support
  SUPPORT_READ = 'support:read',
  SUPPORT_WRITE = 'support:write',
  SUPPORT_MANAGE = 'support:manage',
  SUPPORT_ALL = 'support:all',

  // Network
  NETWORK_READ = 'network:read',
  NETWORK_WRITE = 'network:write',
  NETWORK_MANAGE = 'network:manage',
  NETWORK_ALL = 'network:all',

  // Orders
  ORDERS_READ = 'orders:read',
  ORDERS_WRITE = 'orders:write',
  ORDERS_DELETE = 'orders:delete',
  ORDERS_MANAGE = 'orders:manage',
  ORDERS_ALL = 'orders:all',

  // Products
  PRODUCTS_READ = 'products:read',
  PRODUCTS_WRITE = 'products:write',
  PRODUCTS_DELETE = 'products:delete',
  PRODUCTS_MANAGE = 'products:manage',
  PRODUCTS_ALL = 'products:all',

  // Marketing
  MARKETING_READ = 'marketing:read',
  MARKETING_WRITE = 'marketing:write',
  MARKETING_MANAGE = 'marketing:manage',
  MARKETING_ALL = 'marketing:all',

  // Settings
  SETTINGS_READ = 'settings:read',
  SETTINGS_WRITE = 'settings:write',
  SETTINGS_MANAGE = 'settings:manage',
  SETTINGS_ALL = 'settings:all',

  // System
  SYSTEM_READ = 'system:read',
  SYSTEM_WRITE = 'system:write',
  SYSTEM_MANAGE = 'system:manage',
  SYSTEM_ALL = 'system:all',

  // Industrial
  INDUSTRIAL_READ = 'industrial:read',
  INDUSTRIAL_WRITE = 'industrial:write',
  INDUSTRIAL_MANAGE = 'industrial:manage',
  INDUSTRIAL_ALL = 'industrial:all',

  // Admin
  ADMIN_ALL = 'admin:all',
}

/**
 * Convert Permission enum to Permission interface
 */
export function enumToPermission(permission: PermissionEnum): Permission {
  const [module, action] = permission.split(':') as [PermissionModule, PermissionAction];
  return {
    id: permission,
    module,
    action: action === 'all' ? 'all' : action,
    description: `${module}:${action}`,
  };
}

/**
 * Convert Permission interface to Permission enum
 */
export function permissionToEnum(permission: Permission): PermissionEnum {
  const key = `${permission.module.toUpperCase()}_${permission.action.toUpperCase()}` as keyof typeof PermissionEnum;
  return PermissionEnum[key] || PermissionEnum.DASHBOARD_READ;
}

/**
 * Check if permission action implies another action
 * all > manage > write > read
 */
export function permissionActionImplies(action: PermissionAction, required: PermissionAction): boolean {
  if (action === 'all') return true;
  if (action === 'manage') return required === 'read' || required === 'write' || required === 'manage';
  if (action === 'write') return required === 'read' || required === 'write';
  if (action === 'read') return required === 'read';
  if (action === 'delete') return required === 'delete';
  return false;
}
