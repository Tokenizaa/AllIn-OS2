/**
 * Inventory Module Index
 * 
 * Exporta todos os componentes do módulo inventory.
 */

export { InventoryMovementRepository, InventoryAlertRepository } from './repositories/inventory.repository';

export { InventoryService } from './services/inventory.service';

export type {
  InventoryMovement,
  CreateInventoryMovementDTO,
  InventoryAlert,
  InventorySummary,
  InventoryResponseDTO,
  InventoryMovementListResponseDTO,
} from './dto/inventory.dto';
