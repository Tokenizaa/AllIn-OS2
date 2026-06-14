import { BaseRepository, BaseEntity } from "@/backend/shared/infrastructure/repository/base.repository";

export interface TimingRecord extends BaseEntity {
  processo_id?: string | null;
  operador_id?: string | null;
  inicio: Date;
  fim?: Date | null;
  duracao_segundos?: number;
  produto_id?: string | null;
  quantidade_produzida?: number;
  observacoes?: string;
}

export class TimingRepository extends BaseRepository<TimingRecord> {
  constructor() {
    super('timing_records', 'industrial');
  }

  async findByProcess(processId: string): Promise<TimingRecord[]> {
    const query = this.getQuery().select('*').eq('processo_id', processId).order('inicio', { ascending: false });
    const { data, error } = await query;
    
    if (error) throw error;
    return data || [];
  }

  async findByOperator(operatorId: string): Promise<TimingRecord[]> {
    const query = this.getQuery().select('*').eq('operador_id', operatorId).order('inicio', { ascending: false });
    const { data, error } = await query;
    
    if (error) throw error;
    return data || [];
  }

  async findByDateRange(inicio: Date, fim: Date): Promise<TimingRecord[]> {
    const query = this.getQuery()
      .select('*')
      .gte('inicio', inicio.toISOString())
      .lte('inicio', fim.toISOString())
      .order('inicio', { ascending: false });
    const { data, error } = await query;
    
    if (error) throw error;
    return data || [];
  }

  async calculateAverageTime(processId: string): Promise<number> {
    const query = this.getQuery()
      .select('duracao_segundos')
      .eq('processo_id', processId)
      .not('duracao_segundos', 'is', null);
    const { data, error } = await query;
    
    if (error) throw error;
    
    if (!data || data.length === 0) return 0;
    
    const total = data.reduce((sum, record) => sum + (record.duracao_segundos || 0), 0);
    return total / data.length;
  }
}
