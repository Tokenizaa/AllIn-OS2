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

import { supabase } from "@/lib/supabase-client";

export const CustomerService = {
  async fetchCustomerById(id: string) {
    const { data, error } = await supabase
      .schema("crm").from("customers")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async fetchCustomerByCompradorId(compradorId: string) {
    const { data, error } = await supabase
      .schema("crm").from("customers")
      .select("*")
      .eq("id_comprador", compradorId)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async fetchDownlines(compradorId: string) {
    const { data, error } = await supabase
      .schema("crm").from("customers")
      .select("id, usuario, id_comprador, telefone, created_at, cidade, estado, nome_completo")
      .eq("patrocinador_comprador", compradorId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async fetchCustomersList(limit = 100) {
    const { data, error } = await supabase
      .schema("crm").from("customers")
      .select("id, nome_completo, email, cpf, user_id, updated_at, created_at, usuario, id_comprador, patrocinador_comprador, cidade, estado, telefone, plano_comprador")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data || [];
  },

  async fetchCustomersWithOrderStats(page = 1, pageSize = 15) {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data: customerData, error: customerError, count: customerCount } = await supabase
      .schema("crm").from("customers")
      .select("id, user_id, usuario, id_comprador, telefone, created_at, nome_completo, plano_comprador, cidade, estado", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (customerError) throw customerError;

    // customer_order_stats table doesn't exist yet, return empty stats
    return {
      customers: customerData || [],
      orderStats: {},
      totalCount: customerCount || 0,
      page,
      pageSize,
    };
  },

  async fetchRecentCustomers(limit = 20) {
    const { data, error } = await supabase
      .schema("crm").from("customers")
      .select("id, usuario, id_comprador, cidade, estado, user_id, nome_completo")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data || [];
  },

  async fetchNetworkMembers(limit = 500) {
    const { data, error } = await supabase
      .schema("crm").from("customers")
      .select("id, usuario, id_comprador, user_id, cidade, estado, nome_completo")
      .limit(limit);
    if (error) throw error;
    return data || [];
  },

  async fetchAnalyticsCustomers() {
    const { data, error } = await supabase
      .schema("crm").from("customers")
      .select("id, usuario, id_comprador, user_id, nome_completo");
    if (error) throw error;
    return data || [];
  },

  async fetchCustomerBonus(compradorId: string) {
    const { data, error } = await supabase
      .from("customer_bonus_view")
      .select("*")
      .eq("id_comprador", compradorId)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async fetchCustomerPlan(compradorId: string) {
    const { data, error } = await supabase
      .schema("mlm")
      .from("planos_distribuidores")
      .select("*, planos(*)")
      .eq("distribuidor_id", compradorId)
      .maybeSingle();
    if (error) throw error;
    return data;
  }
};

