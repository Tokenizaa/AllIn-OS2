/**
 * Centralized Role Definitions
 * 
 * This file contains the official role definitions used across the entire application.
 * Both frontend and backend should import from this file to ensure consistency.
 * 
 * Architecture Decision:
 * - roles are stored in identity.roles and identity.user_roles
 * - tipo_cliente in crm.customers table is for commercial classification only
 * - plan_id in mlm.planos_distribuidores references the plans table
 */

export enum UserRole {
  // Administrative Roles
  ADMIN_MASTER = 'admin_master',
  GESTAO_ADMIN = 'gestao_admin',
  
  // Departmental Roles
  FINANCEIRO = 'financeiro',
  SUPORTE = 'suporte',
  LOGISTICA = 'logistica',
  MARKETING = 'marketing',
  ANALYTICS = 'analytics',
  AUDITOR = 'auditor',
  OPERADOR = 'operador',
  
  // Business Roles
  DISTRIBUIDOR = 'distribuidor',
  AFILIADO = 'afiliado',
  CLIENTE_FINAL = 'cliente_final',
}

/**
 * Role display names for UI
 */
export const ROLE_DISPLAY_NAMES: Record<UserRole, string> = {
  [UserRole.ADMIN_MASTER]: 'Admin Master',
  [UserRole.GESTAO_ADMIN]: 'Gestão Admin',
  [UserRole.FINANCEIRO]: 'Financeiro',
  [UserRole.SUPORTE]: 'Suporte',
  [UserRole.LOGISTICA]: 'Logística',
  [UserRole.MARKETING]: 'Marketing',
  [UserRole.ANALYTICS]: 'Analytics',
  [UserRole.AUDITOR]: 'Auditor',
  [UserRole.OPERADOR]: 'Operador',
  [UserRole.DISTRIBUIDOR]: 'Distribuidor',
  [UserRole.AFILIADO]: 'Afiliado',
  [UserRole.CLIENTE_FINAL]: 'Cliente Final',
};

/**
 * Role categories for grouping
 */
export enum RoleCategory {
  ADMINISTRATIVE = 'administrative',
  DEPARTMENTAL = 'departmental',
  BUSINESS = 'business',
}

/**
 * Role to category mapping
 */
export const ROLE_CATEGORIES: Record<UserRole, RoleCategory> = {
  [UserRole.ADMIN_MASTER]: RoleCategory.ADMINISTRATIVE,
  [UserRole.GESTAO_ADMIN]: RoleCategory.ADMINISTRATIVE,
  [UserRole.FINANCEIRO]: RoleCategory.DEPARTMENTAL,
  [UserRole.SUPORTE]: RoleCategory.DEPARTMENTAL,
  [UserRole.LOGISTICA]: RoleCategory.DEPARTMENTAL,
  [UserRole.MARKETING]: RoleCategory.DEPARTMENTAL,
  [UserRole.ANALYTICS]: RoleCategory.DEPARTMENTAL,
  [UserRole.AUDITOR]: RoleCategory.DEPARTMENTAL,
  [UserRole.OPERADOR]: RoleCategory.DEPARTMENTAL,
  [UserRole.DISTRIBUIDOR]: RoleCategory.BUSINESS,
  [UserRole.AFILIADO]: RoleCategory.BUSINESS,
  [UserRole.CLIENTE_FINAL]: RoleCategory.BUSINESS,
};

/**
 * Helper function to check if a role is administrative
 */
export function isAdministrativeRole(role: UserRole): boolean {
  return ROLE_CATEGORIES[role] === RoleCategory.ADMINISTRATIVE;
}

/**
 * Helper function to check if a role is departmental
 */
export function isDepartmentalRole(role: UserRole): boolean {
  return ROLE_CATEGORIES[role] === RoleCategory.DEPARTMENTAL;
}

/**
 * Helper function to check if a role is business
 */
export function isBusinessRole(role: UserRole): boolean {
  return ROLE_CATEGORIES[role] === RoleCategory.BUSINESS;
}

/**
 * Type guard for UserRole
 */
export function isValidRole(value: string): value is UserRole {
  return Object.values(UserRole).includes(value as UserRole);
}

export const ADMINISTRATIVE_ROLES: UserRole[] = [
  UserRole.ADMIN_MASTER,
  UserRole.GESTAO_ADMIN,
];

export const DEPARTMENTAL_ROLES: UserRole[] = [
  UserRole.FINANCEIRO,
  UserRole.SUPORTE,
  UserRole.LOGISTICA,
  UserRole.MARKETING,
  UserRole.ANALYTICS,
  UserRole.AUDITOR,
  UserRole.OPERADOR,
];

export const BUSINESS_ROLES: UserRole[] = [
  UserRole.DISTRIBUIDOR,
  UserRole.AFILIADO,
  UserRole.CLIENTE_FINAL,
];

export const ALL_ROLES: UserRole[] = [
  ...ADMINISTRATIVE_ROLES,
  ...DEPARTMENTAL_ROLES,
  ...BUSINESS_ROLES,
];

export function getRoleCategory(role: UserRole): RoleCategory {
  return ROLE_CATEGORIES[role];
}

export function getRolesByCategory(category: RoleCategory): UserRole[] {
  return ALL_ROLES.filter((r) => ROLE_CATEGORIES[r] === category);
}
