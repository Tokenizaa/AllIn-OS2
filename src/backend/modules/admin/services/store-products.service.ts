/**
 * Store Products Service
 * 
 * Service para gerenciar produtos em lojas.
 */

import { StoreProductAssignmentRepository } from '../repositories/store-products.repository';
import {
  EnableProductInStoreDTO,
  DisableProductInStoreDTO,
  StoreProductAssignment,
  ProductStoreAvailability,
} from '../dto/store-products.dto';
import { ProductRepository } from '../../products/repositories/product.repository';

export class StoreProductsService {
  private repository: StoreProductAssignmentRepository;
  private productRepository: ProductRepository;

  constructor() {
    this.repository = new StoreProductAssignmentRepository();
    this.productRepository = new ProductRepository();
  }

  /**
   * Habilita produto em loja
   */
  async enableProductInStore(dto: EnableProductInStoreDTO): Promise<StoreProductAssignment> {
    // Busca produto
    const product = await this.productRepository.findById(dto.productId);
    if (!product) {
      throw new Error('Product not found');
    }

    // Habilita produto na loja
    const assignment = await this.repository.enableProductInStore(
      dto.productId,
      dto.storeId,
      product.nome,
      `Loja ${dto.storeId}`,
      dto.userName,
      dto.reason
    );

    // Atualiza campo aparece_loja_id no produto
    const currentStoreIds = product.aparece_loja_id || [];
    if (!currentStoreIds.includes(dto.storeId)) {
      await this.productRepository.update(dto.productId, {
        aparece_loja_id: [...currentStoreIds, dto.storeId],
      });
    }

    return assignment;
  }

  /**
   * Desabilita produto em loja
   */
  async disableProductInStore(dto: DisableProductInStoreDTO): Promise<StoreProductAssignment> {
    // Desabilita produto na loja
    const assignment = await this.repository.disableProductInStore(
      dto.productId,
      dto.storeId,
      dto.userName,
      dto.reason
    );

    // Atualiza campo aparece_loja_id no produto
    const product = await this.productRepository.findById(dto.productId);
    if (product) {
      const currentStoreIds = product.aparece_loja_id || [];
      const updatedStoreIds = currentStoreIds.filter(id => id !== dto.storeId);
      await this.productRepository.update(dto.productId, {
        aparece_loja_id: updatedStoreIds,
      });
    }

    return assignment;
  }

  /**
   * Busca atribuições por produto
   */
  async getProductAssignments(productId: string): Promise<StoreProductAssignment[]> {
    return this.repository.findByProductId(productId);
  }

  /**
   * Busca produtos por loja
   */
  async getStoreProducts(storeId: number): Promise<StoreProductAssignment[]> {
    return this.repository.findActiveByStoreId(storeId);
  }

  /**
   * Busca disponibilidade de produto em lojas
   */
  async getProductStoreAvailability(productId: string): Promise<ProductStoreAvailability> {
    return this.repository.getProductStoreAvailability(productId);
  }

  /**
   * Habilita produto em múltiplas lojas
   */
  async enableProductInMultipleStores(
    productId: string,
    storeIds: number[],
    reason: string,
    userId: string,
    userName: string
  ): Promise<StoreProductAssignment[]> {
    const assignments: StoreProductAssignment[] = [];

    for (const storeId of storeIds) {
      try {
        const assignment = await this.enableProductInStore({
          productId,
          storeId,
          reason,
          userId,
          userName,
        });
        assignments.push(assignment);
      } catch (error) {
        console.error(`Error enabling product in store ${storeId}:`, error);
      }
    }

    return assignments;
  }

  /**
   * Desabilita produto em múltiplas lojas
   */
  async disableProductInMultipleStores(
    productId: string,
    storeIds: number[],
    reason: string,
    userId: string,
    userName: string
  ): Promise<StoreProductAssignment[]> {
    const assignments: StoreProductAssignment[] = [];

    for (const storeId of storeIds) {
      try {
        const assignment = await this.disableProductInStore({
          productId,
          storeId,
          reason,
          userId,
          userName,
        });
        assignments.push(assignment);
      } catch (error) {
        console.error(`Error disabling product in store ${storeId}:`, error);
      }
    }

    return assignments;
  }

  /**
   * Habilita produto em todas as lojas
   */
  async enableProductInAllStores(
    productId: string,
    reason: string,
    userId: string,
    userName: string
  ): Promise<StoreProductAssignment[]> {
    // Assume lojas de 1 a 10 (pode ser configurável)
    const allStoreIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    return this.enableProductInMultipleStores(productId, allStoreIds, reason, userId, userName);
  }

  /**
   * Desabilita produto em todas as lojas
   */
  async disableProductInAllStores(
    productId: string,
    reason: string,
    userId: string,
    userName: string
  ): Promise<StoreProductAssignment[]> {
    const assignments = await this.repository.findByProductId(productId);
    const storeIds = assignments.map(a => a.store_id);
    return this.disableProductInMultipleStores(productId, storeIds, reason, userId, userName);
  }
}
