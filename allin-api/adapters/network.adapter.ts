/**
 * Network Adapter
 * Transforms raw API responses into domain entities
 */

import {
  NetworkDTO,
  NetworkNodeDTO,
  LinearNetworkNodeDTO,
} from '../dto/network.dto';

export interface NetworkEntity {
  distributorId: number;
  distributorCode: string;
  totalDownlines: number;
  activeDownlines: number;
  depth: number;
  leftVolume: number;
  rightVolume: number;
  leftLegCount: number;
  rightLegCount: number;
}

export interface NetworkNodeEntity {
  id: number;
  distributorId: number;
  distributorCode: string;
  distributorName: string;
  parentId?: number;
  leg?: 'LEFT' | 'RIGHT';
  position: number;
  depth: number;
  leftVolume: number;
  rightVolume: number;
  activeDownlines: number;
  totalDownlines: number;
}

export interface LinearNetworkNodeEntity {
  id: number;
  line: number;
  relativePosition: number;
  distributorId: number;
  distributorUsername: string;
  sponsorId?: number;
  sponsorUsername?: string;
}

export class NetworkAdapter {
  static toEntity(dto: NetworkDTO): NetworkEntity {
    return {
      distributorId: dto.distribuidor_id,
      distributorCode: dto.distribuidor_codigo,
      totalDownlines: dto.total_downlines,
      activeDownlines: dto.active_downlines,
      depth: dto.depth,
      leftVolume: dto.left_volume,
      rightVolume: dto.right_volume,
      leftLegCount: dto.left_leg_count,
      rightLegCount: dto.right_leg_count,
    };
  }

  static toDTO(entity: NetworkEntity): NetworkDTO {
    return {
      distribuidor_id: entity.distributorId,
      distribuidor_codigo: entity.distributorCode,
      total_downlines: entity.totalDownlines,
      active_downlines: entity.activeDownlines,
      depth: entity.depth,
      left_volume: entity.leftVolume,
      right_volume: entity.rightVolume,
      left_leg_count: entity.leftLegCount,
      right_leg_count: entity.rightLegCount,
    };
  }

  static toNodeEntity(dto: NetworkNodeDTO): NetworkNodeEntity {
    return {
      id: dto.id,
      distributorId: dto.distribuidor_id,
      distributorCode: dto.distribuidor_codigo,
      distributorName: dto.distribuidor_nome,
      parentId: dto.parent_id,
      leg: dto.leg,
      position: dto.position,
      depth: dto.depth,
      leftVolume: dto.left_volume,
      rightVolume: dto.right_volume,
      activeDownlines: dto.active_downlines,
      totalDownlines: dto.total_downlines,
    };
  }

  static toNodeDTO(entity: NetworkNodeEntity): NetworkNodeDTO {
    return {
      id: entity.id,
      distribuidor_id: entity.distributorId,
      distribuidor_codigo: entity.distributorCode,
      distribuidor_nome: entity.distributorName,
      parent_id: entity.parentId,
      leg: entity.leg,
      position: entity.position,
      depth: entity.depth,
      left_volume: entity.leftVolume,
      right_volume: entity.rightVolume,
      active_downlines: entity.activeDownlines,
      total_downlines: entity.totalDownlines,
    };
  }

  static toLinearNodeEntity(dto: LinearNetworkNodeDTO): LinearNetworkNodeEntity {
    return {
      id: dto.id,
      line: dto.linha,
      relativePosition: dto.posicao_relativa,
      distributorId: dto.id_distribuidor,
      distributorUsername: dto.usuario_distribuidor,
      sponsorId: dto.id_patrocinador,
      sponsorUsername: dto.usuario_patrocinador,
    };
  }

  static toLinearNodeDTO(entity: LinearNetworkNodeEntity): LinearNetworkNodeDTO {
    return {
      id: entity.id,
      linha: entity.line,
      posicao_relativa: entity.relativePosition,
      id_distribuidor: entity.distributorId,
      usuario_distribuidor: entity.distributorUsername,
      id_patrocinador: entity.sponsorId,
      usuario_patrocinador: entity.sponsorUsername,
    };
  }
}
