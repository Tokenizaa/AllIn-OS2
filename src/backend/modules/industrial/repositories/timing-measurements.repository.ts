import { supabase } from '@/lib/supabase-client';
import type {
  TimingMeasurement,
  CreateTimingMeasurementDTO,
  UpdateTimingMeasurementDTO,
} from '../dto/timing-measurements.dto';

export class TimingMeasurementRepository {
  async findAll(timingRecordId?: string): Promise<TimingMeasurement[]> {
    let query = supabase
      .from('timing_measurements')
      .select('*')
      .order('numero_medicao', { ascending: true });

    if (timingRecordId) {
      query = query.eq('timing_record_id', timingRecordId);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch timing measurements: ${error.message}`);
    }

    return data as TimingMeasurement[];
  }

  async findById(id: string): Promise<TimingMeasurement | null> {
    const { data, error } = await supabase
      .from('timing_measurements')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Failed to fetch timing measurement: ${error.message}`);
    }

    return data as TimingMeasurement;
  }

  async create(dto: CreateTimingMeasurementDTO): Promise<TimingMeasurement> {
    const { data, error } = await supabase
      .from('timing_measurements')
      .insert(dto)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create timing measurement: ${error.message}`);
    }

    return data as TimingMeasurement;
  }

  async update(id: string, dto: UpdateTimingMeasurementDTO): Promise<TimingMeasurement> {
    const { data, error } = await supabase
      .from('timing_measurements')
      .update(dto)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update timing measurement: ${error.message}`);
    }

    return data as TimingMeasurement;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('timing_measurements')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete timing measurement: ${error.message}`);
    }
  }

  async findByTimingRecordId(timingRecordId: string): Promise<TimingMeasurement[]> {
    const { data, error } = await supabase
      .from('timing_measurements')
      .select('*')
      .eq('timing_record_id', timingRecordId)
      .order('numero_medicao', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch timing measurements by timing record: ${error.message}`);
    }

    return data as TimingMeasurement[];
  }

  async findByMachineId(machineId: string): Promise<TimingMeasurement[]> {
    const { data, error } = await supabase
      .from('timing_measurements')
      .select('*')
      .eq('maquina_id', machineId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch timing measurements by machine: ${error.message}`);
    }

    return data as TimingMeasurement[];
  }

  async findByProcessId(processId: string): Promise<TimingMeasurement[]> {
    const { data, error } = await supabase
      .from('timing_measurements')
      .select('*')
      .eq('processo_id', processId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch timing measurements by process: ${error.message}`);
    }

    return data as TimingMeasurement[];
  }

  async calculateAverage(timingRecordId: string): Promise<number> {
    const { data, error } = await supabase
      .from('timing_measurements')
      .select('duracao_segundos')
      .eq('timing_record_id', timingRecordId)
      .eq('status', 'valid');

    if (error) {
      throw new Error(`Failed to calculate average timing: ${error.message}`);
    }

    if (!data || data.length === 0) {
      return 0;
    }

    const sum = data.reduce((acc, curr) => acc + (curr.duracao_segundos || 0), 0);
    return sum / data.length;
  }
}
