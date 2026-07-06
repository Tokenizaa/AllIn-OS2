/**
 * Customer360 Service
 * 
 * Camada única responsável por montar a visão completa 360 do customer
 * Centraliza toda agregação de dados de múltiplas tabelas
 * 
 * OTIMIZAÇÃO: Agora usa customer_360_view para reduzir de 12 queries para 1 query
 * para os dados principais (profile, metrics, network, score).
 * 
 * Fontes de dados:
 * - customer_360_view (view consolidada - otimizado)
 * - orders (pedidos - opcional)
 * - order_items (itens - opcional)
 * - products (produtos - opcional)
 * - customer_product_affinities (afinidades - opcional)
 * - network_relationships (relacionamentos de rede - opcional)
 * - wallet_transactions (transações - opcional)
 */

/**
 * Customer360Service
 * 
 * IDENTIFIER STRATEGY:
 * This service uses `id_comprador` (text) as the canonical identifier for fetching customer data.
 * The `customers.id` (UUID) is only used as a technical primary key in the database.
 * 
 * Rationale: The entire application is built around id_comprador (247 occurrences across 54 files).
 * Using it consistently avoids confusion and maintains compatibility with the existing system.
 * 
 * For migration planning, see: docs/IDENTITY_MIGRATION_MASTER_PLAN.md
 */

import { supabase } from "@/lib/supabase/client";
import type {
  Customer360,
  Customer360Params,
  CustomerProfile,
  CustomerMetrics,
  CustomerNetworkMetrics,
  CustomerScore,
  Wallet,
  PointsWallet,
  WalletTransaction,
  Order,
  OrderItem,
  Product,
  CustomerProductAffinity,
  NetworkRelationship,
  Downline,
  Sponsor,
} from "./types";

