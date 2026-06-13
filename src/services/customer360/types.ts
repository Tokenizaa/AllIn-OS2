/**
 * Customer360 Types
 * 
 * DTO unificado para visão completa 360 do customer
 * Consolida dados de múltiplas tabelas em uma única estrutura
 */

// ============================================================================
// PERFIL (customers)
// ============================================================================

export interface CustomerProfile {
  id: string;
  id_comprador: string;
  user_id: string | null;
  usuario: string;
  nome_completo: string;
  email: string;
  telefone: string | null;
  cpf: string | null;
  endereco: string | null;
  cidade: string | null;
  estado: string | null;
  cep: string | null;
  patrocinador_comprador: string | null;
  qualification: string | null;
  plano_comprador: string | null;
  status: string;
  metadata: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// MÉTRICAS (customer_metrics)
// ============================================================================

export interface CustomerMetrics {
  id_comprador: string;
  total_gasto: number;
  ltv: number;
  ticket_medio: number;
  numero_pedidos: number;
  primeiro_pedido: string | null;
  ultimo_pedido: string | null;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// REDE (customer_network_metrics)
// ============================================================================

export interface CustomerNetworkMetrics {
  id_comprador: string;
  direct_indications: number;
  total_network_size: number;
  estimated_bonus: number;
  network_level: number;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// SCORE (customer_scores)
// ============================================================================

export interface CustomerScore {
  id_comprador: string;
  score: number;
  metadata: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// CARTEIRA (wallets, points_wallets)
// ============================================================================

export interface Wallet {
  id: string;
  id_comprador: string;
  balance: number;
  available_balance: number;
  frozen_balance: number;
  currency: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface PointsWallet {
  id: string;
  id_comprador: string;
  balance: number;
  available_balance: number;
  frozen_balance: number;
  total_earned: number;
  total_redeemed: number;
  currency: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface WalletTransaction {
  id: string;
  wallet_id: string;
  transaction_type: 'credit' | 'debit';
  amount: number;
  description: string;
  reference_type: string;
  reference_id: string;
  balance_after: number | null;
  created_at: string;
}

// ============================================================================
// PEDIDOS (orders)
// ============================================================================

export interface Order {
  id: string;
  numero_pedido: string;
  id_comprador: string;
  customer_id: string | null;
  valor_total_pedido: number;
  status_pedido: string;
  payment_method: string | null;
  payment_status: string | null;
  created_at: string;
  updated_at: string;
  data_criacao: string | null;
}

// ============================================================================
// ITENS COMPRADOS (order_items)
// ============================================================================

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  product_code: string | null;
  quantity: number;
  size: string | null;
  variant: string | null;
  valor_unitario: number;
  valor_total: number;
}

// ============================================================================
// PRODUTOS (products)
// ============================================================================

export interface Product {
  id: string;
  nome: string;
  codigo: string | null;
  categoria: string | null;
  preco: number;
  imagem: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// AFINIDADES (customer_product_affinities)
// ============================================================================

export interface CustomerProductAffinity {
  id: string;
  id_comprador: string;
  product_id: string;
  affinity_score: number;
  purchase_count: number;
  last_purchase: string | null;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// REDE (network_relationships)
// ============================================================================

export interface NetworkRelationship {
  id: string;
  id_comprador: string;
  sponsor_id: string | null;
  sponsor_comprador: string | null;
  level: number;
  path: string | null;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// DOWNLINE (simplificado para lista)
// ============================================================================

export interface Downline {
  id: string;
  id_comprador: string;
  usuario: string;
  nome_completo: string;
  email: string;
  telefone: string | null;
  cidade: string | null;
  estado: string | null;
  qualification: string | null;
  status: string;
  created_at: string;
}

// ============================================================================
// SPONSOR (patrocinador)
// ============================================================================

export interface Sponsor {
  id: string;
  id_comprador: string;
  usuario: string;
  nome_completo: string;
  email: string;
  qualification: string | null;
  status: string;
}

// ============================================================================
// CUSTOMER360 - DTO COMPLETO
// ============================================================================

export interface Customer360 {
  // Perfil
  profile: CustomerProfile | null;
  
  // Métricas
  metrics: CustomerMetrics | null;
  
  // Rede
  network: CustomerNetworkMetrics | null;
  
  // Score
  score: CustomerScore | null;
  
  // Carteira
  wallet: Wallet | null;
  pointsWallet: PointsWallet | null;
  walletTransactions: WalletTransaction[];
  
  // Pedidos
  orders: Order[];
  orderItems: OrderItem[];
  
  // Produtos
  products: Product[];
  productAffinities: CustomerProductAffinity[];
  
  // Rede
  networkRelationships: NetworkRelationship[];
  downlines: Downline[];
  sponsor: Sponsor | null;
}

// ============================================================================
// TIPOS DE FILTRO E PAGINAÇÃO
// ============================================================================

export interface Customer360Filters {
  status?: string;
  qualification?: string;
  plan?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface Customer360Params {
  idComprador?: string;
  customerId?: string;
  includeOrders?: boolean;
  includeOrderItems?: boolean;
  includeProducts?: boolean;
  includeAffinities?: boolean;
  includeNetwork?: boolean;
  includeDownlines?: boolean;
  includeSponsor?: boolean;
  includeWalletTransactions?: boolean;
}

// ============================================================================
// RESPOSTAS DE API
// ============================================================================

export interface Customer360Response {
  success: boolean;
  data: Customer360 | null;
  error?: string;
}

export interface Customer360ListResponse {
  success: boolean;
  data: Customer360[];
  total: number;
  page: number;
  pageSize: number;
  error?: string;
}
