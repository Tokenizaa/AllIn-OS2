import { supabase } from '@/lib/supabase-client';
import type {
  ProcessStep,
  CreateProcessStepDTO,
  UpdateProcessStepDTO,
} from '../dto/process-steps.dto';

export class ProcessStepRepository {
  async findAll(processId?: string): Promise<ProcessStep[]> {
    let query = supabase
      .from('process_steps')
      .select('*')
      .order('sequencia', { ascending: true });

    if (processId) {
      query = query.eq('processo_id', processId);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch process steps: ${error.message}`);
    }

    return data as ProcessStep[];
  }

  async findById(id: string): Promise<ProcessStep | null> {
    const { data, error } = await supabase
      .from('process_steps')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Failed to fetch process step: ${error.message}`);
    }

    return data as ProcessStep;
  }

  async create(dto: CreateProcessStepDTO): Promise<ProcessStep> {
    const { data, error } = await supabase
      .from('process_steps')
      .insert(dto)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create process step: ${error.message}`);
    }

    return data as ProcessStep;
  }

  async update(id: string, dto: UpdateProcessStepDTO): Promise<ProcessStep> {
    const { data, error } = await supabase
      .from('process_steps')
      .update(dto)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update process step: ${error.message}`);
    }

    return data as ProcessStep;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('process_steps')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete process step: ${error.message}`);
    }
  }

  async findByProcessId(processId: string): Promise<ProcessStep[]> {
    const { data, error } = await supabase
      .from('process_steps')
      .select('*')
      .eq('processo_id', processId)
      .order('sequencia', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch process steps by process: ${error.message}`);
    }

    return data as ProcessStep[];
  }
}
