/**
 * Inventory Repository
 * 
 * Repository para operações de database relacionadas ao estoque.
 */

import { BaseRepository, BaseEntity, FindOptions, PaginatedResult, PaginationOptions } from '../../../shared/infrastructure/repository/base.repository';
import { supabase } from '../../../shared/infra/database/supabase';

export interface InventoryMovement extends BaseEntity {
  product_id: string;
  product_name: string;
  quantity: number;
  movement_type: 'in' | 'out' | 'adjustment' | 'transfer';
  reason: string;
  reference_id?: string;
  reference_type?: 'order' | 'purchase' | 'return' | 'adjustment' | 'transfer';
  previous_quantity: number;
  new_quantity: number;
  user_id: string;
  user_name: string;
  notes?: string;
}

export class InventoryMovementRepository extends BaseRepository<InventoryMovement> {
  constructor() {
    super('inventory_movements', 'commerce');
  }

  /**
   * Busca movimentações por produto
   */
  async findByProductId(productId: string, options?: FindOptions): Promise<InventoryMovement[]> {
    return this.findAll({
      ...options,
      filters: { product_id: productId, ...options?.filters },
    });
  }

  /**
   * Busca movimentações por tipo
   */
  async findByMovementType(movementType: string, options?: FindOptions): Promise<InventoryMovement[]> {
    return this.findAll({
      ...options,
      filters: { movement_type: movementType, ...options?.filters },
    });
  }

  /**
   * Busca movimentações por usuário
   */
  async findByUserId(userId: string, options?: FindOptions): Promise<InventoryMovement[]> {
    return this.findAll({
      ...options,
      filters: { user_id: userId, ...options?.filters },
    });
  }

  /**
   * Busca movimentações por período
   */
  async findByDateRange(startDate: Date, endDate: Date, options?: FindOptions): Promise<InventoryMovement[]> {
    const { data, error } = await this.executeQuery(
      supabase
        .from(this.tableName)
        .select('*')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())
        .is('deleted_at', null)
        .order('created_at', { ascending: false })
    );

    if (error) throw error;
    return data as InventoryMovement[];
  }

  /**
   * Busca movimentações recentes
   */
  async findRecent(limit: number = 20): Promise<InventoryMovement[]> {
    const { data, error } = await this.executeQuery(
      supabase
        .from(this.tableName)
        .select('*')
        .is('deleted_at', null)
        .order('created_at', { ascending: false })
        .limit(limit)
    );

    if (error) throw error;
    return data as InventoryMovement[];
  }

  /**
   * Cria movimentação de estoque
   */
  async createMovement(movement: Omit<InventoryMovement, 'id' | 'created_at' | 'updated_at'>): Promise<InventoryMovement> {
    return this.create(movement);
  }

  /**
   * Busca resumo de estoque
   */
  async getInventorySummary(): Promise<{
    total_products: number;
    total_quantity: number;
    total_value: number;
    low_stock_count: number;
    out_of_stock_count: number;
  }> {
    const [productsResult, lowStockResult, outOfStockResult] = await Promise.all([
      this.executeQuery(
        supabase
          .schema('commerce')
          .from('produtos')
          .select('id, estoque, preco')
          .is('deleted_at', null)
      ),
      this.executeQuery(
        supabase
          .schema('commerce')
          .from('produtos')
          .select('id')
          .lt('estoque', supabase.raw('estoque_minimo'))
          .is('deleted_at', null)
      ),
      this.executeQuery(
        supabase
          .schema('commerce')
          .from('produtos')
          .select('id')
          .eq('estoque', 0)
          .is('deleted_at', null)
      ),
    ]);

    if (productsResult.error) throw productsResult.error;
    if (lowStockResult.error) throw lowStockResult.error;
    if (outOfStockResult.error) throw outOfStockResult.error;

    const products = productsResult.data || [];
    const totalQuantity = products.reduce((sum: number, p: any) => sum + (p.estoque || 0), 0);
    const totalValue = products.reduce((sum: number, p: any) => sum + ((p.estoque || 0) * Number(p.preco || 0)), 0);

    return {
      total_products: products.length,
      total_quantity,
      total_value,
      low_stock_count: lowStockResult.data?.length || 0,
      out_of_stock_count: outOfStockResult.data?.length || 0,
    };
  }
}

export interface InventoryAlert extends BaseEntity {
  product_id: string;
  product_name: string;
  current_quantity: number;
  minimum_quantity: number;
  alert_type: 'low_stock' | 'out_of_stock';
  alert_status: 'active' | 'resolved';
  resolved_at?: Date;
}

export class InventoryAlertRepository extends BaseRepository<InventoryAlert> {
  constructor() {
    super('inventory_alerts', 'commerce');
  }

  /**
   * Busca alertas ativos
   */
  async findActive(): Promise<InventoryAlert[]> {
    return this.findAll({
      filters: { alert_status: 'active' },
    });
  }

  /**
   * Busca alertas por produto
   */
  async findByProductId(productId: string): Promise<InventoryAlert[]> {
    return this.findAll({
      filters: { product_id: productId },
    });
  }

  /**
   * Busca alertas por tipo
   */
  async findByAlertType(alertType: string): Promise<InventoryAlert[]> {
    return this.findAll({
      filters: { alert_type: alertType },
    });
  }

  /**
   * Cria alerta de estoque
   */
  async createAlert(alert: Omit<InventoryAlert, 'id' | 'created_at' | 'updated_at'>): Promise<InventoryAlert> {
    return this.create(alert);
  }

  /**
   * Resolve alerta
   */
  async resolveAlert(id: string): Promise<InventoryAlert> {
    return this.update(id, {
      alert_status: 'resolved',
      resolved_at: new Date().toISOString(),
    });
  }

  /**
   * Verifica e cria alertas automaticamente
   */
  async checkAndCreateAlerts(): Promise<InventoryAlert[]> {
    const { data, error } = await this.executeQuery(
      supabase
        .schema('commerce')
        .from('produtos')
        .select('id, nome, estoque, estoque_minimo')
        .is('deleted_at', null)
    );

    if (error) throw error;

    const products = data || [];
    const createdAlerts: InventoryAlert[] = [];

    for (const product of products) {
      const currentQuantity = product.estoque || 0;
      const minimumQuantity = product.estoque_minimo || 0;

      // Verifica se já existe alerta ativo para este produto
      const existingAlerts = await this.findByProductId(product.id);
      const activeAlert = existingAlerts.find(a => a.alert_status === 'active');

      if (currentQuantity === 0 && !activeAlert) {
        // Cria alerta de estoque zerado
        const alert = await this.createAlert({
          product_id: product.id,
          product_name: product.nome,
          current_quantity,
          minimum_quantity,
          alert_type: 'out_of_stock',
          alert_status: 'active',
        });
        createdAlerts.push(alert);
      } else if (currentQuantity < minimumQuantity && currentQuantity > 0 && !activeAlert) {
        // Cria alerta de estoque baixo
        const alert = await this.createAlert({
          product_id: product.id,
          product_name: product.nome,
          current_quantity,
          minimum_quantity,
          alert_type: 'low_stock',
          alert_status: 'active',
        });
        createdAlerts.push(alert);
      } else if (currentQuantity >= minimumQuantity && activeAlert) {
        // Resolve alerta existente
        await this.resolveAlert(activeAlert.id);
      }
    }

    return createdAlerts;
  }
}
