import { httpClient } from "@/lib/api-client/http-client";

export const WalletService = {
  async fetchWalletByidComprador(idComprador: string) {
    const result = await httpClient.getWalletBalance(idComprador);
    if (!result.success) {
      throw new Error(result.error || "Failed to fetch wallet");
    }
    return result.data;
  },

  async fetchWalletTransactionsByWalletId(walletId: string) {
    // TODO: Add method to HTTP client
    throw new Error("fetchWalletTransactionsByWalletId not yet implemented in HTTP client");
  },

  async fetchPointsWalletByidComprador(idComprador: string) {
    const result = await httpClient.getPointsWalletBalance(idComprador);
    if (!result.success) {
      throw new Error(result.error || "Failed to fetch points wallet");
    }
    return result.data;
  },

  async createWallet(idComprador: string) {
    const result = await httpClient.ensureWallet(idComprador);
    if (!result.success) {
      throw new Error(result.error || "Failed to create wallet");
    }
    return result.data;
  },

  async createPointsWallet(idComprador: string) {
    const result = await httpClient.ensurePointsWallet(idComprador);
    if (!result.success) {
      throw new Error(result.error || "Failed to create points wallet");
    }
    return result.data;
  },

  async createWalletTransaction(
    walletId: string,
    transaction_type: string,
    amount: number,
    description: string,
    reference_type: string = "adjustment"
  ) {
    // TODO: Add method to HTTP client
    throw new Error("createWalletTransaction not yet implemented in HTTP client");
  },

  async updateWalletBalance(walletId: string, balance: number) {
    // TODO: Add method to HTTP client
    throw new Error("updateWalletBalance not yet implemented in HTTP client");
  },

  async fetchWithdrawals(userId?: string) {
    // TODO: Add method to HTTP client
    throw new Error("fetchWithdrawals not yet implemented in HTTP client");
  },

  async fetchRecentWithdrawals(limit = 5) {
    // TODO: Add method to HTTP client
    throw new Error("fetchRecentWithdrawals not yet implemented in HTTP client");
  },

  async fetchWorkspaceSettings() {
    // TODO: Add method to HTTP client
    throw new Error("fetchWorkspaceSettings not yet implemented in HTTP client");
  },

  async approveWithdrawals(withdrawalIds: string[]) {
    // TODO: Add method to HTTP client
    throw new Error("approveWithdrawals not yet implemented in HTTP client");
  },

  async rejectWithdrawals(withdrawalIds: string[]) {
    // TODO: Add method to HTTP client
    throw new Error("rejectWithdrawals not yet implemented in HTTP client");
  },
};
