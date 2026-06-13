import { UserRole } from "@/shared/types/roles";
import { User } from "./context/auth.types";

export const ROLE_REDIRECT_PATHS: Record<UserRole, string> = {
  [UserRole.ADMIN_MASTER]: "/customers",
  [UserRole.GESTAO_ADMIN]: "/analytics",
  [UserRole.FINANCEIRO]: "/wallets",
  [UserRole.SUPORTE]: "/customers",
  [UserRole.LOGISTICA]: "/office",
  [UserRole.MARKETING]: "/office",
  [UserRole.ANALYTICS]: "/office",
  [UserRole.AUDITOR]: "/office",
  [UserRole.OPERADOR]: "/office",
  [UserRole.DISTRIBUIDOR]: "/office",
  [UserRole.AFILIADO]: "/office",
  [UserRole.CLIENTE_FINAL]: "/loja",
};

export const ROLE_DEMO_PATHS: Record<UserRole, string> = {
  [UserRole.ADMIN_MASTER]: "/analytics",
  [UserRole.GESTAO_ADMIN]: "/analytics",
  [UserRole.FINANCEIRO]: "/wallets",
  [UserRole.SUPORTE]: "/customers",
  [UserRole.LOGISTICA]: "/office/orders",
  [UserRole.MARKETING]: "/marketing",
  [UserRole.ANALYTICS]: "/analytics",
  [UserRole.AUDITOR]: "/insights",
  [UserRole.OPERADOR]: "/office",
  [UserRole.DISTRIBUIDOR]: "/office/network",
  [UserRole.AFILIADO]: "/office/network",
  [UserRole.CLIENTE_FINAL]: "/loja",
};

export function getRoleRedirectPath(user: User): string {
  const basePath = ROLE_REDIRECT_PATHS[user.role] || "/";
  if (user.status === "pending" && basePath === "/office") {
    return "/ativacao";
  }
  return basePath;
}

export function getDemoRedirectPath(role: UserRole): string {
  return ROLE_DEMO_PATHS[role] || "/";
}

export function getPrimaryPathForRole(role: UserRole): string {
  return ROLE_REDIRECT_PATHS[role] || "/";
}
