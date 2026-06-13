// ============================================================================
// COMMERCE SERVICE - ALLIN OS 2.0
// Serviço para gestão de comércio eletrônico
// ============================================================================

import { ApiClient } from '../client';
import { Produto, ProdutoCategoria, FormaPagamento, Pedido, PedidoItem, Fabricante } from '../types';

export class CommerceService {
  constructor(private client: ApiClient) {}

  /**
   * Lista produtos
   */
  async listProdutos(filters?: {
    limit?: number;
    page?: number;
    nome__contem?: string;
    categoria_id?: number;
    fabricante_id?: number;
    ativo?: boolean;
  }): Promise<Produto[]> {
    const response = await this.client.getWithFilters<Produto[]>('/v1/produtos', filters || {});
    return response.data;
  }

  /**
   * Cria novo produto
   */
  async createProduto(produto: Partial<Produto>): Promise<Produto> {
    const response = await this.client.post<Produto>('/v1/produtos', produto);
    return response.data;
  }

  /**
   * Atualiza produto
   */
  async updateProduto(produtoId: number, produto: Partial<Produto>): Promise<Produto> {
    const response = await this.client.put<Produto>(`/v1/produtos/${produtoId}`, produto);
    return response.data;
  }

  /**
   * Gerencia estoque de produtos
   */
  async manageEstoque(produtoId: number, estoque: any): Promise<any> {
    const response = await this.client.post<any>('/v1/produtos/Estoque', {
      produto_id: produtoId,
      ...estoque,
    });
    return response.data;
  }

  /**
   * Lista estoque total de produtos
   */
  async listEstoqueTotal(filters?: {
    limit?: number;
    page?: number;
    produto_id?: number;
  }): Promise<any[]> {
    const response = await this.client.getWithFilters<any[]>('/v1/produtos/EstoqueTotais', filters || {});
    return response.data;
  }

  /**
   * Retorna estoque total por opção e loja
   */
  async getEstoqueTotalProdutos(): Promise<any[]> {
    const response = await this.client.get<any[]>('/v1/estoque-total-produtos');
    return response.data;
  }

  /**
   * Gerencia valores de opções de produtos
   */
  async manageOpcoesValores(opcaoValor: any): Promise<any> {
    const response = await this.client.post<any>('/v1/produtos/OpcoesValores', opcaoValor);
    return response.data;
  }

  /**
   * Lista campos de opções de produtos
   */
  async listCamposOpcoes(filters?: {
    limit?: number;
    page?: number;
  }): Promise<any[]> {
    const response = await this.client.getWithFilters<any[]>('/v1/produtos-campos-opcoes', filters || {});
    return response.data;
  }

  /**
   * Lista categorias de produtos
   */
  async listCategorias(filters?: {
    limit?: number;
    page?: number;
    nome__contem?: string;
    status?: string;
  }): Promise<ProdutoCategoria[]> {
    const response = await this.client.getWithFilters<ProdutoCategoria[]>('/v1/produtos-categorias', filters || {});
    return response.data;
  }

  /**
   * Cria nova categoria
   */
  async createCategoria(categoria: Partial<ProdutoCategoria>): Promise<ProdutoCategoria> {
    const response = await this.client.post<ProdutoCategoria>('/v1/produtos-categorias', categoria);
    return response.data;
  }

  /**
   * Atualiza categoria
   */
  async updateCategoria(categoriaId: number, categoria: Partial<ProdutoCategoria>): Promise<ProdutoCategoria> {
    const response = await this.client.put<ProdutoCategoria>(`/v1/produtos-categorias/${categoriaId}`, categoria);
    return response.data;
  }

  /**
   * Gerencia opções de produtos
   */
  async manageOpcoes(opcao: any): Promise<any> {
    const response = await this.client.post<any>('/v1/produtos-opcoes', opcao);
    return response.data;
  }

  /**
   * Lista formas de pagamento
   */
  async listFormasPagamento(filters?: {
    limit?: number;
    page?: number;
    is_active?: boolean;
  }): Promise<FormaPagamento[]> {
    const response = await this.client.getWithFilters<FormaPagamento[]>('/v1/formas-pagamento', filters || {});
    return response.data;
  }

  /**
   * Cria nova forma de pagamento
   */
  async createFormaPagamento(forma: Partial<FormaPagamento>): Promise<FormaPagamento> {
    const response = await this.client.post<FormaPagamento>('/v1/formas-pagamento', forma);
    return response.data;
  }

  /**
   * Lista pedidos
   */
  async listPedidos(filters?: {
    limit?: number;
    page?: number;
    cliente_id?: number;
    status?: string;
    data_pedido__maior_igual?: string;
    data_pedido__menor_igual?: string;
  }): Promise<Pedido[]> {
    const response = await this.client.getWithFilters<Pedido[]>('/v1/pedidos', filters || {});
    return response.data;
  }

  /**
   * Cria novo pedido
   */
  async createPedido(pedido: Partial<Pedido>): Promise<Pedido> {
    const response = await this.client.post<Pedido>('/v1/pedidos', pedido);
    return response.data;
  }

