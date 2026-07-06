// Context
export { AuthContext, AuthProvider } from "./context";
export type { User, DistributorProfile, CustomerReferral, Permission, AuthContextType } from "./context";

// Hooks
export { useAuth, usePermissions } from "./hooks";

// Services
export { AuthService, ProfileService } from "./services";
export { RoleResolver } from "./services/roleResolver.service";
export { DashboardResolver } from "./services/dashboardResolver.service";

// Guards
export { RouteGuard } from "./guards";

// Permissions
export { getPermissionsForRole, hasPermissionForRole, getUserPermissions } from "./permissions";
export {
  ADMINISTRATIVE_ROLES,
  DEPARTMENTAL_ROLES,
  BUSINESS_ROLES,
  ALL_ROLES,
  isAdministrativeRole,
  isDepartmentalRole,
  isBusinessRole,
  isValidRole,
  getRoleCategory,
  getRolesByCategory
} from "./permissions";
