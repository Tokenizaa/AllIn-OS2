import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { a as Badge, B as Button } from "./router-BZaVudxP.mjs";
import { P as Progress } from "./progress-Ce8_Dh4p.mjs";
import { S as StatCard } from "./stat-card-D9S6pfU6.mjs";
import { s as supabase } from "./supabase-client-BdpvIS_G.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { m as motion } from "../_libs/framer-motion.mjs";
import { o as Crown, I as Copy, J as Share2, a5 as UserPlus, W as Wallet, am as Trophy, k as TrendingUp, U as Users, q as Sparkles, an as ArrowUpRight, i as Target } from "../_libs/lucide-react.mjs";
import { R as ResponsiveContainer, A as AreaChart, C as CartesianGrid, X as XAxis, Y as YAxis, T as Tooltip, a as Area, P as PieChart, b as Pie, c as Cell, B as BarChart, d as Bar } from "../_libs/recharts.mjs";

import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/unenv.mjs";


import "../_libs/seroval-plugins.mjs";


import "../_libs/react-dom.mjs";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "./roles-DEW722fr.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/tslib.mjs";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
import "../_libs/radix-ui__react-progress.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
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
const formatBRL = (value) => new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL"
}).format(value);
const relTime = (value) => value ? new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short"
}).format(new Date(value)) : "-";
function Dashboard() {
  const [stats, setStats] = reactExports.useState(null);
  const [salesSeries, setSalesSeries] = reactExports.useState([]);
  const [bonusOrigin, setBonusOrigin] = reactExports.useState([]);
  const [topProducts, setTopProducts] = reactExports.useState([]);
  const [timeline, setTimeline] = reactExports.useState([]);
  const [aiInsights, setAiInsights] = reactExports.useState([]);
  const [goals, setGoals] = reactExports.useState([]);
  reactExports.useEffect(() => {
    let mounted = true;
    void (async () => {
      const [ordersRes, paymentsRes, customersRes, productsRes, withdrawalsRes, profileRes] = await Promise.all([supabase.from("orders").select("id, numero_pedido, valor_total_pedido, valor_total, created_at, status, status_pedido").order("created_at", {
        ascending: false
      }).limit(300), supabase.from("payments").select("id, amount, created_at, status").order("created_at", {
        ascending: false
      }).limit(300), supabase.from("customers").select("id, usuario, id_comprador, user_id, status, created_at, name").limit(1e3), supabase.from("products").select("id, name, price").limit(20), supabase.from("withdrawals").select("id, amount, created_at, status").order("created_at", {
        ascending: false
      }).limit(20), supabase.from("profiles").select("name, role, created_at").order("created_at", {
        ascending: false
      }).limit(1).maybeSingle()]);
      if (!mounted) return;
      const orders = ordersRes.data || [];
      const payments = paymentsRes.data || [];
      const customers = customersRes.data || [];
      const products = productsRes.data || [];
      const withdrawals = withdrawalsRes.data || [];
      const totalVendido = orders.reduce((sum, row) => sum + Number(row.valor_total_pedido || row.valor_total || 0), 0);
      const totalPago = payments.reduce((sum, row) => sum + Number(row.amount || 0), 0);
      const pedidosMes = orders.length;
      const redeTotal = customers.length;
      const ticketMedio = orders.length ? totalVendido / orders.length : 0;
      const conversion = customers.length ? Math.round(orders.length / customers.length * 100) : 0;
      const saldoDisponivel = Math.max(0, totalPago - withdrawals.reduce((sum, row) => sum + Number(row.amount || 0), 0));
      setStats({
        saldoDisponivel,
        comissaoAcumulada: totalPago * 0.18,
        totalVendido,
        pedidosMes,
        redeTotal,
        ticketMedio,
        conversaoLoja: conversion,
        crescimentoRedeMes: 0,
        nome: profileRes.data?.name || "Usuário",
        qualificacao: "Ativo",
        plano: "Plano Real",
        progresso: Math.min(100, conversion),
        proximaQualificacao: "Meta seguinte",
        linkLoja: window.location.origin
      });
      const grouped = /* @__PURE__ */ new Map();
      orders.slice(0, 30).forEach((row) => {
        const day = new Date(row.created_at || Date.now()).toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "2-digit"
        });
        const current2 = grouped.get(day) || {
          vendas: 0,
          bonus: 0
        };
        const orderAmount = Number(row.valor_total_pedido || row.valor_total || 0);
        current2.vendas += orderAmount;
        current2.bonus += orderAmount * 0.1;
        grouped.set(day, current2);
      });
      setSalesSeries(Array.from(grouped.entries()).map(([day, value]) => ({
        day,
        vendas: value.vendas,
        bonus: value.bonus
      })));
      setBonusOrigin([{
        name: "Vendas",
        value: 45
      }, {
        name: "Pagamentos",
        value: 35
      }, {
        name: "Rede",
        value: 20
      }]);
      setTopProducts(products.slice(0, 5).map((p) => ({
        name: p.name || "Produto",
        qtd: 10,
        receita: Number(p.price || 0) * 10
      })));
      setTimeline([...orders.slice(0, 3).map((o) => ({
        id: `o-${o.id}`,
        title: "Pedido registrado",
        description: `Pedido ${o.numero_pedido || o.id} carregado do Supabase.`,
        at: o.created_at,
        type: "order"
      })), ...payments.slice(0, 2).map((p) => ({
        id: `p-${p.id}`,
        title: "Pagamento confirmado",
        description: `Pagamento de ${formatBRL(Number(p.amount || 0))}.`,
        at: p.created_at,
        type: "bonus"
      }))]);
      setAiInsights([{
        id: "i1",
        title: "Volume real identificado",
        detail: `Foram carregados ${orders.length} pedidos e ${payments.length} pagamentos.`,
        action: "Abrir relatório",
        severity: "success"
      }, {
        id: "i2",
        title: "Base consolidada",
        detail: `A rede atual possui ${customers.length} clientes/distribuidores.`,
        action: "Ver rede",
        severity: "info"
      }]);
      setGoals([{
        id: "g1",
        title: "Receita do mês",
        current: totalVendido,
        target: totalVendido * 1.2 || 1,
        unit: "BRL"
      }, {
        id: "g2",
        title: "Pedidos",
        current: pedidosMes,
        target: Math.max(1, Math.round(pedidosMes * 1.1)),
        unit: "qty"
      }]);
    })();
    return () => {
      mounted = false;
    };
  }, []);
  const current = stats;
  if (!current) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 text-sm text-muted-foreground", children: "Carregando dados reais..." });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: {
      opacity: 0,
      y: -8
    }, animate: {
      opacity: 1,
      y: 0
    }, className: "relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-primary/15 via-fuchsia-500/10 to-cyan-400/5 p-6 md:p-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex flex-col md:flex-row md:items-center justify-between gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-primary/20 text-primary border-primary/30 hover:bg-primary/20", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "h-3 w-3 mr-1" }),
            " ",
            current.qualificacao
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "border-border/60", children: current.plano })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-3xl md:text-4xl font-bold tracking-tight", children: [
          "Olá, ",
          current.nome,
          " 👋"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1.5 text-sm text-muted-foreground max-w-lg", children: "Sua operação está lendo o Supabase em tempo real." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 max-w-md", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs mb-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Progresso" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold", children: [
              current.progresso,
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: current.progresso, className: "h-2" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", className: "gap-2", onClick: () => {
          navigator.clipboard.writeText(current.linkLoja);
          toast.success("Link copiado!");
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "h-3.5 w-3.5" }),
          " Link da loja"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", className: "gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "h-3.5 w-3.5" }),
          " Compartilhar"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", className: "gap-2 bg-gradient-to-r from-primary to-fuchsia-500", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "h-3.5 w-3.5" }),
          " Cadastrar"
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Saldo disponível", value: formatBRL(current.saldoDisponivel), delta: 0, icon: Wallet, accent: "success" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Comissão acumulada", value: formatBRL(current.comissaoAcumulada), delta: 0, icon: Trophy, accent: "primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Total vendido", value: formatBRL(current.totalVendido), delta: 0, icon: TrendingUp, accent: "info" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Cadastros diretos", value: String(current.redeTotal), delta: 0, icon: Users, accent: "warning" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 xl:grid-cols-3 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "xl:col-span-2 rounded-2xl border border-border/60 bg-card/60 p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold", children: "Vendas & Bônus · últimos registros" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-72 mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AreaChart, { data: salesSeries, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "var(--color-border)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { dataKey: "day", stroke: "var(--color-muted-foreground)", fontSize: 11 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { stroke: "var(--color-muted-foreground)", fontSize: 11, tickFormatter: (v) => `${(v / 1e3).toFixed(1)}k` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { contentStyle: {
            background: "var(--color-popover)",
            border: "1px solid var(--color-border)",
            borderRadius: 8,
            fontSize: 12
          } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Area, { type: "monotone", dataKey: "vendas", stroke: "var(--color-primary)", fill: "url(#g1)", strokeWidth: 2 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Area, { type: "monotone", dataKey: "bonus", stroke: "var(--color-success)", fill: "url(#g2)", strokeWidth: 2 })
        ] }) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border/60 bg-card/60 p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold", children: "Origem dos bônus" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-56 mt-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(PieChart, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Pie, { data: bonusOrigin, dataKey: "value", innerRadius: 55, outerRadius: 85, paddingAngle: 3, stroke: "none", children: bonusOrigin.map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Cell, { fill: `var(--color-chart-${i % 5 + 1})` }, i)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { contentStyle: {
            background: "var(--color-popover)",
            border: "1px solid var(--color-border)",
            borderRadius: 8,
            fontSize: 12
          } })
        ] }) }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 xl:grid-cols-3 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "xl:col-span-2 space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-sm font-semibold flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-4 w-4 text-primary" }),
            " Insights do Copiloto"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/office/copilot", className: "text-xs text-primary inline-flex items-center gap-0.5", children: [
            "Abrir copiloto ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "h-3 w-3" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid md:grid-cols-2 gap-3", children: aiInsights.map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { whileHover: {
          y: -2
        }, className: "rounded-2xl border border-border/60 bg-card/60 p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 shrink-0 rounded-lg grid place-items-center bg-info/15 text-info", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-4 w-4" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold leading-tight", children: i.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: i.detail }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "ghost", className: "mt-2 -ml-2 h-7 text-xs text-primary", children: [
              i.action,
              " →"
            ] })
          ] })
        ] }) }, i.id)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border/60 bg-card/60 p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-sm font-semibold flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { className: "h-4 w-4 text-primary" }),
            " Metas"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-[10px]", children: "dados reais" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-4 space-y-4", children: goals.map((g) => {
          const pct = Math.min(100, Math.round(g.current / Math.max(1, g.target) * 100));
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs mb-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: g.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold", children: [
                pct,
                "%"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: pct, className: "h-1.5" })
          ] }, g.id);
        }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 xl:grid-cols-3 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "xl:col-span-2 rounded-2xl border border-border/60 bg-card/60 p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold", children: "Atividades recentes" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-4 space-y-3", children: timeline.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-3 rounded-xl border border-border/60 bg-background/40 p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-0.5 h-2 w-2 rounded-full bg-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium leading-tight", children: t.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: t.description })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground whitespace-nowrap", children: relTime(t.at) })
        ] }, t.id)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border/60 bg-card/60 p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold", children: "Top produtos" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-44 mt-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(BarChart, { data: topProducts, layout: "vertical", margin: {
          left: 0,
          right: 12
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { horizontal: false, strokeDasharray: "3 3", stroke: "var(--color-border)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { type: "number", hide: true }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { type: "category", dataKey: "name", stroke: "var(--color-muted-foreground)", fontSize: 10, width: 120 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { contentStyle: {
            background: "var(--color-popover)",
            border: "1px solid var(--color-border)",
            borderRadius: 8,
            fontSize: 12
          } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { dataKey: "qtd", fill: "var(--color-primary)", radius: [0, 6, 6, 0] })
        ] }) }) })
      ] })
    ] })
  ] });
}
export {
  Dashboard as component
};
