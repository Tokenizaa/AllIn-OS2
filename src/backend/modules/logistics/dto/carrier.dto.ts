/**
 * Carrier DTOs
 * 
 * DTOs para operações com transportadoras.
 */

export interface Carrier {
  id: string;
  name: string;
  cnpj?: string;
  phone?: string;
  email?: string;
  website?: string;
  contact_person?: string;
  address?: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zip_code: string;
  };
  tracking_url?: string;
  api_key?: string;
  api_endpoint?: string;
  active: boolean;
  delivery_time_days?: number;
  minimum_weight?: number;
  maximum_weight?: number;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateCarrierDTO {
  name: string;
  cnpj?: string;
  phone?: string;
  email?: string;
  website?: string;
  contact_person?: string;
  address?: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zip_code: string;
  };
  tracking_url?: string;
  api_key?: string;
  api_endpoint?: string;
  active?: boolean;
  delivery_time_days?: number;
  minimum_weight?: number;
  maximum_weight?: number;
  notes?: string;
}

export interface UpdateCarrierDTO {
  name?: string;
  cnpj?: string;
  phone?: string;
  email?: string;
  website?: string;
  contact_person?: string;
  address?: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zip_code: string;
  };
  tracking_url?: string;
  api_key?: string;
  api_endpoint?: string;
  active?: boolean;
  delivery_time_days?: number;
  minimum_weight?: number;
  maximum_weight?: number;
  notes?: string;
}

export interface CarrierResponseDTO {
  id: string;
  name: string;
  cnpj?: string;
  phone?: string;
  email?: string;
  website?: string;
  contact_person?: string;
  address?: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zip_code: string;
  };
  tracking_url?: string;
  active: boolean;
  delivery_time_days?: number;
  minimum_weight?: number;
  maximum_weight?: number;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

export interface CarrierListResponseDTO {
  data: CarrierResponseDTO[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface CarrierStats {
  total_carriers: number;
  active_carriers: number;
  inactive_carriers: number;
  average_delivery_time: number;
}
