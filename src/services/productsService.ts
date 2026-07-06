import { supabase } from '../lib/supabase/client';
import { Product } from '../types/products';

/**
 * Products Service
 * MIGRATED: Now uses Supabase products table as single source of truth
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
      nome: product.nome,
      category: product.category,
      price: product.price?.toString() || '0',
      images: product.images || [],
      description: product.description,
      sku: product.sku,
      manufacturer: product.manufacturer,
      stock: product.stock || 0,
      is_active: product.status === 'active',
      metadata: product.metadata || {},
      created_at: product.created_at,
      updated_at: product.updated_at,
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
      .eq('category', categoryName)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[productsService] Error fetching products by category:', error);
      throw error;
    }

    return (data || []).map(product => ({
      id: product.id,
      nome: product.nome,
      category: product.category,
      price: product.price?.toString() || '0',
      images: product.images || [],
      description: product.description,
      sku: product.sku,
      manufacturer: product.manufacturer,
      stock: product.stock || 0,
      is_active: product.status === 'active',
      metadata: product.metadata || {},
      created_at: product.created_at,
      updated_at: product.updated_at,
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
      nome: data.nome,
      category: data.category,
      price: data.price?.toString() || '0',
      images: data.images || [],
      description: data.description,
      sku: data.sku,
      manufacturer: data.manufacturer,
      stock: data.stock || 0,
      is_active: data.is_active ?? true,
      metadata: data.metadata || {},
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  },

  /**
   * Get unique categories
   */
  getCategories: async (): Promise<string[]> => {
    const { data, error } = await supabase
      .schema('commerce')
      .from('produtos')
      .select('category')
      .not('category', 'is', null)
      .eq('status', 'active');

    if (error) {
      console.error('[productsService] Error fetching categories:', error);
      return [];
    }

    const categories = [...new Set((data || []).map(p => p.category).filter(Boolean))];
    return categories;
  },

  /**
   * Clear the cache (no longer needed with database)
   */
  clearCache: () => {
    // No-op - database doesn't need cache clearing
  },
};
