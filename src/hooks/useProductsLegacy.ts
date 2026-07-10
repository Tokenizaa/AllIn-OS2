import { useQuery } from '@tanstack/react-query';
import { productsService } from '../services/products';
import { Product } from '../types/products';

/**
 * UI-shape interface (compatible with old useProductsLegacy return)
 */
export interface ProductUI {
  id: string;
  linkProduto: string;
  imgSrc: string;
  imgSrc2: string;
  caption: string;
  categorias: string;
  caption2: string;
  price: string;
  promotion: string;
  parcelasValor: string;
  produtoTag: string;
}

export interface Category {
  id: number;
  name: string;
  productCount: number;
  image?: string;
}

interface UseProductsLegacyReturn {
  products: ProductUI[];
  categories: Category[];
  loading: boolean;
  error: string | null;
  getProductsByCategory: (categoryName: string) => ProductUI[];
  refreshProducts: () => Promise<void>;
}

async function fetchProducts(): Promise<Product[]> {
  return productsService.getAllProducts();
}

function mapToUI(dbProducts: Product[]): ProductUI[] {
  return dbProducts.map((product) => ({
    id: product.id,
    linkProduto: `/loja/${product.id}`,
    imgSrc: product.images?.[0] || 'https://placehold.co/400x400?text=Imagem+Indisponível',
    imgSrc2: product.images?.[1] || product.images?.[0] || 'https://placehold.co/400x400?text=Imagem+Indisponível',
    caption: product.nome || 'Produto',
    categorias: product.category || 'Geral',
    caption2: product.description || '',
    price: String(product.price || 0),
    promotion: '',
    parcelasValor: '',
    produtoTag: product.is_active ? 'Disponível' : '',
  }));
}

function extractCategories(products: ProductUI[]): Category[] {
  const categoryMap = new Map<string, number>();
  products.forEach((product) => {
    const categoryName = product.categorias;
    if (categoryName) {
      categoryMap.set(categoryName, (categoryMap.get(categoryName) || 0) + 1);
    }
  });

  return Array.from(categoryMap.entries()).map(([name, count], index) => ({
    id: index + 1,
    name,
    productCount: count,
  }));
}

/**
 * useProductsLegacy — Marketplace storefront (projects/products)
 *
 * TanStack Query version (Sprint 6 — Domain Consolidation).
 *
 * Consumers:
 *   - src/components/ProductSearch.tsx
 *   - src/routes/loja.tsx
 *
 * MAINTAINS backward-compatible return shape:
 *   { products, categories, loading, error, getProductsByCategory, refreshProducts }
 *
 * Para o storefront, prefira `useProductsQuery` (com a mesma shape e mais cache).
 */
export function useProductsLegacy(): UseProductsLegacyReturn {
  const query = useQuery({
    queryKey: ['products', 'legacy'],
    queryFn: fetchProducts,
    staleTime: 10 * 60 * 1000,
  });

  const uiProducts: ProductUI[] = query.data ? mapToUI(query.data) : [];
  const categories: Category[] = extractCategories(uiProducts);

  const getProductsByCategory = (categoryName: string): ProductUI[] => {
    if (!query.data) return [];
    return uiProducts.filter((product) => product.categorias === categoryName);
  };

  return {
    products: uiProducts,
    categories,
    loading: query.isLoading,
    error: query.error ? (query.error as Error).message : null,
    getProductsByCategory,
    refreshProducts: async () => {
      await query.refetch();
    },
  };
}
