/**
 * Allin API Interface
 * Defines the contract for interacting with the external MLM API
 */

export interface AllinApiConfig {
  baseUrl: string;
  clientId: string;
  clientSecret: string;
  accessToken: string;
  timeout: number;
  retryAttempts: number;
}

export interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  params?: Record<string, any>;
  data?: any;
  cacheKey?: string;
  cacheTTL?: number;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  headers: Record<string, string>;
}

export interface PaginationParams {
  limit?: number;
  page?: number;
}

export interface FilterParams {
  [key: string]: any;
}
