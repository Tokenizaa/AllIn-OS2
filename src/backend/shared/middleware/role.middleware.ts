/**
 * Role Middleware
 * 
 * Middleware para verificar roles e permissões de usuários.
 */

import { Request, Response, NextFunction } from 'express';

export interface UserRole {
  roles: string[];
  permissions: any[];
}

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    roles?: string[];
    permissions?: any[];
  };
}

export class RoleMiddleware {
  /**
   * Verifica se usuário tem role específica
   * 
   * @param roles Roles permitidas
   * @returns Middleware
   */
  static hasRole(...roles: string[]) {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      const userRoles = req.user?.roles || [];

      const hasRequiredRole = roles.some(role => userRoles.includes(role));

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
   * @param resource Recurso
   * @param action Ação (read, write, delete, etc)
   * @returns Middleware
   */
  static hasPermission(resource: string, action: string) {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      const userPermissions = req.user?.permissions || [];

      // Verificar se tem permissão "all"
      const hasAll = userPermissions.some((perm: any) => perm.all === true);

      if (hasAll) {
        return next();
      }

      // Verificar permissão específica
      const hasPermission = userPermissions.some((perm: any) => {
        if (perm[resource] && Array.isArray(perm[resource])) {
          return perm[resource].includes(action);
        }
        return false;
      });

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
    return this.hasRole('admin');
  }

  /**
   * Verifica se usuário é distribuidor
   * 
   * @returns Middleware
   */
  static isDistributor() {
    return this.hasRole('distributor');
  }

  /**
   * Verifica se usuário é customer
   * 
   * @returns Middleware
   */
  static isCustomer() {
    return this.hasRole('customer');
  }

  /**
   * Verifica se usuário é manager
   * 
   * @returns Middleware
   */
  static isManager() {
    return this.hasRole('manager');
  }

  /**
   * Verifica se usuário é support
   * 
   * @returns Middleware
   */
  static isSupport() {
    return this.hasRole('support');
  }

  /**
   * Extrai roles do usuário
   * 
   * @param req Request
   * @returns Roles do usuário
   */
  static getUserRoles(req: AuthenticatedRequest): string[] {
    return req.user?.roles || [];
  }

  /**
   * Extrai permissões do usuário
   * 
   * @param req Request
   * @returns Permissões do usuário
   */
  static getUserPermissions(req: AuthenticatedRequest): any[] {
    return req.user?.permissions || [];
  }

  /**
   * Verifica se usuário tem qualquer uma das roles
   * 
   * @param req Request
   * @param roles Roles a verificar
   * @returns true se tem qualquer uma das roles
   */
  static hasAnyRole(req: AuthenticatedRequest, roles: string[]): boolean {
    const userRoles = this.getUserRoles(req);
    return roles.some(role => userRoles.includes(role));
  }

  /**
   * Verifica se usuário tem todas as roles
   * 
   * @param req Request
   * @param roles Roles a verificar
   * @returns true se tem todas as roles
   */
  static hasAllRoles(req: AuthenticatedRequest, roles: string[]): boolean {
    const userRoles = this.getUserRoles(req);
    return roles.every(role => userRoles.includes(role));
  }
}
