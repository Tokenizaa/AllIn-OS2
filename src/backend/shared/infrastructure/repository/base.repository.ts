/**
 * Base Repository Interface
 * 
 * Interface base para todos os repositories, padronizando operações CRUD.
 */

import { supabase } from './supabase/client';

export interface BaseEntity {
  id: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date | null;
}

export interface FindOptions {
  filters?: Record<string, any>;
  orderBy?: string;
  ascending?: boolean;
  limit?: number;
  offset?: number;
}

export interface PaginationOptions {
  page?: number;
  pageSize?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export abstract class BaseRepository<T extends BaseEntity> {
  protected tableName: string;
  protected schema: string;

  constructor(tableName: string, schema: string = 'public') {
    this.tableName = tableName;
    this.schema = schema;
  }

  /**
   * Busca todos os registros
   * 
   * @param options Opções de busca
   * @returns Lista de registros
   */
  async findAll(options?: FindOptions): Promise<T[]> {
    let query = supabase
      .from(this.tableName)
      .select('*');

    // Aplicar filtros
    if (options?.filters) {
      for (const [key, value] of Object.entries(options.filters)) {
        query = query.eq(key, value);
      }
    }

    // Aplicar ordenação
    if (options?.orderBy) {
      query = query.order(options.orderBy, { ascending: options.ascending ?? true });
    }

    // Aplicar paginação
    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }

    // Filtrar registros não deletados (soft delete)
    query = query.is('deleted_at', null);

    const { data, error } = await query;

    if (error) throw error;
    return (data || []) as T[];
  }

  /**
   * Busca registro por ID
   * 
   * @param id ID do registro
   * @returns Registro ou null
   */
  async findById(id: string): Promise<T | null> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return data as T;
  }

  /**
   * Busca um registro por filtros
   * 
   * @param filters Filtros de busca
   * @returns Registro ou null
   */
  async findOne(filters: Record<string, any>): Promise<T | null> {
    let query = supabase
      .from(this.tableName)
      .select('*')
      .is('deleted_at', null);

    for (const [key, value] of Object.entries(filters)) {
      query = query.eq(key, value);
    }

    const { data, error } = await query.single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return data as T;
  }

  /**
   * Cria novo registro
   * 
   * @param entity Dados da entidade
   * @returns Registro criado
   */
  async create(entity: Partial<T>): Promise<T> {
    const { data, error } = await supabase
      .from(this.tableName)
      .insert({
        ...entity,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data as T;
  }

  /**
   * Atualiza registro
   * 
   * @param id ID do registro
   * @param entity Dados para atualização
   * @returns Registro atualizado
   */
  async update(id: string, entity: Partial<T>): Promise<T> {
    const { data, error } = await supabase
      .from(this.tableName)
      .update({
        ...entity,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as T;
  }

  /**
   * Remove registro (soft delete)
   * 
   * @param id ID do registro
   * @returns true se removido com sucesso
   */
  async delete(id: string): Promise<boolean> {
    const { error } = await supabase
      .from(this.tableName)
      .update({
        deleted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) throw error;
    return true;
  }

  /**
   * Remove registro permanentemente (hard delete)
   * 
   * @param id ID do registro
   * @returns true se removido com sucesso
   */
  async hardDelete(id: string): Promise<boolean> {
    const { error } = await supabase
      .from(this.tableName)
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }

  /**
   * Conta total de registros
   * 
   * @param filters Filtros opcionais
   * @returns Total de registros
   */
  async count(filters?: Record<string, any>): Promise<number> {
    let query = supabase
      .from(this.tableName)
      .select('*', { count: 'exact', head: true })
      .is('deleted_at', null);

    if (filters) {
      for (const [key, value] of Object.entries(filters)) {
        query = query.eq(key, value);
      }
    }

    const { count, error } = await query;

    if (error) throw error;
    return count || 0;
  }

  /**
   * Busca com paginação
   * 
   * @param options Opções de paginação
   * @returns Resultado paginado
   */
  async findPaginated(options: FindOptions & PaginationOptions): Promise<PaginatedResult<T>> {
    const page = options.page || 1;
    const pageSize = options.pageSize || 10;
    const offset = (page - 1) * pageSize;

    const [data, total] = await Promise.all([
      this.findAll({
        ...options,
        limit: pageSize,
        offset,
      }),
      this.count(options?.filters),
    ]);

    return {
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  /**
   * Verifica se registro existe
   * 
   * @param id ID do registro
   * @returns true se existe
   */
  async exists(id: string): Promise<boolean> {
    const entity = await this.findById(id);
    return entity !== null;
  }

  /**
   * Busca múltiplos registros por IDs
   * 
   * @param ids Lista de IDs
   * @returns Lista de registros
   */
  async findByIds(ids: string[]): Promise<T[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .in('id', ids)
      .is('deleted_at', null);

    if (error) throw error;
    return (data || []) as T[];
  }

  /**
   * Executa query customizada
   * 
   * @param queryBuilder Builder de query
   * @returns Resultado da query
   */
  protected async executeQuery(queryBuilder: any): Promise<T[]> {
    const { data, error } = await queryBuilder;

    if (error) throw error;
    return (data || []) as T[];
  }
}
