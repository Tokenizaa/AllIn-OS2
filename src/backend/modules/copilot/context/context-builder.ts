import { CustomerRepository } from "../../customers/repositories/customer.repository";
import { NetworkRepository } from "../../network/repositories/network.repository";
import { OrderRepository } from "../../orders/repositories/order.repository";
import { PaymentRepository } from "../../payments/repositories/payment.repository";
import { AnalyticsRepository } from "../../analytics/repositories/analytics.repository";
import { PlanRepository } from "../../plans/repositories/plan.repository";
import { ProfileRepository } from "../../profiles/repositories/profile.repository";
import { WalletService } from "../../payments/services/wallet.service";
import { BonusWalletService } from "../../payments/services/bonus-wallet.service";
import { ContextData } from "../dto/copilot.dto";
import { PermissionGuard, getPermissionsForRole } from "../../auth/guards/permission.guard";

export class ContextBuilder {
  private customerRepository: CustomerRepository;
  private networkRepository: NetworkRepository;
  private orderRepository: OrderRepository;
  private paymentRepository: PaymentRepository;
  private analyticsRepository: AnalyticsRepository;
  private planRepository: PlanRepository;
  private profileRepository: ProfileRepository;
  private walletService: WalletService;
  private bonusWalletService: BonusWalletService;

  constructor() {
    this.customerRepository = new CustomerRepository();
    this.networkRepository = new NetworkRepository();
    this.orderRepository = new OrderRepository();
    this.paymentRepository = new PaymentRepository();
    this.analyticsRepository = new AnalyticsRepository();
    this.planRepository = new PlanRepository();
    this.profileRepository = new ProfileRepository();
    this.walletService = WalletService.getInstance();
    this.bonusWalletService = BonusWalletService.getInstance();
  }

  async buildContext(userId: string, role: string, route?: string): Promise<ContextData> {
    const context: ContextData = {
      user: {
        id: userId,
        name: "",
        email: "",
        role: role,
      },
      route,
      kpis: {},
      recent_activity: {},
      alerts: [],
    };

    // Get user profile
    try {
      const profile = await this.profileRepository.findByUserId(userId);
      if (profile) {
        context.user.name = profile.name || "";
        context.user.email = profile.email || "";
      }
    } catch (error) {
      console.error("[ContextBuilder] Failed to get profile:", error);
    }

    // Get customer data
    try {
      const customer = await this.customerRepository.findById(userId);
      if (customer) {
        context.user.name = customer.name || context.user.name;
        context.user.email = customer.email || context.user.email;
      }
    } catch (error) {
      console.error("[ContextBuilder] Failed to get customer:", error);
    }

    // Build context based on role and permissions
    const permissions = getPermissionsForRole(role);

    // CRM Context
    if (PermissionGuard.hasAnyPermission(permissions, ['CUSTOMERS_READ', 'NETWORK_READ'])) {
      try {
        const networkStats = await this.networkRepository.getNetworkStats(userId);
        context.kpis.network_size = networkStats.totalNetworkSize;
        context.kpis.active_customers = networkStats.activeDistributors;
      } catch (error) {
        console.error("[ContextBuilder] Failed to get network stats:", error);
      }
    }

    // Commercial Context
    if (PermissionGuard.hasAnyPermission(permissions, ['ORDERS_READ', 'ANALYTICS_READ'])) {
      try {
        const executiveAnalytics = await this.analyticsRepository.getExecutiveAnalytics();
        context.kpis.total_orders = executiveAnalytics.totalOrders;
        context.kpis.total_revenue = executiveAnalytics.totalRevenue;
        context.kpis.total_customers = executiveAnalytics.totalCustomers;
      } catch (error) {
        console.error("[ContextBuilder] Failed to get analytics:", error);
      }
    }

    // Financial Context
    if (PermissionGuard.hasAnyPermission(permissions, ['PAYMENTS_READ'])) {
      try {
        const wallet = await this.walletService.getWalletByCustomerId(userId);
        if (wallet) {
          context.kpis.wallet_balance = wallet.available_balance;
        }

        const bonusWallet = await this.bonusWalletService.getBonusWalletByCustomerId(userId);
        if (bonusWallet) {
          context.kpis.wallet_balance = (context.kpis.wallet_balance || 0) + bonusWallet.available_balance;
        }
      } catch (error) {
        console.error("[ContextBuilder] Failed to get wallet data:", error);
      }
    }

    // Route-specific context
    if (route) {
      await this.buildRouteContext(context, userId, route, permissions);
    }

    // Add alerts based on data quality
    this.addDataQualityAlerts(context);

    return context;
  }

  private async buildRouteContext(
    context: ContextData,
    userId: string,
    route: string,
    permissions: string[]
  ): Promise<void> {
    switch (route) {
      case "/office/customers":
        if (PermissionGuard.hasPermission(permissions, 'CUSTOMERS_READ')) {
          try {
            const customers = await this.customerRepository.findAll({ limit: 10 });
            context.recent_activity = {
              ...context.recent_activity,
              recent_signups: customers.length,
            };
          } catch (error) {
            console.error("[ContextBuilder] Failed to get recent customers:", error);
          }
        }
        break;

      case "/office/orders":
        if (PermissionGuard.hasPermission(permissions, 'ORDERS_READ')) {
          try {
            const orders = await this.orderRepository.findByCustomerId(userId, { limit: 10 });
            context.recent_activity = {
              ...context.recent_activity,
              recent_orders: orders.length,
            };
          } catch (error) {
            console.error("[ContextBuilder] Failed to get recent orders:", error);
          }
        }
        break;

      case "/office/payments":
        if (PermissionGuard.hasPermission(permissions, 'PAYMENTS_READ')) {
          try {
            const payments = await this.paymentRepository.findByCustomerId(userId, { limit: 10 });
            context.recent_activity = {
              ...context.recent_activity,
              recent_payments: payments.length,
            };
          } catch (error) {
            console.error("[ContextBuilder] Failed to get recent payments:", error);
          }
        }
        break;

      default:
        break;
    }
  }

  private addDataQualityAlerts(context: ContextData): void {
    // Add alerts based on known data quality issues from audit
    if (context.kpis.total_customers === 0) {
      context.alerts?.push({
        type: "warning",
        message: "Nenhum cliente encontrado no sistema",
        source: "customers",
      });
    }

    if (context.kpis.wallet_balance === 0) {
      context.alerts?.push({
        type: "info",
        message: "Saldo da carteira é zero",
        source: "wallets",
      });
    }
  }

  async buildMinimalContext(userId: string, role: string): Promise<Record<string, any>> {
    return {
      user_id: userId,
      role: role,
      timestamp: new Date().toISOString(),
    };
  }
}

export const contextBuilder = new ContextBuilder();
