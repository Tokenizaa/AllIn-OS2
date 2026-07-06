import { httpClient } from "@/lib/api-client/http-client";

export const getWalletBalance = async (data: { customerId: string }) => {
  const result = await httpClient.getWalletBalance(data.customerId);
  if (!result.success) throw new Error(result.error || "Failed to fetch wallet balance");
  return result.data;
};

export const getWalletTransactions = async (data: { customerId: string; limit?: number; transactionType?: string }) => {
  const result = await httpClient.getWalletTransactions(data.customerId, { limit: data.limit, transactionType: data.transactionType as any });
  if (!result.success) throw new Error(result.error || "Failed to fetch wallet transactions");
  return result.data;
};

export const ensureWallet = async (data: { customerId: string }) => {
  const result = await httpClient.ensureWallet(data.customerId);
  if (!result.success) throw new Error(result.error || "Failed to ensure wallet");
  return result.data;
};

export const creditWallet = async (data: { customerId: string; amount: number; description: string; referenceType?: string }) => {
  const result = await httpClient.creditWallet(data.customerId, data.amount, data.description, undefined, data.referenceType);
  if (!result.success) throw new Error(result.error || "Failed to credit wallet");
  return result.data;
};

export const debitWallet = async (data: { customerId: string; amount: number; description: string; referenceType?: string }) => {
  const result = await httpClient.debitWallet(data.customerId, data.amount, data.description, undefined, data.referenceType);
  if (!result.success) throw new Error(result.error || "Failed to debit wallet");
  return result.data;
};
