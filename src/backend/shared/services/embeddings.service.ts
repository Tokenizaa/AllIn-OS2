/**
 * Embeddings Service
 * 
 * Service para gerar e buscar embeddings usando pgvector.
 */

import { supabase } from '../infrastructure/supabase/client';

export interface Embedding {
  id: string;
  resource_type: string;
  resource_id: string;
  content: string;
  embedding: number[];
  metadata: any;
  created_at: Date;
  updated_at: Date;
}

export interface SimilarEmbedding {
  id: string;
  resource_type: string;
  resource_id: string;
  content: string;
  metadata: any;
  similarity: number;
}

export class EmbeddingsService {
  private parseEmbedding(value: unknown): number[] {
    if (Array.isArray(value)) {
      return value.map((item) => Number(item)).filter((item) => Number.isFinite(item));
    }

    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (!trimmed) {
        return [];
      }

      try {
        return this.parseEmbedding(JSON.parse(trimmed));
      } catch {
        return trimmed
          .replace(/^\[/, '')
          .replace(/\]$/, '')
          .split(',')
          .map((item) => Number(item.trim()))
          .filter((item) => Number.isFinite(item));
      }
    }

    return [];
  }

  /**
   * Cria ou atualiza embedding
   * 
   * @param resourceType Tipo do recurso
   * @param resourceId ID do recurso
   * @param content Conteúdo para gerar embedding
   * @param embedding Vetor de embedding
   * @param metadata Metadados opcionais
   * @returns ID do embedding
   */
  async upsertEmbedding(
    resourceType: string,
    resourceId: string,
    content: string,
    embedding: number[],
    metadata: any = {}
  ): Promise<string> {
    const { data, error } = await supabase.rpc('update_embedding', {
      p_resource_type: resourceType,
      p_resource_id: resourceId,
      p_content: content,
      p_embedding: `[${embedding.join(',')}]`,
      p_metadata: metadata,
    });

    if (error) throw error;
    return data;
  }

  /**
   * Busca embeddings similares
   * 
   * @param embedding Vetor de embedding para busca
   * @param resourceType Tipo do recurso
   * @param limit Limite de resultados
   * @param threshold Limiar de similaridade
   * @returns Lista de embeddings similares
   */
  async searchSimilar(
    embedding: number[],
    resourceType: string,
    limit: number = 10,
    threshold: number = 0.5
  ): Promise<SimilarEmbedding[]> {
    const { data, error } = await supabase.rpc('search_similar_embeddings', {
      search_embedding: `[${embedding.join(',')}]`,
      search_resource_type: resourceType,
      limit_count: limit,
      similarity_threshold: threshold,
    });

    if (error) throw error;
    return data || [];
  }

  /**
   * Deleta embedding
   * 
   * @param resourceType Tipo do recurso
   * @param resourceId ID do recurso
   * @returns true se deletado
   */
  async deleteEmbedding(resourceType: string, resourceId: string): Promise<boolean> {
    const { data, error } = await supabase.rpc('delete_embedding', {
      p_resource_type: resourceType,
      p_resource_id: resourceId,
    });

    if (error) throw error;
    return data;
  }

  /**
   * Busca embedding por recurso
   * 
   * @param resourceType Tipo do recurso
   * @param resourceId ID do recurso
   * @returns Embedding ou null
   */
  async findByResource(resourceType: string, resourceId: string): Promise<Embedding | null> {
    const { data, error } = await supabase
      .schema('system')
      .from('embeddings')
      .select('*')
      .eq('resource_type', resourceType)
      .eq('resource_id', resourceId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return {
      ...data,
      embedding: this.parseEmbedding(data.embedding),
    };
  }

  /**
   * Deleta todos os embeddings de um tipo de recurso
   * 
   * @param resourceType Tipo do recurso
   * @returns Número de embeddings deletados
   */
  async deleteByResourceType(resourceType: string): Promise<number> {
    const { error } = await supabase
      .schema('system')
      .from('embeddings')
      .delete()
      .eq('resource_type', resourceType);

    if (error) throw error;
    return 0; // Supabase não retorna count em delete
  }

  /**
   * Conta embeddings por tipo de recurso
   * 
   * @param resourceType Tipo do recurso
   * @returns Total de embeddings
   */
  async countByResourceType(resourceType: string): Promise<number> {
    const { count, error } = await supabase
      .schema('system')
      .from('embeddings')
      .select('*', { count: 'exact', head: true })
      .eq('resource_type', resourceType);

    if (error) throw error;
    return count || 0;
  }

  /**
   * Lista todos os embeddings de um tipo de recurso
   * 
   * @param resourceType Tipo do recurso
   * @param limit Limite de resultados
   * @returns Lista de embeddings
   */
  async listByResourceType(resourceType: string, limit: number = 100): Promise<Embedding[]> {
    const { data, error } = await supabase
      .schema('system')
      .from('embeddings')
      .select('*')
      .eq('resource_type', resourceType)
      .limit(limit);

    if (error) throw error;
    return (data || []).map(e => ({
      ...e,
      embedding: this.parseEmbedding(e.embedding),
    }));
  }
}
