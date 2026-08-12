import { supabase } from "@/lib/supabase/client";

const COMMISSION_RATE = 0.25;
const DEFAULT_POINTS_PER_UNIT = 20;
const OFFICE_COMMISSION_RATE = 0.18;
const OFFICE_BONUS_RATE = 0.10;
const UNILEVEL_COMMISSION_RATE = 0.04;

const UNILEVEL_GENERATION_RATES: Record<number, number> = {
  1: 0.05,
  2: 0.03,
  3: 0.02,
};

export const CheckoutRules = {
  COMMISSION_RATE,
  DEFAULT_POINTS_PER_UNIT,
  VALID_COUPONS: { ALLIN10: 0.10 } as Record<string, number>,

  calculateItemPoints(product: { bonus_payment_percentage?: number }, quantity: number): number {
    const pointsPerUnit = product.bonus_payment_percentage ?? DEFAULT_POINTS_PER_UNIT;
    return pointsPerUnit * quantity;
  },

  calculateItemCommission(price: string | number, quantity: number): number {
    return (parseFloat(String(price)) * COMMISSION_RATE) * quantity;
  },

  calculateCartPoints(cart: { product: any; quantity: number }[]): number {
    return cart.reduce((acc, item) => acc + CheckoutRules.calculateItemPoints(item.product, item.quantity), 0);
  },

  calculateCartCommission(cart: { product: any; quantity: number }[]): number {
    return cart.reduce((acc, item) => acc + CheckoutRules.calculateItemCommission(item.product.price, item.quantity), 0);
  },

  validateCoupon(code: string): { valid: boolean; discountRate: number } {
    const normalized = code.trim().toUpperCase();
    const discountRate = CheckoutRules.VALID_COUPONS[normalized];
    return { valid: discountRate !== undefined, discountRate: discountRate ?? 0 };
  },

  calculateDiscount(subtotal: number, couponCode: string): { discount: number; valid: boolean } {
    const { valid, discountRate } = CheckoutRules.validateCoupon(couponCode);
    return { discount: valid ? subtotal * discountRate : 0, valid };
  },
};

export const OfficeRules = {
  COMMISSION_RATE: OFFICE_COMMISSION_RATE,
  BONUS_RATE: OFFICE_BONUS_RATE,

  calculateCommission(totalPaid: number): number {
    return totalPaid * OFFICE_COMMISSION_RATE;
  },

  calculateBonus(orderAmount: number): number {
    return orderAmount * OFFICE_BONUS_RATE;
  },
};

export const EarningsRules = {
  UNILEVEL_RATE: UNILEVEL_COMMISSION_RATE,

  calculateNetworkSize(directs: number, multiplication: number, generations: number): number {
    let total = 0;
    for (let g = 1; g <= generations; g++) {
      total += directs * Math.pow(multiplication, g - 1);
    }
    return total;
  },

  calculateMonthlyIncome(directs: number, multiplication: number, generations: number, avgTicket: number): number {
    let income = 0;
    for (let g = 1; g <= generations; g++) {
      const generationCount = directs * Math.pow(multiplication, g - 1);
      const rate = UNILEVEL_GENERATION_RATES[g] || UNILEVEL_COMMISSION_RATE;
      income += generationCount * (avgTicket * rate);
    }
    return income;
  },
};

export const OrderService = {
  async fetchOrdersForDashboard() {
    const { data, error } = await supabase
      .schema('commerce').from('orders')
      .select('*')
      .limit(300)
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message || "Failed to fetch orders for dashboard");
    return data || [];
  },

  async fetchOrdersList(page = 1, pageSize = 15) {
    const { data, error } = await supabase
      .schema('commerce').from('orders')
      .select('*')
      .range((page - 1) * pageSize, page * pageSize - 1)
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message || "Failed to fetch orders list");
    return {
      orders: data || [],
      totalCount: 0,
      page,
      pageSize,
    };
  },

  async fetchOrdersAndCustomers(limit = 60) {
    const [{ data: ordersData, error: ordersError }, { data: customersData, error: customersError }] = await Promise.all([
      supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(limit),
      supabase.schema('crm').from("customers").select("id, usuario, id_comprador, user_id, qualification, telefone, metadata, nome_completo").order("created_at", { ascending: false }),
    ]);
    if (ordersError) throw ordersError;
    if (customersError) throw customersError;
    return {
      orders: ordersData || [],
      customers: customersData || [],
    };
  },

  async fetchRecentOrders(options: { page?: number; limit?: number; id_comprador?: string; status?: string } = {}) {
    let query = supabase
      .schema('commerce').from('orders')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });
    if (options.limit) query = query.limit(options.limit);
    if (options.page && options.limit) query = query.range((options.page - 1) * options.limit, options.page * options.limit - 1);
    if (options.id_comprador) query = query.eq('id_comprador', options.id_comprador);
    if (options.status) query = query.eq('status', options.status);
    const { data, error, count } = await query;
    if (error) throw new Error(error.message || "Failed to fetch recent orders");
    return { data: data || [], total: count || 0, pages: options.limit ? Math.ceil((count || 0) / options.limit) : 1 };
  },

  resolvePaymentStatus(index: number): "processando" | "pago" {
    return index < 2 ? "processando" : "pago";
  },

  transformCommissionRows(payments: any[]): any[] {
    return (payments || []).map((p: any, i: number) => ({
      id: p.id || i,
      ciclo: `Lançamento #${i + 1}`,
      qualificados: Number(p.quantity || 1),
      pago: Number(p.amount || 0),
      status: OrderService.resolvePaymentStatus(i),
      planKey: p.plan_id || p.plan_name || p.plano_id || null,
    }));
  },

  transformNetworkLegs(relationships: any[]): any[] {
    return (relationships || []).map((r: any, i: number) => ({
      name: `G${i + 1}`,
      esquerda: Number(r.left_count || r.left_side_count || 0),
      direita: Number(r.right_count || r.right_side_count || 0),
    }));
  },

  async fetchOrdersPage(page: number, pageSize: number) {
    const from = (page - 1) * pageSize;
    const to = page * pageSize - 1;
    const { data, error, count } = await supabase
      .schema('commerce')
      .from('orders')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);
    if (error) throw error;
    return { orders: data || [], totalCount: count || 0 };
  },

  async fetchAllCustomers() {
    const { data, error } = await supabase
      .schema('crm')
      .from('customers')
      .select('id, usuario, id_comprador, user_id, qualification, telefone, metadata, nome_completo')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async fetchOrderStats() {
    const { data, error } = await supabase
      .schema('commerce').from('orders')
      .select('*');
    if (error) throw new Error(error.message || "Failed to fetch order stats");
    const totalOrders = data?.length || 0;
    const totalRevenue = data?.reduce((sum, o) => sum + (Number(o.total) || 0), 0) || 0;
    return {
      success: true,
      data: { totalOrders, totalRevenue, orders: data }
    };
  }
};
