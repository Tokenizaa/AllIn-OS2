/**
 * Admin Repository
 * 
 * Repository para operações de database relacionadas a administração.
 */

import { BaseRepository, BaseEntity } from '../../../shared/infrastructure/repository/base.repository';
import { supabase } from '../../../shared/infra/database/supabase';

export interface AdminAction extends BaseEntity {
  action_type: 'change_username' | 'change_sponsor' | 'activate' | 'deactivate' | 'delete';
  target_id: string;
  target_type: 'distributor' | 'customer' | 'product';
  old_value?: string;
  new_value?: string;
  reason: string;
  user_id: string;
  user_name: string;
}

export class AdminActionRepository extends BaseRepository<AdminAction> {
  constructor() {
    super('admin_actions', 'admin');
  }

  /**
   * Busca ações por tipo
   */
  async findByActionType(actionType: string): Promise<AdminAction[]> {
    return this.findAll({
      filters: { action_type: actionType },
    });
  }

  /**
   * Busca ações por target
   */
  async findByTarget(targetId: string): Promise<AdminAction[]> {
    return this.findAll({
      filters: { target_id: targetId },
    });
  }

  /**
   * Busca ações por usuário
   */
  async findByUser(userId: string): Promise<AdminAction[]> {
    return this.findAll({
      filters: { user_id: userId },
    });
  }

  /**
   * Busca ações recentes
   */
  async findRecent(limit: number = 50): Promise<AdminAction[]> {
    const { data, error } = await this.executeQuery(
      supabase
        .from(this.tableName)
        .select('*')
        .is('deleted_at', null)
        .order('created_at', { ascending: false })
        .limit(limit)
    );

    if (error) throw error;
    return data as AdminAction[];
  }

  /**
   * Registra ação administrativa
   */
  async logAction(action: Omit<AdminAction, 'id' | 'created_at' | 'updated_at'>): Promise<AdminAction> {
    return this.create(action);
  }
}

export interface UsernameChangeHistory extends BaseEntity {
  distributor_id: string;
  distributor_name: string;
  old_username: string;
  new_username: string;
  reason: string;
  changed_by: string;
  changed_at: Date;
}

export class UsernameChangeHistoryRepository extends BaseRepository<UsernameChangeHistory> {
  constructor() {
    super('username_change_history', 'admin');
  }

  /**
   * Busca histórico por distribuidor
   */
  async findByDistributor(distributorId: string): Promise<UsernameChangeHistory[]> {
    return this.findAll({
      filters: { distributor_id: distributorId },
    });
  }

  /**
   * Busca histórico por username
   */
  async findByUsername(username: string): Promise<UsernameChangeHistory[]> {
    const { data, error } = await this.executeQuery(
      supabase
        .from(this.tableName)
        .select('*')
        .or(`old_username.eq.${username},new_username.eq.${username}`)
        .is('deleted_at', null)
        .order('created_at', { ascending: false })
    );

    if (error) throw error;
    return data as UsernameChangeHistory[];
  }

  /**
   * Registra mudança de username
   */
  async logChange(change: Omit<UsernameChangeHistory, 'id' | 'created_at' | 'updated_at'>): Promise<UsernameChangeHistory> {
    return this.create(change);
  }
}

export interface SponsorChangeHistory extends BaseEntity {
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

export class SponsorChangeHistoryRepository extends BaseRepository<SponsorChangeHistory> {
  constructor() {
    super('sponsor_change_history', 'admin');
  }

  /**
   * Busca histórico por distribuidor
   */
  async findByDistributor(distributorId: string): Promise<SponsorChangeHistory[]> {
    return this.findAll({
      filters: { distributor_id: distributorId },
    });
  }

  /**
   * Busca histórico por patrocinador
   */
  async findBySponsor(sponsorId: string): Promise<SponsorChangeHistory[]> {
    const { data, error } = await this.executeQuery(
      supabase
        .from(this.tableName)
        .select('*')
        .or(`old_sponsor_id.eq.${sponsorId},new_sponsor_id.eq.${sponsorId}`)
        .is('deleted_at', null)
        .order('created_at', { ascending: false })
    );

    if (error) throw error;
    return data as SponsorChangeHistory[];
  }

  /**
   * Registra mudança de patrocinador
   */
  async logChange(change: Omit<SponsorChangeHistory, 'id' | 'created_at' | 'updated_at'>): Promise<SponsorChangeHistory> {
    return this.create(change);
  }
}
