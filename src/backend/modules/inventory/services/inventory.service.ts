/**
 * Inventory Service
 * 
 * Service para gerenciar estoque.
 */

import { InventoryMovementRepository, InventoryAlertRepository } from '../repositories/inventory.repository';
import {
  InventoryMovement,
  CreateInventoryMovementDTO,
  InventoryAlert,
  InventorySummary,
  InventoryResponseDTO,
} from '../dto/inventory.dto';
import { ProductRepository } from '../../products/repositories/product.repository';

export class InventoryService {
  private movementRepository: InventoryMovementRepository;
  private alertRepository: InventoryAlertRepository;
  private productRepository: ProductRepository;

  constructor() {
    this.movementRepository = new InventoryMovementRepository();
    this.alertRepository = new InventoryAlertRepository();
    this.productRepository = new ProductRepository();
  }

  /**
   * Cria movimentação de estoque
   */
  async createMovement(dto: CreateInventoryMovementDTO): Promise<InventoryMovement> {
    // Busca produto atual
    const product = await this.productRepository.findById(dto.product_id);
    if (!product) {
      throw new Error('Product not found');
    }

    const previousQuantity = product.estoque || 0;
    let newQuantity = previousQuantity;

    // Calcula nova quantidade baseada no tipo de movimentação
    switch (dto.movement_type) {
      case 'in':
        newQuantity = previousQuantity + dto.quantity;
        break;
      case 'out':
        newQuantity = Math.max(0, previousQuantity - dto.quantity);
        break;
      case 'adjustment':
        newQuantity = dto.quantity;
        break;
      case 'transfer':
        // Transferência não altera o total, apenas move entre locais
        // Para simplificar, tratamos como ajuste
        newQuantity = dto.quantity;
        break;
    }

    // Cria movimentação
    const movement = await this.movementRepository.createMovement({
      product_id: dto.product_id,
      product_name: product.nome,
      quantity: dto.quantity,
      movement_type: dto.movement_type,
      reason: dto.reason,
      reference_id: dto.reference_id,
      reference_type: dto.reference_type,
      previous_quantity: previousQuantity,
      new_quantity: newQuantity,
      user_id: dto.user_id,
      user_name: dto.user_name,
      notes: dto.notes,
    });

    // Atualiza estoque do produto
    await this.productRepository.updateStock(dto.product_id, newQuantity - previousQuantity);

    // Verifica e cria alertas
    await this.alertRepository.checkAndCreateAlerts();

    return movement;
  }

  /**
   * Busca movimentações por produto
   */
  async getMovementsByProductId(productId: string): Promise<InventoryMovement[]> {
    return this.movementRepository.findByProductId(productId);
  }

  /**
   * Busca movimentações por tipo
   */
  async getMovementsByType(movementType: string): Promise<InventoryMovement[]> {
    return this.movementRepository.findByMovementType(movementType);
  }

  /**
   * Busca movimentações por período
   */
  async getMovementsByDateRange(startDate: Date, endDate: Date): Promise<InventoryMovement[]> {
    return this.movementRepository.findByDateRange(startDate, endDate);
  }

  /**
   * Busca movimentações recentes
   */
  async getRecentMovements(limit: number = 20): Promise<InventoryMovement[]> {
    return this.movementRepository.findRecent(limit);
  }

  /**
   * Busca resumo de estoque
   */
  async getInventorySummary(): Promise<InventorySummary> {
    const summary = await this.movementRepository.getInventorySummary();
    const recentMovements = await this.movementRepository.findRecent(10);
    const activeAlerts = await this.alertRepository.findActive();

    return {
      ...summary,
      recent_movements: recentMovements,
      active_alerts: activeAlerts,
    };
  }

  /**
   * Busca estoque de um produto
   */
  async getProductInventory(productId: string): Promise<InventoryResponseDTO> {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    const lastMovement = await this.movementRepository.findByProductId(productId);
    const alert = (await this.alertRepository.findByProductId(productId)).find(
      a => a.alert_status === 'active'
    );

    return {
      product_id: product.id,
      product_name: product.nome,
      current_quantity: product.estoque || 0,
      minimum_quantity: product.estoque_minimo || 0,
      maximum_quantity: product.metadados?.maximum_quantity,
      reorder_point: product.metadados?.reorder_point,
      reorder_quantity: product.metadados?.reorder_quantity,
      last_movement: lastMovement[0],
      alert,
    };
  }

  /**
   * Busca alertas ativos
   */
  async getActiveAlerts(): Promise<InventoryAlert[]> {
    return this.alertRepository.findActive();
  }

  /**
   * Resolve alerta
   */
  async resolveAlert(alertId: string): Promise<InventoryAlert> {
    return this.alertRepository.resolveAlert(alertId);
  }

  /**
   * Verifica e cria alertas automaticamente
   */
  async checkAndCreateAlerts(): Promise<InventoryAlert[]> {
    return this.alertRepository.checkAndCreateAlerts();
  }

  /**
   * Ajusta estoque manualmente
   */
  async adjustStock(
    productId: string,
    newQuantity: number,
    reason: string,
    userId: string,
    userName: string
  ): Promise<InventoryMovement> {
    return this.createMovement({
      product_id: productId,
      quantity: newQuantity,
      movement_type: 'adjustment',
      reason,
      user_id: userId,
      user_name: userName,
    });
  }

  /**
   * Adiciona estoque
   */
  async addStock(
    productId: string,
    quantity: number,
    reason: string,
    userId: string,
    userName: string,
    referenceId?: string,
    referenceType?: 'purchase' | 'return' | 'transfer'
  ): Promise<InventoryMovement> {
    return this.createMovement({
      product_id: productId,
      quantity,
      movement_type: 'in',
      reason,
      reference_id: referenceId,
      reference_type: referenceType,
      user_id: userId,
      user_name: userName,
    });
  }

  /**
   * Remove estoque
   */
  async removeStock(
    productId: string,
    quantity: number,
    reason: string,
    userId: string,
    userName: string,
    referenceId?: string,
    referenceType?: 'order' | 'return' | 'transfer'
  ): Promise<InventoryMovement> {
    return this.createMovement({
      product_id: productId,
      quantity,
      movement_type: 'out',
      reason,
      reference_id: referenceId,
      reference_type: referenceType,
      user_id: userId,
      user_name: userName,
    });
  }
}
