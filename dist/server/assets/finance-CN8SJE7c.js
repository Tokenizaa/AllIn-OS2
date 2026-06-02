import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect, useMemo } from "react";
import { ArrowDownToLine, Lock, Clock, TrendingUp, Sparkles, Wallet } from "lucide-react";
import { B as Button, a as Badge } from "./router-C3cuB5ui.js";
import { S as StatCard } from "./stat-card-CXJsfWNR.js";
import { ResponsiveContainer, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Area, PieChart, Pie, Cell } from "recharts";
import { s as supabase } from "./supabase-client-BdpvIS_G.js";
import "@tanstack/react-query";
import "@tanstack/react-router";
import "./roles-DEW722fr.js";
import "framer-motion";
import "sonner";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "@supabase/supabase-js";
function formatBRL(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(value);
}
function FinancePage() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [wallet, setWallet] = useState({});
  useEffect(() => {
    let mounted = true;
    void (async () => {
      const [{
        data: withdrawalsData
      }, {
        data: profileData
      }] = await Promise.all([supabase.from("withdrawals").select("id, description, type, amount, created_at").order("created_at", {
        ascending: false
      }).limit(50), supabase.from("workspace_settings").select("balance_available, balance_blocked, balance_pending, total_year, total_month").limit(1).maybeSingle()]);
      if (!mounted) return;
      setWithdrawals(withdrawalsData || []);
      setWallet(profileData || {});
    })();
    return () => {
      mounted = false;
    };
  }, []);
  const earnings = useMemo(() => {
    const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    return months.map((mes, i) => ({
      mes,
      valor: Math.max(0, Number(wallet.total_month || 0) * (0.3 + i / 20))
    }));
  }, [wallet.total_month]);
  const bonusOrigin = useMemo(() => [{
    name: "Saques",
    value: 38
  }, {
    name: "Comissões",
    value: 34
  }, {
    name: "Bônus",
    value: 28
  }], []);
  const available = Number(wallet.balance_available || 0);
  const blocked = Number(wallet.balance_blocked || 0);
  const pending = Number(wallet.balance_pending || 0);
  const totalYear = Number(wallet.total_year || 0);
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-end justify-between flex-wrap gap-3", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl md:text-3xl font-bold tracking-tight", children: "Financeiro" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Saldos e extrato carregados do Supabase." })
      ] }),
      /* @__PURE__ */ jsxs(Button, { className: "gap-2 bg-gradient-to-r from-primary to-fuchsia-500", children: [
        /* @__PURE__ */ jsx(ArrowDownToLine, { className: "h-4 w-4" }),
        " Solicitar saque"
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "md:col-span-2 relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/20 via-fuchsia-500/10 to-transparent p-6", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute -top-20 -right-20 h-60 w-60 rounded-full bg-primary/20 blur-3xl" }),
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs uppercase tracking-wider text-muted-foreground", children: "Saldo disponível" }),
          /* @__PURE__ */ jsx("p", { className: "mt-2 text-4xl md:text-5xl font-bold", children: formatBRL(available) }),
          /* @__PURE__ */ jsxs("div", { className: "mt-6 grid grid-cols-3 gap-4", children: [
            /* @__PURE__ */ jsx(Mini, { icon: Lock, label: "Bloqueado", value: formatBRL(blocked) }),
            /* @__PURE__ */ jsx(Mini, { icon: Clock, label: "A liberar", value: formatBRL(pending) }),
            /* @__PURE__ */ jsx(Mini, { icon: TrendingUp, label: "Ganho no ano", value: formatBRL(totalYear) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "rounded-3xl border border-border/60 bg-card/60 p-5", children: [
        /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: "border-border/60", children: [
          /* @__PURE__ */ jsx(Sparkles, { className: "h-3 w-3 mr-1 text-primary" }),
          " Forecast IA"
        ] }),
        /* @__PURE__ */ jsx("h3", { className: "mt-3 text-base font-semibold", children: "Próximos 30 dias" }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-2xl font-bold text-success", children: formatBRL(available + pending) }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: "Baseado no saldo real e liberações pendentes." })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [
      /* @__PURE__ */ jsx(StatCard, { label: "Ganho no ano", value: formatBRL(totalYear), delta: 0, icon: Wallet, accent: "success" }),
      /* @__PURE__ */ jsx(StatCard, { label: "Saques realizados", value: String(withdrawals.length), delta: 0, accent: "info" }),
      /* @__PURE__ */ jsx(StatCard, { label: "Bônus pendentes", value: formatBRL(pending), accent: "warning", hint: "Saldo ainda não liberado" }),
      /* @__PURE__ */ jsx(StatCard, { label: "Próxima liberação", value: withdrawals[0]?.created_at ? new Date(withdrawals[0].created_at).toLocaleDateString("pt-BR") : "-", accent: "primary", hint: "Último registro do extrato" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 xl:grid-cols-3 gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "xl:col-span-2 rounded-2xl border border-border/60 bg-card/60 p-5", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold", children: "Ganhos por mês" }),
        /* @__PURE__ */ jsx("div", { className: "h-64 mt-3", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(AreaChart, { data: earnings, children: [
          /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs("linearGradient", { id: "ge", x1: "0", x2: "0", y1: "0", y2: "1", children: [
            /* @__PURE__ */ jsx("stop", { offset: "0%", stopColor: "var(--color-success)", stopOpacity: 0.5 }),
            /* @__PURE__ */ jsx("stop", { offset: "100%", stopColor: "var(--color-success)", stopOpacity: 0 })
          ] }) }),
          /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "var(--color-border)" }),
          /* @__PURE__ */ jsx(XAxis, { dataKey: "mes", stroke: "var(--color-muted-foreground)", fontSize: 11 }),
          /* @__PURE__ */ jsx(YAxis, { stroke: "var(--color-muted-foreground)", fontSize: 11, tickFormatter: (v) => `${(v / 1e3).toFixed(0)}k` }),
          /* @__PURE__ */ jsx(Tooltip, { contentStyle: {
            background: "var(--color-popover)",
            border: "1px solid var(--color-border)",
            borderRadius: 8,
            fontSize: 12
          } }),
          /* @__PURE__ */ jsx(Area, { type: "monotone", dataKey: "valor", stroke: "var(--color-success)", fill: "url(#ge)", strokeWidth: 2 })
        ] }) }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-border/60 bg-card/60 p-5", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold", children: "Origem dos ganhos" }),
        /* @__PURE__ */ jsx("div", { className: "h-56 mt-3", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(PieChart, { children: [
          /* @__PURE__ */ jsx(Pie, { data: bonusOrigin, dataKey: "value", innerRadius: 50, outerRadius: 80, paddingAngle: 3, stroke: "none", children: bonusOrigin.map((_, i) => /* @__PURE__ */ jsx(Cell, { fill: `var(--color-chart-${i % 5 + 1})` }, i)) }),
          /* @__PURE__ */ jsx(Tooltip, { contentStyle: {
            background: "var(--color-popover)",
            border: "1px solid var(--color-border)",
            borderRadius: 8,
            fontSize: 12
          } })
        ] }) }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-border/60 bg-card/60 p-5", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold mb-3", children: "Extrato recente" }),
      /* @__PURE__ */ jsx("ul", { className: "space-y-2", children: withdrawals.map((entry) => /* @__PURE__ */ jsxs("li", { className: "flex items-center justify-between rounded-lg border border-border/60 bg-background/40 p-3 text-sm", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "font-medium", children: entry.description || "Movimentação financeira" }),
          /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground", children: [
            entry.type || "registro",
            " · ",
            entry.created_at ? new Date(entry.created_at).toLocaleDateString("pt-BR") : "-"
          ] })
        ] }),
        /* @__PURE__ */ jsx("span", { className: "font-semibold", children: formatBRL(Number(entry.amount || 0)) })
      ] }, entry.id)) })
    ] })
  ] });
}
function Mini({
  icon: Icon,
  label,
  value
}) {
  return /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-border/60 bg-background/40 p-3", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 text-[10px] text-muted-foreground uppercase tracking-wider", children: [
      /* @__PURE__ */ jsx(Icon, { className: "h-3 w-3" }),
      " ",
      label
    ] }),
    /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm font-semibold", children: value })
  ] });
}
export {
  FinancePage as component
};
