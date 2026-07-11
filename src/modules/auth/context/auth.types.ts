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
  id_comprador: string;
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
  id_comprador: string;
  source: string;
  tracking_metadata: {
    clicked_at?: string;
    landing_url?: string;
    referrer_code?: string;
    device?: string;
  };
  created_at: string;
}

export type { Permission } from '../../../../shared/types/permissions';

export interface AuditLog {
  id: string;
  action: string;
  entity_type: string;
  description: string;
  user_id?: string;
  user_email?: string;
  created_at: string;
}

export interface AdminInvite {
  id: string;
  email: string;
  full_name: string;
  role: string;
  permissions: string[];
  invite_token: string;
  invite_link: string;
  invited_by: string;
  expires_at: string;
  status: "pending" | "accepted" | "revoked" | "expired";
  notes?: string;
  created_at: string;
  revoked_at?: string;
  accepted_at?: string;
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
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, role: UserRole, extra?: { phone?: string; cpf?: string; sponsor_id?: string; password?: string }) => Promise<User>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<User>;
  updateDistributorProfile: (updates: Partial<DistributorProfile>) => Promise<DistributorProfile>;
  changeUserRole: (userId: string, targetRole: UserRole) => Promise<void>;
  clearSponsor: () => void;
  activateDistributorOffice: (planId: string) => Promise<DistributorProfile | null>;
  adminInvites: any[];
  usersList: any[];
  getAdminInviteByToken: (token: string) => Promise<any>;
  acceptAdminInvite: (token: string, name: string, password: string) => Promise<any>;
  createAdminInvite: (data: any) => Promise<void>;
  revokeAdminInvite: (id: string) => Promise<void>;
  resendAdminInvite: (id: string) => Promise<void>;
  deleteUserAndInviteSession: (userId: string) => Promise<void>;
  fetchRecentWithdrawals: () => Promise<any[]>;
  fetchWorkspaceSettings: () => Promise<any>;
}
