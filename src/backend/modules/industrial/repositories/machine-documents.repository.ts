import { supabase } from '@/lib/supabase-client';
import type {
  MachineDocument,
  CreateMachineDocumentDTO,
  UpdateMachineDocumentDTO,
} from '../dto/machine-documents.dto';

export class MachineDocumentRepository {
  async findAll(machineId?: string): Promise<MachineDocument[]> {
    let query = supabase
      .from('machine_documents')
      .select('*')
      .order('created_at', { ascending: false });

    if (machineId) {
      query = query.eq('maquina_id', machineId);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch machine documents: ${error.message}`);
    }

    return data as MachineDocument[];
  }

  async findById(id: string): Promise<MachineDocument | null> {
    const { data, error } = await supabase
      .from('machine_documents')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Failed to fetch machine document: ${error.message}`);
    }

    return data as MachineDocument;
  }

  async create(dto: CreateMachineDocumentDTO): Promise<MachineDocument> {
    const { data, error } = await supabase
      .from('machine_documents')
      .insert(dto)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create machine document: ${error.message}`);
    }

    return data as MachineDocument;
  }

  async update(id: string, dto: UpdateMachineDocumentDTO): Promise<MachineDocument> {
    const { data, error } = await supabase
      .from('machine_documents')
      .update(dto)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update machine document: ${error.message}`);
    }

    return data as MachineDocument;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('machine_documents')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete machine document: ${error.message}`);
    }
  }

  async findByMachineId(machineId: string): Promise<MachineDocument[]> {
    const { data, error } = await supabase
      .from('machine_documents')
      .select('*')
      .eq('maquina_id', machineId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch machine documents by machine: ${error.message}`);
    }

    return data as MachineDocument[];
  }

  async findByType(machineId: string, tipo: string): Promise<MachineDocument[]> {
    const { data, error } = await supabase
      .from('machine_documents')
      .select('*')
      .eq('maquina_id', machineId)
      .eq('tipo', tipo)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch machine documents by type: ${error.message}`);
    }

    return data as MachineDocument[];
  }
}
