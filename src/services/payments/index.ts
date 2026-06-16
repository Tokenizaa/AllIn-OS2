import { httpClient } from "@/lib/api-client/http-client";

export const PaymentService = {
  async fetchPaymentsForDashboard() {
    const result = await httpClient.getPayments({ limit: 300 });
    if (!result.success) {
      throw new Error(result.error || "Failed to fetch payments for dashboard");
    }
    return result.data || [];
  },

  async fetchRecentPayments(limit = 5) {
    const result = await httpClient.getPayments({ limit });
    if (!result.success) {
      throw new Error(result.error || "Failed to fetch recent payments");
    }
    return result.data || [];
  },

  async fetchPaymentsForCommissions(limit = 18) {
    const result = await httpClient.getPayments({ limit });
    if (!result.success) {
      throw new Error(result.error || "Failed to fetch payments for commissions");
    }
    return result.data || [];
  },

  async fetchPaymentsForReports(limit = 500) {
    const result = await httpClient.getPayments({ limit });
    if (!result.success) {
      throw new Error(result.error || "Failed to fetch payments for reports");
    }
    return result.data || [];
  }
};
