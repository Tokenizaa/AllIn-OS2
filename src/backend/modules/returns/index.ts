/**
 * Returns Module Index
 * 
 * Exporta todos os componentes do módulo de devoluções.
 */

export { ReturnRepository } from './repositories/return.repository';

export { ReturnService } from './services/return.service';

export { ReturnAPI } from './api/return.api';

export type {
  Return,
  ReturnReason,
  ReturnStatus,
  ReturnItem,
  CreateReturnDto,
  UpdateReturnDto,
  ReturnStats,
} from './dto/return.dto';
