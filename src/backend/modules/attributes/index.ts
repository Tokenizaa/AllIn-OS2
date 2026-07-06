/**
 * Attributes Module Index
 * 
 * Exporta todos os componentes do módulo de atributos.
 */

export { AttributeRepository, ProductAttributeValueRepository } from './repositories/attribute.repository';

export { AttributeService, ProductAttributeValueService } from './services/attribute.service';

export { AttributeAPI, ProductAttributeValueAPI } from './api/attribute.api';

export type {
  Attribute,
  AttributeType,
  CreateAttributeDto,
  UpdateAttributeDto,
  ProductAttributeValue,
  CreateProductAttributeValueDto,
  UpdateProductAttributeValueDto,
} from './dto/attribute.dto';
