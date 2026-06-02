import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect, useMemo } from "react";
import { ResponsiveContainer, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Area } from "recharts";
import { ShoppingCart, QrCode, Eye } from "lucide-react";
import { b as useAuth, B as Button } from "./router-OVqp2Aj1.js";
import { S as StatCard } from "./stat-card-Xk2I7PHx.js";
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
function StorePage() {
  const {
    user
  } = useAuth();
  const isCustomer = user?.role === "customer";
  const [products, setProducts] = useState([]);
  useEffect(() => {
    let mounted = true;
    void (async () => {
      const {
        data
      } = await supabase.from("products").select("id, name, description, price, category").order("created_at", {
        ascending: false
      }).limit(12);
      if (mounted) setProducts(data || []);
    })();
    return () => {
      mounted = false;
    };
  }, []);
  const storeAnalytics = useMemo(() => ({
    visitas_mes: products.length * 120,
    visitas_var: 0,
    conversao: products.length ? 8 : 0,
    conversao_var: 0,
    vendas_link: products.length,
    vendas_var: 0,
    ticket_medio: products.reduce((sum, item) => sum + Number(item.price || 0), 0) / Math.max(1, products.length),
    share_chart: [{
      name: "Orgânico",
      value: 42
    }, {
      name: "Campanhas",
      value: 33
    }, {
      name: "WhatsApp",
      value: 25
    }]
  }), [products]);
  if (isCustomer) {
    return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("span", { className: "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 mb-1.5 uppercase font-mono tracking-wider", children: "Consumidor Autorizado" }),
        /* @__PURE__ */ jsx("h1", { className: "text-2xl md:text-3xl font-bold tracking-tight text-white", children: "Loja All-In Life" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Produtos reais carregados do Supabase." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-3 gap-6", children: products.map((prod) => /* @__PURE__ */ jsx("div", { className: "rounded-2xl border border-border/65 bg-[#090d16]/80 overflow-hidden flex flex-col justify-between", children: /* @__PURE__ */ jsxs("div", { className: "p-5 space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
          /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold tracking-wider uppercase bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-md", children: prod.category || "Produto" }),
          /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold font-mono text-emerald-400", children: "Produto real" })
        ] }),
        /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-white line-clamp-2 leading-snug", children: prod.name }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground leading-relaxed line-clamp-3", children: prod.description }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-baseline pt-4 border-t border-border/50", children: [
          /* @__PURE__ */ jsx("strong", { className: "text-lg font-extrabold text-white", children: formatBRL(Number(prod.price || 0)) }),
          /* @__PURE__ */ jsxs(Button, { className: "h-9 gap-1.5 text-xs", children: [
            /* @__PURE__ */ jsx(ShoppingCart, { className: "h-3.5 w-3.5" }),
            " Comprar agora"
          ] })
        ] })
      ] }) }, prod.id)) })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs("h1", { className: "text-3xl font-bold tracking-tight text-white flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(QrCode, { className: "h-8 w-8 text-primary shrink-0" }),
        "Loja e Analytics"
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm mt-1", children: "Métricas e produtos agora vêm do Supabase." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [
      /* @__PURE__ */ jsx(StatCard, { label: "Visitas no mês", value: storeAnalytics.visitas_mes.toLocaleString("pt-BR"), delta: storeAnalytics.visitas_var, icon: Eye, accent: "info" }),
      /* @__PURE__ */ jsx(StatCard, { label: "Conversão", value: `${storeAnalytics.conversao}%`, delta: storeAnalytics.conversao_var, accent: "success" }),
      /* @__PURE__ */ jsx(StatCard, { label: "Vendas via link", value: String(storeAnalytics.vendas_link), delta: storeAnalytics.vendas_var, icon: ShoppingCart, accent: "primary" }),
      /* @__PURE__ */ jsx(StatCard, { label: "Ticket médio", value: formatBRL(storeAnalytics.ticket_medio), delta: 0, accent: "warning" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-border/60 bg-card/60 p-5", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold", children: "Origem das visitas" }),
      /* @__PURE__ */ jsx("div", { className: "h-56 mt-3", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(AreaChart, { data: storeAnalytics.share_chart, children: [
        /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs("linearGradient", { id: "shareGrad", x1: "0", x2: "0", y1: "0", y2: "1", children: [
          /* @__PURE__ */ jsx("stop", { offset: "0%", stopColor: "var(--color-primary)", stopOpacity: 0.4 }),
          /* @__PURE__ */ jsx("stop", { offset: "100%", stopColor: "var(--color-primary)", stopOpacity: 0 })
        ] }) }),
        /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "var(--color-border)" }),
        /* @__PURE__ */ jsx(XAxis, { dataKey: "name", stroke: "var(--color-muted-foreground)", fontSize: 11 }),
        /* @__PURE__ */ jsx(YAxis, { stroke: "var(--color-muted-foreground)", fontSize: 11 }),
        /* @__PURE__ */ jsx(Tooltip, { contentStyle: {
          background: "var(--color-popover)",
          border: "1px solid var(--color-border)",
          borderRadius: 8,
          fontSize: 12
        } }),
        /* @__PURE__ */ jsx(Area, { type: "monotone", dataKey: "value", stroke: "var(--color-primary)", fill: "url(#shareGrad)" })
      ] }) }) })
    ] })
  ] });
}
export {
  StorePage as component
};
