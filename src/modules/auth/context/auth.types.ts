import { UserRole } from "@/shared/types/roles";

/**
 * User interface representing an authenticated user in the system
 */
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: "active" | "pending" | "suspended";
  active: boolean;
  avatar?: string;
  phone?: string;
  cpf?: string;
  sponsor_id?: string;
  referral_code?: string;
  created_at: string;
  last_login?: string;
  permissions_list?: string[]; // Custom allowed modules/actions
}

/**
 * Distributor profile containing MLM-specific information
 */
export interface DistributorProfile {
  id: string;
  customer_id: string;
  sponsor_id: string;
  referral_code: string;
  referral_link: string;
  plan_id: string;
  qualification: string;
  wallet_balance: number;
  bonus_balance: number;
  status: "active" | "pending" | "suspended";
}

/**
 * Customer referral tracking information
 */
export interface CustomerReferral {
  id: string;
  distributor_id: string;
  customer_id: string;
  source: string;
  tracking_metadata: {
    clicked_at?: string;
    landing_url?: string;
    referrer_code?: string;
    device?: string;
  };
  created_at: string;
}

/**
 * Audit log entry for tracking system actions
 */
export interface AuditLog {
  id: string;
  user_id: string;
  actor: string;
  action: string;
  entity: string;
  details?: string;
  ip_address?: string;
  tenant_id: string;
  created_at: string;
}

/**
 * Permission definition for RBAC system
 */
export interface Permission {
  id: string;
  module: "dashboard" | "analytics" | "finance" | "support" | "network" | "orders" | "products" | "marketing" | "settings" | "system";
  action: "read" | "write" | "delete" | "manage" | "all";
  description: string;
}

/**
 * Admin invite for onboarding administrative users
 */
export interface AdminInvite {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  permissions: string[]; // custom additional modules/permissions
  invite_token: string;
  invite_link: string;
  invited_by: string; // Actor who did the inviting
  expires_at: string;
  accepted_at?: string;
  revoked_at?: string;
  status: "pending" | "accepted" | "expired" | "revoked";
  notes?: string;
  metadata?: any;
  created_at: string;
}

/**
 * AuthContext type definition
 * Contains all authentication state and methods
 */
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  distributorProfile: DistributorProfile | null;
  activeSponsor: string | null;
  activeReferralMetadata: any | null;
  auditLogs: AuditLog[];
  usersList: User[];
  adminInvites: AdminInvite[];
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, role: UserRole, extra?: { phone?: string; cpf?: string; sponsor_id?: string; password?: string }) => Promise<User>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<User>;
  updateDistributorProfile: (updates: Partial<DistributorProfile>) => Promise<DistributorProfile>;
  changeUserRole: (userId: string, targetRole: UserRole) => Promise<void>;
  simulateAuditLog: (action: string, entity: string, details?: string) => void;
  clearSponsor: () => void;
  activateDistributorOffice: (planId: string) => Promise<void>;
  addAuditLog: (logInput: any) => void;
  triggerBinomialBonusPay: (points: number, commission: number, value: number) => Promise<void>;
  createAdminInvite: (invite: Omit<AdminInvite, "id" | "invite_token" | "invite_link" | "created_at" | "expires_at" | "status">) => Promise<AdminInvite>;
  revokeAdminInvite: (inviteId: string) => Promise<void>;
  resendAdminInvite: (inviteId: string) => Promise<void>;
  getAdminInviteByToken: (token: string) => Promise<AdminInvite | null>;
  acceptAdminInvite: (token: string, name: string, password: string) => Promise<User>;
  deleteUserAndInviteSession: (userId: string) => void;
}
