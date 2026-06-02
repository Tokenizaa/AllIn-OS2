import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { P as PageHeader } from "./page-header-R4VVQEB2.mjs";
import { K as KpiCard } from "./kpi-card-CwoKg18r.mjs";
import { B as Button } from "./router-BZaVudxP.mjs";
import { s as supabase } from "./supabase-client-BdpvIS_G.mjs";
import { c as computeGenerationBonus } from "./mlm-rules-RFBC3uMT.mjs";
import "../_libs/sonner.mjs";

import "../_libs/lucide-react.mjs";
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
function CommissionsPage() {
  const [rows, setRows] = reactExports.useState([]);
  const [plans, setPlans] = reactExports.useState([]);
  const [customers, setCustomers] = reactExports.useState([]);
  reactExports.useEffect(() => {
    (async () => {
      const [{
        data: payments
      }, {
        data: plansData
      }, {
        data: customersData
      }] = await Promise.all([supabase.from("payments").select("*").order("created_at", {
        ascending: false
      }).limit(18), supabase.from("plans").select("id, name, price, commission_percent, generations, benefits, is_active, sort_order").eq("is_active", true).order("sort_order", {
        ascending: true
      }), supabase.from("customers").select("id, user_id, usuario, id_comprador, qualification, patrocinador_comprador, status, created_at, name").limit(500)]);
      setRows((payments || []).map((p, i) => ({
        id: p.id || i,
        ciclo: `Lançamento #${i + 1}`,
        qualificados: Number(p.quantity || 1),
        pago: Number(p.amount || 0),
        status: i < 2 ? "processando" : "pago",
        planKey: p.plan_id || p.plan_name || p.plano_id || null
      })));
      setPlans(plansData || []);
      setCustomers(customersData || []);
    })();
  }, []);
  const total = rows.reduce((sum, r) => sum + Number(r.pago || 0), 0);
  const plan = plans[0];
  const activeDirects = reactExports.useMemo(() => customers.filter((c) => String(c.patrocinador_comprador || "").length > 0 && (c.status || "").toLowerCase() === "active").length, [customers]);
  const simulation = computeGenerationBonus(plan?.name, total || 1e3, activeDirects);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { eyebrow: "Rede MLM", title: "Comissões & Ciclos", subtitle: "Processamento derivado de pagamentos reais e regras dos planos.", actions: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", children: "Rodar ciclo" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { label: "Total pago no mês", value: `R$ ${total.toLocaleString("pt-BR", {
        minimumFractionDigits: 2
      })}`, accent: "success" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { label: "Bônus médio", value: `R$ ${(rows.length ? total / rows.length : 0).toLocaleString("pt-BR", {
        minimumFractionDigits: 2
      })}` }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { label: "Ciclos no mês", value: String(rows.length) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { label: "Pendente próximo ciclo", value: String(rows.filter((r) => r.status !== "pago").length), accent: "warning" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { label: "Comissão direta simulada", value: `R$ ${simulation.direct.toLocaleString("pt-BR", {
        minimumFractionDigits: 2
      })}` }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { label: "Geração 1", value: `R$ ${(simulation.generations[0]?.amount || 0).toLocaleString("pt-BR", {
        minimumFractionDigits: 2
      })}` }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { label: "Bônus extra diretos", value: `R$ ${simulation.extraDirects.reduce((sum, b) => sum + b.amount, 0).toLocaleString("pt-BR", {
        minimumFractionDigits: 2
      })}` })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border bg-card/40 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-background/40 text-[11px] uppercase tracking-wider text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2.5 text-left", children: "Ciclo" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2.5 text-right", children: "Qualificados" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2.5 text-right", children: "Valor pago" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2.5 text-left", children: "Status" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border/60", children: rows.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-accent/30", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-medium", children: r.ciclo }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right tabular-nums", children: r.qualificados }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 text-right tabular-nums", children: [
          "R$ ",
          r.pago.toLocaleString("pt-BR", {
            minimumFractionDigits: 2
          })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 capitalize", children: r.status })
      ] }, r.id)) })
    ] }) })
  ] });
}
export {
  CommissionsPage as component
};
