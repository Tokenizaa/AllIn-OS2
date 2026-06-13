/**
 * Admin Module Index
 * 
 * Exporta todos os componentes do módulo admin.
 */

export { AdminActionRepository, UsernameChangeHistoryRepository, SponsorChangeHistoryRepository } from './repositories/admin.repository';

export { StoreProductAssignmentRepository } from './repositories/store-products.repository';

export { CDBalanceMovementRepository } from './repositories/cd-balance.repository';

export { AdminService } from './services/admin.service';

export { StoreProductsService } from './services/store-products.service';

export { CDBalanceService } from './services/cd-balance.service';

export type {
  ChangeUsernameDTO,
  ChangeSponsorDTO,
  AdminAction,
  CreateAdminActionDTO,
  UsernameChangeHistory,
  SponsorChangeHistory,
} from './dto/admin.dto';

export type {
  EnableProductInStoreDTO,
  DisableProductInStoreDTO,
  StoreProductAssignment,
  ProductStoreAvailability,
} from './dto/store-products.dto';

export type {
  CDBalanceMovement,
  CreateCDBalanceMovementDTO,
  CDBalance,
  CDBalanceSummary,
} from './dto/cd-balance.dto';
