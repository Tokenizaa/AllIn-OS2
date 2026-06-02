import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect, useMemo } from "react";
import { P as PageHeader } from "./page-header-BiG0inxH.js";
import { K as KpiCard } from "./kpi-card-DWxdq3sg.js";
import { B as Button } from "./router-C3cuB5ui.js";
import { s as supabase } from "./supabase-client-BdpvIS_G.js";
import { c as computeGenerationBonus } from "./mlm-rules-RFBC3uMT.js";
import "lucide-react";
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
function CommissionsPage() {
  const [rows, setRows] = useState([]);
  const [plans, setPlans] = useState([]);
  const [customers, setCustomers] = useState([]);
  useEffect(() => {
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
  const activeDirects = useMemo(() => customers.filter((c) => String(c.patrocinador_comprador || "").length > 0 && (c.status || "").toLowerCase() === "active").length, [customers]);
  const simulation = computeGenerationBonus(plan?.name, total || 1e3, activeDirects);
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsx(PageHeader, { eyebrow: "Rede MLM", title: "Comissões & Ciclos", subtitle: "Processamento derivado de pagamentos reais e regras dos planos.", actions: /* @__PURE__ */ jsx(Button, { size: "sm", children: "Rodar ciclo" }) }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3", children: [
      /* @__PURE__ */ jsx(KpiCard, { label: "Total pago no mês", value: `R$ ${total.toLocaleString("pt-BR", {
        minimumFractionDigits: 2
      })}`, accent: "success" }),
      /* @__PURE__ */ jsx(KpiCard, { label: "Bônus médio", value: `R$ ${(rows.length ? total / rows.length : 0).toLocaleString("pt-BR", {
        minimumFractionDigits: 2
      })}` }),
      /* @__PURE__ */ jsx(KpiCard, { label: "Ciclos no mês", value: String(rows.length) }),
      /* @__PURE__ */ jsx(KpiCard, { label: "Pendente próximo ciclo", value: String(rows.filter((r) => r.status !== "pago").length), accent: "warning" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-3", children: [
      /* @__PURE__ */ jsx(KpiCard, { label: "Comissão direta simulada", value: `R$ ${simulation.direct.toLocaleString("pt-BR", {
        minimumFractionDigits: 2
      })}` }),
      /* @__PURE__ */ jsx(KpiCard, { label: "Geração 1", value: `R$ ${(simulation.generations[0]?.amount || 0).toLocaleString("pt-BR", {
        minimumFractionDigits: 2
      })}` }),
      /* @__PURE__ */ jsx(KpiCard, { label: "Bônus extra diretos", value: `R$ ${simulation.extraDirects.reduce((sum, b) => sum + b.amount, 0).toLocaleString("pt-BR", {
        minimumFractionDigits: 2
      })}` })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-border bg-card/40 overflow-hidden", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsx("thead", { className: "bg-background/40 text-[11px] uppercase tracking-wider text-muted-foreground", children: /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("th", { className: "px-4 py-2.5 text-left", children: "Ciclo" }),
        /* @__PURE__ */ jsx("th", { className: "px-4 py-2.5 text-right", children: "Qualificados" }),
        /* @__PURE__ */ jsx("th", { className: "px-4 py-2.5 text-right", children: "Valor pago" }),
        /* @__PURE__ */ jsx("th", { className: "px-4 py-2.5 text-left", children: "Status" })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-border/60", children: rows.map((r) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-accent/30", children: [
        /* @__PURE__ */ jsx("td", { className: "px-4 py-3 font-medium", children: r.ciclo }),
        /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-right tabular-nums", children: r.qualificados }),
        /* @__PURE__ */ jsxs("td", { className: "px-4 py-3 text-right tabular-nums", children: [
          "R$ ",
          r.pago.toLocaleString("pt-BR", {
            minimumFractionDigits: 2
          })
        ] }),
        /* @__PURE__ */ jsx("td", { className: "px-4 py-3 capitalize", children: r.status })
      ] }, r.id)) })
    ] }) })
  ] });
}
export {
  CommissionsPage as component
};
