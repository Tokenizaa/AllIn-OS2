import { useMemo } from "react";

interface Order {
  forma_pagamento?: string;
  valor_total?: string | number;
}

interface StatsData {
  totalRevenue?: number;
  total_revenue?: number;
  totalOrders?: number;
  total_orders?: number;
}

interface PaymentMethodDistribution {
  method: string;
  count: number;
  percentage: number;
  revenue: number;
}

export function usePaymentAnalyticsData(ordersList: Order[], statsData: StatsData | null) {
  const paymentMethodDistribution = useMemo(() => {
    const grouped = ordersList.reduce((acc: Record<string, { count: number; revenue: number }>, order: Order) => {
      const method = order.forma_pagamento || "outro";
      const entry = acc[method] || { count: 0, revenue: 0 };
      entry.count += 1;
      entry.revenue += Number(order.valor_total || 0);
      acc[method] = entry;
      return acc;
    }, {});

    const totalCount = (Object.values(grouped) as Array<{ count: number; revenue: number }>).reduce((sum, item) => sum + item.count, 0) || 1;
    return Object.entries(grouped).map(([method, value]) => ({
      method,
      count: (value as { count: number; revenue: number }).count,
      percentage: Math.round(((value as { count: number; revenue: number }).count / totalCount) * 100),
      revenue: Number((value as { count: number; revenue: number }).revenue.toFixed(2)),
    }));
  }, [ordersList]);

  const topOrders = useMemo(() => {
    return [...ordersList]
      .sort((a: Order, b: Order) => Number(b.valor_total || 0) - Number(a.valor_total || 0))
      .slice(0, 5);
  }, [ordersList]);

  const totalRevenue = Number(statsData?.totalRevenue || statsData?.total_revenue || 0);
  const totalOrders = Number(statsData?.totalOrders || statsData?.total_orders || 0);
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  return {
    paymentMethodDistribution,
    topOrders,
    totalRevenue,
    totalOrders,
    avgOrderValue,
  };
}
