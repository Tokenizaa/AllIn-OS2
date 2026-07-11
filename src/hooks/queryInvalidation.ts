import { QueryClient } from "@tanstack/react-query";
import { queryKeys } from "./queryKeys";

export function invalidateCustomerQueries(queryClient: QueryClient, customerId?: string) {
  queryClient.invalidateQueries({ queryKey: queryKeys.customers });
  if (customerId) {
    queryClient.invalidateQueries({ queryKey: queryKeys.customer(customerId) });
    queryClient.invalidateQueries({ queryKey: queryKeys.customer360(customerId) });
    queryClient.invalidateQueries({ queryKey: queryKeys.walletData(customerId) });
    queryClient.invalidateQueries({ queryKey: queryKeys.paymentHistory(customerId) });
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

export function invalidateWalletQueries(queryClient: QueryClient, customerId?: string) {
  queryClient.invalidateQueries({ queryKey: queryKeys.wallets });
  if (customerId) {
    queryClient.invalidateQueries({ queryKey: queryKeys.walletData(customerId) });
    queryClient.invalidateQueries({ queryKey: queryKeys.bonusWallet(customerId) });
    queryClient.invalidateQueries({ queryKey: queryKeys.pointsWallet(customerId) });
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
}
