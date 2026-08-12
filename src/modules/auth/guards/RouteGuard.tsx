import { useEffect } from "react";
import { useNavigate, useLocation } from "@tanstack/react-router";
import { UserRole } from "@/shared/types/roles";
import { Permission } from "../context/auth.types";
import { useAuth } from "../hooks/useAuth";
import { usePermissions } from "../hooks/usePermissions";
import { DashboardResolver } from "../services/dashboardResolver.service";

interface GuardProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requiredPermission?: { module: Permission["module"]; action?: Permission["action"] };
}

const PATH_PERMISSION_MAP: Array<{
  pattern: RegExp;
  permission: { module: Permission["module"]; action?: Permission["action"] };
}> = [
  { pattern: /^\/system(?:\/|$)/, permission: { module: "system", action: "read" } },
  { pattern: /^\/wallets(?:\/|$)/, permission: { module: "finance", action: "read" } },
  { pattern: /^\/analytics(?:\/|$)/, permission: { module: "analytics", action: "read" } },
  { pattern: /^\/insights(?:\/|$)/, permission: { module: "analytics", action: "read" } },
  { pattern: /^\/alerts(?:\/|$)/, permission: { module: "dashboard", action: "read" } },
  { pattern: /^\/customers(?:\/|$)/, permission: { module: "support", action: "read" } },
  { pattern: /^\/distributors(?:\/|$)/, permission: { module: "network", action: "read" } },
  { pattern: /^\/orders(?:\/|$)/, permission: { module: "orders", action: "read" } },
  { pattern: /^\/products(?:\/|$)/, permission: { module: "products", action: "read" } },
  { pattern: /^\/network(?:\/|$)/, permission: { module: "network", action: "read" } },
  { pattern: /^\/commissions(?:\/|$)/, permission: { module: "finance", action: "read" } },
  { pattern: /^\/marketing(?:\/|$)/, permission: { module: "marketing", action: "read" } },
  { pattern: /^\/settings(?:\/|$)/, permission: { module: "settings", action: "read" } },
  { pattern: /^\/distributor(?:\/|$)/, permission: { module: "dashboard", action: "read" } },
];

function resolvePathPermission(pathname: string) {
  const normalizedPath = pathname.startsWith("/admin")
    ? pathname.slice("/admin".length) || "/"
    : pathname;

  return PATH_PERMISSION_MAP.find((entry) => entry.pattern.test(normalizedPath))?.permission || null;
}

function getPrimaryPathForRole(role: string): string {
  const map: Record<string, string> = { admin: "/admin", distributor: "/distributor", staff: "/admin", customer: "/distributor" };
  return map[role] || "/login";
}
function getRoleRedirectPath(role: string): string {
  return getPrimaryPathForRole(role);
}

/**
 * RouteGuard component for protecting routes based on authentication, roles, and permissions
 * Redirects unauthorized users to appropriate pages
 */
export const RouteGuard: React.FC<GuardProps> = ({ children, allowedRoles, requiredPermission }) => {
  const { user, loading } = useAuth();
  const { hasPermission, isLoading: permissionsLoading } = usePermissions();
  const navigate = useNavigate();
  const location = useLocation();
  const inferredPermission = requiredPermission || resolvePathPermission(location.pathname);

  // RouteGuard render

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Redirect to Login page and preserve return url
        navigate({
          to: "/login",
          search: location.pathname === "/" ? undefined : { redirect: location.pathname }
        });
        return;
      }

      if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Role mismatch redirect to their respective primary view
        navigate({ to: getPrimaryPathForRole(user.role) });
        return;
      }

      if (inferredPermission && !hasPermission(inferredPermission.module, inferredPermission.action || "read")) {
        // No permission error card redirect or similar
        navigate({ to: getRoleRedirectPath(user.role) });
      }
    }
  }, [user, loading, permissionsLoading, allowedRoles, inferredPermission, navigate, location.pathname, hasPermission]);

  if (loading) {
    return (
      <div
        role="status"
        aria-busy="true"
        data-testid="route-guard-loading"
        className="min-h-screen flex flex-col items-center justify-center bg-[#07090e] text-white">
        <div className="relative flex items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-t-primary border-r-transparent border-b-transparent border-l-transparent" />
          <div className="absolute h-6 w-6 animate-ping rounded-full bg-primary/20" />
        </div>
        <p className="mt-4 text-xs font-mono text-muted-foreground uppercase tracking-wider" data-testid="route-guard-loading-text">Iniciando ambiente de segurança...</p>
      </div>
    );
  }

  if (!user) return null;
  if (allowedRoles && !allowedRoles.includes(user.role)) return null;
  if (inferredPermission && !hasPermission(inferredPermission.module, inferredPermission.action || "read")) return null;

  return <>{children}</>;
};
