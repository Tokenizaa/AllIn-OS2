import { BaseRepository, BaseEntity } from "@/backend/shared/infrastructure/repository/base.repository";

export interface Location extends BaseEntity {
  nome: string;
  tipo?: string;
  parent_id?: string | null;
  descricao?: string;
  area_m2?: number;
}

export class LocationRepository extends BaseRepository<Location> {
  constructor() {
    super('locations', 'industrial');
  }

  async findByType(tipo: string): Promise<Location[]> {
    const query = this.getQuery().select('*').eq('tipo', tipo);
    const { data, error } = await query;
    
    if (error) throw error;
    return data || [];
  }

  async findByParent(parentId: string): Promise<Location[]> {
    const query = this.getQuery().select('*').eq('parent_id', parentId);
    const { data, error } = await query;
    
    if (error) throw error;
    return data || [];
  }

  async findRootLocations(): Promise<Location[]> {
    const query = this.getQuery().select('*').is('parent_id', null);
    const { data, error } = await query;
    
    if (error) throw error;
    return data || [];
  }

  async findTree(): Promise<Location[]> {
    const query = this.getQuery().select('*').order('nome');
    const { data, error } = await query;
    
    if (error) throw error;
    return data || [];
  }
}
