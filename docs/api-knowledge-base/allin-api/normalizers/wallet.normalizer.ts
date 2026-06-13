/**
 * Wallet Normalizer
 * Sanitizes and validates wallet data from the API
 */

import { z } from 'zod';

const WalletSchema = z.object({
  id: z.number(),
  distribuidor_id: z.number(),
  distribuidor_codigo: z.string(),
  saldo: z.number(),
  saldo_disponivel: z.number(),
  saldo_pendente: z.number(),
  total_sacado: z.number(),
  total_depositado: z.number(),
  moeda: z.string(),
  ultima_transacao: z.string().datetime().optional(),
  data_cadastro: z.string().datetime(),
  data_atualizacao: z.string().datetime(),
});

const TransactionSchema = z.object({
  id: z.number(),
  carteira_id: z.number(),
  distribuidor_id: z.number(),
  tipo: z.string(),
  valor: z.number(),
  descricao: z.string(),
  status: z.string(),
  data_processamento: z.string().datetime().optional(),
  data_cadastro: z.string().datetime(),
});

export class WalletNormalizer {
  static normalize(data: any): any {
    try {
      const sanitized = this.sanitize(data);
      const validated = WalletSchema.parse(sanitized);
      return this.enrich(validated);
    } catch (error) {
      throw new Error(`Invalid wallet data: ${error.message}`);
    }
  }

  static normalizeTransaction(data: any): any {
    try {
      const sanitized = this.sanitizeTransaction(data);
      const validated = TransactionSchema.parse(sanitized);
      return this.enrichTransaction(validated);
    } catch (error) {
      throw new Error(`Invalid transaction data: ${error.message}`);
    }
  }

  private static sanitize(data: any): any {
    return {
      id: Number(data.id),
      distribuidor_id: Number(data.distribuidor_id),
      distribuidor_codigo: String(data.distribuidor_codigo || '').trim(),
      saldo: Number(data.saldo || 0),
      saldo_disponivel: Number(data.saldo_disponivel || 0),
      saldo_pendente: Number(data.saldo_pendente || 0),
      total_sacado: Number(data.total_sacado || 0),
      total_depositado: Number(data.total_depositado || 0),
      moeda: String(data.moeda || 'BRL').trim(),
      ultima_transacao: data.ultima_transacao || null,
      data_cadastro: data.data_cadastro,
      data_atualizacao: data.data_atualizacao,
    };
  }

  private static sanitizeTransaction(data: any): any {
    return {
      id: Number(data.id),
      carteira_id: Number(data.carteira_id),
      distribuidor_id: Number(data.distribuidor_id),
      tipo: String(data.tipo || '').trim(),
      valor: Number(data.valor || 0),
      descricao: String(data.descricao || '').trim(),
      status: String(data.status || '').trim(),
      data_processamento: data.data_processamento || null,
      data_cadastro: data.data_cadastro,
    };
  }

  private static enrich(data: any): any {
    // Add computed fields
    return {
      ...data,
      hasPendingBalance: data.saldo_pendente > 0,
      canWithdraw: data.saldo_disponivel > 0,
      totalTransactions: data.total_depositado + data.total_sacado,
    };
  }

  private static enrichTransaction(data: any): any {
    // Add computed fields
    const isCredit = data.tipo.toLowerCase().includes('credito') || data.valor > 0;
    const isDebit = data.tipo.toLowerCase().includes('debito') || data.valor < 0;
    const isProcessed = data.status === 'Processado' || !!data.data_processamento;

    return {
      ...data,
      isCredit,
      isDebit,
      isProcessed,
      absoluteValue: Math.abs(data.valor),
    };
  }
}
