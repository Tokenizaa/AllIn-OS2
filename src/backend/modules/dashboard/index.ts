/**
 * Dashboard Module Index
 * 
 * Exporta todos os componentes do módulo dashboard.
 */

export { DashboardRepository } from './repositories/dashboard.repository';

export { DashboardService } from './services/dashboard.service';

export type {
  DashboardStats,
  SalesTrend,
  TopDistributor,
  TopProduct,
  RecentOrder,
  CommissionOverview,
  NetworkOverview,
  DashboardResponse,
} from './dto/dashboard.dto';
