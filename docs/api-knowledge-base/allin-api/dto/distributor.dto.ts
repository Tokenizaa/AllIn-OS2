/**
 * Distributor DTOs
 * Based on API documentation from 01-geral.md and related files
 */

import { IsNumber, IsString, IsOptional, IsEmail, IsISO8601 } from 'class-validator';

export class DistributorDTO {
  @IsNumber()
  id: number;

  @IsString()
  codigo: string;

  @IsString()
  nome: string;

  @IsString()
  usuario: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  telefone?: string;

  @IsString()
  cpf: string;

  @IsString()
  status: string;

  @IsOptional()
  @IsISO8601()
  data_ativacao?: string;

  @IsOptional()
  @IsNumber()
  id_patrocinador?: number;

  @IsOptional()
  @IsString()
  codigo_patrocinador?: string;

  @IsOptional()
  @IsNumber()
  id_plano?: number;

  @IsOptional()
  @IsString()
  nome_plano?: string;

  @IsOptional()
  @IsString()
  nivel_qualificacao?: string;

  @IsISO8601()
  data_cadastro: string;

  @IsISO8601()
  data_atualizacao: string;
}

export class DistributorFilterDTO {
  @IsOptional()
  @IsNumber()
  limit?: number;

  @IsOptional()
  @IsNumber()
  page?: number;

  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  nome__contem?: string;

  @IsOptional()
  @IsString()
  usuario__contem?: string;

  @IsOptional()
  @IsString()
  status?: string;
}
