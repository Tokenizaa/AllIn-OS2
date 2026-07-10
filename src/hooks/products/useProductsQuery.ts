import { useQuery } from "@tanstack/react-query";
import { productsService } from "@/services/products";

export interface Product {
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

interface ProductsContextType {
  products: Product[];
  categories: Category[];
  loading: boolean;
  error: string | null;
  refreshProducts: () => Promise<void>;
  getProductsByCategory: (categoryName: string, limit?: number) => Product[];
}

// Sprint 2: Migrar ProductsProvider para TanStack Query
async function fetchProducts(): Promise<Product[]> {
  const productsData = await productsService.getAllProducts();
  // Mapear campos do banco de dados para a interface esperada pelo ProductGallery
  return productsData.map(product => ({
    id: product.id,
    linkProduto: `/loja/${product.id}`,
    imgSrc: product.images?.[0] || 'https://placehold.co/400x400?text=Imagem+Indispon%C3%ADvel',
    imgSrc2: product.images?.[1] || product.images?.[0] || 'https://placehold.co/400x400?text=Imagem+Indispon%C3%ADvel',
    caption: product.nome || 'Produto',
    categorias: product.category || 'Geral',
    caption2: product.description || '',
    price: product.price || '0',
    promotion: '',
    parcelasValor: '',
    produtoTag: product.is_active ? 'Disponível' : '',
  }));
}

function extractCategories(products: Product[]): Category[] {
  const categoryMap = new Map<string, number>();
  products.forEach(product => {
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

export function useProductsQuery() {
  const query = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    staleTime: 10 * 60 * 1000, // 10 minutos
  });

  const categories = query.data ? extractCategories(query.data) : [];

  const getProductsByCategory = (categoryName: string, limit: number = 4): Product[] => {
    if (!query.data) return [];
    const filteredProducts = query.data.filter(
      product => product.categorias.trim().toLowerCase() === categoryName.toLowerCase()
    );
    return limit ? filteredProducts.slice(0, limit) : filteredProducts;
  };

  return {
    products: query.data || [],
    categories,
    loading: query.isLoading,
    error: query.error ? (query.error as Error).message : null,
    refreshProducts: () => query.refetch(),
    getProductsByCategory,
  };
}
