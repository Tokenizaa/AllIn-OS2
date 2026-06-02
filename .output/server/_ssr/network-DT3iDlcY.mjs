import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { P as PageHeader } from "./page-header-R4VVQEB2.mjs";
import { K as KpiCard } from "./kpi-card-CwoKg18r.mjs";
import { s as supabase } from "./supabase-client-BdpvIS_G.mjs";
import "../_libs/sonner.mjs";
import { R as ResponsiveContainer, B as BarChart, C as CartesianGrid, X as XAxis, Y as YAxis, T as Tooltip, d as Bar, g as Treemap } from "../_libs/recharts.mjs";

import "./router-BZaVudxP.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/unenv.mjs";


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
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/tslib.mjs";
import "../_libs/supabase__functions-js.mjs";
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
function NetworkPage() {
  const [customers, setCustomers] = reactExports.useState([]);
  const [legs, setLegs] = reactExports.useState([]);
  reactExports.useEffect(() => {
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { eyebrow: "Rede MLM", title: "Genealogia inteligente", subtitle: "Dados reais da rede no Supabase." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { label: "Total na rede", value: String(customers.length), accent: "primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { label: "Pares binários", value: String(legs.length), accent: "success" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { label: "Equilíbrio binário", value: "--" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { label: "Ciclos pagos", value: "--", accent: "warning" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 xl:grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card/60 p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold", children: "Pernas binárias" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-72 mt-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(BarChart, { data: legs, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "var(--color-border)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { dataKey: "name", stroke: "var(--color-muted-foreground)", fontSize: 11 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { stroke: "var(--color-muted-foreground)", fontSize: 11 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { contentStyle: {
            background: "var(--color-popover)",
            border: "1px solid var(--color-border)",
            borderRadius: 8,
            fontSize: 12
          } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { dataKey: "esquerda", stackId: "a", fill: "var(--color-primary)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { dataKey: "direita", stackId: "a", fill: "var(--color-chart-2)" })
        ] }) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card/60 p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold", children: "Mapa de calor da rede" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-72 mt-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Treemap, { data, dataKey: "size", stroke: "var(--color-background)", fill: "var(--color-primary)" }) }) })
      ] })
    ] })
  ] });
}
export {
  NetworkPage as component
};
