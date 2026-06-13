/**
 * MLM Domain Services Index
 * 
 * Exporta todos os domain services do bounded context MLM.
 * Domain services contêm lógica pura de negócio, separada de infraestrutura.
 */

export { CommissionCalculationDomainService } from './commission-calculation.domain-service';
export { QualificationCalculationDomainService } from './qualification-calculation.domain-service';
export { PointsCalculationDomainService } from './points-calculation.domain-service';

export type {
  CommissionRule,
  CommissionCondition,
  CommissionCalculationResult,
  DistributorNetwork,
} from './commission-calculation.domain-service';

export type {
  QualificationRequirements,
  QualificationLevel,
  QualificationCalculationResult,
  DistributorMetrics,
} from './qualification-calculation.domain-service';

export type {
  PointsRule,
  PointsCondition,
  PointsCalculationResult,
  PointsBalance,
} from './points-calculation.domain-service';
