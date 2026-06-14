import { BaseRepository, BaseEntity } from "@/backend/shared/infrastructure/repository/base.repository";

export interface Machine extends BaseEntity {
  nome: string;
  codigo: string;
  fabricante?: string;
  modelo?: string;
  numero_serie?: string;
  data_aquisicao?: Date;
  valor_aquisicao?: number;
  localizacao_id?: string | null;
  localizacao_detalhe?: string;
  status?: string;
  capacidade_horaria?: number;
  especificacoes?: any;
  observacoes?: string;
  anexos?: any[];
}

export class MachineRepository extends BaseRepository<Machine> {
  constructor() {
    super('machines', 'industrial');
  }

  async findByStatus(status: string): Promise<Machine[]> {
    const query = this.getQuery().select('*').eq('status', status);
    const { data, error } = await query;
    
    if (error) throw error;
    return data || [];
  }

  async findByLocation(locationId: string): Promise<Machine[]> {
    const query = this.getQuery().select('*').eq('localizacao_id', locationId);
    const { data, error } = await query;
    
    if (error) throw error;
    return data || [];
  }

  async findActive(): Promise<Machine[]> {
    return this.findByStatus('active');
  }

  async findInMaintenance(): Promise<Machine[]> {
    return this.findByStatus('maintenance');
  }

  async findByCode(codigo: string): Promise<Machine | null> {
    const query = this.getQuery().select('*').eq('codigo', codigo).single();
    const { data, error } = await query;
    
    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  }
}
