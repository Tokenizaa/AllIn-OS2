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

import { supabase } from "@/lib/supabase-client";
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
        .from("profiles")
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
    const [orders, orderItems, products] = await Promise.all([
      this.fetchOrders(effectiveIdComprador),
      this.fetchOrderItemsAndProducts(effectiveIdComprador),
    ]);

    return {
      orders,
      orderItems: orderItems.items,
      products: orderItems.products,
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
      .from("orders")
      .select("*")
      .eq("id_comprador", idComprador)
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) throw error;
    return data || [];
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
      .from("order_items")
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
      .from("products")
      .select("*")
      .in("id", productIds);

    if (error) throw error;
    return data || [];
  },
};
