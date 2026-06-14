import { BaseRepository, BaseEntity } from "@/backend/shared/infrastructure/repository/base.repository";

export interface ProductIndustrial extends BaseEntity {
  modelo: string;
  categoria?: string;
  largura_cm?: number;
  comprimento_cm?: number;
  altura_cm?: number;
  especificacoes?: any;
  observacoes?: string;
}

export class ProductIndustrialRepository extends BaseRepository<ProductIndustrial> {
  constructor() {
    super('products_industrial', 'industrial');
  }

  async findByCategory(categoria: string): Promise<ProductIndustrial[]> {
    const query = this.getQuery().select('*').eq('categoria', categoria);
    const { data, error } = await query;
    
    if (error) throw error;
    return data || [];
  }

  async findByDimensions(largura: number, comprimento: number): Promise<ProductIndustrial[]> {
    const query = this.getQuery()
      .select('*')
      .eq('largura_cm', largura)
      .eq('comprimento_cm', comprimento);
    const { data, error } = await query;
    
    if (error) throw error;
    return data || [];
  }

  async findActive(): Promise<ProductIndustrial[]> {
    const query = this.getQuery().select('*').is('deleted_at', null);
    const { data, error } = await query;
    
    if (error) throw error;
    return data || [];
  }
}
