/**
 * Orders Module Index
 * 
 * Exporta todos os componentes do módulo orders.
 */

export { OrderRepository, OrderItemRepository } from './repositories/order.repository';

export { CustomFieldRepository, CustomFieldValueRepository } from './repositories/custom-field.repository';

export { OrderService } from './services/order.service';

export { CustomFieldService } from './services/custom-field.service';

export type {
  Order,
  CreateOrderDto,
  UpdateOrderDto,
  OrderItem,
  OrderSummary,
} from './dto/order.dto';

export type {
  CustomField,
  CreateCustomFieldDTO,
  UpdateCustomFieldDTO,
  CustomFieldResponseDTO,
  CustomFieldValue,
  CreateCustomFieldValueDTO,
  UpdateCustomFieldValueDTO,
} from './dto/custom-fields.dto';
