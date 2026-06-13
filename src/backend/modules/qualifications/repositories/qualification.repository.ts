/**
 * Qualification Repository
 * 
 * Repository para operações de database relacionadas a qualificações.
 */

import { BaseRepository, BaseEntity, FindOptions, PaginatedResult, PaginationOptions } from '../../../shared/infrastructure/repository/base.repository';

export interface Qualification extends BaseEntity {
  distribuidor_id: string;
  nivel: string;
  data_atingimento: Date;
  requisitos: any;
  pontos: number;
  status: string;
}

export class QualificationRepository extends BaseRepository<Qualification> {
  constructor() {
    super('qualificacoes', 'mlm');
  }

  /**
   * Busca qualificação atual de um distribuidor
   * 
   * @param distributorId ID do distribuidor
   * @returns Qualificação atual ou null
   */
  async findCurrentByDistributor(distributorId: string): Promise<Qualification | null> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('distribuidor_id', distributorId)
      .eq('status', 'active')
      .is('deleted_at', null)
      .order('data_atingimento', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return data as Qualification;
  }

  /**
   * Busca histórico de qualificações de um distribuidor
   * 
   * @param distributorId ID do distribuidor
   * @param options Opções de busca
   * @returns Lista de qualificações
   */
  async findHistoryByDistributor(distributorId: string, options?: FindOptions): Promise<Qualification[]> {
    return this.findAll({
      ...options,
      filters: { distribuidor_id: distributorId, ...options?.filters },
      orderBy: 'data_atingimento',
      ascending: false,
    });
  }

  /**
   * Busca qualificações por nível
   * 
   * @param level Nível de qualificação
   * @param options Opções de busca
   * @returns Lista de qualificações
   */
  async findByLevel(level: string, options?: FindOptions): Promise<Qualification[]> {
    return this.findAll({
      ...options,
      filters: { nivel: level, ...options?.filters },
    });
  }

  /**
   * Atualiza qualificação de um distribuidor
   * 
   * @param distributorId ID do distribuidor
   * @param level Novo nível
   * @param requirements Requisitos
   * @param points Pontos
   * @returns Qualificação atualizada
   */
  async updateQualification(
    distributorId: string,
    level: string,
    requirements: any,
    points: number
  ): Promise<Qualification> {
    // Primeiro, desativar qualificação atual
    const current = await this.findCurrentByDistributor(distributorId);
    if (current) {
      await this.update(current.id, { status: 'inactive' });
    }

    // Criar nova qualificação
    return this.create({
      distribuidor_id: distributorId,
      nivel: level,
      data_atingimento: new Date().toISOString(),
      requisitos: requirements,
      pontos: points,
      status: 'active',
    });
  }

  /**
   * Busca qualificações com paginação
   * 
   * @param options Opções de busca e paginação
   * @returns Resultado paginado
   */
  async findPaginated(options: FindOptions & PaginationOptions): Promise<PaginatedResult<Qualification>> {
    return super.findPaginated(options);
  }
}
