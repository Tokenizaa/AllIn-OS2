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
    const result = await httpClient.getCustomerDownlinesByComprador(compradorId);
    if (!result.success) {
      throw new Error(result.error || "Failed to fetch downlines");
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
    const result = await httpClient.getRecentCustomers({ limit });
    if (!result.success) {
      throw new Error(result.error || "Failed to fetch recent customers");
    }
    return result.data || [];
  },

  async fetchNetworkMembers(limit = 500) {
    const result = await httpClient.getNetworkMembers({ limit });
    if (!result.success) {
      throw new Error(result.error || "Failed to fetch network members");
    }
    return result.data || [];
  },

  async fetchAnalyticsCustomers() {
    const result = await httpClient.getAnalyticsCustomers();
    if (!result.success) {
      throw new Error(result.error || "Failed to fetch analytics customers");
    }
    return result.data || [];
  },

  async fetchCustomerBonus(compradorId: string) {
    const result = await httpClient.getCustomerBonus(compradorId);
    if (!result.success) {
      throw new Error(result.error || "Failed to fetch customer bonus");
    }
    return result.data;
  },

  async fetchCustomerPlan(compradorId: string) {
    const result = await httpClient.getCustomerPlan(compradorId);
    if (!result.success) {
      throw new Error(result.error || "Failed to fetch customer plan");
    }
    return result.data;
  }
};
