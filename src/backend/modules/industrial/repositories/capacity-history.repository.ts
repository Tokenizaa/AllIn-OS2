import { supabase } from '@/lib/supabase-client';
import type {
  CapacityHistory,
  CreateCapacityHistoryDTO,
  UpdateCapacityHistoryDTO,
} from '../dto/capacity-history.dto';

export class CapacityHistoryRepository {
  async findAll(capacityId?: string): Promise<CapacityHistory[]> {
    let query = supabase
      .from('capacity_history')
      .select('*')
      .order('data_registro', { ascending: false });

    if (capacityId) {
      query = query.eq('capacity_id', capacityId);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch capacity history: ${error.message}`);
    }

    return data as CapacityHistory[];
  }

  async findById(id: string): Promise<CapacityHistory | null> {
    const { data, error } = await supabase
      .from('capacity_history')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Failed to fetch capacity history: ${error.message}`);
    }

    return data as CapacityHistory;
  }

  async create(dto: CreateCapacityHistoryDTO): Promise<CapacityHistory> {
    const { data, error } = await supabase
      .from('capacity_history')
      .insert(dto)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create capacity history: ${error.message}`);
    }

    return data as CapacityHistory;
  }

  async update(id: string, dto: UpdateCapacityHistoryDTO): Promise<CapacityHistory> {
    const { data, error } = await supabase
      .from('capacity_history')
      .update(dto)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update capacity history: ${error.message}`);
    }

    return data as CapacityHistory;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('capacity_history')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete capacity history: ${error.message}`);
    }
  }

  async findByCapacityId(capacityId: string): Promise<CapacityHistory[]> {
    const { data, error } = await supabase
      .from('capacity_history')
      .select('*')
      .eq('capacity_id', capacityId)
      .order('data_registro', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch capacity history by capacity: ${error.message}`);
    }

    return data as CapacityHistory[];
  }

  async findByDateRange(startDate: string, endDate: string): Promise<CapacityHistory[]> {
    const { data, error } = await supabase
      .from('capacity_history')
      .select('*')
      .gte('data_registro', startDate)
      .lte('data_registro', endDate)
      .order('data_registro', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch capacity history by date range: ${error.message}`);
    }

    return data as CapacityHistory[];
  }

  async findByMachineId(machineId: string): Promise<CapacityHistory[]> {
    const { data, error } = await supabase
      .from('capacity_history')
      .select('*')
      .eq('maquina_id', machineId)
      .order('data_registro', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch capacity history by machine: ${error.message}`);
    }

    return data as CapacityHistory[];
  }

  async calculateAverageEfficiency(capacityId: string): Promise<number> {
    const { data, error } = await supabase
      .from('capacity_history')
      .select('eficiencia_percentual')
      .eq('capacity_id', capacityId);

    if (error) {
      throw new Error(`Failed to calculate average efficiency: ${error.message}`);
    }

    if (!data || data.length === 0) {
      return 0;
    }

    const sum = data.reduce((acc, curr) => acc + (curr.eficiencia_percentual || 0), 0);
    return sum / data.length;
  }
}
