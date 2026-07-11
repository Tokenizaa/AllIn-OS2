import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsOptional, IsNumber, IsString } from 'class-validator';

export enum CustomerPhoneType {
  CELULAR = 'celular',
  FIXO = 'fixo',
  COMERCIAL = 'comercial',
  WHATSAPP = 'whatsapp',
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

export enum CustomerAccountTitularType {
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

  @ApiProperty()
  principal: boolean;

  @ApiProperty()
  verificado: boolean;

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
  customer_id?: string;

  @ApiPropertyOptional({ enum: CustomerPhoneType })
  @IsOptional()
  @IsEnum(CustomerPhoneType)
  tipo?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  numero__contem?: string;
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

  @ApiProperty()
  principal: boolean;

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
  customer_id?: string;

  @ApiPropertyOptional({ enum: CustomerAddressType })
  @IsOptional()
  @IsEnum(CustomerAddressType)
  tipo?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  cep?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  cidade__contem?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  uf?: string;
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

  @ApiProperty({ enum: CustomerAccountTitularType })
  tipo_titular: string;

  @ApiPropertyOptional()
  titular_nome?: string;

  @ApiPropertyOptional()
  titular_documento?: string;

  @ApiPropertyOptional()
  chave_pix?: string;

  @ApiProperty()
  ativa: boolean;

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
  customer_id?: string;

  @ApiPropertyOptional({ enum: CustomerAccountType })
  @IsOptional()
  @IsEnum(CustomerAccountType)
  tipo?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  ativa?: boolean;
}

export class CustomerAuthTokenDTO {
  @ApiProperty()
  id: string;

  @ApiProperty()
  customer_id: string;

  @ApiProperty()
  token_hash: string;

  @ApiProperty({ enum: ['login', 'api', 'reset_password'] })
  token_type: string;

  @ApiProperty()
  expires_at: string;

  @ApiPropertyOptional()
  used_at?: string;

  @ApiPropertyOptional()
  ip_address?: string;

  @ApiPropertyOptional()
  user_agent?: string;

  @ApiProperty()
  revoked: boolean;

  @ApiPropertyOptional()
  metadata?: Record<string, any>;

  @ApiProperty()
  created_at: string;
}

export class CustomerAuthTokenFilterDTO {
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
  customer_id?: string;

  @ApiPropertyOptional({ enum: ['login', 'api', 'reset_password'] })
  @IsOptional()
  @IsEnum(['login', 'api', 'reset_password'])
  token_type?: string;
}