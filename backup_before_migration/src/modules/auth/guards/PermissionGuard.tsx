import { Permission } from "../context/auth.types";
import { usePermissions } from "../hooks/usePermissions";

interface PermissionGuardProps {
  children: React.ReactNode;
  module: Permission["module"];
  action?: Permission["action"];
  fallback?: React.ReactNode;
}

/**
 * PermissionGuard component for conditionally rendering children based on user permissions
 * Renders fallback if user doesn't have required permission
 */
export const PermissionGuard: React.FC<PermissionGuardProps> = ({ 
  children, 
  module, 
  action = "read", 
  fallback = null 
}) => {
  const { hasPermission } = usePermissions();
  if (!hasPermission(module, action)) {
    return <>{fallback}</>;
  }
  return <>{children}</>;
};
