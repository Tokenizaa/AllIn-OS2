import { jsxs, jsx } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { Sparkles, Search, Filter, ArrowUpRight } from "lucide-react";
import { P as PageHeader } from "./page-header-D_YhEPyH.js";
import { I as Input } from "./input-QP3DCRKc.js";
import { B as Button, c as cn, a as Badge } from "./router-Piw3VGP8.js";
import { s as supabase } from "./supabase-client-BdpvIS_G.js";
import { g as getCustomerLabel, a as getCustomerInitials } from "./customer-label-ChoLRkdM.js";
import "@tanstack/react-query";
import "framer-motion";
import "sonner";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "@supabase/supabase-js";
const statusStyles = {
  active: "bg-success/15 text-success border-success/30",
  pending: "bg-warning/15 text-warning border-warning/30",
  blocked: "bg-destructive/15 text-destructive border-destructive/30",
  churned: "bg-muted text-muted-foreground border-border"
};
function CustomersPage() {
  const [q, setQ] = useState("");
  const [qual, setQual] = useState("all");
  const [customers, setCustomers] = useState([]);
  useEffect(() => {
    (async () => {
      const {
        data
      } = await supabase.from("customers").select("id, user_id, usuario, id_comprador, qualification, status, telefone, created_at").order("created_at", {
        ascending: false
      });
      setCustomers(data || []);
    })();
  }, []);
  const filtered = useMemo(() => customers.filter((c) => (qual === "all" || (c.qualification || "") === qual) && (q === "" || getCustomerLabel(c).toLowerCase().includes(q.toLowerCase()))), [q, qual, customers]);
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsx(PageHeader, { eyebrow: "CRM", title: "Distribuidores", subtitle: `${customers.length.toLocaleString("pt-BR")} registros · ${customers.filter((c) => c.status === "active").length.toLocaleString("pt-BR")} ativos`, actions: /* @__PURE__ */ jsx(Button, { size: "sm", children: "Novo distribuidor" }) }),
    /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-primary/30 bg-primary/5 p-3 flex flex-wrap items-center gap-3", children: [
      /* @__PURE__ */ jsx(Sparkles, { className: "h-4 w-4 text-primary shrink-0" }),
      /* @__PURE__ */ jsxs("p", { className: "text-sm flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxs("span", { className: "font-medium", children: [
          customers.filter((c) => (c.status || "") !== "active").length,
          " distribuidores"
        ] }),
        " ",
        "em atenção. ",
        /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Use os filtros para priorização." })
      ] }),
      /* @__PURE__ */ jsx(Button, { size: "sm", variant: "outline", children: "Atualizar base" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative flex-1 min-w-[240px] max-w-md", children: [
        /* @__PURE__ */ jsx(Search, { className: "pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" }),
        /* @__PURE__ */ jsx(Input, { value: q, onChange: (e) => setQ(e.target.value), placeholder: "Buscar por nome ou identificação…", className: "h-9 pl-8 bg-card/60" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex gap-1.5 flex-wrap", children: ["all", "Bronze", "Prata", "Ouro", "Diamante", "Black"].map((v) => /* @__PURE__ */ jsx("button", { onClick: () => setQual(v), className: cn("rounded-md border border-border px-3 py-1.5 text-xs", qual === v ? "bg-primary text-primary-foreground border-primary" : "bg-card/40 text-muted-foreground hover:text-foreground"), children: v === "all" ? "Todas qualificações" : v }, v)) }),
      /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "sm", className: "ml-auto gap-1.5", children: [
        /* @__PURE__ */ jsx(Filter, { className: "h-3.5 w-3.5" }),
        " Mais filtros"
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-border bg-card/40 overflow-hidden", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsx("thead", { className: "bg-background/40 text-left", children: /* @__PURE__ */ jsxs("tr", { className: "text-[11px] uppercase tracking-wider text-muted-foreground", children: [
        /* @__PURE__ */ jsx("th", { className: "px-4 py-2.5 font-medium", children: "Distribuidor" }),
        /* @__PURE__ */ jsx("th", { className: "px-4 py-2.5 font-medium", children: "Qualificação" }),
        /* @__PURE__ */ jsx("th", { className: "px-4 py-2.5 font-medium", children: "Status" }),
        /* @__PURE__ */ jsx("th", { className: "px-4 py-2.5 font-medium text-right", children: "Pedidos" }),
        /* @__PURE__ */ jsx("th", { className: "px-4 py-2.5 font-medium text-right", children: "LTV" }),
        /* @__PURE__ */ jsx("th", { className: "px-4 py-2.5 font-medium", children: "Telefone" }),
        /* @__PURE__ */ jsx("th", { className: "px-4 py-2.5 font-medium" })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-border/60", children: filtered.slice(0, 40).map((c) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-accent/30 transition-colors", children: [
        /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "h-8 w-8 rounded-full bg-gradient-to-br from-primary/40 to-fuchsia-500/40 grid place-items-center text-[11px] font-medium", children: getCustomerInitials(c) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Link, { to: "/_app/customers/$id", params: {
              id: c.id
            }, className: "font-medium hover:text-primary", children: getCustomerLabel(c) }),
            /* @__PURE__ */ jsx("div", { className: "text-[11px] text-muted-foreground", children: c.id_comprador || c.user_id || "-" })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-[10px]", children: c.qualification || "-" }) }),
        /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsx("span", { className: cn("inline-flex rounded-md border px-1.5 py-0.5 text-[10px] capitalize", statusStyles[c.status || "pending"]), children: c.status || "pending" }) }),
        /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-right tabular-nums", children: "-" }),
        /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-right tabular-nums font-medium", children: "-" }),
        /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-xs text-muted-foreground", children: c.telefone || "-" }),
        /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ jsxs(Link, { to: "/_app/customers/$id", params: {
          id: c.id
        }, className: "inline-flex items-center gap-0.5 text-xs text-primary", children: [
          "Abrir 360 ",
          /* @__PURE__ */ jsx(ArrowUpRight, { className: "h-3 w-3" })
        ] }) })
      ] }, c.id)) })
    ] }) })
  ] });
}
export {
  CustomersPage as component
};
