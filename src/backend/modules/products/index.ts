/**
 * Products Module Index
 * 
 * Exporta todos os componentes do módulo products.
 */

export { ProductRepository } from './repositories/product.repository';
export type { Product } from './repositories/product.repository';

export { ProductService } from './services/product.service';

export type {
  CreateProductDTO,
  UpdateProductDTO,
  ProductResponseDTO,
  ProductListResponseDTO,
} from './dto/product.dto';
