/**
 * CustomerService
 *
 * IDENTIFIER STRATEGY:
 * This service uses `id_comprador` (text) as the canonical identifier for customer operations.
 * The `customers.id` (UUID) is only used as a technical primary key in the database.
 *
 * Rationale: The entire application is built around id_comprador (247 occurrences across 54 files).
 * Using it consistently avoids confusion and maintains compatibility with the existing system.
 *
 * For migration planning, see: docs/IDENTITY_MIGRATION_MASTER_PLAN.md
 */

import { httpClient } from "@/lib/api-client/http-client";

export const CustomerService = {
  async fetchCustomerById(id: string) {
    const result = await httpClient.getCustomerById(id);
    if (!result.success) {
      throw new Error(result.error || "Failed to fetch customer");
    }
    return result.data;
  },

  async fetchCustomerByCompradorId(compradorId: string) {
    const result = await httpClient.getCustomerByCompradorId(compradorId);
    if (!result.success) {
      throw new Error(result.error || "Failed to fetch customer by comprador ID");
    }
    return result.data;
  },

  async fetchDownlines(compradorId: string) {
    const { data, error } = await supabase
      .from("customers")
      .select("id, usuario, id_comprador, qualification, status, telefone, created_at, cidade, estado, nome_completo")
      .eq("patrocinador_comprador", compradorId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async fetchCustomersList(limit = 100) {
    const { data, error } = await supabase
      .from("customers")
      .select("id, nome_completo, email, avatar_url, phone, status, qualification, cpf, user_id, updated_at, created_at, usuario, id_comprador, patrocinador_comprador, cidade, estado, telefone")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data || [];
  },

  async fetchCustomersWithOrderStats() {
    const [{ data: customerData, error: customerError }, { data: allOrders, error: orderError }] = await Promise.all([
      supabase
        .from("customers")
        .select("id, user_id, usuario, id_comprador, qualification, status, telefone, created_at, nome_completo")
        .order("created_at", { ascending: false }),
      supabase
        .from("orders")
        .select("id, customer_id, valor_total_pedido, valor_total, status_pedido, status"),
    ]);

    if (customerError) throw customerError;
    if (orderError) throw orderError;

    const statsMap: Record<string, { count: number; ltv: number }> = {};
    if (allOrders) {
      allOrders.forEach((o: any) => {
        const cid = o.customer_id;
        if (!cid) return;
        if (!statsMap[cid]) {
          statsMap[cid] = { count: 0, ltv: 0 };
        }
        statsMap[cid].count += 1;

        const isPaid = ["pago", "entregue", "enviado"].includes(
          (o.status_pedido || o.status || "").toLowerCase()
        );
        if (isPaid) {
          statsMap[cid].ltv += Number(o.valor_total_pedido || o.valor_total || 0);
        }
      });
    }
    return result.data || [];
  },

  async fetchCustomersList(limit = 100) {
    const result = await httpClient.getCustomersList({ limit });
    if (!result.success) {
      throw new Error(result.error || "Failed to fetch customers list");
    }
    return result.data || [];
  },

  async fetchCustomersWithOrderStats(page = 1, pageSize = 15) {
    const result = await httpClient.getCustomersWithOrderStats({ page, pageSize });
    if (!result.success) {
      throw new Error(result.error || "Failed to fetch customers with order stats");
    }
    return result.data;
  },

  async fetchRecentCustomers(limit = 20) {
    const { data, error } = await supabase
      .from("customers")
      .select("id, usuario, id_comprador, qualification, status, cidade, estado, user_id, nome_completo")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data || [];
  },

  async fetchNetworkMembers(limit = 500) {
    const { data, error } = await supabase
      .from("customers")
      .select("id, usuario, id_comprador, user_id, qualification, status, cidade, estado, nome_completo")
      .limit(limit);
    if (error) throw error;
    return data || [];
  },

  async fetchAnalyticsCustomers() {
    const { data, error } = await supabase
      .from("customers")
      .select("id, usuario, id_comprador, user_id, nome_completo");
    if (error) throw error;
    return data || [];
  }
};
