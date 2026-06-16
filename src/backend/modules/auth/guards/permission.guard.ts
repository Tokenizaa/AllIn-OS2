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
export const ROLE_PERMISSIONS: Record<string, PermissionEnum[]> = {
  admin_master: getCentralizedPermissionsForRole('admin_master' as any),
  gestao_admin: getCentralizedPermissionsForRole('gestao_admin' as any),
  financeiro: getCentralizedPermissionsForRole('financeiro' as any),
  suporte: getCentralizedPermissionsForRole('suporte' as any),
  logistica: getCentralizedPermissionsForRole('logistica' as any),
  marketing: getCentralizedPermissionsForRole('marketing' as any),
  analytics: getCentralizedPermissionsForRole('analytics' as any),
  auditor: getCentralizedPermissionsForRole('auditor' as any),
  operador: getCentralizedPermissionsForRole('operador' as any),
  distribuidor: getCentralizedPermissionsForRole('distribuidor' as any),
  afiliado: getCentralizedPermissionsForRole('afiliado' as any),
  cliente_final: getCentralizedPermissionsForRole('cliente_final' as any),
};

export function getPermissionsForRole(role: string): PermissionEnum[] {
  return ROLE_PERMISSIONS[role] || [];
}
