export interface Product {
  id: string;
  nome: string;
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
