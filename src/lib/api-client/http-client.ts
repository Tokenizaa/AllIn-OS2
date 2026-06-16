/**
 * Centralized HTTP Client
 * 
 * Provides a single point for all HTTP requests to the backend API
 * Handles authentication, error handling, and request/response transformation
 */

import type {
  ApiResponse,
  LoginRequest,
  RegisterRequest,
  RefreshTokenRequest,
  ChangePasswordRequest,
  AuthResponse,
  PaginationParams,
  Customer,
  Customer360,
  CustomerStats,
  Plan,
  PlanBonus,
  CustomerPlan,
  PlanStats,
  Order,
  OrderStats,
  Payment,
  PaymentStats,
  Product,
  NetworkNode,
  Downline,
  Upline,
  NetworkStats,
  ExecutiveAnalytics,
  SalesAnalytics,
  NetworkAnalytics,
  PlanAnalytics,
  BonusDistribution,
} from '../../../shared/types/api.types';

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

class HttpClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('access_token');
    if (token) {
      return {
        ...this.defaultHeaders,
        Authorization: `Bearer ${token}`,
      };
    }
    return this.defaultHeaders;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = this.getAuthHeaders();

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...headers,
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`[HTTP Client] Error fetching ${endpoint}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private async get<T>(endpoint: string, params?: Record<string, unknown>): Promise<ApiResponse<T>> {
    const queryString = params ? new URLSearchParams(params as Record<string, string>).toString() : '';
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request<T>(url, { method: 'GET' });
  }

  private async post<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  private async put<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  private async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // ============================================================================
  // Auth API
  // ============================================================================

  async login(data: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    return this.post<AuthResponse>('/api/auth/login', data);
  }

  async register(data: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    return this.post<AuthResponse>('/api/auth/register', data);
  }

  async refreshToken(data: RefreshTokenRequest): Promise<ApiResponse<AuthResponse>> {
    return this.post<AuthResponse>('/api/auth/refresh', data);
  }

  async changePassword(userId: string, data: ChangePasswordRequest): Promise<ApiResponse<void>> {
    return this.post<void>('/api/auth/change-password', { userId, data });
  }

  async logout(userId: string): Promise<ApiResponse<void>> {
    return this.post<void>('/api/auth/logout', { userId });
  }

  // ============================================================================
  // Customers API
  // ============================================================================

  async getCustomers(params?: PaginationParams): Promise<ApiResponse<Customer[]>> {
    return this.get<Customer[]>('/api/customers', params);
  }

  async getCustomerById(id: string): Promise<ApiResponse<Customer>> {
    return this.get<Customer>(`/api/customers/${id}`);
  }

  async getCustomer360(id: string): Promise<ApiResponse<Customer360>> {
    return this.get<Customer360>(`/api/customers/${id}/360`);
  }

  async createCustomer(data: Partial<Customer>): Promise<ApiResponse<Customer>> {
    return this.post<Customer>('/api/customers', data);
  }

  async updateCustomer(id: string, data: Partial<Customer>): Promise<ApiResponse<Customer>> {
    return this.put<Customer>(`/api/customers/${id}`, data);
  }

  async deleteCustomer(id: string): Promise<ApiResponse<void>> {
    return this.delete<void>(`/api/customers/${id}`);
  }

  async getCustomerStats(): Promise<ApiResponse<CustomerStats>> {
    return this.get<CustomerStats>('/api/customers/stats/overview');
  }

  async getCustomerDownlines(sponsorId: string, params?: PaginationParams): Promise<ApiResponse<Downline[]>> {
    return this.get<Downline[]>(`/api/customers/${sponsorId}/downlines`, params);
  }

  async getCustomerByCompradorId(compradorId: string): Promise<ApiResponse<Customer>> {
    return this.get<Customer>(`/api/customers/comprador/${compradorId}`);
  }

  async getCustomerDownlinesByComprador(compradorId: string): Promise<ApiResponse<Customer[]>> {
    return this.get<Customer[]>(`/api/customers/${compradorId}/downlines`);
  }

  async getCustomersList(params?: { limit?: number }): Promise<ApiResponse<Customer[]>> {
    return this.get<Customer[]>('/api/customers/list', params);
  }

  async getCustomersWithOrderStats(params?: { page?: number; pageSize?: number }): Promise<ApiResponse<{ customers: Customer[]; orderStats: Record<string, { count: number; ltv: number }>; totalCount: number; page: number; pageSize: number }>> {
    return this.get<{ customers: Customer[]; orderStats: Record<string, { count: number; ltv: number }>; totalCount: number; page: number; pageSize: number }>('/api/customers/with-order-stats', params);
  }

  async getRecentCustomers(params?: { limit?: number }): Promise<ApiResponse<Customer[]>> {
    return this.get<Customer[]>('/api/customers/recent', params);
  }

  async getNetworkMembers(params?: { limit?: number }): Promise<ApiResponse<Customer[]>> {
    return this.get<Customer[]>('/api/customers/network', params);
  }

  async getAnalyticsCustomers(): Promise<ApiResponse<Customer[]>> {
    return this.get<Customer[]>('/api/customers/analytics');
  }

  async getCustomerBonus(compradorId: string): Promise<ApiResponse<any>> {
    return this.get<any>(`/api/customers/${compradorId}/bonus`);
  }

  async getCustomerPlan(compradorId: string): Promise<ApiResponse<any>> {
    return this.get<any>(`/api/customers/${compradorId}/plan`);
  }

  // ============================================================================
  // Plans API
  // ============================================================================

  async getPlans(params?: PaginationParams): Promise<ApiResponse<Plan[]>> {
    return this.get<Plan[]>('/api/plans', params);
  }

  async getPlanById(id: string): Promise<ApiResponse<Plan>> {
    return this.get<Plan>(`/api/plans/${id}`);
  }

  async createPlan(data: Partial<Plan>): Promise<ApiResponse<Plan>> {
    return this.post<Plan>('/api/plans', data);
  }

  async updatePlan(id: string, data: Partial<Plan>): Promise<ApiResponse<Plan>> {
    return this.put<Plan>(`/api/plans/${id}`, data);
  }

  async deletePlan(id: string): Promise<ApiResponse<void>> {
    return this.delete<void>(`/api/plans/${id}`);
  }

  async getPlanBonuses(id: string): Promise<ApiResponse<PlanBonus[]>> {
    return this.get<PlanBonus[]>(`/api/plans/${id}/bonuses`);
  }

  async createPlanBonus(planId: string, data: Partial<PlanBonus>): Promise<ApiResponse<PlanBonus>> {
    return this.post<PlanBonus>(`/api/plans/${planId}/bonuses`, data);
  }

  async deletePlanBonus(planId: string, bonusId: string): Promise<ApiResponse<void>> {
    return this.delete<void>(`/api/plans/${planId}/bonuses/${bonusId}`);
  }

  async activateCustomerPlan(customerId: string, planId: string): Promise<ApiResponse<CustomerPlan>> {
    return this.post<CustomerPlan>(`/api/plans/customers/${customerId}/activate`, { planId });
  }

  async deactivateCustomerPlan(customerId: string): Promise<ApiResponse<void>> {
    return this.post<void>(`/api/plans/customers/${customerId}/deactivate`);
  }

  async getCustomerPlans(customerId: string): Promise<ApiResponse<CustomerPlan[]>> {
    return this.get<CustomerPlan[]>(`/api/plans/customers/${customerId}`);
  }

  async getActiveCustomerPlan(customerId: string): Promise<ApiResponse<CustomerPlan>> {
    return this.get<CustomerPlan>(`/api/plans/customers/${customerId}/active`);
  }

  async getPlanStats(): Promise<ApiResponse<PlanStats>> {
    return this.get<PlanStats>('/api/plans/stats/overview');
  }

  async getAllPlanStats(): Promise<ApiResponse<PlanStats>> {
    return this.get<PlanStats>('/api/plans/stats/all');
  }

  // ============================================================================
  // Orders API
  // ============================================================================

  async getOrders(params?: PaginationParams): Promise<ApiResponse<Order[]>> {
    return this.get<Order[]>('/api/orders', params);
  }

  async getOrderById(id: string): Promise<ApiResponse<Order>> {
    return this.get<Order>(`/api/orders/${id}`);
  }

  async getOrderSummary(id: string): Promise<ApiResponse<Order>> {
    return this.get<Order>(`/api/orders/${id}/summary`);
  }

  async getOrderItems(id: string): Promise<ApiResponse<Order['items']>> {
    return this.get<Order['items']>(`/api/orders/${id}/items`);
  }

  async createOrder(data: Partial<Order>): Promise<ApiResponse<Order>> {
    return this.post<Order>('/api/orders', data);
  }

  async updateOrder(id: string, data: Partial<Order>): Promise<ApiResponse<Order>> {
    return this.put<Order>(`/api/orders/${id}`, data);
  }

  async deleteOrder(id: string): Promise<ApiResponse<void>> {
    return this.delete<void>(`/api/orders/${id}`);
  }

  async getOrderStats(): Promise<ApiResponse<OrderStats>> {
    return this.get<OrderStats>('/api/orders/stats/overview');
  }

  async getOrdersByComprador(idComprador: string): Promise<ApiResponse<Order[]>> {
    return this.get<Order[]>(`/api/orders/comprador/${idComprador}`);
  }

  async getOfficeOrders(params?: { limit?: number }): Promise<ApiResponse<Order[]>> {
    return this.get<Order[]>('/api/orders/office', params);
  }

  async getOrdersAndCustomers(params?: { page?: number; pageSize?: number }): Promise<ApiResponse<{ orders: Order[]; customers: Customer[]; totalCount: number; page: number; pageSize: number }>> {
    return this.get<{ orders: Order[]; customers: Customer[]; totalCount: number; page: number; pageSize: number }>('/api/orders/with-customers', params);
  }

  async getRecentOrders(params?: { page?: number; limit?: number; id_comprador?: string; status?: string }): Promise<ApiResponse<{ data: Order[]; total: number; pages: number }>> {
    return this.get<{ data: Order[]; total: number; pages: number }>('/api/orders/recent', params);
  }

  // ============================================================================
  // Payments API
  // ============================================================================

  async getPayments(params?: PaginationParams): Promise<ApiResponse<Payment[]>> {
    return this.get<Payment[]>('/api/payments', params);
  }

  async getPaymentById(id: string): Promise<ApiResponse<Payment>> {
    return this.get<Payment>(`/api/payments/${id}`);
  }

  async createPayment(data: Partial<Payment>): Promise<ApiResponse<Payment>> {
    return this.post<Payment>('/api/payments', data);
  }

  async updatePayment(id: string, data: Partial<Payment>): Promise<ApiResponse<Payment>> {
    return this.put<Payment>(`/api/payments/${id}`, data);
  }

  async deletePayment(id: string): Promise<ApiResponse<void>> {
    return this.delete<void>(`/api/payments/${id}`);
  }

  async processPaymentWebhook(data: unknown): Promise<ApiResponse<void>> {
    return this.post<void>('/api/payments/webhook', data);
  }

  async getPaymentStats(): Promise<ApiResponse<PaymentStats>> {
    return this.get<PaymentStats>('/api/payments/stats/overview');
  }

  // ============================================================================
  // Products API
  // ============================================================================

  async getProducts(params?: { limit?: number }): Promise<ApiResponse<Product[]>> {
    return this.get<Product[]>('/api/products', params);
  }

  async getProductById(id: string): Promise<ApiResponse<Product>> {
    return this.get<Product>(`/api/products/${id}`);
  }

  async getStoresProducts(params?: { limit?: number }): Promise<ApiResponse<Product[]>> {
    return this.get<Product[]>('/api/products/stores', params);
  }

  // ============================================================================
  // Network API
  // ============================================================================

  async getNetworkTree(distributorId: string): Promise<ApiResponse<NetworkNode>> {
    return this.get<NetworkNode>(`/api/network/${distributorId}/tree`);
  }

  async getDownlines(distributorId: string, params?: PaginationParams): Promise<ApiResponse<Downline[]>> {
    return this.get<Downline[]>(`/api/network/${distributorId}/downlines`, params);
  }

  async getUpline(distributorId: string): Promise<ApiResponse<Upline[]>> {
    return this.get<Upline[]>(`/api/network/${distributorId}/upline`);
  }

  async getNetworkStats(distributorId: string): Promise<ApiResponse<NetworkStats>> {
    return this.get<NetworkStats>(`/api/network/${distributorId}/stats`);
  }

  // ============================================================================
  // Analytics API
  // ============================================================================

  async getExecutiveAnalytics(params?: Record<string, unknown>): Promise<ApiResponse<ExecutiveAnalytics>> {
    return this.get<ExecutiveAnalytics>('/api/analytics/executive', params);
  }

  async getSalesAnalytics(params?: Record<string, unknown>): Promise<ApiResponse<SalesAnalytics>> {
    return this.get<SalesAnalytics>('/api/analytics/sales', params);
  }

  async getNetworkAnalytics(params?: Record<string, unknown>): Promise<ApiResponse<NetworkAnalytics>> {
    return this.get<NetworkAnalytics>('/api/analytics/network', params);
  }

  async getPlanAnalytics(params?: Record<string, unknown>): Promise<ApiResponse<PlanAnalytics>> {
    return this.get<PlanAnalytics>('/api/analytics/plans', params);
  }

  async getPlanAnalyticsById(id: string): Promise<ApiResponse<PlanAnalytics>> {
    return this.get<PlanAnalytics>(`/api/analytics/plans/${id}`);
  }

  async getBonusDistribution(params?: Record<string, unknown>): Promise<ApiResponse<BonusDistribution>> {
    return this.get<BonusDistribution>('/api/analytics/bonus-distribution', params);
  }

  // ============================================================================
  // Wallet API
  // ============================================================================

  async getWalletBalance(idComprador: string): Promise<ApiResponse<{ balance: number; availableBalance: number; frozenBalance: number; currency: string }>> {
    return this.get<{ balance: number; availableBalance: number; frozenBalance: number; currency: string }>(`/api/wallets/${idComprador}/balance`);
  }

  async getWalletTransactions(idComprador: string, params?: { limit?: number; transactionType?: 'credit' | 'debit' | 'freeze' | 'unfreeze' }): Promise<ApiResponse<any[]>> {
    return this.get<any[]>(`/api/wallets/${idComprador}/transactions`, params);
  }

  async ensureWallet(idComprador: string): Promise<ApiResponse<any>> {
    return this.post<any>(`/api/wallets/${idComprador}/ensure`);
  }

  async creditWallet(idComprador: string, amount: number, description: string, referenceId?: string, referenceType?: string): Promise<ApiResponse<any>> {
    return this.post<any>(`/api/wallets/${idComprador}/credit`, { amount, description, referenceId, referenceType });
  }

  async debitWallet(idComprador: string, amount: number, description: string, referenceId?: string, referenceType?: string): Promise<ApiResponse<any>> {
    return this.post<any>(`/api/wallets/${idComprador}/debit`, { amount, description, referenceId, referenceType });
  }

  async freezeWallet(idComprador: string, amount: number, description: string, referenceId?: string, referenceType?: string): Promise<ApiResponse<any>> {
    return this.post<any>(`/api/wallets/${idComprador}/freeze`, { amount, description, referenceId, referenceType });
  }

  async unfreezeWallet(idComprador: string, amount: number, description: string, referenceId?: string, referenceType?: string): Promise<ApiResponse<any>> {
    return this.post<any>(`/api/wallets/${idComprador}/unfreeze`, { amount, description, referenceId, referenceType });
  }

  // ============================================================================
  // Bonus Wallet API
  // ============================================================================

  async getBonusWalletBalance(idComprador: string): Promise<ApiResponse<{ balance: number; availableBalance: number }>> {
    return this.get<{ balance: number; availableBalance: number }>(`/api/wallets/${idComprador}/bonus/balance`);
  }

  async getBonusTransactions(idComprador: string, params?: { limit?: number }): Promise<ApiResponse<any[]>> {
    return this.get<any[]>(`/api/wallets/${idComprador}/bonus/transactions`, params);
  }

  async ensureBonusWallet(idComprador: string): Promise<ApiResponse<any>> {
    return this.post<any>(`/api/wallets/${idComprador}/bonus/ensure`);
  }

  // ============================================================================
  // Points Wallet API
  // ============================================================================

  async getPointsWalletBalance(idComprador: string): Promise<ApiResponse<{ balance: number; availableBalance: number }>> {
    return this.get<{ balance: number; availableBalance: number }>(`/api/wallets/${idComprador}/points/balance`);
  }

  async getPointsTransactions(idComprador: string, params?: { limit?: number }): Promise<ApiResponse<any[]>> {
    return this.get<any[]>(`/api/wallets/${idComprador}/points/transactions`, params);
  }

  async ensurePointsWallet(idComprador: string): Promise<ApiResponse<any>> {
    return this.post<any>(`/api/wallets/${idComprador}/points/ensure`);
  }

  // ============================================================================
  // MLM Commission API
  // ============================================================================

  async simulateCommission(sellerId: string, orderAmount: number): Promise<ApiResponse<any>> {
    return this.post<any>('/api/mlm/simulate', { seller_id: sellerId, order_amount: orderAmount });
  }
}

export const httpClient = new HttpClient(BASE_URL);
