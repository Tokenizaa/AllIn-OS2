/**
 * Freight DTOs
 * 
 * Data Transfer Objects para cálculo de frete
 */

export interface FreightCalculationRequestDTO {
  originCep: string;
  destinationCep: string;
  weight: number;
  volume?: number;
  orderValue: number;
  carrierId?: string;
}

export interface FreightCalculationResponseDTO {
  carrierId: string;
  carrierName: string;
  deliveryTime: number;
  price: number;
  priceWithoutDiscount: number;
  discount: number;
  discountPercentage: number;
  estimatedDeliveryDate: string;
}

export interface FreightQuoteResponseDTO {
  quotes: FreightCalculationResponseDTO[];
  cheapest?: FreightCalculationResponseDTO;
  fastest?: FreightCalculationResponseDTO;
}

export interface CarrierDTO {
  id: string;
  name: string;
  code: string;
  isActive: boolean;
  baseRate: number;
  ratePerKg: number;
  ratePerKm: number;
  freeShippingThreshold: number;
  minDeliveryTime: number;
  maxDeliveryTime: number;
}

export interface CreateCarrierDTO {
  name: string;
  code: string;
  baseRate: number;
  ratePerKg: number;
  ratePerKm: number;
  freeShippingThreshold: number;
  minDeliveryTime: number;
  maxDeliveryTime: number;
  apiUrl?: string;
  apiKey?: string;
}

export interface UpdateCarrierDTO {
  name?: string;
  code?: string;
  isActive?: boolean;
  baseRate?: number;
  ratePerKg?: number;
  ratePerKm?: number;
  freeShippingThreshold?: number;
  minDeliveryTime?: number;
  maxDeliveryTime?: number;
  apiUrl?: string;
  apiKey?: string;
}
