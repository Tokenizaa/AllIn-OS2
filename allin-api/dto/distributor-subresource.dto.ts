/**
 * Distributor Sub-Resource DTOs
 * For endpoints: /v1/distribuidores/Telefones, /v1/distribuidores/AtivacoesMensais, /v1/distribuidores/PlanoAtual, /v1/distribuidores/QualificacaoAtual
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsEnum, IsDateString, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export enum DistributorPhoneType {
  CELULAR = 'celular',
  FIXO = 'fixo',
  COMERCIAL = 'comercial',
  WHATSAPP = 'whatsapp',
  RECADO = 'recado',
}

export enum DistributorActivationType {
  PLANO = 'plano',
  UPGRADE = 'upgrade',
  RENOVACAO = 'renovacao',
  REATIVACAO = 'reativacao',
}

export enum DistributorActivationStatus {
  CONFIRMADA = 'confirmada',
  CANCELADA = 'cancelada',
  ESTORNADA = 'estornada',
}

export class DistributorPhoneDTO {
  @ApiProperty()
  id: string;

  @ApiProperty()
  distribuidor_id: string;

  @ApiProperty({ enum: DistributorPhoneType })
  tipo: string;

  @ApiProperty()
  numero: string;

  @ApiPropertyOptional()
  ddd?: string;

  @ApiPropertyOptional()
  principal?: boolean;

  @ApiPropertyOptional()
  verificado?: boolean;

  @ApiPropertyOptional()
  verificado_em?: string;

  @ApiPropertyOptional()
  metadata?: Record<string, any>;

  @ApiProperty()
  created_at: string;

  @ApiProperty()
  updated_at: string;
}

export class DistributorPhoneFilterDTO {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number = 100;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number = 1;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  distribuidor_id?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  telefone__contem?: string;
}

export class DistributorActivacaoMensalDTO {
  @ApiProperty()
  id: string;

  @ApiProperty()
  distribuidor_id: string;

  @ApiProperty()
  ano: number;

  @ApiProperty()
  mes: number;

  @ApiProperty({ enum: DistributorActivationType })
  tipo_ativacao: string;

  @ApiPropertyOptional()
  plano_id?: string;

  @ApiProperty()
  quantidade: number;

  @ApiProperty()
  valor_total: number;

  @ApiProperty()
  pontos_ganhos: number;

  @ApiProperty({ enum: DistributorActivationStatus })
  status: string;

  @ApiProperty()
  data_ativacao: string;

  @ApiPropertyOptional()
  metadata?: Record<string, any>;

  @ApiProperty()
  created_at: string;

  @ApiProperty()
  updated_at: string;
}

export class DistribuidorAtivacaoMensalFilterDTO {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number = 100;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number = 1;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  distribuidor_id?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  ano?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  mes?: number;

  @ApiPropertyOptional({ enum: DistributorActivationType })
  @IsOptional()
  @IsEnum(DistributorActivationType)
  tipo_ativacao?: string;

  @ApiPropertyOptional({ enum: DistributorActivationStatus })
  @IsOptional()
  @IsEnum(DistributorActivationStatus)
  status?: string;
}

export class DistributorPlanoAtualDTO {
  @ApiProperty()
  distribuidor_id: string;

  @ApiProperty()
  plano_distribuidor_id: string;

  @ApiProperty()
  plano_id: string;

  @ApiProperty()
  plano_nome: string;

  @ApiProperty()
  plano_tipo: string;

  @ApiProperty()
  plano_preco: number;

  @ApiProperty()
  status: string;

  @ApiProperty()
  data_ativacao: string;

  @ApiPropertyOptional()
  data_expiracao?: string;

  @ApiPropertyOptional()
  data_renovacao?: string;

  @ApiProperty()
  valor_pago: number;

  @ApiPropertyOptional()
  forma_pagamento?: string;

  @ApiProperty()
  pontos_ganhos: number;

  @ApiProperty()
  created_at: string;

  @ApiProperty()
  updated_at: string;
}

export class DistributorQualificacaoAtualDTO {
  @ApiProperty()
  distribuidor_id: string;

  @ApiProperty()
  qualificacao_historico_id: string;

  @ApiProperty()
  qualificacao_id: string;

  @ApiProperty()
  qualificacao_nome: string;

  @ApiProperty()
  qualificacao_codigo: string;

  @ApiProperty()
  qualificacao_nivel: number;

  @ApiProperty()
  data_inicio: string;

  @ApiPropertyOptional()
  data_fim?: string;

  @ApiProperty()
  is_active: boolean;

  @ApiProperty()
  created_at: string;
}