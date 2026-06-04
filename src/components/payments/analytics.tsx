import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { BarChart3, PieChart, TrendingUp, Calendar, Download, RefreshCw, Loader2 } from "lucide-react";
import { useAnalytics } from "@/hooks/analytics/useAnalytics";

export function PaymentAnalytics() {
  const [dateRange, setDateRange] = useState("30d");

  const { stats, orders } = useAnalytics();
  const ordersList = useMemo(() => (orders.data?.data || []) as any[], [orders.data]);

  const paymentMethodDistribution = useMemo(() => {
    const grouped = ordersList.reduce((acc: Record<string, { count: number; revenue: number }>, order: any) => {
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
      .sort((a: any, b: any) => Number(b.valor_total || 0) - Number(a.valor_total || 0))
      .slice(0, 5);
  }, [ordersList]);

  const totalRevenue = Number((stats.data as any)?.data?.totalRevenue || (stats.data as any)?.data?.total_revenue || 0);
  const totalOrders = Number((stats.data as any)?.data?.totalOrders || (stats.data as any)?.data?.total_orders || 0);
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const handleRefresh = async () => {
    await Promise.all([stats.refetch(), orders.refetch()]);
  };

  const loading = stats.isLoading || orders.isLoading;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Payment Analytics</h2>
          <p className="text-muted-foreground">Relatório real baseado em `orders` e `order_items`.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleRefresh} disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
            Refresh
          </Button>
          <Button variant="outline" disabled={loading}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">
            <BarChart3 className="mr-2 h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="methods">
            <PieChart className="mr-2 h-4 w-4" />
            Methods
          </TabsTrigger>
          <TabsTrigger value="trends">
            <TrendingUp className="mr-2 h-4 w-4" />
            Trends
          </TabsTrigger>
          <TabsTrigger value="products">
            <Calendar className="mr-2 h-4 w-4" />
            Top Orders
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-4">
            <MetricCard title="Total Revenue" value={`R$ ${totalRevenue.toLocaleString()}`} helper="Selected period" />
            <MetricCard title="Total Orders" value={String(totalOrders)} helper="Selected period" />
            <MetricCard title="Delivered" value={String(Number((stats as any)?.data?.deliveredOrders || (stats as any)?.data?.delivered_orders || 0))} helper="Real production data" />
            <MetricCard title="Avg Order Value" value={`R$ ${avgOrderValue.toFixed(2)}`} helper="Selected period" />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest operational records from the production backend</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading orders...
                </div>
              ) : ordersList.length === 0 ? (
                <div className="text-sm text-muted-foreground">No orders found for the selected period.</div>
              ) : (
                <div className="space-y-4">
                  {ordersList.slice(0, 8).map((order: any) => (
                    <div key={order.id} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{order.usuario || order.comprador || "Cliente"}</span>
                        <span className="text-muted-foreground">R$ {Number(order.valor_total || 0).toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{
                            width: `${Math.max(6, (Number(order.valor_total || 0) / Math.max(...ordersList.map((o: any) => Number(o.valor_total || 0)), 1)) * 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="methods" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Method Distribution</CardTitle>
              <CardDescription>Breakdown of payment methods present in real orders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paymentMethodDistribution.length === 0 ? (
                  <div className="text-sm text-muted-foreground">No method distribution available.</div>
                ) : (
                  paymentMethodDistribution.map((method) => (
                    <div key={method.method} className="p-4 border rounded-lg space-y-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-semibold">{method.method}</h4>
                          <p className="text-sm text-muted-foreground">
                            {method.count} orders ({method.percentage}%)
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">R$ {method.revenue.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">
                            R$ {(method.revenue / Math.max(method.count, 1)).toFixed(2)} avg
                          </div>
                        </div>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${method.percentage}%` }} />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Operational Trends</CardTitle>
              <CardDescription>Current production signals derived from order stats</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground">
                Production readout is now based on order totals, status distribution and payment method mix.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Orders by Revenue</CardTitle>
              <CardDescription>Highest-value real orders in the selected period</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topOrders.length === 0 ? (
                  <div className="text-sm text-muted-foreground">No order data found yet.</div>
                ) : (
                  topOrders.map((order: any, index: number) => (
                    <div key={order.id} className="p-4 border rounded-lg space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="font-semibold">{order.usuario || order.comprador || `Pedido ${index + 1}`}</h4>
                            <p className="text-sm text-muted-foreground">{order.forma_pagamento || "outro"} · {order.status || "pending"}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">R$ {Number(order.valor_total || 0).toLocaleString()}</div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function MetricCard({ title, value, helper }: { title: string; value: string; helper: string }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{helper}</p>
      </CardContent>
    </Card>
  );
}
