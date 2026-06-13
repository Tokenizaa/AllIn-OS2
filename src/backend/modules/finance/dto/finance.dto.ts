/**
 * Finance DTOs
 * 
 * Data Transfer Objects para o módulo finance
 */

export interface WithdrawalRequestDTO {
  distributorId: string;
  amount: number;
  bankCode: string;
  accountType: string;
  variation?: string;
  agency: string;
  accountNumber: string;
  operation?: string;
  accountHolderName: string;
  accountHolderType: string;
  accountHolderDocument: string;
}

export interface WithdrawalResponseDTO {
  id: string;
  distributorId: string;
  distributorName: string;
  amount: number;
  totalFees: number;
  amountToDeposit: number;
  status: string;
  statusDescription: string;
  requestedAt: string;
  approvedAt?: string;
  depositedAt?: string;
  bankCode: string;
  accountType: string;
  agency: string;
  accountNumber: string;
  accountHolderName: string;
}

export interface BalanceResponseDTO {
  distributorId: string;
  availableBalance: number;
  blockedBalance: number;
  totalBalance: number;
  pendingWithdrawals: number;
  pendingCommissions: number;
  lastUpdatedAt: string;
}

export interface BalanceTransactionDTO {
  id: string;
  distributorId: string;
  type: string;
  amount: number;
  description: string;
  referenceId?: string;
  referenceType?: string;
  createdAt: string;
}

export interface BankAccountDTO {
  id: string;
  distributorId: string;
  bankCode: string;
  bankName: string;
  accountType: string;
  variation?: string;
  agency: string;
  accountNumber: string;
  operation?: string;
  accountHolderName: string;
  accountHolderType: string;
  accountHolderDocument: string;
  isPrimary: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBankAccountDTO {
  distributorId: string;
  bankCode: string;
  bankName: string;
  accountType: 'checking' | 'savings';
  variation?: string;
  agency: string;
  accountNumber: string;
  operation?: string;
  accountHolderName: string;
  accountHolderType: 'individual' | 'corporate';
  accountHolderDocument: string;
  isPrimary?: boolean;
}

export interface UpdateBankAccountDTO {
  bankCode?: string;
  bankName?: string;
  accountType?: 'checking' | 'savings';
  variation?: string;
  agency?: string;
  accountNumber?: string;
  operation?: string;
  accountHolderName?: string;
  accountHolderType?: 'individual' | 'corporate';
  accountHolderDocument?: string;
  isPrimary?: boolean;
  isActive?: boolean;
}
