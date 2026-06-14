import { BaseRepository, BaseEntity } from "@/backend/shared/infrastructure/repository/base.repository";

export interface Process extends BaseEntity {
  nome: string;
  descricao?: string;
  sequencia?: number;
  entradas?: any[];
  saidas?: any[];
  maquinas?: any[];
  responsaveis?: any[];
  tempo_padrao_minutos?: number;
  status?: string;
  observacoes?: string;
}

export class ProcessRepository extends BaseRepository<Process> {
  constructor() {
    super('processes', 'industrial');
  }

  async findBySequence(sequencia: number): Promise<Process[]> {
    const query = this.getQuery().select('*').eq('sequencia', sequencia);
    const { data, error } = await query;
    
    if (error) throw error;
    return data || [];
  }

  async findByStatus(status: string): Promise<Process[]> {
    const query = this.getQuery().select('*').eq('status', status);
    const { data, error } = await query;
    
    if (error) throw error;
    return data || [];
  }

  async findActive(): Promise<Process[]> {
    return this.findByStatus('active');
  }

  async findByMachine(machineId: string): Promise<Process[]> {
    const query = this.getQuery().select('*').contains('maquinas', [machineId]);
    const { data, error } = await query;
    
    if (error) throw error;
    return data || [];
  }
}
