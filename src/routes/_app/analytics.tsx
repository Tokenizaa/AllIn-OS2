import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { useAnalytics } from "@/hooks/analytics/useAnalytics";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PageHeader } from "@/components/widgets/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/_app/analytics")({ component: AnalyticsPage });

function AnalyticsPage() {
  const { stats, orders, customers } = useAnalytics();

  const { data: statsData, isLoading: statsLoading, isError: statsIsError, error: statsError, refetch: refetchStats } = stats;
  const { data: ordersResult, isLoading: ordersLoading, isError: ordersIsError, error: ordersError, refetch: refetchOrders } = orders;
  const { data: customersData, isLoading: customersLoading, isError: customersIsError, error: customersError, refetch: refetchCustomers } = customers;

  const ordersList = useMemo(() => ordersResult?.data?.data || [], [ordersResult]);

  const revenueSeries = useMemo(() => {
    // Show in chronological order (left to right) by reversing the recent orders slice
    return ordersList.slice(0, 12).reverse().map((order: any, index: number) => {
      let dayLabel = `D${index + 1}`;
      if (order.data_criacao_pedido) {
        const d = new Date(order.data_criacao_pedido);
        if (!isNaN(d.getTime())) {
          dayLabel = d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
        }
      } else if (order.created_at) {
        const d = new Date(order.created_at);
        if (!isNaN(d.getTime())) {
          dayLabel = d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
        }
      }
      return ({
        day: dayLabel,
        receita: Number(order.valor_total || 0),
        // Removido: ano_anterior fake. Se não houver dados históricos reais, não mostrar comparação
      });
    });
  }, [ordersList]);

  const getCustomerName = (order: any) => {
    if (!customersData || customersData.length === 0) {
      return order.usuario || order.comprador || "Cliente";
    }
    const found = customersData.find(
      (c: any) =>
        (order.user_id && c.user_id === order.user_id) ||
        (order.id_comprador && c.id === order.id_comprador) ||
        (order.comprador && c.id_comprador === order.comprador) ||
        (order.usuario && c.usuario === order.usuario)
    );
    return (found as any)?.name || order.usuario || order.comprador || "Cliente";
  };

  const channelMix = useMemo(() => {
    const methods = ordersList.reduce((acc: Record<string, number>, order: any) => {
      const key = order.forma_pagamento || "outro";
      acc[key] = (acc[key] || 0) + Number(order.valor_total || 0);
      return acc;
    }, {});
    return Object.entries(methods).map(([name, value]) => ({ name, value: Math.round(Number(value)) }));
  }, [ordersList]);

  const networkLegs = useMemo(() => {
    const total = Number(statsData?.data?.totalOrders || 0);
    const active = Number(statsData?.data?.deliveredOrders || 0);
    const pending = Number(statsData?.data?.pendingOrders || 0);
    return [
      { name: "Pedidos", esquerda: total, direita: active },
      { name: "Entregues", esquerda: active, direita: pending },
      { name: "Faturamento", esquerda: Number(statsData?.data?.totalRevenue || 0), direita: Number(statsData?.data?.processingOrders || 0) },
    ];
  }, [statsData]);

  const isLoading = statsLoading || ordersLoading;
  // Removido: cohort fake. Implementar cálculo real de retenção se necessário

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader eyebrow="Executive" title="Analytics" subtitle="Carregando dados reais do banco..." />
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <Skeleton className="h-[280px] rounded-xl" />
          <Skeleton className="h-[280px] rounded-xl" />
          <Skeleton className="h-[280px] rounded-xl" />
          <Skeleton className="h-[280px] rounded-xl" />
        </div>
      </div>
    );
  }

  if (statsIsError || ordersIsError) {
    const message =
      (statsError instanceof Error && statsError.message) ||
      (ordersError instanceof Error && ordersError.message) ||
      "falha desconhecida";
    return (
      <div className="space-y-3">
        <PageHeader eyebrow="Executive" title="Analytics" subtitle="Falha ao carregar dados reais." />
        <p className="text-sm text-destructive">Erro: {message}</p>
        <button className="text-sm underline" onClick={() => { void refetchStats(); void refetchOrders(); }}>
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Executive" title="Analytics" subtitle="KPIs operacionais com dados reais de pedidos." />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Receita total" value={`R$ ${Number(statsData?.data?.totalRevenue || 0).toLocaleString()}`} helper={`${Number(statsData?.data?.totalOrders || 0)} pedidos`} />
        <MetricCard title="Pedidos" value={Number(statsData?.data?.totalOrders || 0).toString()} helper={`${Number(statsData?.data?.pendingOrders || 0)} pendentes`} />
        <MetricCard title="Entregues" value={Number(statsData?.data?.deliveredOrders || 0).toString()} helper={`${Number(statsData?.data?.shippedOrders || 0)} enviados`} />
        <MetricCard title="Cancelados" value={Number(statsData?.data?.cancelledOrders || 0).toString()} helper="Monitoramento de perda" />
      </div>

      <Tabs defaultValue="operacional" className="space-y-4">
        <TabsList>
          <TabsTrigger value="operacional">Operacional</TabsTrigger>
          <TabsTrigger value="pagamentos">Pagamentos</TabsTrigger>
        </TabsList>

        <TabsContent value="operacional" className="space-y-4">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <Card title="Receita por período">
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={revenueSeries}>
                  <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" />
                  <XAxis dataKey="day" fontSize={11} stroke="var(--color-muted-foreground)" />
                  <YAxis fontSize={11} stroke="var(--color-muted-foreground)" tickFormatter={(v) => `${(Number(v) / 1000).toFixed(0)}k`} />
                  <Tooltip contentStyle={ttStyle} />
                  <Area dataKey="receita" stroke="var(--color-primary)" fill="var(--color-primary)" fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
            <Card title="Status dos pedidos">
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={networkLegs}>
                  <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={11} stroke="var(--color-muted-foreground)" />
                  <YAxis fontSize={11} stroke="var(--color-muted-foreground)" />
                  <Tooltip contentStyle={ttStyle} />
                  <Bar dataKey="esquerda" fill="var(--color-primary)" />
                  <Bar dataKey="direita" fill="var(--color-chart-2)" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
            <Card title="Mix por forma de pagamento">
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={channelMix} dataKey="value" innerRadius={50} outerRadius={90} paddingAngle={3} stroke="none">
                    {channelMix.map((_, i) => (
                      <Cell key={i} fill={`var(--color-chart-${(i % 5) + 1})`} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={ttStyle} />
                </PieChart>
              </ResponsiveContainer>
            </Card>
            <Card title="Distribuição de status">
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={networkLegs}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="name" fontSize={11} stroke="var(--color-muted-foreground)" />
                  <YAxis fontSize={11} stroke="var(--color-muted-foreground)" />
                  <Tooltip contentStyle={ttStyle} />
                  <Bar dataKey="esquerda" fill="var(--color-chart-3)" />
                  <Bar dataKey="direita" fill="var(--color-chart-4)" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="pagamentos">
          <div className="rounded-xl border border-border bg-card/60 p-5">
            <h3 className="text-sm font-semibold mb-3">Últimos pedidos</h3>
            <div className="space-y-3">
              {ordersList.slice(0, 10).map((order: any) => (
                <div key={order.id} className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2 text-sm">
                  <div>
                    <div className="font-medium">{getCustomerName(order)}</div>
                    <div className="text-xs text-muted-foreground">{order.forma_pagamento || "outro"} · {order.status || "pending"}</div>
                  </div>
                  <div className="font-semibold">R$ {Number(order.valor_total || 0).toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

const ttStyle = { background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 };

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card/60 p-5">
      <h3 className="text-sm font-semibold mb-3">{title}</h3>
      {children}
    </div>
  );
}

function MetricCard({ title, value, helper }: { title: string; value: string; helper: string }) {
  return (
    <div className="rounded-xl border border-border bg-card/60 p-5">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{title}</p>
      <div className="mt-2 text-2xl font-bold">{value}</div>
      <p className="mt-1 text-xs text-muted-foreground">{helper}</p>
    </div>
  );
}