export const Customer360Service = {
  /**
   * Busca visão completa 360 do customer por id_comprador
   * 
   * OTIMIZADO: Usa customer_360_view para reduzir queries
   * 
   * @param idComprador - ID do comprador (chave de negócio)
   * @param params - Parâmetros opcionais para incluir/excluir dados
   * @returns Customer360 completo
   */
  async getCustomer360ByIdComprador(
    idComprador: string,
    params: Customer360Params = {}
  ): Promise<Customer360> {
    const {
      includeOrders = true,
      includeOrderItems = true,
      includeProducts = true,
      includeAffinities = true,
      includeNetwork = true,
      includeDownlines = true,
      includeSponsor = true,
      includeWalletTransactions = true,
    } = params;

    // OTIMIZAÇÃO: Buscar dados principais usando customer_360_view (1 query)
    // Em vez de 9 queries paralelas para profile, metrics, networkMetrics, score, wallet, pointsWallet
    const viewData = await this.fetchCustomer360View(idComprador);
    
    if (!viewData) {
      throw new Error("Customer not found");
    }

    // Extrair dados da view
    const profile = this.mapViewToProfile(viewData);
    const metrics = this.mapViewToMetrics(viewData);
    const networkMetrics = this.mapViewToNetworkMetrics(viewData);
    const score = this.mapViewToScore(viewData);
    
    // Buscar dados adicionais em paralelo (apenas se necessário)
    const [
      wallet,
      pointsWallet,
      orders,
      productAffinities,
      networkRelationships,
      downlines,
    ] = await Promise.all([
      this.fetchWallet(idComprador),
      this.fetchPointsWallet(idComprador),
      includeOrders ? this.fetchOrders(idComprador) : Promise.resolve([]),
      includeAffinities ? this.fetchProductAffinities(idComprador) : Promise.resolve([]),
      includeNetwork ? this.fetchNetworkRelationships(idComprador) : Promise.resolve([]),
      includeDownlines ? this.fetchDownlines(idComprador) : Promise.resolve([]),
    ]);

    // Buscar dados sequenciais (dependem de dados anteriores)
    let orderItems: OrderItem[] = [];
    let products: Product[] = [];
    let walletTransactions: WalletTransaction[] = [];
    let sponsor: Sponsor | null = null;

    if (includeOrderItems && orders.length > 0) {
      const orderIds = orders.map((o) => o.id);
      orderItems = await this.fetchOrderItems(orderIds);
      
      if (includeProducts && orderItems.length > 0) {
        const productIds = orderItems
          .map((item) => item.product_id)
          .filter((id): id is string => id !== null && id !== undefined);
        products = await this.fetchProducts(productIds);
      }
    }

    if (includeWalletTransactions && wallet) {
      walletTransactions = await this.fetchWalletTransactions(wallet.id);
    }

    if (includeSponsor && profile?.patrocinador_comprador) {
      sponsor = await this.fetchSponsor(profile.patrocinador_comprador);
    }

    return {
      profile,
      metrics,
      network: networkMetrics,
      score,
      wallet,
      pointsWallet,
      walletTransactions,
      orders,
      orderItems,
      products,
      productAffinities,
      networkRelationships,
      downlines,
      sponsor,
    };
  },

  /**
   * Busca visão completa 360 do customer por UUID
   * 
   * @deprecated Use getCustomer360ByIdComprador() instead. This method accepts UUID but converts to id_comprador internally.
   * @param customerId - UUID do customer
   * @param params - Parâmetros opcionais para incluir/excluir dados
   * @returns Customer360 completo
   */
  async getCustomer360ByCustomerId(
    customerId: string,
    params: Customer360Params = {}
  ): Promise<Customer360> {
    // Primeiro busca o profile para obter o id_comprador
    const profile = await this.fetchProfileByCustomerId(customerId);
    
    if (!profile) {
      throw new Error("Customer not found");
    }

    return this.getCustomer360ByIdComprador(profile.id_comprador, params);
  },

  // ============================================================================
  // MÉTODOS DE BUSCA
  // ============================================================================

  /**
   * Busca dados consolidados da customer_360_view (OTIMIZADO)
   */
  async fetchCustomer360View(idComprador: string): Promise<any | null> {
    const { data, error } = await supabase
      .from("crm.customer_360_view")
      .select("*")
      .eq("id_comprador", idComprador)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  /**
   * Mapeia dados da view para CustomerProfile
   */
  mapViewToProfile(viewData: any): CustomerProfile {
    return {
      id: viewData.id,
      id_comprador: viewData.id_comprador,
      user_id: viewData.user_id || null,
      usuario: viewData.usuario,
      nome_completo: viewData.nome_completo,
      email: viewData.email,
      telefone: viewData.telefone,
      cpf: viewData.cpf,
      endereco: viewData.endereco,
      cidade: viewData.cidade,
      estado: viewData.estado,
      cep: viewData.cep,
      qualificacao: viewData.qualification,
      plano_comprador: viewData.plan_name || null,
      status: viewData.status,
      metadata: null,
      created_at: viewData.data_cadastro || viewData.created_at,
      updated_at: new Date().toISOString(),
      patrocinador_comprador: viewData.patrocinador_comprador || null,
    };
  },

  /**
   * Mapeia dados da view para CustomerMetrics
   */
  mapViewToMetrics(viewData: any): CustomerMetrics | null {
    if (!viewData.ltv && !viewData.total_gasto) return null;
    return {
      id_comprador: viewData.id_comprador,
      ltv: viewData.ltv || 0,
      total_gasto: viewData.total_gasto || 0,
      ticket_medio: viewData.ticket_medio || 0,
      numero_pedidos: viewData.total_pedidos || 0,
      primeiro_pedido: null, // Não disponível na view
      ultimo_pedido: viewData.ultimo_pedido,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  },

  /**
   * Mapeia dados da view para CustomerNetworkMetrics
   */
  mapViewToNetworkMetrics(viewData: any): CustomerNetworkMetrics | null {
    if (!viewData.total_downlines && !viewData.network_revenue) return null;
    return {
      id_comprador: viewData.id_comprador,
      total_network_size: viewData.total_downlines || 0,
      direct_indications: 0, // Não disponível na view
      estimated_bonus: viewData.network_revenue || 0, // Usando network_revenue como proxy
      network_level: 0, // Não disponível na view
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  },

  /**
   * Mapeia dados da view para CustomerScore
   */
  mapViewToScore(viewData: any): CustomerScore | null {
    if (!viewData.engagement_score && !viewData.churn_score) return null;
    // Usando engagement_score como score principal
    return {
      id_comprador: viewData.id_comprador,
      score: viewData.engagement_score || viewData.churn_score || 0,
      metadata: {
        churn_score: viewData.churn_score,
        loyalty_score: viewData.loyalty_score,
        activity_score: viewData.activity_score,
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  },

  /**
   * Busca perfil do customer por id_comprador
   */
  async fetchProfile(idComprador: string): Promise<CustomerProfile | null> {
    const { data, error } = await supabase
      .from("crm.customers")
      .select("*")
      .eq("id_comprador", idComprador)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  /**
   * Busca perfil do customer por UUID
   */
  async fetchProfileByCustomerId(customerId: string): Promise<CustomerProfile | null> {
    const { data, error } = await supabase
      .from("crm.customers")
      .select("*")
      .eq("id", customerId)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  /**
   * Busca métricas do customer
   */
  async fetchMetrics(idComprador: string): Promise<CustomerMetrics | null> {
    const { data, error } = await supabase
      .from("crm.customer_metrics")
      .select("*")
      .eq("id_comprador", idComprador)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  /**
   * Busca métricas de rede do customer
   */
  async fetchNetworkMetrics(idComprador: string): Promise<CustomerNetworkMetrics | null> {
    const { data, error } = await supabase
      .from("crm.customer_network_metrics")
      .select("*")
      .eq("id_comprador", idComprador)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  /**
   * Busca score do customer
   */
  async fetchScore(idComprador: string): Promise<CustomerScore | null> {
    const { data, error } = await supabase
      .from("crm.customer_scores")
      .select("*")
      .eq("id_comprador", idComprador)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  /**
   * Busca carteira do customer
   */
  async fetchWallet(idComprador: string): Promise<Wallet | null> {
    const { data, error } = await supabase
      .from("finance.wallets")
      .select("*")
      .eq("id_comprador", idComprador)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  /**
   * Busca carteira de pontos do customer
   */
  async fetchPointsWallet(idComprador: string): Promise<PointsWallet | null> {
    const { data, error } = await supabase
      .from("finance.points_wallets")
      .select("*")
      .eq("id_comprador", idComprador)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  /**
   * Busca transações da carteira
   */
  async fetchWalletTransactions(walletId: string): Promise<WalletTransaction[]> {
    const { data, error } = await supabase
      .from("finance.wallet_transactions")
      .select("*")
      .eq("wallet_id", walletId)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) throw error;
    return data || [];
  },

  /**
   * Busca pedidos do customer
   */
  async fetchOrders(idComprador: string): Promise<Order[]> {
    const { data, error } = await supabase
      .from("commerce.orders")
      .select("*")
      .eq("id_comprador", idComprador)
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) throw error;
    return data || [];
  },

  /**
   * Busca itens de pedidos
   */
  async fetchOrderItems(orderIds: string[]): Promise<OrderItem[]> {
    if (orderIds.length === 0) return [];

    const { data, error } = await supabase
      .from("commerce.order_items")
      .select("*")
      .in("order_id", orderIds);

    if (error) throw error;
    return data || [];
  },

  /**
   * Busca produtos por IDs
   */
  async fetchProducts(productIds: string[]): Promise<Product[]> {
    if (!productIds || productIds.length === 0) return [];

    const { data, error } = await supabase
      .from("commerce.produtos")
      .select("*")
      .in("id", productIds);

    if (error) throw error;
    return data || [];
  },

  /**
   * Busca afinidades de produtos do customer
   */
  async fetchProductAffinities(idComprador: string): Promise<CustomerProductAffinity[]> {
    const { data, error } = await supabase
      .from("crm.customer_product_affinities")
      .select("*")
      .eq("id_comprador", idComprador)
      .order("affinity_score", { ascending: false })
      .limit(20);

    if (error) throw error;
    return data || [];
  },

  /**
   * Busca relacionamentos de rede do customer
   */
  async fetchNetworkRelationships(idComprador: string): Promise<NetworkRelationship[]> {
    const { data, error } = await supabase
      .from("mlm.network_relationships")
      .select("*")
      .eq("id_comprador", idComprador)
      .limit(100);

    if (error) throw error;
    return data || [];
  },

  /**
   * Busca downlines (indicações diretas) do customer
   */
  async fetchDownlines(idComprador: string): Promise<Downline[]> {
    const { data, error } = await supabase
      .from("crm.customers")
      .select("id, id_comprador, usuario, nome, email, telefone, cidade, estado, created_at")
      .eq("patrocinador_id", idComprador)
      .order("created_at", { ascending: false })
      .limit(500);

    if (error) throw error;
    return data || [];
  },

  /**
   * Busca sponsor (patrocinador) do customer
   */
  async fetchSponsor(sponsorIdComprador: string): Promise<Sponsor | null> {
    const { data, error } = await supabase
      .from("crm.customers")
      .select("id, id_comprador, usuario, nome, email")
      .eq("id_comprador", sponsorIdComprador)
      .maybeSingle();

    if (error) throw error;
    return data;
  },
};
