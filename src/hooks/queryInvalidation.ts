import { QueryClient } from "@tanstack/react-query";
import { queryKeys } from "./queryKeys";

/**
 * Centralized cache invalidation functions
 * All mutations should use these functions to invalidate related queries
 */

export function invalidateCustomerQueries(queryClient: QueryClient, idComprador?: string) {
  queryClient.invalidateQueries({ queryKey: queryKeys.customers });
  if (idComprador) {
    queryClient.invalidateQueries({ queryKey: queryKeys.customer(idComprador) });
    queryClient.invalidateQueries({ queryKey: queryKeys.customer360(idComprador) });
    queryClient.invalidateQueries({ queryKey: queryKeys.walletData(idComprador) });
    queryClient.invalidateQueries({ queryKey: queryKeys.paymentHistory(idComprador) });
  }
  queryClient.invalidateQueries({ queryKey: queryKeys.network });
  queryClient.invalidateQueries({ queryKey: queryKeys.analytics });
}

export function invalidateOrderQueries(queryClient: QueryClient) {
  queryClient.invalidateQueries({ queryKey: queryKeys.orders });
  queryClient.invalidateQueries({ queryKey: queryKeys.analytics });
  queryClient.invalidateQueries({ queryKey: queryKeys.payments });
  queryClient.invalidateQueries({ queryKey: queryKeys.shipments });
}

export function invalidateWalletQueries(queryClient: QueryClient, idComprador?: string) {
  queryClient.invalidateQueries({ queryKey: queryKeys.wallets });
  if (idComprador) {
    queryClient.invalidateQueries({ queryKey: queryKeys.walletData(idComprador) });
    queryClient.invalidateQueries({ queryKey: queryKeys.bonusWallet(idComprador) });
    queryClient.invalidateQueries({ queryKey: queryKeys.pointsWallet(idComprador) });
  }
  queryClient.invalidateQueries({ queryKey: queryKeys.analytics });
  queryClient.invalidateQueries({ queryKey: queryKeys.commissions });
}

export function invalidatePaymentQueries(queryClient: QueryClient) {
  queryClient.invalidateQueries({ queryKey: queryKeys.payments });
  queryClient.invalidateQueries({ queryKey: queryKeys.wallets });
  queryClient.invalidateQueries({ queryKey: queryKeys.analytics });
  queryClient.invalidateQueries({ queryKey: queryKeys.commissions });
}

export function invalidatePlanQueries(queryClient: QueryClient) {
  queryClient.invalidateQueries({ queryKey: queryKeys.plans });
  queryClient.invalidateQueries({ queryKey: queryKeys.analytics });
}

export function invalidateNetworkQueries(queryClient: QueryClient) {
  queryClient.invalidateQueries({ queryKey: queryKeys.network });
  queryClient.invalidateQueries({ queryKey: queryKeys.customers });
  queryClient.invalidateQueries({ queryKey: queryKeys.analytics });
}

export function invalidateAnalyticsQueries(queryClient: QueryClient) {
  queryClient.invalidateQueries({ queryKey: queryKeys.analytics });
  queryClient.invalidateQueries({ queryKey: queryKeys.insights });
  queryClient.invalidateQueries({ queryKey: queryKeys.paymentAnalytics });
}

export function invalidateAuditQueries(queryClient: QueryClient) {
  queryClient.invalidateQueries({ queryKey: queryKeys.auditLogs });
  queryClient.invalidateQueries({ queryKey: queryKeys.audit as any });
}
