import { UserRole } from "@/shared/types/roles";

/**
 * Role matrix for role categorization and hierarchy
 * Provides utilities for role classification and validation
 */

/**
 * Administrative roles - full system access
 */
export const ADMINISTRATIVE_ROLES: UserRole[] = [
  UserRole.ADMIN_MASTER,
  UserRole.GESTAO_ADMIN
];

/**
 * Departmental roles - specific department access
 */
export const DEPARTMENTAL_ROLES: UserRole[] = [
  UserRole.FINANCEIRO,
  UserRole.SUPORTE,
  UserRole.LOGISTICA,
  UserRole.MARKETING,
  UserRole.ANALYTICS,
  UserRole.AUDITOR,
  UserRole.OPERADOR
];

/**
 * Business roles - customer-facing roles
 */
export const BUSINESS_ROLES: UserRole[] = [
  UserRole.DISTRIBUIDOR,
  UserRole.AFILIADO,
  UserRole.CLIENTE_FINAL
];

/**
 * All roles
 */
export const ALL_ROLES: UserRole[] = [
  ...ADMINISTRATIVE_ROLES,
  ...DEPARTMENTAL_ROLES,
  ...BUSINESS_ROLES
];

/**
 * Check if role is administrative
 */
export const isAdministrativeRole = (role: UserRole): boolean => {
  return ADMINISTRATIVE_ROLES.includes(role);
};

/**
 * Check if role is departmental
 */
export const isDepartmentalRole = (role: UserRole): boolean => {
  return DEPARTMENTAL_ROLES.includes(role);
};

/**
 * Check if role is business
 */
export const isBusinessRole = (role: UserRole): boolean => {
  return BUSINESS_ROLES.includes(role);
};

/**
 * Check if role is valid
 */
export const isValidRole = (role: string): role is UserRole => {
  return ALL_ROLES.includes(role as UserRole);
};

/**
 * Get role category
 */
export const getRoleCategory = (role: UserRole): "administrative" | "departmental" | "business" => {
  if (isAdministrativeRole(role)) return "administrative";
  if (isDepartmentalRole(role)) return "departmental";
  return "business";
};

/**
 * Get roles by category
 */
export const getRolesByCategory = (category: "administrative" | "departmental" | "business"): UserRole[] => {
  switch (category) {
    case "administrative":
      return ADMINISTRATIVE_ROLES;
    case "departmental":
      return DEPARTMENTAL_ROLES;
    case "business":
      return BUSINESS_ROLES;
  }
};
