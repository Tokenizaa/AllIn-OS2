import { httpClient } from "@/lib/api-client/http-client";

export const getPointsWalletBalance = async (data: { customerId: string }) => {
  const result = await httpClient.getPointsWalletBalance(data.customerId);
  if (!result.success) throw new Error(result.error || "Failed to fetch points wallet balance");
  return result.data;
};

export const getPointsTransactions = async (data: { customerId: string; limit?: number }) => {
  const result = await httpClient.getWalletTransactions(data.customerId, { limit: data.limit });
  if (!result.success) throw new Error(result.error || "Failed to fetch points transactions");
  return result.data;
};

export const ensurePointsWallet = async (data: { customerId: string }) => {
  const result = await httpClient.ensurePointsWallet(data.customerId);
  if (!result.success) throw new Error(result.error || "Failed to ensure points wallet");
  return result.data;
};
