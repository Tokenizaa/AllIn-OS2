/**
 * Order DTOs
 * Based on API documentation from 05-pedidos.md
 */

import { IsNumber, IsString, IsOptional, IsISO8601, IsEnum } from 'class-validator';

export enum OrderStatus {
  PENDING = 'Pendente',
  PAID = 'Pago',
  SHIPPED = 'Enviado',
  DELIVERED = 'Entregue',
  CANCELLED = 'Cancelado',
}

export class OrderDTO {
  @IsNumber()
  id: number;

  @IsString()
  numero_pedido: string;

  @IsNumber()
  distribuidor_id: number;

  @IsString()
  distribuidor_codigo: string;

  @IsString()
  distribuidor_nome: string;

  @IsNumber()
  valor_total: number;

  @IsEnum(OrderStatus)
  status: string;

  @IsString()
  forma_pagamento: string;

  @IsString()
  status_pagamento: string;

  @IsISO8601()
  data_pedido: string;

  @IsOptional()
  @IsISO8601()
  data_pagamento?: string;

  @IsOptional()
  @IsISO8601()
  data_envio?: string;

  @IsOptional()
  @IsISO8601()
  data_entrega?: string;

  @IsISO8601()
  data_cadastro: string;

  @IsISO8601()
  data_atualizacao: string;
}

export class OrderFilterDTO {
  @IsOptional()
  @IsNumber()
  limit?: number;

  @IsOptional()
  @IsNumber()
  page?: number;

  @IsOptional()
  @IsNumber()
  distribuidor_id?: number;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsISO8601()
  data_pedido__maior_igual?: string;

  @IsOptional()
  @IsISO8601()
  data_pedido__menor_igual?: string;
}
