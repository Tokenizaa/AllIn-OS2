import { BaseRepository, BaseEntity } from "@/backend/shared/infrastructure/repository/base.repository";

export interface Tool extends BaseEntity {
  descricao: string;
  categoria?: string;
  localizacao_id?: string | null;
  responsavel_id?: string | null;
  status?: string;
  observacoes?: string;
}

export class ToolRepository extends BaseRepository<Tool> {
  constructor() {
    super('tools', 'industrial');
  }

  async findByCategory(categoria: string): Promise<Tool[]> {
    const query = this.getQuery().select('*').eq('categoria', categoria);
    const { data, error } = await query;
    
    if (error) throw error;
    return data || [];
  }

  async findByLocation(locationId: string): Promise<Tool[]> {
    const query = this.getQuery().select('*').eq('localizacao_id', locationId);
    const { data, error } = await query;
    
    if (error) throw error;
    return data || [];
  }

  async findByResponsavel(responsavelId: string): Promise<Tool[]> {
    const query = this.getQuery().select('*').eq('responsavel_id', responsavelId);
    const { data, error } = await query;
    
    if (error) throw error;
    return data || [];
  }

  async findAvailable(): Promise<Tool[]> {
    const query = this.getQuery().select('*').eq('status', 'available');
    const { data, error } = await query;
    
    if (error) throw error;
    return data || [];
  }
}
