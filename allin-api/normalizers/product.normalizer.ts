/**
 * Product Normalizer
 * Sanitizes and validates product data from the API
 */

import { z } from 'zod';

const ProductSchema = z.object({
  id: z.number(),
  modelo: z.string().min(1),
  ncm: z.string(),
  preco: z.number().min(0),
  e_plano: z.boolean(),
  upgrade_plano: z.boolean(),
  recompra_plano: z.boolean(),
  renovacao_plano: z.boolean(),
  ativacao: z.boolean(),
  e_visivel: z.boolean(),
  requer_frete: z.boolean(),
  peso: z.number().optional(),
  quantidade: z.number().min(0),
  quantidade_minima: z.number().min(0),
  data_cadastro: z.string().datetime(),
  data_atualizacao: z.string().datetime(),
});

export class ProductNormalizer {
  static normalize(data: any): any {
    try {
      const sanitized = this.sanitize(data);
      const validated = ProductSchema.parse(sanitized);
      return this.enrich(validated);
    } catch (error) {
      throw new Error(`Invalid product data: ${error.message}`);
    }
  }

  private static sanitize(data: any): any {
    return {
      id: Number(data.id),
      modelo: String(data.modelo || '').trim(),
      ncm: String(data.ncm || '').trim(),
      preco: Number(data.preco || 0),
      e_plano: Boolean(data.e_plano),
      upgrade_plano: Boolean(data.upgrade_plano),
      recompra_plano: Boolean(data.recompra_plano),
      renovacao_plano: Boolean(data.renovacao_plano),
      ativacao: Boolean(data.ativacao),
      e_visivel: Boolean(data.e_visivel),
      requer_frete: Boolean(data.requer_frete),
      peso: data.peso ? Number(data.peso) : undefined,
      quantidade: Number(data.quantidade || 0),
      quantidade_minima: Number(data.quantidade_minima || 0),
      data_cadastro: data.data_cadastro,
      data_atualizacao: data.data_atualizacao,
    };
  }

  private static enrich(data: any): any {
    // Add computed fields
    const isAvailable = data.e_visivel && data.quantidade > 0;
    const isLowStock = data.quantidade > 0 && data.quantidade <= data.quantidade_minima * 2;
    const isOutOfStock = data.quantidade === 0;
    const isPlanProduct = data.e_plano || data.upgrade_plano || data.recompra_plano || data.renovacao_plano;

    return {
      ...data,
      isAvailable,
      isLowStock,
      isOutOfStock,
      isPlanProduct,
      stockStatus: this.getStockStatus(data.quantidade, data.quantidade_minima),
      productType: this.getProductType(data),
    };
  }

  private static getStockStatus(quantity: number, minQuantity: number): 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' {
    if (quantity === 0) return 'OUT_OF_STOCK';
    if (quantity <= minQuantity * 2) return 'LOW_STOCK';
    return 'IN_STOCK';
  }

  private static getProductType(data: any): string {
    if (data.ativacao) return 'ACTIVATION';
    if (data.upgrade_plano) return 'UPGRADE';
    if (data.renovacao_plano) return 'RENEWAL';
    if (data.recompra_plano) return 'REPURCHASE';
    if (data.e_plano) return 'PLAN';
    return 'PRODUCT';
  }
}
