/**
 * Product DTOs
 * Based on API documentation from 54-produtos.md
 */

import { IsNumber, IsString, IsOptional, IsBoolean, IsISO8601 } from 'class-validator';

export class ProductDTO {
  @IsNumber()
  id: number;

  @IsString()
  modelo: string;

  @IsString()
  ncm: string;

  @IsNumber()
  preco: number;

  @IsBoolean()
  e_plano: boolean;

  @IsBoolean()
  upgrade_plano: boolean;

  @IsBoolean()
  recompra_plano: boolean;

  @IsBoolean()
  renovacao_plano: boolean;

  @IsBoolean()
  ativacao: boolean;

  @IsBoolean()
  e_visivel: boolean;

  @IsBoolean()
  requer_frete: boolean;

  @IsOptional()
  @IsNumber()
  peso?: number;

  @IsNumber()
  quantidade: number;

  @IsNumber()
  quantidade_minima: number;

  @IsISO8601()
  data_cadastro: string;

  @IsISO8601()
  data_atualizacao: string;
}

export class ProductFilterDTO {
  @IsOptional()
  @IsNumber()
  limit?: number;

  @IsOptional()
  @IsNumber()
  page?: number;

  @IsOptional()
  @IsBoolean()
  e_plano?: boolean;

  @IsOptional()
  @IsBoolean()
  e_visivel?: boolean;

  @IsOptional()
  @IsString()
  modelo__contem?: string;

  @IsOptional()
  @IsString()
  order_by?: string;
}
