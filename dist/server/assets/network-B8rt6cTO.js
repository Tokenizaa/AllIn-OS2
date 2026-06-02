import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { P as PageHeader } from "./page-header-BiG0inxH.js";
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, Treemap } from "recharts";
import { K as KpiCard } from "./kpi-card-DWxdq3sg.js";
import { s as supabase } from "./supabase-client-BdpvIS_G.js";
import "lucide-react";
import "./router-C3cuB5ui.js";
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
function NetworkPage() {
  const [customers, setCustomers] = useState([]);
  const [legs, setLegs] = useState([]);
  useEffect(() => {
    (async () => {
      const [{
        data: customerData
      }, {
        data: relationshipData
      }] = await Promise.all([supabase.from("customers").select("id, usuario, id_comprador, qualification, status, cidade, estado, user_id, name").order("created_at", {
        ascending: false
      }).limit(20), supabase.from("network_relationships").select("*").order("created_at", {
        ascending: false
      }).limit(12)]);
      setCustomers(customerData || []);
      setLegs((relationshipData || []).map((r, i) => ({
        name: `G${i + 1}`,
        esquerda: Number(r.left_count || r.left_side_count || 0),
        direita: Number(r.right_count || r.right_side_count || 0)
      })));
    })();
  }, []);
  const data = customers.map((c) => ({
    name: (c.name || c.usuario || c.id_comprador || "D").split(" ")[0],
    size: Math.max(1, Number(c.id ? 1 : 0)) * 100
  }));
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsx(PageHeader, { eyebrow: "Rede MLM", title: "Genealogia inteligente", subtitle: "Dados reais da rede no Supabase." }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3", children: [
      /* @__PURE__ */ jsx(KpiCard, { label: "Total na rede", value: String(customers.length), accent: "primary" }),
      /* @__PURE__ */ jsx(KpiCard, { label: "Pares binários", value: String(legs.length), accent: "success" }),
      /* @__PURE__ */ jsx(KpiCard, { label: "Equilíbrio binário", value: "--" }),
      /* @__PURE__ */ jsx(KpiCard, { label: "Ciclos pagos", value: "--", accent: "warning" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 xl:grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-border bg-card/60 p-5", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold", children: "Pernas binárias" }),
        /* @__PURE__ */ jsx("div", { className: "h-72 mt-3", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(BarChart, { data: legs, children: [
          /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "var(--color-border)" }),
          /* @__PURE__ */ jsx(XAxis, { dataKey: "name", stroke: "var(--color-muted-foreground)", fontSize: 11 }),
          /* @__PURE__ */ jsx(YAxis, { stroke: "var(--color-muted-foreground)", fontSize: 11 }),
          /* @__PURE__ */ jsx(Tooltip, { contentStyle: {
            background: "var(--color-popover)",
            border: "1px solid var(--color-border)",
            borderRadius: 8,
            fontSize: 12
          } }),
          /* @__PURE__ */ jsx(Bar, { dataKey: "esquerda", stackId: "a", fill: "var(--color-primary)" }),
          /* @__PURE__ */ jsx(Bar, { dataKey: "direita", stackId: "a", fill: "var(--color-chart-2)" })
        ] }) }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-border bg-card/60 p-5", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold", children: "Mapa de calor da rede" }),
        /* @__PURE__ */ jsx("div", { className: "h-72 mt-3", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsx(Treemap, { data, dataKey: "size", stroke: "var(--color-background)", fill: "var(--color-primary)" }) }) })
      ] })
    ] })
  ] });
}
export {
  NetworkPage as component
};
