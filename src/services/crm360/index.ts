/**
 * CRM360 Service
 * 
 * Service focado em dados de CRM (Customer Relationship Management)
 * Extrai do Customer360Service monolítico apenas a parte de CRM
 * 
 * Responsabilidades:
 * - Pedidos do cliente
 * - Itens de pedido
 * - Produtos comprados
 * - Documentos do cliente
 * - Notas CRM
 * - Automações de comunicação
 * 
 * Fontes de dados:
 * - orders (pedidos)
 * - order_items (itens)
 * - products (produtos)
 * - customer_documents (documentos)
 * - customer_notes (notas)
 * - customer_automations (automações)
 */

import { supabase } from "@/lib/supabase/client";
import type {
  Order,
  OrderItem,
  Product,
} from "../customer360/types";

export const CRM360Service = {
  /**
   * Busca dados CRM de um perfil
   * 
   * @param profileId - ID do profile (UUID)
   * @param idComprador - ID do comprador (chave de negócio, opcional)
   * @returns Dados CRM do perfil
   */
  async getCRM360(profileId: string, idComprador?: string): Promise<{
    orders: Order[];
    orderItems: OrderItem[];
    products: Product[];
  }> {
    // Se não tiver id_comprador, tenta buscar do profile
    let effectiveIdComprador = idComprador;
    if (!effectiveIdComprador) {
      const { data: profile } = await supabase
        .schema("crm")
        .from("customers")
        .select("id_comprador")
        .eq("id", profileId)
        .maybeSingle();
      effectiveIdComprador = profile?.id_comprador;
    }

    if (!effectiveIdComprador) {
      return {
        orders: [],
        orderItems: [],
        products: [],
      };
    }

    // Busca dados em paralelo
    const [orders, orderItemsData] = await Promise.all([
      this.fetchOrders(effectiveIdComprador),
      this.fetchOrderItemsAndProducts(effectiveIdComprador),
    ]);

    return {
      orders,
      orderItems: orderItemsData.items,
      products: orderItemsData.products,
    };
  },

  // ============================================================================
  // MÉTODOS DE BUSCA
  // ============================================================================

  /**
   * Busca pedidos do customer
   */
  async fetchOrders(idComprador: string): Promise<Order[]> {
    const { data, error } = await supabase
      .schema("commerce")
      .from("pedidos")
      .select("*")
      .eq("distribuidor_comprador_id", idComprador)
      .order("data_criacao", { ascending: false })
      .limit(100);

    if (error) throw error;
    
    // Mapear campos do banco (português) para tipos TypeScript (inglês)
    return (data || []).map(order => this.mapOrderFromDB(order));
  },

  /**
   * Mapeia pedido do banco para formato TypeScript
   */
  mapOrderFromDB(dbOrder: any): Order {
    return {
      id: dbOrder.id,
      numero_pedido: dbOrder.numero_pedido || dbOrder.id.slice(0, 10),
      id_comprador: dbOrder.distribuidor_comprador_id || "",
      customer_id: dbOrder.cliente_id,
      valor_total_pedido: dbOrder.valor_total || 0,
      status_pedido: dbOrder.status_pedido || "pendente",
      payment_method: dbOrder.forma_pagamento,
      payment_status: dbOrder.pagamento_confirmado ? "pago" : "pendente",
      created_at: dbOrder.data_criacao || dbOrder.created_at,
      updated_at: dbOrder.updated_at,
      data_criacao: dbOrder.data_criacao,
    };
  },

  /**
   * Busca itens de pedido e produtos associados
   */
  async fetchOrderItemsAndProducts(idComprador: string): Promise<{
    items: OrderItem[];
    products: Product[];
  }> {
    // Primeiro busca os pedidos para obter os IDs
    const orders = await this.fetchOrders(idComprador);
    
    if (orders.length === 0) {
      return { items: [], products: [] };
    }

    const orderIds = orders.map((o) => o.id);
    const orderItems = await this.fetchOrderItems(orderIds);
    
    if (orderItems.length === 0) {
      return { items: [], products: [] };
    }

    // Busca produtos únicos
    const productIds = orderItems
      .map((item) => item.product_id)
      .filter((id): id is string => id !== null && id !== undefined);
    
    const uniqueProductIds = Array.from(new Set(productIds));
    const products = await this.fetchProducts(uniqueProductIds);

    return {
      items: orderItems,
      products,
    };
  },

  /**
   * Busca itens de pedidos por IDs
   */
  async fetchOrderItems(orderIds: string[]): Promise<OrderItem[]> {
    if (orderIds.length === 0) return [];

    const { data, error } = await supabase
      .schema("commerce")
      .from("pedidos_itens")
      .select("*")
      .in("pedido_id", orderIds);

    if (error) throw error;
    
    // Mapear campos do banco para formato TypeScript
    return (data || []).map(item => this.mapOrderItemFromDB(item));
  },

  /**
   * Mapeia item de pedido do banco para formato TypeScript
   */
  mapOrderItemFromDB(dbItem: any): OrderItem {
    return {
      id: dbItem.id,
      order_id: dbItem.pedido_id,
      product_id: dbItem.produto_id,
      product_name: dbItem.nome_produto || "",
      product_code: null,
      quantity: dbItem.quantidade || 1,
      size: null,
      variant: null,
      valor_unitario: dbItem.preco_unitario || 0,
      valor_total: dbItem.preco_total || 0,
    };
  },

  /**
   * Busca produtos por IDs
   */
  async fetchProducts(productIds: string[]): Promise<Product[]> {
    if (!productIds || productIds.length === 0) return [];

    const { data, error } = await supabase
      .schema("commerce")
      .from("produtos")
      .select("*")
      .in("id", productIds);

    if (error) throw error;
    
    // Mapear campos do banco para formato TypeScript
    return (data || []).map(product => this.mapProductFromDB(product));
  },

  /**
   * Mapeia produto do banco para formato TypeScript
   */
  mapProductFromDB(dbProduct: any): Product {
    return {
      id: dbProduct.id,
      nome: dbProduct.nome || "",
      codigo: dbProduct.codigo,
      categoria: dbProduct.categoria,
      preco: dbProduct.preco || 0,
      imagem: dbProduct.imagem,
      status: dbProduct.status || "ativo",
      created_at: dbProduct.created_at,
      updated_at: dbProduct.updated_at,
    };
  },
};
