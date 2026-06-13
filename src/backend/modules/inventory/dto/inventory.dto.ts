/**
 * Inventory DTOs
 * 
 * DTOs para operações com estoque.
 */

export interface InventoryMovement {
  id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  movement_type: 'in' | 'out' | 'adjustment' | 'transfer';
  reason: string;
  reference_id?: string;
  reference_type?: 'order' | 'purchase' | 'return' | 'adjustment' | 'transfer';
  previous_quantity: number;
  new_quantity: number;
  user_id: string;
  user_name: string;
  notes?: string;
  created_at: Date;
}

export interface CreateInventoryMovementDTO {
  product_id: string;
  quantity: number;
  movement_type: 'in' | 'out' | 'adjustment' | 'transfer';
  reason: string;
  reference_id?: string;
  reference_type?: 'order' | 'purchase' | 'return' | 'adjustment' | 'transfer';
  notes?: string;
  user_id: string;
  user_name: string;
}

export interface InventoryAlert {
  id: string;
  product_id: string;
  product_name: string;
  current_quantity: number;
  minimum_quantity: number;
  alert_type: 'low_stock' | 'out_of_stock';
  alert_status: 'active' | 'resolved';
  created_at: Date;
  resolved_at?: Date;
}

export interface InventorySummary {
  total_products: number;
  total_quantity: number;
  total_value: number;
  low_stock_count: number;
  out_of_stock_count: number;
  recent_movements: InventoryMovement[];
  active_alerts: InventoryAlert[];
}

export interface InventoryResponseDTO {
  product_id: string;
  product_name: string;
  current_quantity: number;
  minimum_quantity: number;
  maximum_quantity?: number;
  reorder_point?: number;
  reorder_quantity?: number;
  last_movement?: InventoryMovement;
  alert?: InventoryAlert;
}

export interface InventoryMovementListResponseDTO {
  data: InventoryMovement[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
