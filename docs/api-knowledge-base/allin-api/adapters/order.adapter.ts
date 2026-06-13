/**
 * Order Adapter
 * Transforms raw API responses into domain entities
 */

import { OrderDTO, OrderStatus } from '../dto/order.dto';

export interface OrderEntity {
  id: number;
  orderNumber: string;
  distributorId: number;
  distributorCode: string;
  distributorName: string;
  totalAmount: number;
  status: 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  paymentMethod: string;
  paymentStatus: string;
  items: OrderItemEntity[];
  shippingAddress?: AddressEntity;
  createdAt: Date;
  updatedAt: Date;
  paidAt?: Date;
  shippedAt?: Date;
  deliveredAt?: Date;
}

export interface OrderItemEntity {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  isPlan: boolean;
}

export interface AddressEntity {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export class OrderAdapter {
  static toEntity(dto: OrderDTO): OrderEntity {
    return {
      id: dto.id,
      orderNumber: dto.numero_pedido,
      distributorId: dto.distribuidor_id,
      distributorCode: dto.distribuidor_codigo,
      distributorName: dto.distribuidor_nome,
      totalAmount: dto.valor_total,
      status: this.mapStatus(dto.status),
      paymentMethod: dto.forma_pagamento,
      paymentStatus: dto.status_pagamento,
      items: [], // Items would need to be fetched separately or included in a detailed endpoint
      shippingAddress: undefined, // Address would need to be fetched separately
      createdAt: new Date(dto.data_pedido),
      updatedAt: new Date(dto.data_atualizacao),
      paidAt: dto.data_pagamento ? new Date(dto.data_pagamento) : undefined,
      shippedAt: dto.data_envio ? new Date(dto.data_envio) : undefined,
      deliveredAt: dto.data_entrega ? new Date(dto.data_entrega) : undefined,
    };
  }

  static toDTO(entity: OrderEntity): OrderDTO {
    return {
      id: entity.id,
      numero_pedido: entity.orderNumber,
      distribuidor_id: entity.distributorId,
      distribuidor_codigo: entity.distributorCode,
      distribuidor_nome: entity.distributorName,
      valor_total: entity.totalAmount,
      status: this.mapStatusToDTO(entity.status),
      forma_pagamento: entity.paymentMethod,
      status_pagamento: entity.paymentStatus,
      data_pedido: entity.createdAt.toISOString(),
      data_pagamento: entity.paidAt?.toISOString(),
      data_envio: entity.shippedAt?.toISOString(),
      data_entrega: entity.deliveredAt?.toISOString(),
      data_cadastro: entity.createdAt.toISOString(),
      data_atualizacao: entity.updatedAt.toISOString(),
    };
  }

  private static mapStatus(status: string): 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' {
    const statusMap: Record<string, 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'> = {
      'Pendente': 'PENDING',
      'Pago': 'PAID',
      'Enviado': 'SHIPPED',
      'Entregue': 'DELIVERED',
      'Cancelado': 'CANCELLED',
    };
    return statusMap[status] || 'PENDING';
  }

  private static mapStatusToDTO(status: 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'): string {
    const statusMap: Record<'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED', string> = {
      'PENDING': 'Pendente',
      'PAID': 'Pago',
      'SHIPPED': 'Enviado',
      'DELIVERED': 'Entregue',
      'CANCELLED': 'Cancelado',
    };
    return statusMap[status] || 'Pendente';
  }
}
