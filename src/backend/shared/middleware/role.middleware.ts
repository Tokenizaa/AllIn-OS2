/**
 * Role Middleware
 * 
 * Middleware para verificar roles e permissões de usuários.
 */

import { Request, Response, NextFunction } from 'express';
import { UserRole as UserRoleEnum, isAdministrativeRole } from '@shared/types/roles';
import { PermissionEnum, permissionActionImplies } from '@shared/types/permissions';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role?: UserRoleEnum;
    permissions?: PermissionEnum[];
  };
}

export class RoleMiddleware {
  /**
   * Verifica se usuário tem role específica
   * 
   * @param roles Roles permitidas
   * @returns Middleware
   */
  static hasRole(...roles: UserRoleEnum[]) {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      const userRole = req.user?.role;

      if (!userRole) {
        return res.status(403).json({
          error: 'Forbidden',
          message: 'User role not found',
        });
      }

      const hasRequiredRole = roles.includes(userRole);

      if (!hasRequiredRole) {
        return res.status(403).json({
          error: 'Forbidden',
          message: 'You do not have the required role',
        });
      }

      next();
    };
  }

  /**
   * Verifica se usuário tem permissão específica
   * 
   * @param module Módulo
   * @param action Ação (read, write, delete, etc)
   * @returns Middleware
   */
  static hasPermission(module: string, action: string) {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      const userRole = req.user?.role;
      const userPermissions = req.user?.permissions || [];

      if (!userRole) {
        return res.status(403).json({
          error: 'Forbidden',
          message: 'User role not found',
        });
      }

      // Admin master tem todas as permissões
      if (userRole === UserRoleEnum.ADMIN_MASTER) {
        return next();
      }

      // Verificar permissão específica
      const requiredPermission = `${module}:${action}` as PermissionEnum;
      const hasPermission = userPermissions.includes(requiredPermission);

      if (!hasPermission) {
        return res.status(403).json({
          error: 'Forbidden',
          message: 'You do not have the required permission',
        });
      }

      next();
    };
  }

  /**
   * Verifica se usuário é admin
   * 
   * @returns Middleware
   */
  static isAdmin() {
    return this.hasRole(UserRoleEnum.ADMIN_MASTER, UserRoleEnum.GESTAO_ADMIN);
  }

  /**
   * Verifica se usuário é distribuidor
   * 
   * @returns Middleware
   */
  static isDistributor() {
    return this.hasRole(UserRoleEnum.DISTRIBUIDOR);
  }

  /**
   * Verifica se usuário é cliente
   * 
   * @returns Middleware
   */
  static isCustomer() {
    return this.hasRole(UserRoleEnum.CLIENTE_FINAL);
  }

  /**
   * Verifica se usuário é manager
   * 
   * @returns Middleware
   */
  static isManager() {
    return this.hasRole(UserRoleEnum.GESTAO_ADMIN);
  }

  /**
   * Verifica se usuário é support
   * 
   * @returns Middleware
   */
  static isSupport() {
    return this.hasRole(UserRoleEnum.SUPORTE);
  }

  /**
   * Extrai role do usuário
   * 
   * @param req Request
   * @returns Role do usuário
   */
  static getUserRole(req: AuthenticatedRequest): UserRoleEnum | undefined {
    return req.user?.role;
  }

  /**
   * Extrai permissões do usuário
   * 
   * @param req Request
   * @returns Permissões do usuário
   */
  static getUserPermissions(req: AuthenticatedRequest): PermissionEnum[] {
    return req.user?.permissions || [];
  }

  /**
   * Verifica se usuário tem qualquer uma das roles
   * 
   * @param req Request
   * @param roles Roles a verificar
   * @returns true se tem qualquer uma das roles
   */
  static hasAnyRole(req: AuthenticatedRequest, roles: UserRoleEnum[]): boolean {
    const userRole = this.getUserRole(req);
    if (!userRole) return false;
    return roles.includes(userRole);
  }

  /**
   * Verifica se usuário tem todas as roles
   * 
   * @param req Request
   * @param roles Roles a verificar
   * @returns true se tem todas as roles
   */
  static hasAllRoles(req: AuthenticatedRequest, roles: UserRoleEnum[]): boolean {
    const userRole = this.getUserRole(req);
    if (!userRole) return false;
    return roles.includes(userRole);
  }
}
