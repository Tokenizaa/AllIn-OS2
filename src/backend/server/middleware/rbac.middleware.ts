/**
 * RBAC Middleware
 * 
 * Provides middleware functions for role-based access control.
 * These should be used in combination with the auth middleware to protect routes.
 */

import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth.middleware';
import { UserRole } from '@shared/types/roles';
import { PermissionEnum } from '@shared/types/permissions';

/**
 * Check if user has a specific role
 */
export const requireRole = (...allowedRoles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required',
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Insufficient permissions',
      });
      return;
    }

    next();
  };
};

/**
 * Check if user has a specific permission
 */
export const requirePermission = (requiredPermission: PermissionEnum) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required',
      });
      return;
    }

    // Admin master has all permissions
    if (req.user.role === UserRole.ADMIN_MASTER) {
      next();
      return;
    }

    if (!req.user.permissions.includes(requiredPermission)) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Insufficient permissions',
      });
      return;
    }

    next();
  };
};

/**
 * Check if user has any of the specified permissions
 */
export const requireAnyPermission = (...requiredPermissions: PermissionEnum[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required',
      });
      return;
    }

    // Admin master has all permissions
    if (req.user.role === UserRole.ADMIN_MASTER) {
      next();
      return;
    }

    const hasPermission = requiredPermissions.some(perm => 
      req.user!.permissions.includes(perm)
    );

    if (!hasPermission) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Insufficient permissions',
      });
      return;
    }

    next();
  };
};

/**
 * Check if user has all of the specified permissions
 */
export const requireAllPermissions = (...requiredPermissions: PermissionEnum[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required',
      });
      return;
    }

    // Admin master has all permissions
    if (req.user.role === UserRole.ADMIN_MASTER) {
      next();
      return;
    }

    const hasAllPermissions = requiredPermissions.every(perm => 
      req.user!.permissions.includes(perm)
    );

    if (!hasAllPermissions) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Insufficient permissions',
      });
      return;
    }

    next();
  };
};

/**
 * Check if user is admin (admin_master or gestao_admin)
 */
export const requireAdmin = () => {
  return requireRole(UserRole.ADMIN_MASTER, UserRole.GESTAO_ADMIN);
};

/**
 * Check if user is business role (distribuidor, afiliado, cliente_final)
 */
export const requireBusinessRole = () => {
  return requireRole(UserRole.DISTRIBUIDOR, UserRole.AFILIADO, UserRole.CLIENTE_FINAL);
};

/**
 * Check if user is departmental role
 */
export const requireDepartmentalRole = () => {
  return requireRole(
    UserRole.FINANCEIRO,
    UserRole.SUPORTE,
    UserRole.LOGISTICA,
    UserRole.MARKETING,
    UserRole.ANALYTICS,
    UserRole.AUDITOR,
    UserRole.OPERADOR
  );
};
