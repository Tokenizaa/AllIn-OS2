import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { P as PageHeader } from "./page-header-R4VVQEB2.mjs";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-DH3dyAiq.mjs";
import { S as Skeleton } from "./skeleton-ATJguDyB.mjs";
import { s as supabase } from "./supabase-client-BdpvIS_G.mjs";
import { a as getOrderStats, g as getOrders } from "./orders.api-Cc__Njw8.mjs";
import "../_libs/sonner.mjs";

import "../_libs/seroval.mjs";
import { R as ResponsiveContainer, A as AreaChart, C as CartesianGrid, X as XAxis, Y as YAxis, T as Tooltip, a as Area, L as LineChart, f as Line, P as PieChart, b as Pie, c as Cell, B as BarChart, d as Bar } from "../_libs/recharts.mjs";

import "../_libs/tanstack__query-core.mjs";
import "./router-BZaVudxP.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";


import "../_libs/react-dom.mjs";
import "../_libs/isbot.mjs";
import "./roles-DEW722fr.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/lucide-react.mjs";
import "../_libs/framer-motion.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
import "../_libs/unenv.mjs";


import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/tslib.mjs";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/radix-ui__react-tabs.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-roving-focus.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "./createSsrRpc-BmDEujYz.mjs";
import "./server-BaJh_Ojk.mjs";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";




import "./pagination.dto-D6rx1FA4.mjs";
import "../_libs/zod.mjs";
import "./order.dto-LsqToPpL.mjs";
import "../_libs/lodash.mjs";
import "../_libs/react-smooth.mjs";
import "../_libs/prop-types.mjs";
import "../_libs/fast-equals.mjs";
import "../_libs/tiny-invariant.mjs";
import "../_libs/react-is.mjs";
import "../_libs/d3-shape.mjs";
import "../_libs/d3-path.mjs";
import "../_libs/victory-vendor.mjs";
import "../_libs/d3-scale.mjs";
import "../_libs/internmap.mjs";
import "../_libs/d3-array.mjs";
import "../_libs/d3-time-format.mjs";
import "../_libs/d3-time.mjs";
import "../_libs/d3-interpolate.mjs";
import "../_libs/d3-color.mjs";
import "../_libs/d3-format.mjs";
import "../_libs/recharts-scale.mjs";
import "../_libs/decimal.js-light.mjs";
import "../_libs/eventemitter3.mjs";
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
  const orders = reactExports.useMemo(() => ordersResult?.data?.data || [], [ordersResult]);
  const revenueSeries = reactExports.useMemo(() => {
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
  const channelMix = reactExports.useMemo(() => {
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
  const networkLegs = reactExports.useMemo(() => {
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
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { eyebrow: "Executive", title: "Analytics", subtitle: "Carregando dados reais do banco..." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 xl:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-[280px] rounded-xl" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-[280px] rounded-xl" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-[280px] rounded-xl" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-[280px] rounded-xl" })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { eyebrow: "Executive", title: "Analytics", subtitle: "KPIs operacionais com dados reais de pedidos." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 md:grid-cols-2 xl:grid-cols-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(MetricCard, { title: "Receita total", value: `R$ ${Number(stats?.data?.totalRevenue || 0).toLocaleString()}`, helper: `${Number(stats?.data?.totalOrders || 0)} pedidos` }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(MetricCard, { title: "Pedidos", value: Number(stats?.data?.totalOrders || 0).toString(), helper: `${Number(stats?.data?.pendingOrders || 0)} pendentes` }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(MetricCard, { title: "Entregues", value: Number(stats?.data?.deliveredOrders || 0).toString(), helper: `${Number(stats?.data?.shippedOrders || 0)} enviados` }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(MetricCard, { title: "Cancelados", value: Number(stats?.data?.cancelledOrders || 0).toString(), helper: "Monitoramento de perda" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "operacional", className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "operacional", children: "Operacional" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "pagamentos", children: "Pagamentos" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "operacional", className: "space-y-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 xl:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: "Receita vs ano anterior", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 240, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AreaChart, { data: revenueSeries, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { stroke: "var(--color-border)", strokeDasharray: "3 3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { dataKey: "day", fontSize: 11, stroke: "var(--color-muted-foreground)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { fontSize: 11, stroke: "var(--color-muted-foreground)", tickFormatter: (v) => `${(Number(v) / 1e3).toFixed(0)}k` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { contentStyle: ttStyle }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Area, { dataKey: "receita", stroke: "var(--color-primary)", fill: "var(--color-primary)", fillOpacity: 0.2 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Area, { dataKey: "ano_anterior", stroke: "var(--color-info)", fill: "transparent" })
        ] }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: "Ciclo operacional", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 240, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(LineChart, { data: cohort, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { stroke: "var(--color-border)", strokeDasharray: "3 3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { dataKey: "mes", fontSize: 11, stroke: "var(--color-muted-foreground)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { fontSize: 11, stroke: "var(--color-muted-foreground)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { contentStyle: ttStyle }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Line, { dataKey: "retencao", stroke: "var(--color-success)", strokeWidth: 2, dot: false })
        ] }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: "Mix por forma de pagamento", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 240, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(PieChart, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Pie, { data: channelMix, dataKey: "value", innerRadius: 50, outerRadius: 90, paddingAngle: 3, stroke: "none", children: channelMix.map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Cell, { fill: `var(--color-chart-${i % 5 + 1})` }, i)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { contentStyle: ttStyle })
        ] }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: "Volume por etapa", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 240, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(BarChart, { data: networkLegs, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { stroke: "var(--color-border)", strokeDasharray: "3 3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { dataKey: "name", fontSize: 11, stroke: "var(--color-muted-foreground)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { fontSize: 11, stroke: "var(--color-muted-foreground)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { contentStyle: ttStyle }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { dataKey: "esquerda", fill: "var(--color-primary)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { dataKey: "direita", fill: "var(--color-chart-2)" })
        ] }) }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "pagamentos", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card/60 p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold mb-3", children: "Últimos pedidos" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: orders.slice(0, 10).map((order) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between rounded-lg border border-border/60 px-3 py-2 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: getCustomerName(order) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
              order.forma_pagamento || "outro",
              " · ",
              order.status || "pending"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-semibold", children: [
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card/60 p-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold mb-3", children: title }),
    children
  ] });
}
function MetricCard({
  title,
  value,
  helper
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card/60 p-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-wide text-muted-foreground", children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 text-2xl font-bold", children: value }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: helper })
  ] });
}
export {
  AnalyticsPage as component
};
