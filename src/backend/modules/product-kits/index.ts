/**
 * Product Kits Module Index
 * 
 * Exporta todos os componentes do módulo de kit de produtos.
 */

export { ProductKitRepository } from './repositories/product-kit.repository';

export { ProductKitService } from './services/product-kit.service';

export { ProductKitAPI } from './api/product-kit.api';

export type {
  ProductKit,
  ProductKitItem,
  CreateProductKitDto,
  UpdateProductKitDto,
} from './dto/product-kit.dto';
