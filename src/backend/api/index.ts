// Central API exports for frontend consumption
// This file provides a single entry point for all API functions

// Auth
export {
  login,
  register,
  refreshToken,
  changePassword,
  logout,
} from "../modules/auth/api/auth.api";

// Customers
export {
  getCustomers,
  getCustomerById,
  getCustomer360,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerStats,
  getCustomerDownlines,
} from "../modules/customers/api/customers.api";

// Plans
export {
  getPlans,
  getPlanById,
  createPlan,
  updatePlan,
  deletePlan,
  getPlanBonuses,
  createPlanBonus,
  deletePlanBonus,
  activateCustomerPlan,
  deactivateCustomerPlan,
  getCustomerPlans,
  getActiveCustomerPlan,
  getPlanStats,
  getAllPlanStats,
} from "../modules/plans/api/plans.api";

// Analytics
export {
  getExecutiveAnalytics,
  getSalesAnalytics,
  getNetworkAnalytics,
  getPlanAnalytics,
  getPlanAnalyticsById,
  getBonusDistribution,
} from "../modules/analytics/api/analytics.api";

// Orders
export {
  getOrders,
  getOrderById,
  getOrderSummary,
  createOrder,
  updateOrder,
  deleteOrder,
  getOrderItems,
  getOrderStats,
} from "../modules/orders/api/orders.api";

// Network
export {
  getNetworkTree,
  getDownlines,
  getUpline,
  getNetworkStats,
} from "../modules/network/api/network.api";

// Payments
export {
  getPayments,
  getPaymentById,
  createPayment,
  updatePayment,
  deletePayment,
  processPaymentWebhook,
  getPaymentStats,
} from "../modules/payments/api/payments.api";

// Distributors
export {
  syncAllDistributors,
  syncDistributorById,
  getDistributorSyncStatus,
} from "../modules/distributors/api/distributors.api";

// Copilot - Server-side only, not exported for frontend
// The copilot API uses Express and is meant for server-side use only
// Frontend should make HTTP requests to the backend endpoints instead
