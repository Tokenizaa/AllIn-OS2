/**
 * Network DTOs
 * Based on API documentation from 07-rede-binaria.md and 58-rede-linear-nos.md
 */

import { IsNumber, IsString, IsOptional } from 'class-validator';

export class NetworkDTO {
  @IsNumber()
  distribuidor_id: number;

  @IsString()
  distribuidor_codigo: string;

  @IsNumber()
  total_downlines: number;

  @IsNumber()
  active_downlines: number;

  @IsNumber()
  depth: number;

  @IsNumber()
  left_volume: number;

  @IsNumber()
  right_volume: number;

  @IsNumber()
  left_leg_count: number;

  @IsNumber()
  right_leg_count: number;
}

export class NetworkNodeDTO {
  @IsNumber()
  id: number;

  @IsNumber()
  distribuidor_id: number;

  @IsString()
  distribuidor_codigo: string;

  @IsString()
  distribuidor_nome: string;

  @IsOptional()
  @IsNumber()
  parent_id?: number;

  @IsOptional()
  @IsString()
  leg?: 'LEFT' | 'RIGHT';

  @IsNumber()
  position: number;

  @IsNumber()
  depth: number;

  @IsNumber()
  left_volume: number;

  @IsNumber()
  right_volume: number;

  @IsNumber()
  active_downlines: number;

  @IsNumber()
  total_downlines: number;
}

export class LinearNetworkNodeDTO {
  @IsNumber()
  id: number;

  @IsNumber()
  linha: number;

  @IsNumber()
  posicao_relativa: number;

  @IsNumber()
  id_distribuidor: number;

  @IsString()
  usuario_distribuidor: string;

  @IsOptional()
  @IsNumber()
  id_patrocinador?: number;

  @IsOptional()
  @IsString()
  usuario_patrocinador?: string;
}

export class NetworkFilterDTO {
  @IsOptional()
  @IsNumber()
  limit?: number;

  @IsOptional()
  @IsNumber()
  page?: number;

  @IsOptional()
  @IsString()
  leg?: 'LEFT' | 'RIGHT';
}

export class LinearNetworkFilterDTO {
  @IsOptional()
  @IsNumber()
  limit?: number;

  @IsOptional()
  @IsNumber()
  page?: number;

  @IsOptional()
  @IsNumber()
  linha?: number;

  @IsOptional()
  @IsNumber()
  posicao_relativa?: number;

  @IsOptional()
  @IsNumber()
  id_distribuidor?: number;

  @IsOptional()
  @IsNumber()
  id_patrocinador?: number;

  @IsOptional()
  @IsString()
  usuario_distribuidor?: string;

  @IsOptional()
  @IsString()
  usuario_patrocinador?: string;
}
