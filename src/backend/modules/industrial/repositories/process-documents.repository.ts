import { supabase } from '@/lib/supabase-client';
import type {
  ProcessDocument,
  CreateProcessDocumentDTO,
  UpdateProcessDocumentDTO,
} from '../dto/process-documents.dto';

export class ProcessDocumentRepository {
  async findAll(processId?: string): Promise<ProcessDocument[]> {
    let query = supabase
      .from('process_documents')
      .select('*')
      .order('created_at', { ascending: false });

    if (processId) {
      query = query.eq('processo_id', processId);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch process documents: ${error.message}`);
    }

    return data as ProcessDocument[];
  }

  async findById(id: string): Promise<ProcessDocument | null> {
    const { data, error } = await supabase
      .from('process_documents')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Failed to fetch process document: ${error.message}`);
    }

    return data as ProcessDocument;
  }

  async create(dto: CreateProcessDocumentDTO): Promise<ProcessDocument> {
    const { data, error } = await supabase
      .from('process_documents')
      .insert(dto)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create process document: ${error.message}`);
    }

    return data as ProcessDocument;
  }

  async update(id: string, dto: UpdateProcessDocumentDTO): Promise<ProcessDocument> {
    const { data, error } = await supabase
      .from('process_documents')
      .update(dto)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update process document: ${error.message}`);
    }

    return data as ProcessDocument;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('process_documents')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete process document: ${error.message}`);
    }
  }

  async findByProcessId(processId: string): Promise<ProcessDocument[]> {
    const { data, error } = await supabase
      .from('process_documents')
      .select('*')
      .eq('processo_id', processId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch process documents by process: ${error.message}`);
    }

    return data as ProcessDocument[];
  }

  async findByType(processId: string, tipo: string): Promise<ProcessDocument[]> {
    const { data, error } = await supabase
      .from('process_documents')
      .select('*')
      .eq('processo_id', processId)
      .eq('tipo', tipo)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch process documents by type: ${error.message}`);
    }

    return data as ProcessDocument[];
  }
}
