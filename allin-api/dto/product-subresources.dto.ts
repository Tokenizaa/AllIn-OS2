/**
 * Product Sub-Resource DTOs
 * For endpoints: /v1/produtos/Estoque, /v1/produtos/EstoqueTotais, /v1/produtos/OpcoesValores
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsString, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export class ProductStockDTO {
  @ApiProperty()
  id: string;

  @ApiProperty()
  produto_id: string;

  @ApiPropertyOptional()
  loja_id?: number;

  @ApiPropertyOptional()
  deposito?: string;

  @ApiProperty()
  quantidade: number;

  @ApiProperty()
  quantidade_reservada: number;

  @ApiProperty()
  quantidade_disponivel: number;

  @ApiProperty()
  quantidade_minima: number;

  @ApiPropertyOptional()
  quantidade_maxima?: number;

  @ApiPropertyOptional()
  localizacao?: string;

  @ApiPropertyOptional()
  lote?: string;

  @ApiPropertyOptional()
  validade?: string;

  @ApiPropertyOptional()
  custo_medio?: number;

  @ApiPropertyOptional()
  ultimo_inventario?: string;

  @ApiPropertyOptional()
  metadata?: Record<string, any>;

  @ApiProperty()
  created_at: string;

  @ApiProperty()
  updated_at: string;
}

export class ProductStockFilterDTO {
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
  produto_id?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  loja_id?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  deposito?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  quantidade_disponivel__maior_igual?: number;
}

export class ProductStockTotalDTO {
  @ApiProperty()
  id: string;

  @ApiProperty()
  produto_id: string;

  @ApiProperty()
  quantidade_total: number;

  @ApiProperty()
  quantidade_reservada_total: number;

  @ApiProperty()
  quantidade_disponivel_total: number;

  @ApiProperty()
  quantidade_em_transito: number;

  @ApiProperty()
  quantidade_em_separacao: number;

  @ApiProperty()
  valor_estoque_total: number;

  @ApiPropertyOptional()
  custo_medio_ponderado?: number;

  @ApiProperty()
  depositos_count: number;

  @ApiProperty()
  ultima_atualizacao: string;

  @ApiPropertyOptional()
  metadata?: Record<string, any>;
}

export class ProductStockTotalFilterDTO {
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
  produto_id?: string;
}

export class ProductOptionValueDTO {
  @ApiProperty()
  id: string;

  @ApiProperty()
  produto_id: string;

  @ApiProperty()
  opcao_id: string;

  @ApiPropertyOptional()
  campo_opcao_id?: string;

  @ApiProperty()
  valor: string;

  @ApiProperty()
  valor_adicional: number;

  @ApiProperty()
  peso_adicional: number;

  @ApiPropertyOptional()
  sku_adicional?: string;

  @ApiPropertyOptional()
  imagem?: string;

  @ApiProperty()
  ordem: number;

  @ApiProperty()
  ativo: boolean;

  @ApiPropertyOptional()
  metadata?: Record<string, any>;

  @ApiProperty()
  created_at: string;

  @ApiProperty()
  updated_at: string;
}

export class ProductOptionValueFilterDTO {
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
  produto_id?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  opcao_id?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  campo_opcao_id?: string;
}