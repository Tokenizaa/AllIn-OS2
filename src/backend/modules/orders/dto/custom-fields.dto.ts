/**
 * Custom Fields DTOs
 * 
 * DTOs para operações com campos personalizados para pedidos.
 */

export interface CustomField {
  id: string;
  name: string;
  key: string;
  type: 'text' | 'number' | 'date' | 'select' | 'checkbox' | 'textarea';
  options?: string[];
  required: boolean;
  placeholder?: string;
  default_value?: string;
  validation?: {
    min_length?: number;
    max_length?: number;
    pattern?: string;
    min_value?: number;
    max_value?: number;
  };
  order: number;
  active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateCustomFieldDTO {
  name: string;
  key: string;
  type: 'text' | 'number' | 'date' | 'select' | 'checkbox' | 'textarea';
  options?: string[];
  required?: boolean;
  placeholder?: string;
  default_value?: string;
  validation?: {
    min_length?: number;
    max_length?: number;
    pattern?: string;
    min_value?: number;
    max_value?: number;
  };
  order?: number;
  active?: boolean;
}

export interface UpdateCustomFieldDTO {
  name?: string;
  key?: string;
  type?: 'text' | 'number' | 'date' | 'select' | 'checkbox' | 'textarea';
  options?: string[];
  required?: boolean;
  placeholder?: string;
  default_value?: string;
  validation?: {
    min_length?: number;
    max_length?: number;
    pattern?: string;
    min_value?: number;
    max_value?: number;
  };
  order?: number;
  active?: boolean;
}

export interface CustomFieldResponseDTO {
  id: string;
  name: string;
  key: string;
  type: 'text' | 'number' | 'date' | 'select' | 'checkbox' | 'textarea';
  options?: string[];
  required: boolean;
  placeholder?: string;
  default_value?: string;
  validation?: {
    min_length?: number;
    max_length?: number;
    pattern?: string;
    min_value?: number;
    max_value?: number;
  };
  order: number;
  active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CustomFieldValue {
  id: string;
  custom_field_id: string;
  order_id: string;
  value: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateCustomFieldValueDTO {
  custom_field_id: string;
  order_id: string;
  value: string;
}

export interface UpdateCustomFieldValueDTO {
  value: string;
}
