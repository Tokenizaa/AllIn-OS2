/**
 * Logistics Module Index
 * 
 * Exporta todos os serviços e DTOs do bounded context Logistics.
 */

export { FreightCalculationService } from './services/freight-calculation.service';
export { CarrierService } from './services/carrier.service';

export type {
  FreightCalculationRequest,
  FreightCalculationResult,
  Carrier,
} from './services/freight-calculation.service';

export type {
  Carrier as CarrierEntity,
  CreateCarrierDTO,
  UpdateCarrierDTO,
} from './services/carrier.service';

export type {
  FreightCalculationRequestDTO,
  FreightCalculationResponseDTO,
  FreightQuoteResponseDTO,
  CarrierDTO,
} from './dto/freight.dto';
