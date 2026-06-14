import { BaseRepository, BaseEntity } from "@/backend/shared/infrastructure/repository/base.repository";

export interface Material extends BaseEntity {
  codigo: string;
  descricao: string;
  categoria?: string;
  unidade_medida: string;
  estoque_atual: number;
  estoque_minimo: number;
  estoque_maximo?: number;
  custo_unitario?: number;
  custo_medio?: number;
  fornecedor_padrao_id?: string | null;
  localizacao_id?: string | null;
  especificacoes?: any;
  observacoes?: string;
}

export class MaterialRepository extends BaseRepository<Material> {
  constructor() {
    super('materials', 'industrial');
  }

  async findByCategory(categoria: string): Promise<Material[]> {
    const query = this.getQuery().select('*').eq('categoria', categoria);
    const { data, error } = await query;
    
    if (error) throw error;
    return data || [];
  }

  async findBySupplier(supplierId: string): Promise<Material[]> {
    const query = this.getQuery().select('*').eq('fornecedor_padrao_id', supplierId);
    const { data, error } = await query;
    
    if (error) throw error;
    return data || [];
  }

  async findLowStock(): Promise<Material[]> {
    const query = this.getQuery()
      .select('*')
      .lt('estoque_atual', 'estoque_minimo')
      .is('deleted_at', null);
    const { data, error } = await query;
    
    if (error) throw error;
    return data || [];
  }

  async updateStock(id: string, quantidade: number): Promise<Material> {
    const query = this.getQuery()
      .update({ estoque_atual: quantidade })
      .eq('id', id)
      .select()
      .single();
    const { data, error } = await query;
    
    if (error) throw error;
    return data;
  }

  async findByCode(codigo: string): Promise<Material | null> {
    const query = this.getQuery().select('*').eq('codigo', codigo).single();
    const { data, error } = await query;
    
    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  }
}
