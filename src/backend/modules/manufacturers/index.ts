/**
 * Manufacturers Module Index
 * 
 * Exporta todos os componentes do módulo de fabricantes.
 */

export { ManufacturerRepository } from './repositories/manufacturer.repository';

export { ManufacturerService } from './services/manufacturer.service';

export { ManufacturerAPI } from './api/manufacturer.api';

export type {
  Manufacturer,
  CreateManufacturerDto,
  UpdateManufacturerDto,
} from './dto/manufacturer.dto';
