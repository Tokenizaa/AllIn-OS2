/**
 * Distributor Adapter
 * Transforms raw API responses into domain entities
 */

import { DistributorDTO } from '../dto/distributor.dto';

export interface DistributorEntity {
  id: number;
  code: string;
  name: string;
  username: string;
  email: string;
  phone?: string;
  cpf: string;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'SUSPENDED';
  activationDate?: Date;
  sponsorId?: number;
  sponsorCode?: string;
  planId?: number;
  planName?: string;
  qualificationLevel?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class DistributorAdapter {
  static toEntity(dto: DistributorDTO): DistributorEntity {
    return {
      id: dto.id,
      code: dto.codigo,
      name: dto.nome,
      username: dto.usuario,
      email: dto.email,
      phone: dto.telefone,
      cpf: dto.cpf,
      status: this.mapStatus(dto.status),
      activationDate: dto.data_ativacao ? new Date(dto.data_ativacao) : undefined,
      sponsorId: dto.id_patrocinador,
      sponsorCode: dto.codigo_patrocinador,
      planId: dto.id_plano,
      planName: dto.nome_plano,
      qualificationLevel: dto.nivel_qualificacao,
      createdAt: new Date(dto.data_cadastro),
      updatedAt: new Date(dto.data_atualizacao),
    };
  }

  static toDTO(entity: DistributorEntity): DistributorDTO {
    return {
      id: entity.id,
      codigo: entity.code,
      nome: entity.name,
      usuario: entity.username,
      email: entity.email,
      telefone: entity.phone,
      cpf: entity.cpf,
      status: this.mapStatusToDTO(entity.status),
      data_ativacao: entity.activationDate?.toISOString(),
      id_patrocinador: entity.sponsorId,
      codigo_patrocinador: entity.sponsorCode,
      id_plano: entity.planId,
      nome_plano: entity.planName,
      nivel_qualificacao: entity.qualificationLevel,
      data_cadastro: entity.createdAt.toISOString(),
      data_atualizacao: entity.updatedAt.toISOString(),
    };
  }

  private static mapStatus(status: string): 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'SUSPENDED' {
    const statusMap: Record<string, 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'SUSPENDED'> = {
      'Ativo': 'ACTIVE',
      'Inativo': 'INACTIVE',
      'Pendente': 'PENDING',
      'Suspenso': 'SUSPENDED',
    };
    return statusMap[status] || 'INACTIVE';
  }

  private static mapStatusToDTO(status: 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'SUSPENDED'): string {
    const statusMap: Record<'ACTIVE' | 'INACTIVE' | 'PENDING' | 'SUSPENDED', string> = {
      'ACTIVE': 'Ativo',
      'INACTIVE': 'Inativo',
      'PENDING': 'Pendente',
      'SUSPENDED': 'Suspenso',
    };
    return statusMap[status] || 'Inativo';
  }
}
