/**
 * Permission Enum for backend services
 * Maps to identity.permissions table in the database
 */

export enum PermissionEnum {
  // System permissions
  ADMIN_ALL = 'admin_all',
  SYSTEM_READ = 'system_read',
  SYSTEM_WRITE = 'system_write',

  // Dashboard
  DASHBOARD_READ = 'dashboard_read',
  DASHBOARD_WRITE = 'dashboard_write',

  // Customers
  CUSTOMERS_READ = 'customers_read',
  CUSTOMERS_WRITE = 'customers_write',
  CUSTOMERS_DELETE = 'customers_delete',

  // Orders
  ORDERS_READ = 'orders_read',
  ORDERS_WRITE = 'orders_write',
  ORDERS_DELETE = 'orders_delete',

  // Products
  PRODUCTS_READ = 'products_read',
  PRODUCTS_WRITE = 'products_write',
  PRODUCTS_DELETE = 'products_delete',

  // Network/MLM
  NETWORK_READ = 'network_read',
  NETWORK_WRITE = 'network_write',

  // Finance
  FINANCE_READ = 'finance_read',
  FINANCE_WRITE = 'finance_write',

  // Marketing
  MARKETING_READ = 'marketing_read',
  MARKETING_WRITE = 'marketing_write',

  // Support
  SUPPORT_READ = 'support_read',
  SUPPORT_WRITE = 'support_write',

  // Analytics
  ANALYTICS_READ = 'analytics_read',
  ANALYTICS_WRITE = 'analytics_write',

  // Settings
  SETTINGS_READ = 'settings_read',
  SETTINGS_WRITE = 'settings_write',
}
