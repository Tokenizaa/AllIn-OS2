/**
 * Wallet DTOs
 * Based on API documentation from 06-carteira.md
 */

import { IsNumber, IsString, IsOptional, IsISO8601 } from 'class-validator';

export class WalletDTO {
  @IsNumber()
  id: number;

  @IsNumber()
  distribuidor_id: number;

  @IsString()
  distribuidor_codigo: string;

  @IsNumber()
  saldo: number;

  @IsNumber()
  saldo_disponivel: number;

  @IsNumber()
  saldo_pendente: number;

  @IsNumber()
  total_sacado: number;

  @IsNumber()
  total_depositado: number;

  @IsString()
  moeda: string;

  @IsOptional()
  @IsISO8601()
  ultima_transacao?: string;

  @IsISO8601()
  data_cadastro: string;

  @IsISO8601()
  data_atualizacao: string;
}

export class TransactionDTO {
  @IsNumber()
  id: number;

  @IsNumber()
  carteira_id: number;

  @IsNumber()
  distribuidor_id: number;

  @IsString()
  tipo: string;

  @IsNumber()
  valor: number;

  @IsString()
  descricao: string;

  @IsString()
  status: string;

  @IsOptional()
  @IsISO8601()
  data_processamento?: string;

  @IsISO8601()
  data_cadastro: string;
}

export class WalletFilterDTO {
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
}