  /**
   * Altera status do pedido
   */
  async alterarStatusPedido(pedidoId: number, status: string): Promise<void> {
    await this.client.post('/v1/pedidos/AlterarStatus', {
      id: pedidoId,
      status,
    });
  }

  /**
   * Cancela pedido
   */
  async cancelarPedido(pedidoId: number): Promise<void> {
    await this.client.post('/v1/pedidos/Cancelar', { id: pedidoId });
  }

  /**
   * Confirma pagamento do pedido
   */
  async confirmarPagamento(pedidoId: number): Promise<void> {
    await this.client.post('/v1/pedidos/ConfirmarPagamento', { id: pedidoId });
  }

  /**
   * Gerencia histórico do pedido
   */
  async manageHistorico(pedidoId: number, historico: any): Promise<any> {
    const response = await this.client.post<any>('/v1/pedidos/Historico', {
      pedido_id: pedidoId,
      ...historico,
    });
    return response.data;
  }

  /**
   * Lista itens do pedido
   */
  async listItensPedido(pedidoId: number): Promise<PedidoItem[]> {
    const response = await this.client.get<PedidoItem[]>(`/v1/pedidos/Itens?pedido_id=${pedidoId}`);
    return response.data;
  }

  /**
   * Lista itens de kit do pedido
   */
  async listKitItensPedido(pedidoId: number): Promise<any[]> {
    const response = await this.client.get<any[]>(`/v1/pedidos/Itens/KitItens?pedido_id=${pedidoId}`);
    return response.data;
  }

  /**
   * Lista itens de faturamento do pedido
   */
  async listItensFaturamento(pedidoId: number): Promise<any[]> {
    const response = await this.client.get<any[]>(`/v1/pedidos/ItensFaturamento?pedido_id=${pedidoId}`);
    return response.data;
  }

  /**
   * Gerencia pagamentos do pedido
   */
  async managePagamentos(pagamento: any): Promise<any> {
    const response = await this.client.post<any>('/v1/pedidos/Pagamentos', pagamento);
    return response.data;
  }

  /**
   * Lista totais do pedido
   */
  async listTotaisPedido(pedidoId: number): Promise<any[]> {
    const response = await this.client.get<any[]>(`/v1/pedidos/Totais?pedido_id=${pedidoId}`);
    return response.data;
  }

  /**
   * Lista transportes do pedido
   */
  async listTransportesPedido(pedidoId: number): Promise<any[]> {
    const response = await this.client.get<any[]>(`/v1/pedidos/Transportes?pedido_id=${pedidoId}`);
    return response.data;
  }

  /**
   * Lista fabricantes
   */
  async listFabricantes(filters?: {
    limit?: number;
    page?: number;
    nome__contem?: string;
    is_active?: boolean;
  }): Promise<Fabricante[]> {
    const response = await this.client.getWithFilters<Fabricante[]>('/v1/fabricantes', filters || {});
    return response.data;
  }

  /**
   * Cria novo fabricante
   */
  async createFabricante(fabricante: Partial<Fabricante>): Promise<Fabricante> {
    const response = await this.client.post<Fabricante>('/v1/fabricantes', fabricante);
    return response.data;
  }

  /**
   * Atualiza fabricante
   */
  async updateFabricante(fabricanteId: number, fabricante: Partial<Fabricante>): Promise<Fabricante> {
    const response = await this.client.put<Fabricante>(`/v1/fabricantes/${fabricanteId}`, fabricante);
    return response.data;
  }

  /**
   * Lista lojas
   */
  async listLojas(filters?: {
    limit?: number;
    page?: number;
    nome__contem?: string;
    status?: number;
  }): Promise<any[]> {
    const response = await this.client.getWithFilters<any[]>('/v1/lojas', filters || {});
    return response.data;
  }

  /**
   * Lista situações de pedidos
   */
  async listPedidosStatus(filters?: {
    limit?: number;
    page?: number;
  }): Promise<any[]> {
    const response = await this.client.getWithFilters<any[]>('/v1/pedidos-status', filters || {});
    return response.data;
  }

  /**
   * Cria nova situação de pedido
   */
  async createPedidoStatus(status: any): Promise<any> {
    const response = await this.client.post<any>('/v1/pedidos-status', status);
    return response.data;
  }

  /**
   * Lista saldos gerados na compra de pacotes
   */
  async listPedidosSaldos(filters?: {
    limit?: number;
    page?: number;
    cliente_id?: number;
  }): Promise<any[]> {
    const response = await this.client.getWithFilters<any[]>('/v1/pedidos-saldos', filters || {});
    return response.data;
  }

  /**
   * Lista tipos de campo disponíveis para pedidos
   */
  async listTiposCampoPedido(filters?: {
    limit?: number;
    page?: number;
    ativo?: boolean;
  }): Promise<any[]> {
    const response = await this.client.getWithFilters<any[]>('/v1/tipos-campo-pedido', filters || {});
    return response.data;
  }
}
