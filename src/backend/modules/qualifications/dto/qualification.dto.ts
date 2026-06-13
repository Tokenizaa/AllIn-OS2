/**
 * Qualification DTOs
 * 
 * DTOs para operações com qualificações.
 */

export interface CreateQualificationDTO {
  distribuidor_id: string;
  nivel: string;
  data_atingimento: Date;
  requisitos: any;
  pontos: number;
  status?: string;
}

export interface UpdateQualificationDTO {
  nivel?: string;
  data_atingimento?: Date;
  requisitos?: any;
  pontos?: number;
  status?: string;
}

export interface QualificationResponseDTO {
  id: string;
  distribuidor_id: string;
  nivel: string;
  data_atingimento: Date;
  requisitos: any;
  pontos: number;
  status: string;
  created_at: Date;
  updated_at: Date;
}

export interface QualificationHistoryResponseDTO {
  data: QualificationResponseDTO[];
  total: number;
}
