/**
 * React Query Client Configuration
 * 
 * Centralized configuration for React Query cache
 */

import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache for 5 minutes by default
      staleTime: 5 * 60 * 1000,
      // Retry failed requests 3 times
      retry: 3,
      // Retry with exponential backoff
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Don't refetch on window focus by default
      refetchOnWindowFocus: false,
      // Refetch on reconnect
      refetchOnReconnect: true,
    },
    mutations: {
      // Retry failed mutations once
      retry: 1,
    },
  },
});

/**
 * Cache invalidation helpers
 */
export const cacheKeys = {
  // Auth
  auth: ['auth'] as const,
  user: (id: string) => ['user', id] as const,
  
  // Customers
  customers: ['customers'] as const,
  customer: (id: string) => ['customer', id] as const,
  customer360: (id: string) => ['customer360', id] as const,
  
  // Plans
  plans: ['plans'] as const,
  plan: (id: string) => ['plan', id] as const,
  planAnalytics: ['plans', 'analytics'] as const,
  planBonuses: (id: string) => ['plan', id, 'bonuses'] as const,
  
  // Orders
  orders: ['orders'] as const,
  order: (id: string) => ['order', id] as const,
  
  // Payments
  payments: ['payments'] as const,
  payment: (id: string) => ['payment', id] as const,
  
  // Network
  network: ['network'] as const,
  downlines: (id: string) => ['network', id, 'downlines'] as const,
  
  // Wallets
  wallets: ['wallets'] as const,
  wallet: (id: string) => ['wallet', id] as const,
  walletData: (id: string) => ['wallet', id, 'data'] as const,
  
  // Analytics
  analytics: ['analytics'] as const,
  executiveAnalytics: ['analytics', 'executive'] as const,
  salesAnalytics: ['analytics', 'sales'] as const,
  networkAnalytics: ['analytics', 'network'] as const,
};

/**
 * Invalidate related cache entries
 */
export const invalidateCache = {
  // Invalidate all customer-related caches
  customer: (id: string) => {
    queryClient.invalidateQueries({ queryKey: cacheKeys.customer(id) });
    queryClient.invalidateQueries({ queryKey: cacheKeys.customer360(id) });
  },
  
  // Invalidate all plan-related caches
  plans: () => {
    queryClient.invalidateQueries({ queryKey: cacheKeys.plans });
    queryClient.invalidateQueries({ queryKey: cacheKeys.planAnalytics });
  },
  
  // Invalidate all wallet-related caches
  wallet: (id: string) => {
    queryClient.invalidateQueries({ queryKey: cacheKeys.wallet(id) });
    queryClient.invalidateQueries({ queryKey: cacheKeys.walletData(id) });
  },
  
  // Invalidate all order-related caches
  orders: () => {
    queryClient.invalidateQueries({ queryKey: cacheKeys.orders });
  },
  
  // Invalidate all analytics caches
  analytics: () => {
    queryClient.invalidateQueries({ queryKey: cacheKeys.analytics });
  },
};
