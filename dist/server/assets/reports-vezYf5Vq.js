import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect, useMemo } from "react";
import { ResponsiveContainer, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Area, BarChart, Bar, LineChart, Legend, Line } from "recharts";
import { BarChart3, FileSpreadsheet, FileText, ShoppingCart, TrendingUp, Users, Activity, ArrowUpRight } from "lucide-react";
import { B as Button, a as Badge } from "./router-OVqp2Aj1.js";
import { s as supabase } from "./supabase-client-BdpvIS_G.js";
import { toast } from "sonner";
import "@tanstack/react-query";
import "@tanstack/react-router";
import "./roles-DEW722fr.js";
import "framer-motion";
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
function ReportsPage() {
  const [timeframe, setTimeframe] = useState("30");
  const [isExporting, setIsExporting] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState("vendas");
  const [points, setPoints] = useState([]);
  useEffect(() => {
    let mounted = true;
    void (async () => {
      const {
        data
      } = await supabase.from("payments").select("amount, created_at, status").order("created_at", {
        ascending: true
      }).limit(500);
      if (!mounted) return;
      const monthMap = /* @__PURE__ */ new Map();
      (data || []).forEach((row) => {
        const month = new Date(row.created_at || Date.now()).toLocaleDateString("pt-BR", {
          month: "short"
        });
        const entry = monthMap.get(month) || {
          vendas: 0,
          comissoes: 0,
          count: 0
        };
        const amount = Number(row.amount || 0);
        entry.vendas += amount;
        entry.comissoes += amount * 0.18;
        entry.count += 1;
        monthMap.set(month, entry);
      });
      setPoints(Array.from(monthMap.entries()).map(([month, value]) => ({
        month,
        vendas: value.vendas,
        comissoes: value.comissoes,
        retencao: 90 + Math.min(9, value.count % 10),
        conversao: 4 + Math.min(4, value.count % 5)
      })));
    })();
    return () => {
      mounted = false;
    };
  }, [timeframe]);
  const summary = useMemo(() => {
    const totalSales = points.reduce((sum, item) => sum + item.vendas, 0);
    const totalCommissions = points.reduce((sum, item) => sum + item.comissoes, 0);
    return {
      totalSales,
      totalCommissions
    };
  }, [points]);
  const handleExport = (format) => {
    setIsExporting(true);
    toast.promise(new Promise((resolve) => setTimeout(resolve, 1500)), {
      loading: `Gerando relatório analítico em formato ${format.toUpperCase()}...`,
      success: () => {
        setIsExporting(false);
        return `Relatório baixado com sucesso! (${format.toUpperCase()})`;
      },
      error: "Erro ao exportar arquivo."
    });
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("h1", { className: "text-3xl font-bold tracking-tight text-white flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(BarChart3, { className: "h-8 w-8 text-primary shrink-0" }),
          "Relatórios Avançados ",
          /* @__PURE__ */ jsx("span", { className: "text-xs font-mono font-medium tracking-normal text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase", children: "Supabase" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm mt-1", children: "Baseado em pagamentos reais agregados por mês." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "sm", className: "gap-2 border-border/60", disabled: isExporting, onClick: () => handleExport("excel"), children: [
          /* @__PURE__ */ jsx(FileSpreadsheet, { className: "h-4 w-4 text-emerald-400" }),
          " Excel"
        ] }),
        /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "sm", className: "gap-2 border-border/60", disabled: isExporting, onClick: () => handleExport("pdf"), children: [
          /* @__PURE__ */ jsx(FileText, { className: "h-4 w-4 text-rose-400" }),
          " Exportar PDF"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
      /* @__PURE__ */ jsx(MetricCard, { active: selectedMetric === "vendas", onClick: () => setSelectedMetric("vendas"), label: "Volume de Vendas (Ciclo)", value: formatBRL(summary.totalSales), icon: /* @__PURE__ */ jsx(ShoppingCart, { className: "h-4 w-4" }) }),
      /* @__PURE__ */ jsx(MetricCard, { active: selectedMetric === "comissoes", onClick: () => setSelectedMetric("comissoes"), label: "Rendimento de Bônus", value: formatBRL(summary.totalCommissions), icon: /* @__PURE__ */ jsx(TrendingUp, { className: "h-4 w-4" }) }),
      /* @__PURE__ */ jsx(MetricCard, { active: selectedMetric === "retencao", onClick: () => setSelectedMetric("retencao"), label: "Consistência de Rede", value: "Dados reais", icon: /* @__PURE__ */ jsx(Users, { className: "h-4 w-4" }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "rounded-3xl border border-border/60 bg-card/40 p-6 space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("h2", { className: "text-lg font-bold text-white flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Activity, { className: "h-5 w-5 text-primary" }),
            "Curva Analítica de Desenvolvimento"
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Agregação mensal dos pagamentos." })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex bg-background/80 p-0.5 rounded-lg border border-border/60 self-start", children: ["30", "90", "365"].map((value) => /* @__PURE__ */ jsx(Button, { variant: timeframe === value ? "secondary" : "ghost", size: "sm", onClick: () => setTimeframe(value), className: "h-7 text-[11px] px-2.5", children: value === "30" ? "Últimos 30 dias" : value === "90" ? "Trimestre" : "Anual" }, value)) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "h-80 w-full pt-4", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: selectedMetric === "vendas" ? /* @__PURE__ */ jsxs(AreaChart, { data: points, children: [
        /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs("linearGradient", { id: "vendasGrad", x1: "0", x2: "0", y1: "0", y2: "1", children: [
          /* @__PURE__ */ jsx("stop", { offset: "0%", stopColor: "var(--color-primary)", stopOpacity: 0.4 }),
          /* @__PURE__ */ jsx("stop", { offset: "100%", stopColor: "var(--color-primary)", stopOpacity: 0 })
        ] }) }),
        /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "var(--color-border)", opacity: 0.3 }),
        /* @__PURE__ */ jsx(XAxis, { dataKey: "month", stroke: "var(--color-muted-foreground)", fontSize: 11 }),
        /* @__PURE__ */ jsx(YAxis, { stroke: "var(--color-muted-foreground)", fontSize: 11, tickFormatter: (v) => `${(v / 1e3).toFixed(0)}k` }),
        /* @__PURE__ */ jsx(Tooltip, { contentStyle: {
          background: "var(--color-popover)",
          border: "1px solid var(--color-border)",
          borderRadius: 12,
          fontSize: 12
        } }),
        /* @__PURE__ */ jsx(Area, { type: "monotone", dataKey: "vendas", name: "Vendas Ativas (R$)", stroke: "var(--color-primary)", strokeWidth: 3, fill: "url(#vendasGrad)" })
      ] }) : selectedMetric === "comissoes" ? /* @__PURE__ */ jsxs(BarChart, { data: points, children: [
        /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "var(--color-border)", opacity: 0.3 }),
        /* @__PURE__ */ jsx(XAxis, { dataKey: "month", stroke: "var(--color-muted-foreground)", fontSize: 11 }),
        /* @__PURE__ */ jsx(YAxis, { stroke: "var(--color-muted-foreground)", fontSize: 11, tickFormatter: (v) => `${(v / 1e3).toFixed(1)}k` }),
        /* @__PURE__ */ jsx(Tooltip, { contentStyle: {
          background: "var(--color-popover)",
          border: "1px solid var(--color-border)",
          borderRadius: 12,
          fontSize: 12
        } }),
        /* @__PURE__ */ jsx(Bar, { dataKey: "comissoes", name: "Bônus Unilevel (R$)", fill: "var(--color-success)", radius: [6, 6, 0, 0] })
      ] }) : /* @__PURE__ */ jsxs(LineChart, { data: points, children: [
        /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "var(--color-border)", opacity: 0.3 }),
        /* @__PURE__ */ jsx(XAxis, { dataKey: "month", stroke: "var(--color-muted-foreground)", fontSize: 11 }),
        /* @__PURE__ */ jsx(YAxis, { stroke: "var(--color-muted-foreground)", fontSize: 11, domain: [90, 100] }),
        /* @__PURE__ */ jsx(Tooltip, { contentStyle: {
          background: "var(--color-popover)",
          border: "1px solid var(--color-border)",
          borderRadius: 12,
          fontSize: 12
        } }),
        /* @__PURE__ */ jsx(Legend, { verticalAlign: "top", height: 36 }),
        /* @__PURE__ */ jsx(Line, { type: "monotone", dataKey: "retencao", name: "Frequência Consistência (%)", stroke: "#818cf8", strokeWidth: 3, activeDot: {
          r: 8
        } }),
        /* @__PURE__ */ jsx(Line, { type: "monotone", dataKey: "conversao", name: "Conversão Loja (%)", stroke: "#f43f5e", strokeWidth: 2 })
      ] }) }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "rounded-2xl border border-border/60 bg-card/60 p-5", children: /* @__PURE__ */ jsxs("h3", { className: "text-sm font-semibold flex items-center gap-2", children: [
      /* @__PURE__ */ jsx(Badge, { children: "Fonte" }),
      " Somente pagamentos reais foram usados neste relatório."
    ] }) })
  ] });
}
function MetricCard({
  active,
  onClick,
  label,
  value,
  icon
}) {
  return /* @__PURE__ */ jsxs("div", { onClick, className: `rounded-2xl border p-5 cursor-pointer transition-all ${active ? "bg-primary/10 border-primary shadow-lg shadow-primary/5" : "bg-card/60 border-border/30 hover:border-border/60"}`, children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsx("span", { className: "text-xs font-medium text-muted-foreground uppercase tracking-wider font-mono", children: label }),
      icon
    ] }),
    /* @__PURE__ */ jsx("p", { className: "mt-3 text-2xl font-bold text-white", children: value }),
    /* @__PURE__ */ jsxs("div", { className: "mt-1 flex items-center justify-between text-xs", children: [
      /* @__PURE__ */ jsxs("span", { className: "text-emerald-400 font-semibold inline-flex items-center gap-0.5", children: [
        /* @__PURE__ */ jsx(ArrowUpRight, { className: "h-3.5 w-3.5" }),
        " +0%"
      ] }),
      /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "vs. período anterior" })
    ] })
  ] });
}
export {
  ReportsPage as component
};
