/**
 * Store Products DTOs
 * 
 * DTOs para operações com produtos em lojas.
 */

export interface EnableProductInStoreDTO {
  productId: string;
  storeId: number;
  reason: string;
  userId: string;
  userName: string;
}

export interface DisableProductInStoreDTO {
  productId: string;
  storeId: number;
  reason: string;
  userId: string;
  userName: string;
}

export interface StoreProductAssignment {
  id: string;
  product_id: string;
  product_name: string;
  store_id: number;
  store_name: string;
  enabled: boolean;
  enabled_at: Date;
  disabled_at?: Date;
  enabled_by: string;
  disabled_by?: string;
  reason: string;
}

export interface ProductStoreAvailability {
  product_id: string;
  product_name: string;
  available_stores: number[];
  all_stores: number[];
}
