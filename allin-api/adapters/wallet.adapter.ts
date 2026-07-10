/**
 * Wallet Adapter
 * Transforms raw API responses into domain entities
 */

import { WalletDTO, TransactionDTO } from '../dto/wallet.dto';

export interface WalletEntity {
  id: number;
  distributorId: number;
  distributorCode: string;
  balance: number;
  availableBalance: number;
  pendingBalance: number;
  totalWithdrawn: number;
  totalDeposited: number;
  currency: string;
  lastTransactionAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface TransactionEntity {
  id: number;
  walletId: number;
  distributorId: number;
  type: string;
  amount: number;
  description: string;
  status: string;
  processedAt?: Date;
  createdAt: Date;
}

export class WalletAdapter {
  static toEntity(dto: WalletDTO): WalletEntity {
    return {
      id: dto.id,
      distributorId: dto.distribuidor_id,
      distributorCode: dto.distribuidor_codigo,
      balance: dto.saldo,
      availableBalance: dto.saldo_disponivel,
      pendingBalance: dto.saldo_pendente,
      totalWithdrawn: dto.total_sacado,
      totalDeposited: dto.total_depositado,
      currency: dto.moeda,
      lastTransactionAt: dto.ultima_transacao ? new Date(dto.ultima_transacao) : undefined,
      createdAt: new Date(dto.data_cadastro),
      updatedAt: new Date(dto.data_atualizacao),
    };
  }

  static toDTO(entity: WalletEntity): WalletDTO {
    return {
      id: entity.id,
      distribuidor_id: entity.distributorId,
      distribuidor_codigo: entity.distributorCode,
      saldo: entity.balance,
      saldo_disponivel: entity.availableBalance,
      saldo_pendente: entity.pendingBalance,
      total_sacado: entity.totalWithdrawn,
      total_depositado: entity.totalDeposited,
      moeda: entity.currency,
      ultima_transacao: entity.lastTransactionAt?.toISOString(),
      data_cadastro: entity.createdAt.toISOString(),
      data_atualizacao: entity.updatedAt.toISOString(),
    };
  }

  static toTransactionEntity(dto: TransactionDTO): TransactionEntity {
    return {
      id: dto.id,
      walletId: dto.carteira_id,
      distributorId: dto.distribuidor_id,
      type: dto.tipo,
      amount: dto.valor,
      description: dto.descricao,
      status: dto.status,
      processedAt: dto.data_processamento ? new Date(dto.data_processamento) : undefined,
      createdAt: new Date(dto.data_cadastro),
    };
  }

  static toTransactionDTO(entity: TransactionEntity): TransactionDTO {
    return {
      id: entity.id,
      carteira_id: entity.walletId,
      distribuidor_id: entity.distributorId,
      tipo: entity.type,
      valor: entity.amount,
      descricao: entity.description,
      status: entity.status,
      data_processamento: entity.processedAt?.toISOString(),
      data_cadastro: entity.createdAt.toISOString(),
    };
  }
}
