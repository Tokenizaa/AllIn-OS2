/**
 * Shared API Types
 * 
 * These types are shared between frontend and backend
 * to ensure type safety across the HTTP boundary
 */

// ============================================================================
// Common Types
// ============================================================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
  [key: string]: unknown; // Index signature for compatibility with Record<string, unknown>
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

// ============================================================================
// Auth Types
// ============================================================================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// Customer Types
// ============================================================================

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  cpf?: string;
  cnpj?: string;
  status: CustomerStatus;
  sponsorId?: string;
  distributorId?: string;
  allinId?: number;
  createdAt: string;
  updatedAt: string;
}

export type CustomerStatus = 'active' | 'inactive' | 'pending' | 'suspended';

export interface Address {
  street: string;
  number: string;
  complement?: string;
  city: string;
  state: string;
  zipCode: string;
  country?: string;
}

export interface CustomerStats {
  totalCustomers: number;
  activeCustomers: number;
  newCustomersThisMonth: number;
  totalDownlines: number;
}

export interface Customer360 {
  customer: Customer;
  metrics: CustomerMetrics;
  networkMetrics: CustomerNetworkMetrics;
  scores: CustomerScores;
  plans: CustomerPlan[];
}

export interface CustomerMetrics {
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  lastOrderDate?: string;
}

export interface CustomerNetworkMetrics {
  totalDownlines: number;
  activeDownlines: number;
  totalVolume: number;
  rank: string;
}

export interface CustomerScores {
  engagementScore: number;
  loyaltyScore: number;
  performanceScore: number;
}

// ============================================================================
// Plan Types
// ============================================================================

export interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in months
  features: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PlanBonus {
  id: string;
  planId: string;
  name: string;
  percentage: number;
  conditions: string[];
}

export interface CustomerPlan {
  id: string;
  customerId: string;
  planId: string;
  status: PlanStatus;
  startDate: string;
  endDate?: string;
  autoRenew: boolean;
}

export type PlanStatus = 'active' | 'expired' | 'cancelled' | 'pending';

export interface PlanStats {
  totalPlans: number;
  activePlans: number;
  totalRevenue: number;
  plansByStatus: Record<PlanStatus, number>;
}

// ============================================================================
// Order Types
// ============================================================================

export interface Order {
  id: string;
  customerId: string;
  status: OrderStatus;
  totalAmount: number;
  currency: string;
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress?: Address;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface OrderStats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
}

// ============================================================================
// Payment Types
// ============================================================================

export interface Payment {
  id: string;
  orderId: string;
  customerId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod: PaymentMethod;
  transactionId?: string;
  createdAt: string;
  updatedAt: string;
}

export type PaymentStatus = 
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'refunded'
  | 'cancelled';

export type PaymentMethod = 
  | 'credit_card'
  | 'debit_card'
  | 'pix'
  | 'boleto'
  | 'cash'
  | 'bank_transfer';

export interface PaymentStats {
  totalPayments: number;
  completedPayments: number;
  failedPayments: number;
  totalAmount: number;
  averageAmount: number;
}

// ============================================================================
// Product Types
// ============================================================================

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  category?: string;
  imageUrl?: string;
  stock?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// Network Types
// ============================================================================

export interface NetworkNode {
  distributorId: string;
  name: string;
  email: string;
  rank: string;
  level: number;
  leftChild?: NetworkNode;
  rightChild?: NetworkNode;
}

export interface Downline {
  id: string;
  name: string;
  email: string;
  level: number;
  status: CustomerStatus;
  joinDate: string;
  totalVolume: number;
}

export interface Upline {
  id: string;
  name: string;
  email: string;
  level: number;
  rank: string;
}

export interface NetworkStats {
  totalDownlines: number;
  activeDownlines: number;
  totalVolume: number;
  averageVolumePerDownline: number;
  depth: number;
}

// ============================================================================
// Analytics Types
// ============================================================================

export interface ExecutiveAnalytics {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalDistributors: number;
  revenueGrowth: number;
  orderGrowth: number;
  customerGrowth: number;
  period: string;
}

export interface SalesAnalytics {
  dailySales: Array<{ date: string; amount: number }>;
  topProducts: Array<{ productId: string; name: string; quantity: number; revenue: number }>;
  salesByRegion: Array<{ region: string; amount: number }>;
  period: string;
}

export interface NetworkAnalytics {
  networkGrowth: Array<{ date: string; count: number }>;
  topPerformers: Array<{ distributorId: string; name: string; volume: number }>;
  depthDistribution: Array<{ level: number; count: number }>;
  period: string;
}

export interface PlanAnalytics {
  planDistribution: Array<{ planId: string; name: string; count: number; revenue: number }>;
  planConversionRate: number;
  averagePlanDuration: number;
  period: string;
}

export interface BonusDistribution {
  totalBonus: number;
  bonusByType: Array<{ type: string; amount: number; count: number }>;
  topEarners: Array<{ distributorId: string; name: string; bonus: number }>;
  period: string;
}
