/**
 * Admin DTOs
 * 
 * DTOs para operações administrativas.
 */

export interface ChangeUsernameDTO {
  distributorId: string;
  newUsername: string;
  reason: string;
  userId: string;
  userName: string;
}

export interface ChangeSponsorDTO {
  distributorId: string;
  newSponsorId: string;
  reason: string;
  userId: string;
  userName: string;
}

export interface AdminAction {
  id: string;
  action_type: 'change_username' | 'change_sponsor' | 'activate' | 'deactivate' | 'delete';
  target_id: string;
  target_type: 'distributor' | 'customer' | 'product';
  old_value?: string;
  new_value?: string;
  reason: string;
  user_id: string;
  user_name: string;
  created_at: Date;
}

export interface CreateAdminActionDTO {
  action_type: 'change_username' | 'change_sponsor' | 'activate' | 'deactivate' | 'delete';
  target_id: string;
  target_type: 'distributor' | 'customer' | 'product';
  old_value?: string;
  new_value?: string;
  reason: string;
  user_id: string;
  user_name: string;
}

export interface UsernameChangeHistory {
  id: string;
  distributor_id: string;
  distributor_name: string;
  old_username: string;
  new_username: string;
  reason: string;
  changed_by: string;
  changed_at: Date;
}

export interface SponsorChangeHistory {
  id: string;
  distributor_id: string;
  distributor_name: string;
  old_sponsor_id: string;
  old_sponsor_name: string;
  new_sponsor_id: string;
  new_sponsor_name: string;
  reason: string;
  changed_by: string;
  changed_at: Date;
}
