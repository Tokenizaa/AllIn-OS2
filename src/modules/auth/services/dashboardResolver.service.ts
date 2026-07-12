import { UserRole } from "@/shared/types/roles";

/**
 * DashboardResolver Service
 * 
 * Centralized service for resolving dashboard paths based on user roles.
 * Uses only the role to determine the dashboard path.
 * No hardcoded logic, no email-based decisions.
 */
export class DashboardResolver {
  /**
   * Dashboard path mapping for each role
   * This is the single source of truth for dashboard routing
   */
  private static readonly DASHBOARD_PATHS: Record<UserRole, string> = {
    // Administrative Roles
    [UserRole.ADMIN_MASTER]: "/admin/customers",
    [UserRole.GESTAO_ADMIN]: "/admin/analytics",

    // Departmental Roles
    [UserRole.FINANCEIRO]: "/admin/wallets",
    [UserRole.SUPORTE]: "/admin/customers",
    [UserRole.LOGISTICA]: "/admin/orders",
    [UserRole.MARKETING]: "/admin/marketing",
    [UserRole.ANALYTICS]: "/admin/analytics",
    [UserRole.AUDITOR]: "/admin/insights",
    [UserRole.OPERADOR]: "/admin",

    // Business Roles
    [UserRole.DISTRIBUIDOR]: "/distributor/network",
    [UserRole.AFILIADO]: "/distributor/network",
    [UserRole.CLIENTE_FINAL]: "/minha-conta",
  };

  /**
   * Get dashboard path for a given role
   * 
   * @param role - The user's role
   * @returns The dashboard path for the role
   */
  static getDashboardPath(role: UserRole): string {
    return this.DASHBOARD_PATHS[role] || "/loja";
  }

  /**
   * Get dashboard path for a user
   * 
   * @param user - The user object with role and status
   * @returns The dashboard path for the user's role
   */
  static getDashboardPathForUser(user: { role: UserRole; status?: string }): string {
    const basePath = this.getDashboardPath(user.role);
    
    // Special case: pending distributors go to activation page
    if (user.status === "pending" && basePath === "/distributor") {
      return "/ativacao";
    }
    
    return basePath;
  }

  /**
   * Get demo path for a given role
   * 
   * @param role - The user's role
   * @returns The demo path for the role
   */
  static getDemoPath(role: UserRole): string {
    const DEMO_PATHS: Record<UserRole, string> = {
      [UserRole.ADMIN_MASTER]: "/admin/analytics",
      [UserRole.GESTAO_ADMIN]: "/admin/analytics",
      [UserRole.FINANCEIRO]: "/admin/wallets",
      [UserRole.SUPORTE]: "/admin/customers",
      [UserRole.LOGISTICA]: "/admin/orders",
      [UserRole.MARKETING]: "/admin/marketing",
      [UserRole.ANALYTICS]: "/admin/analytics",
      [UserRole.AUDITOR]: "/admin/insights",
      [UserRole.OPERADOR]: "/admin",
      [UserRole.DISTRIBUIDOR]: "/distributor/network",
      [UserRole.AFILIADO]: "/distributor/network",
      [UserRole.CLIENTE_FINAL]: "/loja",
    };
    return DEMO_PATHS[role] || "/";
  }

  /**
   * Check if a path is a dashboard path for a role
   * 
   * @param path - The path to check
   * @param role - The role to check against
   * @returns true if the path is the dashboard for the role
   */
  static isDashboardPathForRole(path: string, role: UserRole): boolean {
    return this.getDashboardPath(role) === path;
  }

  /**
   * Get all dashboard paths
   * 
   * @returns Array of all dashboard paths
   */
  static getAllDashboardPaths(): string[] {
    return Object.values(this.DASHBOARD_PATHS);
  }

  /**
   * Get role for a dashboard path
   * 
   * @param path - The dashboard path
   * @returns The role that owns this dashboard, or null if not found
   */
  static getRoleForDashboardPath(path: string): UserRole | null {
    for (const [role, dashboardPath] of Object.entries(this.DASHBOARD_PATHS)) {
      if (dashboardPath === path) {
        return role as UserRole;
      }
    }
    return null;
  }
}
