import { BaseRepository, BaseEntity } from "@/backend/shared/infrastructure/repository/base.repository";

export interface Component extends BaseEntity {
  nome: string;
  categoria?: string;
  especificacoes?: any;
  observacoes?: string;
}

export class ComponentRepository extends BaseRepository<Component> {
  constructor() {
    super('components', 'industrial');
  }

  async findByCategory(categoria: string): Promise<Component[]> {
    const query = this.getQuery().select('*').eq('categoria', categoria);
    const { data, error } = await query;
    
    if (error) throw error;
    return data || [];
  }

  async findActive(): Promise<Component[]> {
    const query = this.getQuery().select('*').is('deleted_at', null);
    const { data, error } = await query;
    
    if (error) throw error;
    return data || [];
  }
}
