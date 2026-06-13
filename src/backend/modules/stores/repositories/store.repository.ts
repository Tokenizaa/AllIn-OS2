/**
 * Store Repository
 * 
 * Repository para operações de database relacionadas a lojas virtuais.
 */

import { BaseRepository, BaseEntity } from '../../../shared/infrastructure/repository/base.repository';

export interface Store extends BaseEntity {
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  banner?: string;
  theme?: {
    primary_color?: string;
    secondary_color?: string;
    accent_color?: string;
  };
  settings?: {
    allow_guest_checkout?: boolean;
    require_registration?: boolean;
    show_prices?: boolean;
    show_stock?: boolean;
    enable_wishlist?: boolean;
    enable_reviews?: boolean;
  };
  contact?: {
    email?: string;
    phone?: string;
    whatsapp?: string;
  };
  social?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
  seo?: {
    meta_title?: string;
    meta_description?: string;
    meta_keywords?: string;
  };
  active: boolean;
  store_id: number;
}

export class StoreRepository extends BaseRepository<Store> {
  constructor() {
    super('stores', 'commerce');
  }

  /**
   * Busca lojas ativas
   */
  async findActive(): Promise<Store[]> {
    return this.findAll({
      filters: { active: true },
    });
  }

  /**
   * Busca lojas inativas
   */
  async findInactive(): Promise<Store[]> {
    return this.findAll({
      filters: { active: false },
    });
  }

  /**
   * Busca por slug
   */
  async findBySlug(slug: string): Promise<Store[]> {
    return this.findAll({
      filters: { slug },
    });
  }

  /**
   * Busca por store_id
   */
  async findByStoreId(storeId: number): Promise<Store[]> {
    return this.findAll({
      filters: { store_id: storeId },
    });
  }

  /**
   * Ativa loja
   */
  async activate(id: string): Promise<Store> {
    return this.update(id, { active: true });
  }

  /**
   * Desativa loja
   */
  async deactivate(id: string): Promise<Store> {
    return this.update(id, { active: false });
  }

  /**
   * Busca estatísticas
   */
  async getStats(): Promise<{
    total_stores: number;
    active_stores: number;
    inactive_stores: number;
    total_products: number;
    total_orders: number;
  }> {
    const [allStores, activeStores, inactiveStores] = await Promise.all([
      this.findAll(),
      this.findActive(),
      this.findInactive(),
    ]);

    // Simplificação: não temos acesso direto aos dados de produtos e pedidos
    // Em uma implementação real, isso seria feito através de queries específicas
    return {
      total_stores: allStores.length,
      active_stores: activeStores.length,
      inactive_stores: inactiveStores.length,
      total_products: 0,
      total_orders: 0,
    };
  }
}
