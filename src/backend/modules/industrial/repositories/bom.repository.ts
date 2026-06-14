import { BaseRepository, BaseEntity } from "@/backend/shared/infrastructure/repository/base.repository";

export interface BOM extends BaseEntity {
  produto_id: string;
  componente_id: string;
  quantidade: number;
  unidade_medida?: string;
  sequencia?: number;
  observacoes?: string;
}

export class BOMRepository extends BaseRepository<BOM> {
  constructor() {
    super('bom', 'industrial');
  }

  async findByProduct(produtoId: string): Promise<BOM[]> {
    const query = this.getQuery()
      .select('*')
      .eq('produto_id', produtoId)
      .order('sequencia', { ascending: true, nullsFirst: false });
    const { data, error } = await query;
    
    if (error) throw error;
    return data || [];
  }

  async findByComponent(componenteId: string): Promise<BOM[]> {
    const query = this.getQuery().select('*').eq('componente_id', componenteId);
    const { data, error } = await query;
    
    if (error) throw error;
    return data || [];
  }

  async findBOMTree(produtoId: string): Promise<BOM[]> {
    const query = this.getQuery()
      .select(`
        *,
        components:componente_id (nome, categoria),
        products:produto_id (modelo, categoria)
      `)
      .eq('produto_id', produtoId)
      .order('sequencia', { ascending: true, nullsFirst: false });
    const { data, error } = await query;
    
    if (error) throw error;
    return data || [];
  }
}
