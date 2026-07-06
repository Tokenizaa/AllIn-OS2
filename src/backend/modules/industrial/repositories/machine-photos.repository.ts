import { supabase } from '@/lib/supabase-client';
import type {
  MachinePhoto,
  CreateMachinePhotoDTO,
  UpdateMachinePhotoDTO,
} from '../dto/machine-photos.dto';

export class MachinePhotoRepository {
  async findAll(machineId?: string): Promise<MachinePhoto[]> {
    let query = supabase
      .from('machine_photos')
      .select('*')
      .order('ordem', { ascending: true });

    if (machineId) {
      query = query.eq('maquina_id', machineId);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch machine photos: ${error.message}`);
    }

    return data as MachinePhoto[];
  }

  async findById(id: string): Promise<MachinePhoto | null> {
    const { data, error } = await supabase
      .from('machine_photos')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Failed to fetch machine photo: ${error.message}`);
    }

    return data as MachinePhoto;
  }

  async create(dto: CreateMachinePhotoDTO): Promise<MachinePhoto> {
    const { data, error } = await supabase
      .from('machine_photos')
      .insert(dto)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create machine photo: ${error.message}`);
    }

    return data as MachinePhoto;
  }

  async update(id: string, dto: UpdateMachinePhotoDTO): Promise<MachinePhoto> {
    const { data, error } = await supabase
      .from('machine_photos')
      .update(dto)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update machine photo: ${error.message}`);
    }

    return data as MachinePhoto;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('machine_photos')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete machine photo: ${error.message}`);
    }
  }

  async findByMachineId(machineId: string): Promise<MachinePhoto[]> {
    const { data, error } = await supabase
      .from('machine_photos')
      .select('*')
      .eq('maquina_id', machineId)
      .order('ordem', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch machine photos by machine: ${error.message}`);
    }

    return data as MachinePhoto[];
  }

  async findByCategory(machineId: string, categoria: string): Promise<MachinePhoto[]> {
    const { data, error } = await supabase
      .from('machine_photos')
      .select('*')
      .eq('maquina_id', machineId)
      .eq('categoria', categoria)
      .order('ordem', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch machine photos by category: ${error.message}`);
    }

    return data as MachinePhoto[];
  }

  async updateOrder(id: string, ordem: number): Promise<MachinePhoto> {
    const { data, error } = await supabase
      .from('machine_photos')
      .update({ ordem })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update machine photo order: ${error.message}`);
    }

    return data as MachinePhoto;
  }
}
