import { z } from "zod";

export const reportPeriodSchema = z.enum(["daily", "weekly", "monthly", "quarterly", "yearly", "custom"]);

export type ReportPeriod = z.infer<typeof reportPeriodSchema>;

export const salesReportSchema = z.object({
  period: reportPeriodSchema,
  start_date: z.string().datetime(),
  end_date: z.string().datetime(),
  total_orders: z.number(),
  total_revenue: z.number(),
  average_order_value: z.number(),
  total_customers: z.number(),
  returning_customers: z.number(),
  conversion_rate: z.number(),
  top_products: z.array(z.object({
    product_id: z.string(),
    product_name: z.string(),
    quantity_sold: z.number(),
    revenue: z.number(),
  })),
  revenue_by_payment_method: z.record(z.number()),
  revenue_by_category: z.record(z.number()),
});

export type SalesReport = z.infer<typeof salesReportSchema>;

export const productReportSchema = z.object({
  period: reportPeriodSchema,
  start_date: z.string().datetime(),
  end_date: z.string().datetime(),
  total_products: z.number(),
  active_products: z.number(),
  out_of_stock_products: z.number(),
  low_stock_products: z.number(),
  top_selling_products: z.array(z.object({
    product_id: z.string(),
    product_name: z.string(),
    quantity_sold: z.number(),
    revenue: z.number(),
    stock_level: z.number(),
  })),
  products_by_category: z.record(z.number()),
  inventory_value: z.number(),
});

export type ProductReport = z.infer<typeof productReportSchema>;

export const customerReportSchema = z.object({
  period: reportPeriodSchema,
  start_date: z.string().datetime(),
  end_date: z.string().datetime(),
  total_customers: z.number(),
  new_customers: z.number(),
  active_customers: z.number(),
  average_lifetime_value: z.number(),
  average_order_frequency: z.number(),
  top_customers: z.array(z.object({
    customer_id: z.string(),
    customer_name: z.string(),
    customer_email: z.string(),
    total_orders: z.number(),
    total_spent: z.number(),
    last_order_date: z.string().datetime(),
  })),
  customers_by_segment: z.record(z.number()),
});

export type CustomerReport = z.infer<typeof customerReportSchema>;

export const inventoryReportSchema = z.object({
  period: reportPeriodSchema,
  start_date: z.string().datetime(),
  end_date: z.string().datetime(),
  total_products: z.number(),
  total_quantity: z.number(),
  total_value: z.number(),
  low_stock_items: z.array(z.object({
    product_id: z.string(),
    product_name: z.string(),
    current_stock: z.number(),
    reorder_level: z.number(),
    status: z.string(),
  })),
  out_of_stock_items: z.array(z.object({
    product_id: z.string(),
    product_name: z.string(),
    last_stock_date: z.string().datetime().nullable(),
  })),
  inventory_turnover: z.number(),
  days_of_inventory: z.number(),
});

export type InventoryReport = z.infer<typeof inventoryReportSchema>;
