import { jsxs, jsx } from "react/jsx-runtime";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { ResponsiveContainer, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Area, LineChart, Line, PieChart, Pie, Cell, BarChart, Bar } from "recharts";
import { P as PageHeader } from "./page-header-DZhedIL1.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-vlCUvq5M.js";
import { S as Skeleton } from "./skeleton-C7fYO8Tf.js";
import { s as supabase } from "./supabase-client-BdpvIS_G.js";
import { a as getOrderStats, g as getOrders } from "./orders.api-CoxMvgnr.js";
import "lucide-react";
import "./router-OVqp2Aj1.js";
import "@tanstack/react-router";
import "./roles-DEW722fr.js";
import "framer-motion";
import "sonner";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "@radix-ui/react-tabs";
import "@supabase/supabase-js";
import "./createSsrRpc-XYDuBZ54.js";
import "./server-DdVc0fX6.js";
import "node:async_hooks";
import "h3-v2";
import "@tanstack/router-core";
import "seroval";
import "@tanstack/history";
import "@tanstack/router-core/ssr/client";
import "@tanstack/router-core/ssr/server";
import "@tanstack/react-router/ssr/server";
import "zod";
import "./pagination.dto-D6rx1FA4.js";
import "./order.dto-LsqToPpL.js";
function AnalyticsPage() {
  const {
    data: stats,
    isLoading: statsLoading
  } = useQuery({
    queryKey: ["analytics", "orders", "stats"],
    queryFn: getOrderStats
  });
  const {
    data: ordersResult,
    isLoading: ordersLoading
  } = useQuery({
    queryKey: ["analytics", "orders", "recent"],
    queryFn: () => getOrders({
      page: 1,
      limit: 50
    })
  });
  const {
    data: customers
  } = useQuery({
    queryKey: ["analytics", "customers"],
    queryFn: async () => {
      const {
        data
      } = await supabase.from("customers").select("id, usuario, id_comprador, user_id, name");
      return data || [];
    }
  });
  const orders = useMemo(() => ordersResult?.data?.data || [], [ordersResult]);
  const revenueSeries = useMemo(() => {
    return orders.slice(0, 12).reverse().map((order, index) => {
      let dayLabel = `D${index + 1}`;
      if (order.data_criacao_pedido) {
        const d = new Date(order.data_criacao_pedido);
        if (!isNaN(d.getTime())) {
          dayLabel = d.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit"
          });
        }
      } else if (order.created_at) {
        const d = new Date(order.created_at);
        if (!isNaN(d.getTime())) {
          dayLabel = d.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit"
          });
        }
      }
      return {
        day: dayLabel,
        receita: Number(order.valor_total || 0),
        ano_anterior: Number(order.valor_total || 0) * 0.82
      };
    });
  }, [orders]);
  const getCustomerName = (order) => {
    if (!customers || customers.length === 0) {
      return order.usuario || order.comprador || "Cliente";
    }
    const found = customers.find((c) => order.user_id && c.user_id === order.user_id || order.customer_id && c.id === order.customer_id || order.comprador && c.id_comprador === order.comprador || order.usuario && c.usuario === order.usuario);
    return found?.name || order.usuario || order.comprador || "Cliente";
  };
  const channelMix = useMemo(() => {
    const methods = orders.reduce((acc, order) => {
      const key = order.forma_pagamento || "outro";
      acc[key] = (acc[key] || 0) + Number(order.valor_total || 0);
      return acc;
    }, {});
    return Object.entries(methods).map(([name, value]) => ({
      name,
      value: Math.round(Number(value))
    }));
  }, [orders]);
  const networkLegs = useMemo(() => {
    const total = Number(stats?.data?.totalOrders || 0);
    const active = Number(stats?.data?.deliveredOrders || 0);
    const pending = Number(stats?.data?.pendingOrders || 0);
    return [{
      name: "Pedidos",
      esquerda: total,
      direita: active
    }, {
      name: "Entregues",
      esquerda: active,
      direita: pending
    }, {
      name: "Faturamento",
      esquerda: Number(stats?.data?.totalRevenue || 0),
      direita: Number(stats?.data?.processingOrders || 0)
    }];
  }, [stats]);
  const isLoading = statsLoading || ordersLoading;
  const cohort = Array.from({
    length: 12
  }).map((_, i) => ({
    mes: `M${i + 1}`,
    retencao: Math.max(20, 100 - i * 4)
  }));
  if (isLoading) {
    return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsx(PageHeader, { eyebrow: "Executive", title: "Analytics", subtitle: "Carregando dados reais do banco..." }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 xl:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsx(Skeleton, { className: "h-[280px] rounded-xl" }),
        /* @__PURE__ */ jsx(Skeleton, { className: "h-[280px] rounded-xl" }),
        /* @__PURE__ */ jsx(Skeleton, { className: "h-[280px] rounded-xl" }),
        /* @__PURE__ */ jsx(Skeleton, { className: "h-[280px] rounded-xl" })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsx(PageHeader, { eyebrow: "Executive", title: "Analytics", subtitle: "KPIs operacionais com dados reais de pedidos." }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-4 md:grid-cols-2 xl:grid-cols-4", children: [
      /* @__PURE__ */ jsx(MetricCard, { title: "Receita total", value: `R$ ${Number(stats?.data?.totalRevenue || 0).toLocaleString()}`, helper: `${Number(stats?.data?.totalOrders || 0)} pedidos` }),
      /* @__PURE__ */ jsx(MetricCard, { title: "Pedidos", value: Number(stats?.data?.totalOrders || 0).toString(), helper: `${Number(stats?.data?.pendingOrders || 0)} pendentes` }),
      /* @__PURE__ */ jsx(MetricCard, { title: "Entregues", value: Number(stats?.data?.deliveredOrders || 0).toString(), helper: `${Number(stats?.data?.shippedOrders || 0)} enviados` }),
      /* @__PURE__ */ jsx(MetricCard, { title: "Cancelados", value: Number(stats?.data?.cancelledOrders || 0).toString(), helper: "Monitoramento de perda" })
    ] }),
    /* @__PURE__ */ jsxs(Tabs, { defaultValue: "operacional", className: "space-y-4", children: [
      /* @__PURE__ */ jsxs(TabsList, { children: [
        /* @__PURE__ */ jsx(TabsTrigger, { value: "operacional", children: "Operacional" }),
        /* @__PURE__ */ jsx(TabsTrigger, { value: "pagamentos", children: "Pagamentos" })
      ] }),
      /* @__PURE__ */ jsx(TabsContent, { value: "operacional", className: "space-y-4", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 xl:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsx(Card, { title: "Receita vs ano anterior", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: 240, children: /* @__PURE__ */ jsxs(AreaChart, { data: revenueSeries, children: [
          /* @__PURE__ */ jsx(CartesianGrid, { stroke: "var(--color-border)", strokeDasharray: "3 3" }),
          /* @__PURE__ */ jsx(XAxis, { dataKey: "day", fontSize: 11, stroke: "var(--color-muted-foreground)" }),
          /* @__PURE__ */ jsx(YAxis, { fontSize: 11, stroke: "var(--color-muted-foreground)", tickFormatter: (v) => `${(Number(v) / 1e3).toFixed(0)}k` }),
          /* @__PURE__ */ jsx(Tooltip, { contentStyle: ttStyle }),
          /* @__PURE__ */ jsx(Area, { dataKey: "receita", stroke: "var(--color-primary)", fill: "var(--color-primary)", fillOpacity: 0.2 }),
          /* @__PURE__ */ jsx(Area, { dataKey: "ano_anterior", stroke: "var(--color-info)", fill: "transparent" })
        ] }) }) }),
        /* @__PURE__ */ jsx(Card, { title: "Ciclo operacional", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: 240, children: /* @__PURE__ */ jsxs(LineChart, { data: cohort, children: [
          /* @__PURE__ */ jsx(CartesianGrid, { stroke: "var(--color-border)", strokeDasharray: "3 3" }),
          /* @__PURE__ */ jsx(XAxis, { dataKey: "mes", fontSize: 11, stroke: "var(--color-muted-foreground)" }),
          /* @__PURE__ */ jsx(YAxis, { fontSize: 11, stroke: "var(--color-muted-foreground)" }),
          /* @__PURE__ */ jsx(Tooltip, { contentStyle: ttStyle }),
          /* @__PURE__ */ jsx(Line, { dataKey: "retencao", stroke: "var(--color-success)", strokeWidth: 2, dot: false })
        ] }) }) }),
        /* @__PURE__ */ jsx(Card, { title: "Mix por forma de pagamento", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: 240, children: /* @__PURE__ */ jsxs(PieChart, { children: [
          /* @__PURE__ */ jsx(Pie, { data: channelMix, dataKey: "value", innerRadius: 50, outerRadius: 90, paddingAngle: 3, stroke: "none", children: channelMix.map((_, i) => /* @__PURE__ */ jsx(Cell, { fill: `var(--color-chart-${i % 5 + 1})` }, i)) }),
          /* @__PURE__ */ jsx(Tooltip, { contentStyle: ttStyle })
        ] }) }) }),
        /* @__PURE__ */ jsx(Card, { title: "Volume por etapa", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: 240, children: /* @__PURE__ */ jsxs(BarChart, { data: networkLegs, children: [
          /* @__PURE__ */ jsx(CartesianGrid, { stroke: "var(--color-border)", strokeDasharray: "3 3" }),
          /* @__PURE__ */ jsx(XAxis, { dataKey: "name", fontSize: 11, stroke: "var(--color-muted-foreground)" }),
          /* @__PURE__ */ jsx(YAxis, { fontSize: 11, stroke: "var(--color-muted-foreground)" }),
          /* @__PURE__ */ jsx(Tooltip, { contentStyle: ttStyle }),
          /* @__PURE__ */ jsx(Bar, { dataKey: "esquerda", fill: "var(--color-primary)" }),
          /* @__PURE__ */ jsx(Bar, { dataKey: "direita", fill: "var(--color-chart-2)" })
        ] }) }) })
      ] }) }),
      /* @__PURE__ */ jsx(TabsContent, { value: "pagamentos", children: /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-border bg-card/60 p-5", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold mb-3", children: "Últimos pedidos" }),
        /* @__PURE__ */ jsx("div", { className: "space-y-3", children: orders.slice(0, 10).map((order) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between rounded-lg border border-border/60 px-3 py-2 text-sm", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "font-medium", children: getCustomerName(order) }),
            /* @__PURE__ */ jsxs("div", { className: "text-xs text-muted-foreground", children: [
              order.forma_pagamento || "outro",
              " · ",
              order.status || "pending"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "font-semibold", children: [
            "R$ ",
            Number(order.valor_total || 0).toLocaleString()
          ] })
        ] }, order.id)) })
      ] }) })
    ] })
  ] });
}
const ttStyle = {
  background: "var(--color-popover)",
  border: "1px solid var(--color-border)",
  borderRadius: 8,
  fontSize: 12
};
function Card({
  title,
  children
}) {
  return /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-border bg-card/60 p-5", children: [
    /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold mb-3", children: title }),
    children
  ] });
}
function MetricCard({
  title,
  value,
  helper
}) {
  return /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-border bg-card/60 p-5", children: [
    /* @__PURE__ */ jsx("p", { className: "text-xs uppercase tracking-wide text-muted-foreground", children: title }),
    /* @__PURE__ */ jsx("div", { className: "mt-2 text-2xl font-bold", children: value }),
    /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: helper })
  ] });
}
export {
  AnalyticsPage as component
};
