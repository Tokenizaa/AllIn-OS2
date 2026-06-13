/**
 * Store Products Repository
 * 
 * Repository para operações de database relacionadas a produtos em lojas.
 */

import { BaseRepository, BaseEntity } from '../../../shared/infrastructure/repository/base.repository';

export interface StoreProductAssignment extends BaseEntity {
  product_id: string;
  product_name: string;
  store_id: number;
  store_name: string;
  enabled: boolean;
  enabled_at: Date;
  disabled_at?: Date | null;
  enabled_by: string;
  disabled_by?: string | null;
  reason: string;
}

export class StoreProductAssignmentRepository extends BaseRepository<StoreProductAssignment> {
  constructor() {
    super('store_product_assignments', 'commerce');
  }

  /**
   * Busca atribuições por produto
   */
  async findByProductId(productId: string): Promise<StoreProductAssignment[]> {
    return this.findAll({
      filters: { product_id: productId },
    });
  }

  /**
   * Busca atribuições por loja
   */
  async findByStoreId(storeId: number): Promise<StoreProductAssignment[]> {
    return this.findAll({
      filters: { store_id: storeId },
    });
  }

  /**
   * Busca atribuições ativas por loja
   */
  async findActiveByStoreId(storeId: number): Promise<StoreProductAssignment[]> {
    return this.findAll({
      filters: { store_id: storeId, enabled: true },
    });
  }

  /**
   * Habilita produto em loja
   */
  async enableProductInStore(
    productId: string,
    storeId: number,
    productName: string,
    storeName: string,
    enabledBy: string,
    reason: string
  ): Promise<StoreProductAssignment> {
    // Verifica se já existe atribuição
    const existing = await this.findByProductId(productId);
    const existingAssignment = existing.find(a => a.store_id === storeId);

    if (existingAssignment) {
      // Reabilita se existir
      return this.update(existingAssignment.id, {
        enabled: true,
        enabled_at: new Date(),
        disabled_at: null,
        disabled_by: null,
        enabled_by: enabledBy,
        reason,
      });
    }

    // Cria nova atribuição
    return this.create({
      product_id: productId,
      product_name: productName,
      store_id: storeId,
      store_name: storeName,
      enabled: true,
      enabled_at: new Date(),
      enabled_by: enabledBy,
      reason,
    });
  }

  /**
   * Desabilita produto em loja
   */
  async disableProductInStore(
    productId: string,
    storeId: number,
    disabledBy: string,
    reason: string
  ): Promise<StoreProductAssignment> {
    const existing = await this.findByProductId(productId);
    const existingAssignment = existing.find(a => a.store_id === storeId);

    if (!existingAssignment) {
      throw new Error('Product not assigned to this store');
    }

    return this.update(existingAssignment.id, {
      enabled: false,
      disabled_at: new Date(),
      disabled_by: disabledBy,
      reason,
    });
  }

  /**
   * Busca disponibilidade de produto em lojas
   */
  async getProductStoreAvailability(productId: string): Promise<{
    product_id: string;
    product_name: string;
    available_stores: number[];
    all_stores: number[];
  }> {
    const assignments = await this.findByProductId(productId);
    const availableStores = assignments
      .filter(a => a.enabled)
      .map(a => a.store_id);
    const allStores = assignments.map(a => a.store_id);

    if (assignments.length === 0) {
      return {
        product_id: productId,
        product_name: '',
        available_stores: [],
        all_stores: [],
      };
    }

    return {
      product_id: productId,
      product_name: assignments[0].product_name,
      available_stores,
      all_stores,
    };
  }
}
