// Context
export { AuthContext, AuthProvider } from "./context";
export type { User, DistributorProfile, CustomerReferral, AuditLog, Permission, AdminInvite, AuthContextType } from "./context";

// Hooks
export { useAuth, usePermissions, useRole, useSession, useProfile } from "./hooks";

// Services
export { AuthService, ProfileService, InviteService, AuditService } from "./services";

// Guards
export { RouteGuard, RoleGuard, PermissionGuard } from "./guards";

// Permissions
export { ROLE_PERMISSIONS, getPermissionsForRole, hasPermissionForRole } from "./permissions";
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
