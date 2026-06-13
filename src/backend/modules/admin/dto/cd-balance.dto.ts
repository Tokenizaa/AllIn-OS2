/**
 * CD Balance DTOs
 * 
 * DTOs para operações com saldo de Centro de Distribuição (CD).
 */

export interface CDBalanceMovement {
  id: string;
  cd_id: number;
  cd_name: string;
  amount: number;
  movement_type: 'credit' | 'debit' | 'transfer_in' | 'transfer_out';
  reason: string;
  reference_id?: string;
  reference_type?: 'order' | 'adjustment' | 'transfer';
  previous_balance: number;
  new_balance: number;
  user_id: string;
  user_name: string;
  notes?: string;
  created_at: Date;
}

export interface CreateCDBalanceMovementDTO {
  cd_id: number;
  amount: number;
  movement_type: 'credit' | 'debit' | 'transfer_in' | 'transfer_out';
  reason: string;
  reference_id?: string;
  reference_type?: 'order' | 'adjustment' | 'transfer';
  notes?: string;
  user_id: string;
  user_name: string;
}

export interface CDBalance {
  cd_id: number;
  cd_name: string;
  current_balance: number;
  available_balance: number;
  pending_balance: number;
  last_movement?: CDBalanceMovement;
}

export interface CDBalanceSummary {
  total_cds: number;
  total_balance: number;
  total_available: number;
  total_pending: number;
  recent_movements: CDBalanceMovement[];
}
