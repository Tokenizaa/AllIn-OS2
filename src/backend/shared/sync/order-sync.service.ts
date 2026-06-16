/**
 * Order Sync Service
 * 
 * Serviço para sync de pedidos da API Allin.
 */

import { BaseSyncService } from './base-sync.service';
import { allinService } from '../allin/allin.service';
import { OrderMapper, LocalOrder } from './mappers/order.mapper';
import { SyncResult } from './dto/sync-result.dto';
import { OrderRepository } from '../../modules/orders/repositories/order.repository';

export class OrderSyncService extends BaseSyncService<LocalOrder> {
  private orderRepository: OrderRepository;

  constructor(config?: { batchSize?: number; maxRetries?: number; retryDelayMs?: number }) {
    super(config);
    this.orderRepository = new OrderRepository();
  }

  /**
   * Obtém nome da entidade
   */
  protected getEntityName(): string {
    return 'orders';
  }

  /**
   * Mapeia dados da API Allin para entidade local
   */
  protected mapFromAllin(data: any): LocalOrder {
    return OrderMapper.fromAllin(data);
  }

  /**
   * Executa sync de pedidos
   */
  public async sync(params?: { incremental?: boolean; since?: Date }): Promise<SyncResult> {
    const result = this.createSyncResult();
    
    try {
      console.log('[OrderSync] Starting sync...');
      
      // Busca pedidos da API Allin
      const allinOrders = await this.executeWithRetry(
        () => allinService.getPedidos(),
        'Fetch orders from AllIn'
      );
      
      console.log(`[OrderSync] Fetched ${allinOrders.length} orders from AllIn`);
      
      // Converte para formato local
      const localOrders = OrderMapper.fromAllinArray(allinOrders);
      
      // Processa todos os pedidos
      await this.processAllBatches(
        localOrders,
        async (order) => await this.processOrder(order, params),
        result
      );
      
      console.log(`[OrderSync] Sync completed: ${result.processedRecords} processed, ${result.failedRecords} failed`);
      
    } catch (error) {
      this.addError(result, undefined, 'Sync failed', error as Error);
      console.error('[OrderSync] Sync failed:', error);
    }
    
    return this.finalizeSyncResult(result);
  }

  /**
   * Processa um pedido individual
   */
  private async processOrder(
    order: LocalOrder,
    params?: { incremental?: boolean; since?: Date }
  ): Promise<void> {
    try {
      // Verifica se pedido já existe localmente pelo allin_id (usando metadata)
      const existing = await this.orderRepository.findAll({
        filters: { metadata: { allin_id: order.allin_id } },
      });
      
      if (existing.length > 0) {
        // Atualiza pedido existente
        const localOrder = existing[0];
        
        // Verifica se precisa de sync (para sync incremental)
        if (params?.incremental && params.since) {
          const syncThreshold = 5 * 60 * 1000; // 5 minutos
          const timeSinceLastSync = Date.now() - order.allin_synced_at.getTime();
          
          if (timeSinceLastSync < syncThreshold) {
            // Não precisa de sync, skip
            return;
          }
        }
        
        await this.orderRepository.update(localOrder.id, {
          comprador: order.cliente_nome || localOrder.comprador,
          usuario: order.cliente_email || localOrder.usuario,
          status: order.status || localOrder.status,
          valor_total: order.valor_total || localOrder.valor_total,
          pedido_pago: order.pagamento_confirmado ? 'pago' : localOrder.pedido_pago,
          loja: order.loja_nome || localOrder.loja,
          user_id: order.distribuidor_comprador_id ? String(order.distribuidor_comprador_id) : localOrder.user_id,
          informacoes_produtos: JSON.stringify({
            cliente_logradouro: order.cliente_logradouro,
            cliente_bairro: order.cliente_bairro,
            cliente_cep: order.cliente_cep,
            cliente_cidade: order.cliente_cidade,
            cliente_uf: order.cliente_uf,
            entrega_nome: order.entrega_nome,
            entrega_logradouro: order.entrega_logradouro,
            entrega_bairro: order.entrega_bairro,
            entrega_cep: order.entrega_cep,
            entrega_cidade: order.entrega_cidade,
            entrega_uf: order.entrega_uf,
            comentario: order.comentario,
          }),
          pagamentos: JSON.stringify({
            data_pagamento: order.data_pagamento,
            pagamento_confirmado: order.pagamento_confirmado,
          }),
        });
        
        console.log(`[OrderSync] Updated order ${order.allin_id}`);
      } else {
        // Cria novo pedido
        await this.orderRepository.create({
          comprador: order.cliente_nome,
          usuario: order.cliente_email,
          status: order.status || 'pending',
          valor_total: order.valor_total || 0,
          pedido_pago: order.pagamento_confirmado ? 'pago' : 'pendente',
          loja: order.loja_nome,
          user_id: order.distribuidor_comprador_id ? String(order.distribuidor_comprador_id) : undefined,
          informacoes_produtos: JSON.stringify({
            cliente_logradouro: order.cliente_logradouro,
            cliente_bairro: order.cliente_bairro,
            cliente_cep: order.cliente_cep,
            cliente_cidade: order.cliente_cidade,
            cliente_uf: order.cliente_uf,
            entrega_nome: order.entrega_nome,
            entrega_logradouro: order.entrega_logradouro,
            entrega_bairro: order.entrega_bairro,
            entrega_cep: order.entrega_cep,
            entrega_cidade: order.entrega_cidade,
            entrega_uf: order.entrega_uf,
            comentario: order.comentario,
          }),
          pagamentos: JSON.stringify({
            data_pagamento: order.data_pagamento,
            pagamento_confirmado: order.pagamento_confirmado,
          }),
        });
        console.log(`[OrderSync] Created order ${order.allin_id}`);
      }
    } catch (error) {
      console.error(`[OrderSync] Failed to process order ${order.allin_id}:`, error);
      throw error;
    }
  }

  /**
   * Sync incremental de pedidos
   */
  public async syncIncremental(since: Date): Promise<SyncResult> {
    return this.sync({ incremental: true, since });
  }
}
