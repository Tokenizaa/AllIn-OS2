/**
 * Customer Sub-Resource DTOs
 * For endpoints: /v1/clientes/Telefones, /v1/clientes/Enderecos, /v1/clientes/Contas, /v1/clientes/TokenLogin
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsEnum, IsDateString, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export enum CustomerPhoneType {
  CELULAR = 'celular',
  FIXO = 'fixo',
  COMERCIAL = 'comercial',
  WHATSAPP = 'whatsapp',
  RECADO = 'recado',
}

export enum CustomerAddressType {
  RESIDENCIAL = 'residencial',
  COMERCIAL = 'comercial',
  ENTREGA = 'entrega',
  COBRANCA = 'cobranca',
}

export enum CustomerAccountType {
  CORRENTE = 'corrente',
  POUPANCA = 'poupanca',
  PAGAMENTO = 'pagamento',
  SALDO = 'saldo',
}

export enum CustomerAccountHolderType {
  FISICA = 'fisica',
  JURIDICA = 'juridica',
}

export class CustomerPhoneDTO {
  @ApiProperty()
  id: string;

  @ApiProperty()
  customer_id: string;

  @ApiProperty({ enum: CustomerPhoneType })
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

export class CustomerPhoneFilterDTO {
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
  cliente_id?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  telefone__contem?: string;
}

export class CustomerAddressDTO {
  @ApiProperty()
  id: string;

  @ApiProperty()
  customer_id: string;

  @ApiProperty({ enum: CustomerAddressType })
  tipo: string;

  @ApiPropertyOptional()
  cep?: string;

  @ApiPropertyOptional()
  logradouro?: string;

  @ApiPropertyOptional()
  numero?: string;

  @ApiPropertyOptional()
  complemento?: string;

  @ApiPropertyOptional()
  bairro?: string;

  @ApiPropertyOptional()
  cidade?: string;

  @ApiPropertyOptional()
  uf?: string;

  @ApiPropertyOptional()
  pais_id?: number;

  @ApiPropertyOptional()
  principal?: boolean;

  @ApiPropertyOptional()
  metadata?: Record<string, any>;

  @ApiProperty()
  created_at: string;

  @ApiProperty()
  updated_at: string;
}

export class CustomerAddressFilterDTO {
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
  cliente_id?: string;

  @ApiPropertyOptional({ enum: CustomerAddressType })
  @IsOptional()
  @IsEnum(CustomerAddressType)
  tipo?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  cep__contem?: string;
}

export class CustomerAccountDTO {
  @ApiProperty()
  id: string;

  @ApiProperty()
  customer_id: string;

  @ApiProperty({ enum: CustomerAccountType })
  tipo: string;

  @ApiPropertyOptional()
  banco_id?: string;

  @ApiPropertyOptional()
  agencia?: string;

  @ApiPropertyOptional()
  conta?: string;

  @ApiPropertyOptional()
  digito_conta?: string;

  @ApiProperty({ enum: CustomerAccountHolderType })
  tipo_titular: string;

  @ApiPropertyOptional()
  titular_nome?: string;

  @ApiPropertyOptional()
  titular_documento?: string;

  @ApiPropertyOptional()
  chave_pix?: string;

  @ApiPropertyOptional()
  ativa?: boolean;

  @ApiPropertyOptional()
  metadata?: Record<string, any>;

  @ApiProperty()
  created_at: string;

  @ApiProperty()
  updated_at: string;
}

export class CustomerAccountFilterDTO {
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
  cliente_id?: string;

  @ApiPropertyOptional({ enum: CustomerAccountType })
  @IsOptional()
  @IsEnum(CustomerAccountType)
  tipo?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  banco_id?: string;
}

export class CustomerTokenLoginRequestDTO {
  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsString()
  password: string;
}

export class CustomerTokenLoginResponseDTO {
  @ApiProperty()
  access_token: string;

  @ApiProperty()
  expires_in: number;

  @ApiProperty()
  token_type: string;
}