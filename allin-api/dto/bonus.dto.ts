/**
 * Bonus DTOs
 * Based on API documentation from 08-bonus.md
 */

import { IsNumber, IsString, IsOptional, IsISO8601, IsEnum } from 'class-validator';

export enum BonusStatus {
  PENDING = 'Pendente',
  APPROVED = 'Aprovado',
  PAID = 'Pago',
  CANCELLED = 'Cancelado',
}

export class BonusDTO {
  @IsNumber()
  id: number;

  @IsNumber()
  distribuidor_id: number;

  @IsString()
  distribuidor_codigo: string;

  @IsString()
  distribuidor_nome: string;

  @IsString()
  tipo: string;

  @IsNumber()
  valor: number;

  @IsEnum(BonusStatus)
  status: string;

  @IsString()
  periodo: string;

  @IsString()
  descricao: string;

  @IsOptional()
  @IsNumber()
  pedido_id?: number;

  @IsISO8601()
  data_cadastro: string;

  @IsOptional()
  @IsISO8601()
  data_pagamento?: string;
}

export class BonusFilterDTO {
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
  tipo?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  periodo?: string;

  @IsOptional()
  @IsISO8601()
  data_cadastro__maior_igual?: string;

  @IsOptional()
  @IsISO8601()
  data_cadastro__menor_igual?: string;
}
