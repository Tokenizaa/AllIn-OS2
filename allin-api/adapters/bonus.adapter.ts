/**
 * Bonus Adapter
 * Transforms raw API responses into domain entities
 */

import { BonusDTO, BonusStatus } from '../dto/bonus.dto';

export interface BonusEntity {
  id: number;
  distributorId: number;
  distributorCode: string;
  distributorName: string;
  type: string;
  amount: number;
  status: 'PENDING' | 'APPROVED' | 'PAID' | 'CANCELLED';
  period: string;
  description: string;
  relatedOrderId?: number;
  createdAt: Date;
  paidAt?: Date;
}

export class BonusAdapter {
  static toEntity(dto: BonusDTO): BonusEntity {
    return {
      id: dto.id,
      distributorId: dto.distribuidor_id,
      distributorCode: dto.distribuidor_codigo,
      distributorName: dto.distribuidor_nome,
      type: dto.tipo,
      amount: dto.valor,
      status: this.mapStatus(dto.status),
      period: dto.periodo,
      description: dto.descricao,
      relatedOrderId: dto.pedido_id,
      createdAt: new Date(dto.data_cadastro),
      paidAt: dto.data_pagamento ? new Date(dto.data_pagamento) : undefined,
    };
  }

  static toDTO(entity: BonusEntity): BonusDTO {
    return {
      id: entity.id,
      distribuidor_id: entity.distributorId,
      distribuidor_codigo: entity.distributorCode,
      distribuidor_nome: entity.distributorName,
      tipo: entity.type,
      valor: entity.amount,
      status: this.mapStatusToDTO(entity.status),
      periodo: entity.period,
      descricao: entity.description,
      pedido_id: entity.relatedOrderId,
      data_cadastro: entity.createdAt.toISOString(),
      data_pagamento: entity.paidAt?.toISOString(),
    };
  }

  private static mapStatus(status: string): 'PENDING' | 'APPROVED' | 'PAID' | 'CANCELLED' {
    const statusMap: Record<string, 'PENDING' | 'APPROVED' | 'PAID' | 'CANCELLED'> = {
      'Pendente': 'PENDING',
      'Aprovado': 'APPROVED',
      'Pago': 'PAID',
      'Cancelado': 'CANCELLED',
    };
    return statusMap[status] || 'PENDING';
  }

  private static mapStatusToDTO(status: 'PENDING' | 'APPROVED' | 'PAID' | 'CANCELLED'): string {
    const statusMap: Record<'PENDING' | 'APPROVED' | 'PAID' | 'CANCELLED', string> = {
      'PENDING': 'Pendente',
      'APPROVED': 'Aprovado',
      'PAID': 'Pago',
      'CANCELLED': 'Cancelado',
    };
    return statusMap[status] || 'Pendente';
  }
}
