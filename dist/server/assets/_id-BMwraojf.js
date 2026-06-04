import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ShieldAlert, Bot, FileText, Sparkles, CheckCircle2, Wallet, CreditCard, ShoppingBag, Workflow, Mail, Phone, MapPin, Shield } from "lucide-react";
import { P as PageHeader } from "./page-header-D_YhEPyH.js";
import { c as cn, o as Route, B as Button, a as Badge } from "./router-Piw3VGP8.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-DBV3uj2e.js";
import { K as KpiCard } from "./kpi-card-CiHSHjQA.js";
import { s as supabase } from "./supabase-client-BdpvIS_G.js";
import { g as getCustomerLabel, a as getCustomerInitials } from "./customer-label-ChoLRkdM.js";
import "@tanstack/react-query";
import "framer-motion";
import "sonner";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "@radix-ui/react-tabs";
import "@supabase/supabase-js";
const iconMap = {
  order: ShoppingBag,
  payment: CreditCard,
  bonus: Wallet,
  verification: CheckCircle2,
  activation: Sparkles,
  note: FileText,
  automation: Bot,
  risk: ShieldAlert
};
const colorMap = {
  order: "text-primary",
  payment: "text-info",
  bonus: "text-success",
  verification: "text-success",
  activation: "text-primary",
  note: "text-muted-foreground",
  automation: "text-fuchsia-400",
  risk: "text-destructive"
};
function Timeline({ events }) {
  return /* @__PURE__ */ jsx("ol", { className: "relative border-l border-border/60 pl-5 space-y-4", children: events.map((e) => {
    const Icon = iconMap[e.type];
    return /* @__PURE__ */ jsxs("li", { className: "relative", children: [
      /* @__PURE__ */ jsx("span", { className: cn("absolute -left-[27px] grid h-5 w-5 place-items-center rounded-full border border-border bg-card", colorMap[e.type]), children: /* @__PURE__ */ jsx(Icon, { className: "h-3 w-3" }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-baseline justify-between gap-2", children: [
        /* @__PURE__ */ jsx("h5", { className: "text-sm font-medium", children: e.title }),
        /* @__PURE__ */ jsx("time", { className: "text-[11px] text-muted-foreground whitespace-nowrap", children: new Date(e.at).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "mt-0.5 text-xs text-muted-foreground", children: e.description }),
      e.actor && /* @__PURE__ */ jsxs("span", { className: "mt-1 inline-block text-[10px] text-fuchsia-300/80", children: [
        "por ",
        e.actor
      ] })
    ] }, e.id);
  }) });
}
function Customer360() {
  const {
    customer: c
  } = Route.useLoaderData();
  const [orders, setOrders] = useState([]);
  const [sponsor, setSponsor] = useState(null);
  useEffect(() => {
    (async () => {
      const [{
        data: orderData
      }, {
        data: sponsorData
      }] = await Promise.all([supabase.from("orders").select("id, numero_pedido, status_pedido, status, payment_method, payment_status, valor_total_pedido, valor_total, created_at").eq("customer_id", c.id).order("created_at", {
        ascending: false
      }).limit(50), c.patrocinador_comprador ? supabase.from("customers").select("id, usuario, id_comprador, user_id, qualification, status").eq("id_comprador", c.patrocinador_comprador).maybeSingle() : Promise.resolve({
        data: null
      })]);
      setOrders(orderData || []);
      setSponsor(sponsorData || null);
    })();
  }, [c.id, c.patrocinador_comprador]);
  const tl = [{
    id: "1",
    type: "note",
    title: "Cadastro carregado",
    description: "Dados reais do Supabase",
    at: c.created_at || (/* @__PURE__ */ new Date()).toISOString()
  }, ...orders.slice(0, 4).map((o, index) => ({
    id: String(index + 2),
    type: "order",
    title: `Pedido ${o.numero_pedido || o.id}`,
    description: o.status_pedido || o.status || "-",
    at: o.created_at || (/* @__PURE__ */ new Date()).toISOString()
  }))];
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs text-muted-foreground", children: [
      /* @__PURE__ */ jsx(Link, { to: "/_app/customers", className: "hover:text-foreground", children: "Distribuidores" }),
      /* @__PURE__ */ jsx("span", { children: "/" }),
      /* @__PURE__ */ jsx("span", { className: "text-foreground", children: getCustomerLabel(c) })
    ] }),
    /* @__PURE__ */ jsx(PageHeader, { eyebrow: "Customer 360", title: getCustomerLabel(c), subtitle: `${c.plano_id || c.plan_id || "-"} · ${c.qualification || "-"} · ativo desde ${c.created_at ? new Date(c.created_at).toLocaleDateString("pt-BR") : "-"}`, actions: /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs(Button, { size: "sm", variant: "outline", className: "gap-1.5", children: [
        /* @__PURE__ */ jsx(Workflow, { className: "h-3.5 w-3.5" }),
        " Workflow"
      ] }),
      /* @__PURE__ */ jsxs(Button, { size: "sm", variant: "outline", className: "gap-1.5", children: [
        /* @__PURE__ */ jsx(Mail, { className: "h-3.5 w-3.5" }),
        " Mensagem"
      ] }),
      /* @__PURE__ */ jsx(Button, { size: "sm", children: "Ações" })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-4 gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-1 rounded-xl border border-border bg-card/60 p-5 space-y-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "h-14 w-14 rounded-full bg-gradient-to-br from-primary to-fuchsia-500 grid place-items-center text-lg font-semibold text-white", children: getCustomerInitials(c) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "font-semibold", children: getCustomerLabel(c) }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: c.id })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1.5 text-xs", children: [
          /* @__PURE__ */ jsxs("p", { className: "flex items-center gap-2 text-muted-foreground", children: [
            /* @__PURE__ */ jsx(Mail, { className: "h-3.5 w-3.5" }),
            " ",
            c.user_id || c.id_comprador || "-"
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "flex items-center gap-2 text-muted-foreground", children: [
            /* @__PURE__ */ jsx(Phone, { className: "h-3.5 w-3.5" }),
            " ",
            c.telefone || "-"
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "flex items-center gap-2 text-muted-foreground", children: [
            /* @__PURE__ */ jsx(MapPin, { className: "h-3.5 w-3.5" }),
            " ",
            c.cidade || "-",
            "/",
            c.estado || "-"
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "flex items-center gap-2 text-muted-foreground", children: [
            /* @__PURE__ */ jsx(Shield, { className: "h-3.5 w-3.5" }),
            " CPF ",
            c.metadata?.cpf || "-"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-1.5", children: [
          /* @__PURE__ */ jsx(Badge, { variant: "outline", children: c.qualification || "-" }),
          /* @__PURE__ */ jsx(Badge, { variant: "outline", children: c.plano_id || c.plan_id || "-" }),
          /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "capitalize", children: c.status || "-" })
        ] }),
        sponsor && /* @__PURE__ */ jsxs("div", { className: "rounded-md border border-border bg-background/40 p-2 text-xs", children: [
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Patrocinador" }),
          /* @__PURE__ */ jsx(Link, { to: "/_app/customers/$id", params: {
            id: sponsor.id
          }, className: "font-medium hover:text-primary", children: getCustomerLabel(sponsor) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-3", children: [
        /* @__PURE__ */ jsx(KpiCard, { label: "LTV", value: "-" }),
        /* @__PURE__ */ jsx(KpiCard, { label: "Total comprado", value: "-", hint: `${orders.length} pedidos` }),
        /* @__PURE__ */ jsx(KpiCard, { label: "Pedidos", value: String(orders.length) }),
        /* @__PURE__ */ jsx(KpiCard, { label: "Risco de churn", value: "--" }),
        /* @__PURE__ */ jsxs("div", { className: "col-span-2 md:col-span-4 rounded-xl border border-primary/30 bg-primary/5 p-4 flex items-start gap-3", children: [
          /* @__PURE__ */ jsx(Sparkles, { className: "h-4 w-4 text-primary mt-0.5" }),
          /* @__PURE__ */ jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsxs("p", { className: "text-sm", children: [
            /* @__PURE__ */ jsx("span", { className: "font-medium", children: "Dados reais carregados do Supabase." }),
            " As recomendações podem ser reintroduzidas depois."
          ] }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Tabs, { defaultValue: "timeline", className: "space-y-4", children: [
      /* @__PURE__ */ jsxs(TabsList, { className: "bg-card/60 border border-border", children: [
        /* @__PURE__ */ jsx(TabsTrigger, { value: "timeline", children: "Timeline" }),
        /* @__PURE__ */ jsxs(TabsTrigger, { value: "orders", children: [
          "Pedidos (",
          orders.length,
          ")"
        ] }),
        /* @__PURE__ */ jsx(TabsTrigger, { value: "wallet", children: "Carteira" }),
        /* @__PURE__ */ jsx(TabsTrigger, { value: "network", children: "Rede" }),
        /* @__PURE__ */ jsx(TabsTrigger, { value: "docs", children: "Documentos" }),
        /* @__PURE__ */ jsx(TabsTrigger, { value: "automations", children: "Automações" })
      ] }),
      /* @__PURE__ */ jsx(TabsContent, { value: "timeline", className: "grid grid-cols-1 lg:grid-cols-3 gap-4", children: /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 rounded-xl border border-border bg-card/60 p-5", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold mb-4", children: "Timeline operacional" }),
        /* @__PURE__ */ jsx(Timeline, { events: tl })
      ] }) }),
      /* @__PURE__ */ jsx(TabsContent, { value: "orders", children: /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-border bg-card/40 overflow-hidden", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsx("thead", { className: "bg-background/40 text-[11px] uppercase tracking-wider text-muted-foreground", children: /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("th", { className: "px-4 py-2.5 text-left", children: "Pedido" }),
          /* @__PURE__ */ jsx("th", { className: "px-4 py-2.5 text-left", children: "Status" }),
          /* @__PURE__ */ jsx("th", { className: "px-4 py-2.5 text-left", children: "Pagamento" }),
          /* @__PURE__ */ jsx("th", { className: "px-4 py-2.5 text-right", children: "Valor" }),
          /* @__PURE__ */ jsx("th", { className: "px-4 py-2.5 text-left", children: "Data" })
        ] }) }),
        /* @__PURE__ */ jsxs("tbody", { className: "divide-y divide-border/60", children: [
          orders.map((o) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-accent/30", children: [
            /* @__PURE__ */ jsx("td", { className: "px-4 py-3 font-mono text-xs", children: o.numero_pedido || o.id }),
            /* @__PURE__ */ jsx("td", { className: "px-4 py-3 capitalize", children: o.status_pedido || o.status || "-" }),
            /* @__PURE__ */ jsxs("td", { className: "px-4 py-3 text-xs text-muted-foreground", children: [
              o.payment_method || "-",
              " · ",
              o.payment_status || "-"
            ] }),
            /* @__PURE__ */ jsxs("td", { className: "px-4 py-3 text-right tabular-nums", children: [
              "R$ ",
              Number(o.valor_total_pedido || o.valor_total || 0).toLocaleString("pt-BR", {
                minimumFractionDigits: 2
              })
            ] }),
            /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-xs text-muted-foreground", children: o.created_at ? new Date(o.created_at).toLocaleDateString("pt-BR") : "-" })
          ] }, o.id)),
          orders.length === 0 && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 5, className: "px-4 py-8 text-center text-sm text-muted-foreground", children: "Sem pedidos." }) })
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsxs(TabsContent, { value: "wallet", className: "grid md:grid-cols-3 gap-4", children: [
        /* @__PURE__ */ jsx(KpiCard, { label: "Saldo carteira", value: "--" }),
        /* @__PURE__ */ jsx(KpiCard, { label: "Bônus do mês", value: "--", accent: "success" }),
        /* @__PURE__ */ jsx(KpiCard, { label: "Comissões pendentes", value: "--", accent: "warning" })
      ] })
    ] })
  ] });
}
export {
  Customer360 as component
};
