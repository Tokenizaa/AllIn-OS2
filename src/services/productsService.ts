import { supabase } from '../lib/supabase-client';
import { Product } from '../types/products';

/**
 * Products Service
 * MIGRATED: Now uses commerce.produtos table as single source of truth
 */
export const productsService = {
  /**
   * Get all products from Supabase
   */
  getAllProducts: async (): Promise<Product[]> => {
    const { data, error } = await supabase
      .schema('commerce')
      .from('produtos')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[productsService] Error fetching products:', error);
      throw error;
    }

    return (data || []).map(product => ({
      id: product.id,
      name: product.nome,
      category: product.categoria,
      price: product.preco?.toString() || '0',
      images: product.imagens || [],
      description: product.descricao,
      sku: product.sku,
      manufacturer: product.fabricante,
      stock: product.estoque || 0,
      is_active: product.status === 'active',
      metadata: product.metadata || {},
      created_at: product.created_at,
      updated_at: product.updated_at,
      // Legacy fields for backward compatibility
      linkProduto: product.metadata?.linkProduto,
      imgSrc: product.imagens?.[0],
      imgSrc2: product.imagens?.[1],
      caption: product.nome,
      caption2: product.descricao,
      promotion: product.metadata?.promotion,
      parcelasValor: product.metadata?.parcelasValor,
      produtoTag: product.metadata?.produtoTag,
      categorias: product.categoria,
    }));
  },

  /**
   * Get products by category
   */
  getProductsByCategory: async (categoryName: string): Promise<Product[]> => {
    const { data, error } = await supabase
      .schema('commerce')
      .from('produtos')
      .select('*')
      .eq('categoria', categoryName)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[productsService] Error fetching products by category:', error);
      throw error;
    }

    return (data || []).map(product => ({
      id: product.id,
      name: product.nome,
      category: product.categoria,
      price: product.preco?.toString() || '0',
      images: product.imagens || [],
      description: product.descricao,
      sku: product.sku,
      manufacturer: product.fabricante,
      stock: product.estoque || 0,
      is_active: product.status === 'active',
      metadata: product.metadata || {},
      created_at: product.created_at,
      updated_at: product.updated_at,
      // Legacy fields for backward compatibility
      linkProduto: product.metadata?.linkProduto,
      imgSrc: product.imagens?.[0],
      imgSrc2: product.imagens?.[1],
      caption: product.nome,
      caption2: product.descricao,
      promotion: product.metadata?.promotion,
      parcelasValor: product.metadata?.parcelasValor,
      produtoTag: product.metadata?.produtoTag,
      categorias: product.categoria,
    }));
  },

  /**
   * Get product by ID
   */
  getProductById: async (id: string): Promise<Product | undefined> => {
    const { data, error } = await supabase
      .schema('commerce')
      .from('produtos')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('[productsService] Error fetching product by ID:', error);
      return undefined;
    }

    if (!data) return undefined;

    return {
      id: data.id,
      name: data.nome,
      category: data.categoria,
      price: data.preco?.toString() || '0',
      images: data.imagens || [],
      description: data.descricao,
      sku: data.sku,
      manufacturer: data.fabricante,
      stock: data.estoque || 0,
      is_active: data.status === 'active',
      metadata: data.metadata || {},
      created_at: data.created_at,
      updated_at: data.updated_at,
      // Legacy fields for backward compatibility
      linkProduto: data.metadata?.linkProduto,
      imgSrc: data.imagens?.[0],
      imgSrc2: data.imagens?.[1],
      caption: data.nome,
      caption2: data.descricao,
      promotion: data.metadata?.promotion,
      parcelasValor: data.metadata?.parcelasValor,
      produtoTag: data.metadata?.produtoTag,
      categorias: data.categoria,
    };
  },

  /**
   * Get unique categories
   */
  getCategories: async (): Promise<string[]> => {
    const { data, error } = await supabase
      .schema('commerce')
      .from('produtos')
      .select('categoria')
      .not('categoria', 'is', null)
      .eq('status', 'active');

    if (error) {
      console.error('[productsService] Error fetching categories:', error);
      return [];
    }

    const categories = [...new Set((data || []).map(p => p.categoria).filter(Boolean))];
    return categories;
  },

  /**
   * Clear the cache (no longer needed with database)
   */
  clearCache: () => {
    // No-op - database doesn't need cache clearing
  },
};
