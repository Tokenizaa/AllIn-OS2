export interface Product {
  id: string;
  name: string;
  category: string | null;
  price: string;
  images: string[];
  description: string | null;
  sku: string | null;
  manufacturer: string | null;
  stock: number;
  is_active: boolean;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
  // Legacy fields for backward compatibility
  linkProduto?: string;
  imgSrc?: string;
  imgSrc2?: string;
  caption?: string;
  caption2?: string;
  promotion?: string;
  parcelasValor?: string;
  produtoTag?: string;
  categorias?: string;
}

export interface Category {
  id: string;
  name: string;
  productCount: number;
  image?: string;
}

export interface ProductsState {
  products: Product[];
  categories: Category[];
  loading: boolean;
  error: string | null;
}
