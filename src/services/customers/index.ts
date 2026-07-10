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

import { supabase } from "@/lib/supabase/client";

export const CustomerService = {
  async fetchCustomerById(id: string) {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw new Error(error.message || "Failed to fetch customer");
    return data;
  },

  async fetchCustomerByCompradorId(compradorId: string) {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('id_comprador', compradorId)
      .single();
    if (error) throw new Error(error.message || "Failed to fetch customer by comprador ID");
    return data;
  },

  async fetchDownlines(compradorId: string) {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('patrocinador_comprador', compradorId);
    if (error) throw new Error(error.message || "Failed to fetch downlines");
    return data || [];
  },

  async fetchCustomersList(limit = 100) {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .limit(limit)
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message || "Failed to fetch customers list");
    return data || [];
  },

  async fetchCustomersWithOrderStats(page = 1, pageSize = 15) {
    const { data: customers, error } = await supabase
      .from('customers')
      .select('*')
      .range((page - 1) * pageSize, page * pageSize - 1)
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message || "Failed to fetch customers with order stats");
    return { customers: customers || [], orderStats: {}, totalCount: 0, page, pageSize };
  },

  async fetchRecentCustomers(limit = 20) {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .limit(limit)
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message || "Failed to fetch recent customers");
    return data || [];
  },

  async fetchNetworkMembers(limit = 500) {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .limit(limit)
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message || "Failed to fetch network members");
    return data || [];
  },

  async fetchAnalyticsCustomers() {
    const { data, error } = await supabase
      .from('customers')
      .select('*');
    if (error) throw new Error(error.message || "Failed to fetch analytics customers");
    return data || [];
  }
};

