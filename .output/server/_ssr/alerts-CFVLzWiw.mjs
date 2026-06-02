import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { P as PageHeader } from "./page-header-R4VVQEB2.mjs";
import { s as supabase } from "./supabase-client-BdpvIS_G.mjs";
import "../_libs/sonner.mjs";

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
function AlertsPage() {
  const [alerts, setAlerts] = reactExports.useState([]);
  reactExports.useEffect(() => {
    (async () => {
      const [{
        data: payments
      }, {
        data: withdrawals
      }, {
        data: orders
      }] = await Promise.all([supabase.from("payments").select("*").order("created_at", {
        ascending: false
      }).limit(5), supabase.from("withdrawals").select("*").order("created_at", {
        ascending: false
      }).limit(5), supabase.from("orders").select("*").order("created_at", {
        ascending: false
      }).limit(5)]);
      const items = [...(withdrawals || []).map((w) => ({
        id: `w-${w.id}`,
        title: "Saque em processamento",
        domain: "financeiro",
        at: w.created_at,
        severity: w.risco ? "critical" : "warning"
      })), ...(payments || []).map((p) => ({
        id: `p-${p.id}`,
        title: "Pagamento registrado",
        domain: "payments",
        at: p.created_at,
        severity: "info"
      })), ...(orders || []).map((o) => ({
        id: `o-${o.id}`,
        title: "Pedido atualizado",
        domain: "orders",
        at: o.created_at,
        severity: "info"
      }))];
      setAlerts(items.slice(0, 12));
    })();
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { eyebrow: "Executive", title: "Alertas operacionais", subtitle: "Eventos críticos detectados em dados reais." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border bg-card/40 divide-y divide-border/60", children: alerts.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-4 py-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `h-2 w-2 rounded-full ${a.severity === "critical" ? "bg-destructive" : a.severity === "warning" ? "bg-warning" : "bg-info"}` }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: a.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
          a.domain,
          " · ",
          a.at ? new Date(a.at).toLocaleString("pt-BR") : "-"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: a.severity })
    ] }, a.id)) })
  ] });
}
export {
  AlertsPage as component
};
