import { supabase } from "@/lib/supabase/client";
import { Product } from '../../types/products';

/**
 * ProductService — Projeto comercial AllIn (legacy)
 *
 * ATENÇÃO: Este serviço consulta `public.products` (tabela do projeto comercial AllIn).
 * Para o storefront/loja do projeto, use `productsService` (consulta `commerce.produtos`).
 *
 * Coexistem pois são projetos distintos:
 *   - public.products = produtos AllIn comercial (sapatos terapêuticos, etc.) — projeto AllIn
 *   - commerce.produtos = produtos do storefront (e-commerce) — projeto storefront
 *
 * Não confundir/atribuir migração entre as duas tabelas.
 */
export const ProductService = {
  async fetchProducts(limit = 20) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .limit(limit)
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message || "Failed to fetch products");
    return data || [];
  },

  async fetchProductById(id: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw new Error(error.message || "Failed to fetch product by ID");
    return data;
  }
};

export const productsService = {
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
      manufacturer: product.fabricante,
      stock: product.estoque || 0,
      is_active: product.status === 'active',
      metadata: product.metadata || {},
      created_at: product.created_at,
      updated_at: product.updated_at,
    }));
  },

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
      nome: product.nome,
      category: product.category,
      price: product.price?.toString() || '0',
      images: product.images || [],
      description: product.description,
      sku: product.sku,
      manufacturer: product.fabricante,
      stock: product.estoque || 0,
      is_active: product.status === 'active',
      metadata: product.metadata || {},
      created_at: product.created_at,
      updated_at: product.updated_at,
    }));
  },

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
      manufacturer: data.fabricante,
      stock: data.estoque || 0,
      is_active: data.status === 'active',
      metadata: data.metadata || {},
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  },

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

  clearCache: () => {},
};
