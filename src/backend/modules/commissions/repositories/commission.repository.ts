/**
 * Commission Repository
 * 
 * Repository para operações de database relacionadas a comissões.
 */

import { BaseRepository, BaseEntity, FindOptions, PaginatedResult, PaginationOptions } from '../../../shared/infrastructure/repository/base.repository';

export interface Commission extends BaseEntity {
  distribuidor_id: string;
  pedido_id: string;
  tipo: string;
  geracao: number;
  valor_base: number;
  porcentagem: number;
  valor_comissao: number;
  periodo_inicio: Date;
  periodo_fim: Date;
  status: string;
  data_calculo: Date;
  data_aprovacao?: Date;
  data_pagamento?: Date;
  referencia_id?: string;
  referencia_tipo?: string;
  descricao?: string;
}

export class CommissionRepository extends BaseRepository<Commission> {
  constructor() {
    super('comissoes', 'mlm');
  }

  /**
   * Busca comissões por distribuidor
   * 
   * @param distributorId ID do distribuidor
   * @param options Opções de busca
   * @returns Lista de comissões
   */
  async findByDistributorId(distributorId: string, options?: FindOptions): Promise<Commission[]> {
    return this.findAll({
      ...options,
      filters: { distribuidor_id: distributorId, ...options?.filters },
    });
  }

  /**
   * Busca comissões por pedido
   * 
   * @param pedidoId ID do pedido
   * @param options Opções de busca
   * @returns Lista de comissões
   */
  async findByPedidoId(pedidoId: string, options?: FindOptions): Promise<Commission[]> {
    return this.findAll({
      ...options,
      filters: { pedido_id: pedidoId, ...options?.filters },
    });
  }

  /**
   * Busca comissões por status
   * 
   * @param status Status das comissões
   * @param options Opções de busca
   * @returns Lista de comissões
   */
  async findByStatus(status: string, options?: FindOptions): Promise<Commission[]> {
    return this.findAll({
      ...options,
      filters: { status, ...options?.filters },
    });
  }

  /**
   * Busca comissões por período
   * 
   * @param startDate Data inicial
   * @param endDate Data final
   * @param options Opções de busca
   * @returns Lista de comissões
   */
  async findByPeriod(startDate: Date, endDate: Date, options?: FindOptions): Promise<Commission[]> {
    const { data, error } = await this.executeQuery(
      supabase
        .from(this.tableName)
        .select('*')
        .gte('periodo_inicio', startDate.toISOString())
        .lte('periodo_fim', endDate.toISOString())
        .is('deleted_at', null)
    );

    if (error) throw error;
    return data as Commission[];
  }

  /**
   * Busca comissões pendentes de um distribuidor
   * 
   * @param distributorId ID do distribuidor
   * @param options Opções de busca
   * @returns Lista de comissões pendentes
   */
  async findPendingByDistributor(distributorId: string, options?: FindOptions): Promise<Commission[]> {
    return this.findAll({
      ...options,
      filters: { distribuidor_id: distributorId, status: 'pending', ...options?.filters },
    });
  }

  /**
   * Aprova comissão
   * 
   * @param id ID da comissão
   * @returns Comissão atualizada
   */
  async approve(id: string): Promise<Commission> {
    return this.update(id, {
      status: 'approved',
      data_aprovacao: new Date().toISOString(),
    });
  }

  /**
   * Marca comissão como paga
   * 
   * @param id ID da comissão
   * @returns Comissão atualizada
   */
  async markAsPaid(id: string): Promise<Commission> {
    return this.update(id, {
      status: 'paid',
      data_pagamento: new Date().toISOString(),
    });
  }

  /**
   * Cancela comissão
   * 
   * @param id ID da comissão
   * @returns Comissão atualizada
   */
  async cancel(id: string): Promise<Commission> {
    return this.update(id, {
      status: 'cancelled',
    });
  }

  /**
   * Soma valor de comissões por distribuidor
   * 
   * @param distributorId ID do distribuidor
   * @param status Status opcional
   * @returns Soma das comissões
   */
  async sumByDistributor(distributorId: string, status?: string): Promise<number> {
    let query = supabase
      .from(this.tableName)
      .select('valor_comissao')
      .eq('distribuidor_id', distributorId)
      .is('deleted_at', null);

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) throw error;
    return (data || []).reduce((sum, item) => sum + (parseFloat(item.valor_comissao) || 0), 0);
  }

  /**
   * Busca comissões com paginação
   * 
   * @param options Opções de busca e paginação
   * @returns Resultado paginado
   */
  async findPaginated(options: FindOptions & PaginationOptions): Promise<PaginatedResult<Commission>> {
    return super.findPaginated(options);
  }
}
