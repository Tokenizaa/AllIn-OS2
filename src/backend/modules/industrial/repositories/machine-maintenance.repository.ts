import { supabase } from '@/lib/supabase-client';
import type {
  MachineMaintenance,
  CreateMachineMaintenanceDTO,
  UpdateMachineMaintenanceDTO,
} from '../dto/machine-maintenance.dto';

export class MachineMaintenanceRepository {
  async findAll(machineId?: string): Promise<MachineMaintenance[]> {
    let query = supabase
      .from('machine_maintenance')
      .select('*')
      .order('data_agendada', { ascending: true });

    if (machineId) {
      query = query.eq('maquina_id', machineId);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch machine maintenance: ${error.message}`);
    }

    return data as MachineMaintenance[];
  }

  async findById(id: string): Promise<MachineMaintenance | null> {
    const { data, error } = await supabase
      .from('machine_maintenance')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Failed to fetch machine maintenance: ${error.message}`);
    }

    return data as MachineMaintenance;
  }

  async create(dto: CreateMachineMaintenanceDTO): Promise<MachineMaintenance> {
    const { data, error } = await supabase
      .from('machine_maintenance')
      .insert(dto)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create machine maintenance: ${error.message}`);
    }

    return data as MachineMaintenance;
  }

  async update(id: string, dto: UpdateMachineMaintenanceDTO): Promise<MachineMaintenance> {
    const { data, error } = await supabase
      .from('machine_maintenance')
      .update(dto)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update machine maintenance: ${error.message}`);
    }

    return data as MachineMaintenance;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('machine_maintenance')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete machine maintenance: ${error.message}`);
    }
  }

  async findByMachineId(machineId: string): Promise<MachineMaintenance[]> {
    const { data, error } = await supabase
      .from('machine_maintenance')
      .select('*')
      .eq('maquina_id', machineId)
      .order('data_agendada', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch machine maintenance by machine: ${error.message}`);
    }

    return data as MachineMaintenance[];
  }

  async findUpcoming(days: number = 30): Promise<MachineMaintenance[]> {
    const { data, error } = await supabase
      .from('machine_maintenance')
      .select('*')
      .eq('status', 'scheduled')
      .gte('data_agendada', new Date().toISOString())
      .lte('data_agendada', new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString())
      .order('data_agendada', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch upcoming maintenance: ${error.message}`);
    }

    return data as MachineMaintenance[];
  }
}
