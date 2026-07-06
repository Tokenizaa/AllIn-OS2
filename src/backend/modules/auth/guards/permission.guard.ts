import { PermissionEnum } from '@shared/types/permissions';
import { getPermissionsForRole as getCentralizedPermissionsForRole } from '@shared/config/role-permissions';

export class PermissionGuard {
  static hasPermission(userPermissions: PermissionEnum[], requiredPermission: PermissionEnum): boolean {
    // Admin has all permissions
    if (userPermissions.includes(PermissionEnum.ADMIN_ALL)) {
      return true;
    }

    return userPermissions.includes(requiredPermission);
  }

  static hasAnyPermission(userPermissions: PermissionEnum[], requiredPermissions: PermissionEnum[]): boolean {
    // Admin has all permissions
    if (userPermissions.includes(PermissionEnum.ADMIN_ALL)) {
      return true;
    }

    return requiredPermissions.some((permission) => userPermissions.includes(permission));
  }

  static hasAllPermissions(userPermissions: PermissionEnum[], requiredPermissions: PermissionEnum[]): boolean {
    // Admin has all permissions
    if (userPermissions.includes(PermissionEnum.ADMIN_ALL)) {
      return true;
    }

    return requiredPermissions.every((permission) => userPermissions.includes(permission));
  }
}

// Role-based permissions mapping - Now uses centralized configuration
import { UserRole } from '@shared/types/roles';

export const ROLE_PERMISSIONS: Record<UserRole, PermissionEnum[]> = {
  [UserRole.ADMIN_MASTER]: getCentralizedPermissionsForRole(UserRole.ADMIN_MASTER),
  [UserRole.GESTAO_ADMIN]: getCentralizedPermissionsForRole(UserRole.GESTAO_ADMIN),
  [UserRole.FINANCEIRO]: getCentralizedPermissionsForRole(UserRole.FINANCEIRO),
  [UserRole.SUPORTE]: getCentralizedPermissionsForRole(UserRole.SUPORTE),
  [UserRole.LOGISTICA]: getCentralizedPermissionsForRole(UserRole.LOGISTICA),
  [UserRole.MARKETING]: getCentralizedPermissionsForRole(UserRole.MARKETING),
  [UserRole.ANALYTICS]: getCentralizedPermissionsForRole(UserRole.ANALYTICS),
  [UserRole.AUDITOR]: getCentralizedPermissionsForRole(UserRole.AUDITOR),
  [UserRole.OPERADOR]: getCentralizedPermissionsForRole(UserRole.OPERADOR),
  [UserRole.DISTRIBUIDOR]: getCentralizedPermissionsForRole(UserRole.DISTRIBUIDOR),
  [UserRole.AFILIADO]: getCentralizedPermissionsForRole(UserRole.AFILIADO),
  [UserRole.CLIENTE_FINAL]: getCentralizedPermissionsForRole(UserRole.CLIENTE_FINAL),
};

export function getPermissionsForRole(role: UserRole): PermissionEnum[] {
  return ROLE_PERMISSIONS[role] || [];
}
