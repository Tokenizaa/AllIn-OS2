import { BaseRepository, BaseEntity } from "@/backend/shared/infrastructure/repository/base.repository";

export interface Supplier extends BaseEntity {
  razao_social: string;
  nome_fantasia?: string;
  cnpj?: string;
  contato_nome?: string;
  contato_email?: string;
  contato_telefone?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  status?: string;
  condicoes_pagamento?: string;
  prazo_entrega_padrao?: number;
  observacoes?: string;
}

export class SupplierRepository extends BaseRepository<Supplier> {
  constructor() {
    super('suppliers', 'industrial');
  }

  async findByCNPJ(cnpj: string): Promise<Supplier | null> {
    const query = this.getQuery().select('*').eq('cnpj', cnpj).single();
    const { data, error } = await query;
    
    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }
    return data;
  }

  async findByStatus(status: string): Promise<Supplier[]> {
    const query = this.getQuery().select('*').eq('status', status);
    const { data, error } = await query;
    
    if (error) throw error;
    return data || [];
  }

  async findActive(): Promise<Supplier[]> {
    return this.findByStatus('active');
  }
}
