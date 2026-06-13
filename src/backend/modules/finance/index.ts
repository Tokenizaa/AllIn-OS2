/**
 * Finance Module Index
 * 
 * Exporta todos os serviços e DTOs do bounded context Finance.
 */

// Domain Services
export { WithdrawalValidationDomainService } from './domain-services';
export { BalanceCalculationDomainService } from './domain-services';
export { LimitCalculationDomainService } from './domain-services';

// Application Services
export { WithdrawalService } from './services/withdrawal.service';
export { BalanceService } from './services/balance.service';
export { BankAccountService } from './services/bank-account.service';

// Domain Service Types
export type {
  WithdrawalValidationRule,
  WithdrawalCondition,
  WithdrawalValidationResult,
  WithdrawalLimits,
  DistributorBalance,
} from './domain-services';

export type {
  BalanceTransaction,
  BalanceSnapshot,
  BalanceCalculationResult,
} from './domain-services';

export type {
  LimitRule,
  LimitCondition,
  LimitCalculationResult,
  DistributorLimits,
} from './domain-services';

// Application Service Types
export type {
  Withdrawal,
  CreateWithdrawalDTO,
  UpdateWithdrawalDTO,
} from './services/withdrawal.service';

export type {
  Balance,
  BalanceTransaction as BalanceTransactionEntity,
} from './services/balance.service';

export type {
  BankAccount,
  CreateBankAccountDTO,
  UpdateBankAccountDTO,
} from './services/bank-account.service';

// DTOs
export type {
  WithdrawalRequestDTO,
  WithdrawalResponseDTO,
  BalanceResponseDTO,
  BalanceTransactionDTO,
  BankAccountDTO,
  CreateBankAccountDTO as CreateBankAccountDTORequest,
  UpdateBankAccountDTO as UpdateBankAccountDTORequest,
} from './dto/finance.dto';
