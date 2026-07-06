import { httpClient } from "@/lib/api-client/http-client";

export const getBonusWalletBalance = async (data: { customerId: string }) => {
  const result = await httpClient.getPointsWalletBalance(data.customerId);
  if (!result.success) throw new Error(result.error || "Failed to fetch bonus wallet balance");
  return result.data;
};

export const getBonusTransactions = async (data: { customerId: string; limit?: number }) => {
  // Uses the same wallet transactions endpoint with bonus type filter
  const result = await httpClient.getWalletTransactions(data.customerId, { limit: data.limit });
  if (!result.success) throw new Error(result.error || "Failed to fetch bonus transactions");
  return result.data;
};

export const ensureBonusWallet = async (data: { customerId: string }) => {
  const result = await httpClient.ensurePointsWallet(data.customerId);
  if (!result.success) throw new Error(result.error || "Failed to ensure bonus wallet");
  return result.data;
};
