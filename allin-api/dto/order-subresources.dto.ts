/**
 * Order Sub-Resource DTOs
 * For endpoints: 
 * - /v1/pedidos/Historico
 * - /v1/pedidos/Itens/KitItens
 * - /v1/pedidos/ItensFaturamento
 * - /v1/pedidos/Transportes
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsString, IsEnum, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export enum OrderHistoryOrigin {
  SISTEMA = 'sistema',
  MANUAL = 'manual',
  API = 'api',
  MARKETPLACE = 'marketplace',
}

export class OrderHistoryDTO {
  @ApiProperty()
  id: string;

  @ApiProperty()
  pedido_id: string;

  @ApiPropertyOptional()
  status_anterior?: string;

  @ApiProperty()
  status_novo: string;

  @ApiPropertyOptional()
  status_descricao?: string;

  @ApiPropertyOptional()
  motivo?: string;

  @ApiPropertyOptional()
  usuario_id?: string;

  @ApiPropertyOptional()
  usuario_nome?: string;

  @ApiPropertyOptional()
  comentario?: string;

  @ApiProperty({ enum: OrderHistoryOrigin })
  origem: string;

  @ApiProperty()
  automatico: boolean;

  @ApiPropertyOptional()
  ip_address?: string;

  @ApiPropertyOptional()
  metadata?: Record<string, any>;

  @ApiProperty()
  created_at: string;
}

export class OrderHistoryFilterDTO {
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
  pedido_id?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  status_novo?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  usuario_id?: string;
}

export class OrderKitItemDTO {
  @ApiProperty()
  id: string;

  @ApiProperty()
  pedido_id: string;

  @ApiPropertyOptional()
  pedido_item_id?: string;

  @ApiProperty()
  produto_id: string;

  @ApiPropertyOptional()
  produto_nome?: string;

  @ApiProperty()
  quantidade: number;

  @ApiProperty()
  preco_unitario: number;

  @ApiProperty()
  preco_total: number;

  @ApiProperty()
  obrigatorio: boolean;

  @ApiProperty()
  enviado: boolean;

  @ApiPropertyOptional()
  metadata?: Record<string, any>;

  @ApiProperty()
  created_at: string;

  @ApiProperty()
  updated_at: string;
}

export class OrderKitItemFilterDTO {
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
  pedido_id?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  pedido_item_id?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  produto_id?: string;
}

export class OrderBillingItemDTO {
  @ApiProperty()
  id: string;

  @ApiProperty()
  pedido_id: string;

  @ApiPropertyOptional()
  pedido_item_id?: string;

  @ApiPropertyOptional()
  nfe_id?: string;

  @ApiPropertyOptional()
  nfe_numero?: string;

  @ApiPropertyOptional()
  nfe_serie?: string;

  @ApiPropertyOptional()
  nfe_chave_acesso?: string;

  @ApiPropertyOptional()
  cfop?: string;

  @ApiPropertyOptional()
  ncm?: string;

  @ApiPropertyOptional()
  cest?: string;

  @ApiProperty()
  quantidade: number;

  @ApiProperty()
  unidade: string;

  @ApiProperty()
  valor_unitario: number;

  @ApiProperty()
  valor_total: number;

  @ApiProperty()
  valor_desconto: number;

  @ApiProperty()
  valor_frete: number;

  @ApiProperty()
  valor_seguro: number;

  @ApiProperty()
  valor_outros: number;

  @ApiPropertyOptional()
  icms_cst?: string;

  @ApiPropertyOptional()
  icms_aliquota?: number;

  @ApiPropertyOptional()
  icms_valor?: number;

  @ApiPropertyOptional()
  ipi_cst?: string;

  @ApiPropertyOptional()
  ipi_aliquota?: number;

  @ApiPropertyOptional()
  ipi_valor?: number;

  @ApiPropertyOptional()
  pis_cst?: string;

  @ApiPropertyOptional()
  pis_aliquota?: number;

  @ApiPropertyOptional()
  pis_valor?: number;

  @ApiPropertyOptional()
  cofins_cst?: string;

  @ApiPropertyOptional()
  cofins_aliquota?: number;

  @ApiPropertyOptional()
  cofins_valor?: number;

  @ApiPropertyOptional()
  nfe_id?: string;

  @ApiPropertyOptional()
  nfe_item?: number;

  @ApiPropertyOptional()
  metadata?: Record<string, any>;

  @ApiProperty()
  created_at: string;

  @ApiProperty()
  updated_at: string;
}

export class OrderBillingItemFilterDTO {
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
  pedido_id?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  pedido_item_id?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  nfe_id?: string;
}

export enum OrderTransportStatus {
  AGUARDANDO_POSTAGEM = 'aguardando_postagem',
  POSTADO = 'postado',
  EM_TRANSITO = 'em_transito',
  ENTREGUE = 'entregue',
  DEVOLVIDO = 'devolvido',
  EXTRAVIADO = 'extraviado',
}

export enum OrderFreightType {
  CIF = 'cif',
  FOB = 'fob',
  GRATIS = 'gratis',
}

export class OrderTransportDTO {
  @ApiProperty()
  id: string;

  @ApiProperty()
  pedido_id: string;

  @ApiPropertyOptional()
  transportadora_id?: string;

  @ApiPropertyOptional()
  transportadora_nome?: string;

  @ApiPropertyOptional()
  servico?: string;

  @ApiPropertyOptional()
  codigo_rastreamento?: string;

  @ApiPropertyOptional()
  url_rastreamento?: string;

  @ApiProperty({ enum: OrderFreightType })
  frete_tipo: string;

  @ApiProperty()
  frete_valor: number;

  @ApiPropertyOptional()
  frete_prazo_dias?: number;

  @ApiPropertyOptional()
  peso_total?: number;

  @ApiPropertyOptional()
  volume_total?: number;

  @ApiProperty()
  volumes: number;

  @ApiPropertyOptional()
  data_postagem?: string;

  @ApiPropertyOptional()
  data_entrega_prevista?: string;

  @ApiPropertyOptional()
  data_entrega_real?: string;

  @ApiProperty({ enum: OrderTransportStatus })
  status: string;

  @ApiPropertyOptional()
  observacoes?: string;

  @ApiPropertyOptional()
  metadata?: Record<string, any>;

  @ApiProperty()
  created_at: string;

  @ApiProperty()
  updated_at: string;
}

export class OrderTransportFilterDTO {
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
  pedido_id?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  transportadora_id?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  codigo_rastreamento?: string;

  @ApiPropertyOptional({ enum: OrderTransportStatus })
  @IsOptional()
  @IsEnum(OrderTransportStatus)
  status?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  servico?: string;
}

export class OrderTotalsDTO {
  @ApiProperty()
  pedido_id: string;

  @ApiPropertyOptional()
  numero_pedido?: string;

  @ApiPropertyOptional()
  distribuidor_comprador_id?: string;

  @ApiPropertyOptional()
  cliente_id?: string;

  @ApiProperty()
  valor_total: number;

  @ApiProperty()
  total_itens: number;

  @ApiProperty()
  total_quantidade_itens: number;

  @ApiProperty()
  total_itens_distintos: number;

  @ApiProperty()
  total_pagamentos: number;

  @ApiProperty()
  total_frete: number;

  @ApiProperty()
  total_desconto: number;

  @ApiProperty()
  status_pedido: string;

  @ApiProperty()
  pagamento_confirmado: boolean;

  @ApiProperty()
  data_criacao: string;

  @ApiPropertyOptional()
  data_pagamento?: string;

  @ApiProperty()
  data_modificado: string;
}