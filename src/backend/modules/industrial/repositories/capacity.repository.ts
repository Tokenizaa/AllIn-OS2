import { BaseRepository, BaseEntity } from "@/backend/shared/infrastructure/repository/base.repository";

export interface Capacity extends BaseEntity {
  maquina_id: string;
  capacidade_teorica?: number;
  capacidade_observada?: number;
  unidade_medida?: string;
  data_inicio?: Date;
  data_fim?: Date;
  observacoes?: string;
}

export class CapacityRepository extends BaseRepository<Capacity> {
  constructor() {
    super('capacity', 'industrial');
  }

  async findByMachine(machineId: string): Promise<Capacity[]> {
    const query = this.getQuery().select('*').eq('maquina_id', machineId).order('data_inicio', { ascending: false });
    const { data, error } = await query;
    
    if (error) throw error;
    return data || [];
  }

  async findByDateRange(dataInicio: Date, dataFim: Date): Promise<Capacity[]> {
    const query = this.getQuery()
      .select('*')
      .gte('data_inicio', dataInicio.toISOString())
      .lte('data_fim', dataFim.toISOString())
      .order('data_inicio', { ascending: false });
    const { data, error } = await query;
    
    if (error) throw error;
    return data || [];
  }

  async findCurrentCapacity(machineId: string): Promise<Capacity | null> {
    const query = this.getQuery()
      .select('*')
      .eq('maquina_id', machineId)
      .lte('data_inicio', new Date().toISOString())
      .or(`data_fim.is.null,data_fim.gte.${new Date().toISOString()}`)
      .order('data_inicio', { ascending: false })
      .limit(1)
      .single();
    const { data, error } = await query;
    
    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  }
}
