/**
 * Admin Service
 * 
 * Service para gerenciar operações administrativas.
 */

import { AdminActionRepository, UsernameChangeHistoryRepository, SponsorChangeHistoryRepository } from '../repositories/admin.repository';
import {
  ChangeUsernameDTO,
  ChangeSponsorDTO,
  AdminAction,
  UsernameChangeHistory,
  SponsorChangeHistory,
} from '../dto/admin.dto';
import { DistributorRepository } from '../../distributors/repositories/distributor.repository';

export class AdminService {
  private adminActionRepository: AdminActionRepository;
  private usernameChangeHistoryRepository: UsernameChangeHistoryRepository;
  private sponsorChangeHistoryRepository: SponsorChangeHistoryRepository;
  private distributorRepository: DistributorRepository;

  constructor() {
    this.adminActionRepository = new AdminActionRepository();
    this.usernameChangeHistoryRepository = new UsernameChangeHistoryRepository();
    this.sponsorChangeHistoryRepository = new SponsorChangeHistoryRepository();
    this.distributorRepository = new DistributorRepository();
  }

  /**
   * Altera username de distribuidor
   */
  async changeUsername(dto: ChangeUsernameDTO): Promise<{ distributor: any; history: UsernameChangeHistory; action: AdminAction }> {
    // Busca distribuidor
    const distributor = await this.distributorRepository.findById(dto.distributorId);
    if (!distributor) {
      throw new Error('Distributor not found');
    }

    const oldUsername = distributor.usuario;

    // Verifica se o novo username já está em uso
    const existingByUsername = await this.distributorRepository.findByUsuario(dto.newUsername);
    if (existingByUsername && existingByUsername.id !== dto.distributorId) {
      throw new Error('Username already in use');
    }

    // Atualiza username
    const updatedDistributor = await this.distributorRepository.update(dto.distributorId, {
      usuario: dto.newUsername,
    });

    // Registra histórico de mudança
    const history = await this.usernameChangeHistoryRepository.logChange({
      distributor_id: dto.distributorId,
      distributor_name: distributor.nome,
      old_username: oldUsername,
      new_username: dto.newUsername,
      reason: dto.reason,
      changed_by: dto.userName,
      changed_at: new Date(),
    });

    // Registra ação administrativa
    const action = await this.adminActionRepository.logAction({
      action_type: 'change_username',
      target_id: dto.distributorId,
      target_type: 'distributor',
      old_value: oldUsername,
      new_value: dto.newUsername,
      reason: dto.reason,
      user_id: dto.userId,
      user_name: dto.userName,
    });

    return {
      distributor: updatedDistributor,
      history,
      action,
    };
  }

  /**
   * Altera patrocinador de distribuidor
   */
  async changeSponsor(dto: ChangeSponsorDTO): Promise<{ distributor: any; history: SponsorChangeHistory; action: AdminAction }> {
    // Busca distribuidor
    const distributor = await this.distributorRepository.findById(dto.distributorId);
    if (!distributor) {
      throw new Error('Distributor not found');
    }

    const oldSponsorId = distributor.patrocinador_id;

    // Busca novo patrocinador
    const newSponsor = await this.distributorRepository.findById(dto.newSponsorId);
    if (!newSponsor) {
      throw new Error('New sponsor not found');
    }

    // Busca nome do antigo patrocinador
    let oldSponsorName = 'N/A';
    if (oldSponsorId) {
      const oldSponsor = await this.distributorRepository.findById(oldSponsorId);
      if (oldSponsor) {
        oldSponsorName = oldSponsor.nome;
      }
    }

    // Atualiza patrocinador
    const updatedDistributor = await this.distributorRepository.update(dto.distributorId, {
      patrocinador_id: dto.newSponsorId,
    });

    // Registra histórico de mudança
    const history = await this.sponsorChangeHistoryRepository.logChange({
      distributor_id: dto.distributorId,
      distributor_name: distributor.nome,
      old_sponsor_id: oldSponsorId || '',
      old_sponsor_name: oldSponsorName,
      new_sponsor_id: dto.newSponsorId,
      new_sponsor_name: newSponsor.nome,
      reason: dto.reason,
      changed_by: dto.userName,
      changed_at: new Date(),
    });

    // Registra ação administrativa
    const action = await this.adminActionRepository.logAction({
      action_type: 'change_sponsor',
      target_id: dto.distributorId,
      target_type: 'distributor',
      old_value: oldSponsorId || '',
      new_value: dto.newSponsorId,
      reason: dto.reason,
      user_id: dto.userId,
      user_name: dto.userName,
    });

    return {
      distributor: updatedDistributor,
      history,
      action,
    };
  }

  /**
   * Busca histórico de mudanças de username
   */
  async getUsernameChangeHistory(distributorId: string): Promise<UsernameChangeHistory[]> {
    return this.usernameChangeHistoryRepository.findByDistributor(distributorId);
  }

  /**
   * Busca histórico de mudanças de patrocinador
   */
  async getSponsorChangeHistory(distributorId: string): Promise<SponsorChangeHistory[]> {
    return this.sponsorChangeHistoryRepository.findByDistributor(distributorId);
  }

  /**
   * Busca ações administrativas recentes
   */
  async getRecentAdminActions(limit: number = 50): Promise<AdminAction[]> {
    return this.adminActionRepository.findRecent(limit);
  }

  /**
   * Busca ações administrativas por tipo
   */
  async getAdminActionsByType(actionType: string): Promise<AdminAction[]> {
    return this.adminActionRepository.findByActionType(actionType);
  }

  /**
   * Busca ações administrativas por usuário
   */
  async getAdminActionsByUser(userId: string): Promise<AdminAction[]> {
    return this.adminActionRepository.findByUser(userId);
  }

  /**
   * Ativa distribuidor
   */
  async activateDistributor(distributorId: string, reason: string, userId: string, userName: string): Promise<{ distributor: any; action: AdminAction }> {
    const distributor = await this.distributorRepository.findById(distributorId);
    if (!distributor) {
      throw new Error('Distributor not found');
    }

    const updatedDistributor = await this.distributorRepository.update(distributorId, {
      ativo: true,
    });

    const action = await this.adminActionRepository.logAction({
      action_type: 'activate',
      target_id: distributorId,
      target_type: 'distributor',
      old_value: 'inactive',
      new_value: 'active',
      reason,
      user_id: userId,
      user_name: userName,
    });

    return {
      distributor: updatedDistributor,
      action,
    };
  }

  /**
   * Desativa distribuidor
   */
  async deactivateDistributor(distributorId: string, reason: string, userId: string, userName: string): Promise<{ distributor: any; action: AdminAction }> {
    const distributor = await this.distributorRepository.findById(distributorId);
    if (!distributor) {
      throw new Error('Distributor not found');
    }

    const updatedDistributor = await this.distributorRepository.update(distributorId, {
      ativo: false,
    });

    const action = await this.adminActionRepository.logAction({
      action_type: 'deactivate',
      target_id: distributorId,
      target_type: 'distributor',
      old_value: 'active',
      new_value: 'inactive',
      reason,
      user_id: userId,
      user_name: userName,
    });

    return {
      distributor: updatedDistributor,
      action,
    };
  }
}
