/**
 * Finance Domain Services Index
 * 
 * Exporta todos os domain services do bounded context Finance.
 * Domain services contêm lógica pura de negócio, separada de infraestrutura.
 */

export { WithdrawalValidationDomainService } from './withdrawal-validation.domain-service';
export { BalanceCalculationDomainService } from './balance-calculation.domain-service';
export { LimitCalculationDomainService } from './limit-calculation.domain-service';

export type {
  WithdrawalValidationRule,
  WithdrawalCondition,
  WithdrawalValidationResult,
  WithdrawalLimits,
  DistributorBalance,
} from './withdrawal-validation.domain-service';

export type {
  BalanceTransaction,
  BalanceSnapshot,
  BalanceCalculationResult,
} from './balance-calculation.domain-service';

export type {
  LimitRule,
  LimitCondition,
  LimitCalculationResult,
  DistributorLimits,
} from './limit-calculation.domain-service';
