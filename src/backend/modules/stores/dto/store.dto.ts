/**
 * Store DTOs
 * 
 * DTOs para operações com lojas virtuais.
 */

export interface Store {
  id: string;
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
  created_at: Date;
  updated_at: Date;
}

export interface CreateStoreDTO {
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
  store_id: number;
  active?: boolean;
}

export interface UpdateStoreDTO {
  name?: string;
  slug?: string;
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
  active?: boolean;
}

export interface StoreResponseDTO {
  id: string;
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
  created_at: Date;
  updated_at: Date;
}

export interface StoreListResponseDTO {
  data: StoreResponseDTO[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface StoreStats {
  total_stores: number;
  active_stores: number;
  inactive_stores: number;
  total_products: number;
  total_orders: number;
}
