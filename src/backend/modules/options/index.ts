/**
 * Options Module Index
 * 
 * Exporta todos os componentes do módulo de opções.
 */

export { OptionRepository, ProductOptionValueRepository } from './repositories/option.repository';

export { OptionService, ProductOptionValueService } from './services/option.service';

export { OptionAPI, ProductOptionValueAPI } from './api/option.api';

export type {
  Option,
  OptionValue,
  CreateOptionDto,
  UpdateOptionDto,
  ProductOptionValue,
  CreateProductOptionValueDto,
} from './dto/option.dto';
