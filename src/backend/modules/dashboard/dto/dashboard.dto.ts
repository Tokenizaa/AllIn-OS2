/**
 * Dashboard DTOs
 * 
 * DTOs para operações com dashboard.
 */

export interface DashboardStats {
  // MLM Stats
  totalDistributors: number;
  activeDistributors: number;
  newDistributorsThisMonth: number;
  totalNetworkVolume: number;
  totalCommissionsPaid: number;
  pendingCommissions: number;
  
  // E-commerce Stats
  totalOrders: number;
  totalRevenue: number;
  ordersThisMonth: number;
  revenueThisMonth: number;
  pendingOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  
  // Customer Stats
  totalCustomers: number;
  activeCustomers: number;
  newCustomersThisMonth: number;
  
  // Product Stats
  totalProducts: number;
  activeProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  
  // Time Period
  period: 'today' | 'week' | 'month' | 'year' | 'all';
  periodStart: Date;
  periodEnd: Date;
}

export interface SalesTrend {
  date: string;
  orders: number;
  revenue: number;
  commissions: number;
}

export interface TopDistributor {
  id: string;
  name: string;
  email: string;
  totalVolume: number;
  totalCommissions: number;
  networkSize: number;
  rank: string;
}

export interface TopProduct {
  id: string;
  name: string;
  category: string;
  totalSold: number;
  totalRevenue: number;
  stock: number;
}

export interface RecentOrder {
  id: string;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  createdAt: Date;
}

export interface CommissionOverview {
  totalPaid: number;
  totalPending: number;
  totalAvailable: number;
  paidThisMonth: number;
  pendingThisMonth: number;
  recentPayments: Array<{
    id: string;
    distributorId: string;
    distributorName: string;
    amount: number;
    status: string;
    paidAt: Date;
  }>;
}

export interface NetworkOverview {
  totalNodes: number;
  activeNodes: number;
  depth: number;
  width: number;
  growthRate: number;
  topPerformers: TopDistributor[];
}

export interface DashboardResponse {
  stats: DashboardStats;
  salesTrend: SalesTrend[];
  topDistributors: TopDistributor[];
  topProducts: TopProduct[];
  recentOrders: RecentOrder[];
  commissionOverview: CommissionOverview;
  networkOverview: NetworkOverview;
}
