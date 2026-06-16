/**
 * Authentication Middleware
 * 
 * Verifies Supabase JWT tokens and extracts user information including role and permissions.
 * This middleware should be applied to protected routes.
 */

import { Request, Response, NextFunction } from 'express';
import { getSupabaseClient } from '../../infra/supabase/client';
import { UserRole } from '@shared/types/roles';
import { PermissionEnum } from '@shared/types/permissions';
import { getPermissionsForRole } from '@shared/config/role-permissions';

const supabase = getSupabaseClient();

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: UserRole;
    permissions: PermissionEnum[];
  };
}

/**
 * Authentication middleware
 * Verifies the JWT token from the Authorization header and extracts user information
 */
export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get the token from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Missing or invalid authorization header',
      });
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify the token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user?.email) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid or expired token',
      });
      return;
    }

    // Get customer and profile information
    const { data: customer } = await supabase
      .from('customers')
      .select('id, email, name')
      .eq('email', user.email)
      .single();

    if (!customer) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'User not found',
      });
      return;
    }

    // Get user role from profiles table
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', customer.id)
      .single();

    const role = (profile?.role || UserRole.CLIENTE_FINAL) as UserRole;

    // Get permissions for the role
    const permissions = getPermissionsForRole(role);

    // Attach user information to the request
    req.user = {
      id: customer.id,
      email: customer.email,
      role,
      permissions,
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Authentication failed',
    });
  }
};

/**
 * Optional authentication middleware
 * Attaches user information if token is present, but doesn't require it
 */
export const optionalAuthMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      next();
      return;
    }

    const token = authHeader.substring(7);

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user?.email) {
      next();
      return;
    }

    const { data: customer } = await supabase
      .from('customers')
      .select('id, email, name')
      .eq('email', user.email)
      .single();

    if (!customer) {
      next();
      return;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', customer.id)
      .single();

    const role = (profile?.role || UserRole.CLIENTE_FINAL) as UserRole;
    const permissions = getPermissionsForRole(role);

    req.user = {
      id: customer.id,
      email: customer.email,
      role,
      permissions,
    };

    next();
  } catch (error) {
    // Don't fail on optional auth
    next();
  }
};
