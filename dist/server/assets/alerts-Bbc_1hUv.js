import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { P as PageHeader } from "./page-header-D_YhEPyH.js";
import { s as supabase } from "./supabase-client-BdpvIS_G.js";
import "lucide-react";
import "./router-Piw3VGP8.js";
import "@tanstack/react-query";
import "@tanstack/react-router";
import "framer-motion";
import "sonner";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "@supabase/supabase-js";
function AlertsPage() {
  const [alerts, setAlerts] = useState([]);
  useEffect(() => {
    (async () => {
      const [{
        data: payments
      }, {
        data: withdrawals
      }, {
        data: orders
      }] = await Promise.all([supabase.from("payments").select("id, created_at").order("created_at", {
        ascending: false
      }).limit(5), supabase.from("withdrawals").select("id, created_at, risco").order("created_at", {
        ascending: false
      }).limit(5), supabase.from("orders").select("id, created_at").order("created_at", {
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
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsx(PageHeader, { eyebrow: "Executive", title: "Alertas operacionais", subtitle: "Eventos críticos detectados em dados reais." }),
    /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-border bg-card/40 divide-y divide-border/60", children: alerts.map((a) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 px-4 py-3", children: [
      /* @__PURE__ */ jsx("span", { className: `h-2 w-2 rounded-full ${a.severity === "critical" ? "bg-destructive" : a.severity === "warning" ? "bg-warning" : "bg-info"}` }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm font-medium", children: a.title }),
        /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground", children: [
          a.domain,
          " · ",
          a.at ? new Date(a.at).toLocaleString("pt-BR") : "-"
        ] })
      ] }),
      /* @__PURE__ */ jsx("span", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: a.severity })
    ] }, a.id)) })
  ] });
}
export {
  AlertsPage as component
};
