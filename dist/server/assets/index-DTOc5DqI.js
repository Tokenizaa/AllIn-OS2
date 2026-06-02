import { jsxs, jsx } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { Sparkles, Search, Filter, ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { P as PageHeader } from "./page-header-BiG0inxH.js";
import { I as Input } from "./input-CnOu4Y2I.js";
import { B as Button, c as cn, a as Badge } from "./router-C3cuB5ui.js";
import { s as supabase } from "./supabase-client-BdpvIS_G.js";
import { g as getCustomerLabel, a as getCustomerInitials } from "./customer-label-CvKl2zbr.js";
import "@tanstack/react-query";
import "./roles-DEW722fr.js";
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
function formatBRL(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(value);
}
function CustomersPage() {
  const [q, setQ] = useState("");
  const [qual, setQual] = useState("all");
  const [customers, setCustomers] = useState([]);
  const [orderStats, setOrderStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const fetchRealData = async () => {
    setLoading(true);
    try {
      const [{
        data: customerData
      }, {
        data: allOrders
      }] = await Promise.all([supabase.from("customers").select("id, user_id, usuario, id_comprador, qualification, status, telefone, created_at, name").order("created_at", {
        ascending: false
      }), supabase.from("orders").select("id, customer_id, valor_total_pedido, valor_total, status_pedido, status")]);
      const statsMap = {};
      if (allOrders) {
        allOrders.forEach((o) => {
          const cid = o.customer_id;
          if (!cid) return;
          if (!statsMap[cid]) {
            statsMap[cid] = {
              count: 0,
              ltv: 0
            };
          }
          statsMap[cid].count += 1;
          const isPaid = ["pago", "entregue", "enviado"].includes((o.status_pedido || o.status || "").toLowerCase());
          if (isPaid) {
            statsMap[cid].ltv += Number(o.valor_total_pedido || o.valor_total || 0);
          }
        });
      }
      setCustomers(customerData || []);
      setOrderStats(statsMap);
    } catch (err) {
      console.error("Erro ao buscar dados reais do Supabase:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchRealData();
  }, []);
  useEffect(() => {
    setCurrentPage(1);
  }, [q, qual]);
  const filtered = useMemo(() => customers.filter((c) => (qual === "all" || (c.qualification || "") === qual) && (q === "" || getCustomerLabel(c).toLowerCase().includes(q.toLowerCase()))), [q, qual, customers]);
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginatedCustomers = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filtered.slice(startIndex, startIndex + pageSize);
  }, [filtered, currentPage, pageSize]);
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsx(PageHeader, { eyebrow: "CRM", title: "Distribuidores", subtitle: `${customers.length.toLocaleString("pt-BR")} registros · ${customers.filter((c) => c.status === "active").length.toLocaleString("pt-BR")} ativos`, actions: /* @__PURE__ */ jsx(Button, { size: "sm", onClick: fetchRealData, children: "Atualizar base" }) }),
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
      /* @__PURE__ */ jsx(Button, { size: "sm", variant: "outline", onClick: fetchRealData, children: "Recarregar" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative flex-1 min-w-[240px] max-w-md", children: [
        /* @__PURE__ */ jsx(Search, { className: "pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" }),
        /* @__PURE__ */ jsx(Input, { value: q, onChange: (e) => setQ(e.target.value), placeholder: "Buscar por nome ou identificação…", className: "h-9 pl-8 bg-card/60" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex gap-1.5 flex-wrap", children: ["all", "Bronze", "Prata", "Ouro", "Diamante", "Black"].map((v) => /* @__PURE__ */ jsx("button", { onClick: () => setQual(v), className: cn("rounded-md border border-border px-3 py-1.5 text-xs transition-all", qual === v ? "bg-primary text-primary-foreground border-primary" : "bg-card/40 text-muted-foreground hover:text-foreground"), children: v === "all" ? "Todas qualificações" : v }, v)) }),
      /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "sm", className: "ml-auto gap-1.5", children: [
        /* @__PURE__ */ jsx(Filter, { className: "h-3.5 w-3.5" }),
        " Mais filtros"
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-border bg-card/40 overflow-hidden", children: [
      /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsx("thead", { className: "bg-background/40 text-left", children: /* @__PURE__ */ jsxs("tr", { className: "text-[11px] uppercase tracking-wider text-muted-foreground", children: [
          /* @__PURE__ */ jsx("th", { className: "px-4 py-2.5 font-medium", children: "Distribuidor" }),
          /* @__PURE__ */ jsx("th", { className: "px-4 py-2.5 font-medium", children: "Qualificação" }),
          /* @__PURE__ */ jsx("th", { className: "px-4 py-2.5 font-medium", children: "Status" }),
          /* @__PURE__ */ jsx("th", { className: "px-4 py-2.5 font-medium text-right", children: "Pedidos" }),
          /* @__PURE__ */ jsx("th", { className: "px-4 py-2.5 font-medium text-right", children: "LTV" }),
          /* @__PURE__ */ jsx("th", { className: "px-4 py-2.5 font-medium", children: "Telefone" }),
          /* @__PURE__ */ jsx("th", { className: "px-4 py-2.5 font-medium" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-border/60", children: loading ? Array.from({
          length: pageSize
        }).map((_, idx) => /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: "h-8 w-8 rounded-full bg-muted animate-pulse" }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsx("div", { className: "h-4 w-28 bg-muted rounded animate-pulse" }),
              /* @__PURE__ */ jsx("div", { className: "h-3 w-16 bg-muted rounded animate-pulse" })
            ] })
          ] }) }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsx("div", { className: "h-4 w-12 bg-muted rounded animate-pulse" }) }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsx("div", { className: "h-4 w-16 bg-muted rounded animate-pulse" }) }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ jsx("div", { className: "h-4 w-8 bg-muted rounded animate-pulse ml-auto" }) }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ jsx("div", { className: "h-4 w-14 bg-muted rounded animate-pulse ml-auto" }) }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsx("div", { className: "h-4 w-24 bg-muted rounded animate-pulse" }) }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ jsx("div", { className: "h-4 w-16 bg-muted rounded animate-pulse ml-auto" }) })
        ] }, `skeleton-${idx}`)) : paginatedCustomers.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 7, className: "px-4 py-8 text-center text-muted-foreground text-sm", children: "Nenhum distribuidor encontrado com os filtros atuais." }) }) : paginatedCustomers.map((c) => {
          const stats = orderStats[c.id] || {
            count: 0,
            ltv: 0
          };
          return /* @__PURE__ */ jsxs("tr", { className: "hover:bg-accent/30 transition-colors", children: [
            /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsx("div", { className: "h-8 w-8 rounded-full bg-gradient-to-br from-primary/40 to-fuchsia-500/40 grid place-items-center text-[11px] font-medium text-white shadow-sm", children: getCustomerInitials(c) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(Link, { to: "/customers/$id", params: {
                  id: c.id
                }, className: "font-medium hover:text-primary transition-colors", children: getCustomerLabel(c) }),
                /* @__PURE__ */ jsx("div", { className: "text-[11px] text-muted-foreground", children: c.id_comprador || c.user_id || "-" })
              ] })
            ] }) }),
            /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-[10px]", children: c.qualification || "-" }) }),
            /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsx("span", { className: cn("inline-flex rounded-md border px-1.5 py-0.5 text-[10px] capitalize", statusStyles[c.status || "pending"]), children: c.status || "pending" }) }),
            /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-right tabular-nums", children: stats.count.toLocaleString("pt-BR") }),
            /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-right tabular-nums font-medium text-emerald-500", children: formatBRL(stats.ltv) }),
            /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-xs text-muted-foreground", children: c.telefone || "-" }),
            /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ jsxs(Link, { to: "/customers/$id", params: {
              id: c.id
            }, className: "inline-flex items-center gap-0.5 text-xs text-primary font-medium hover:underline", children: [
              "Abrir 360 ",
              /* @__PURE__ */ jsx(ArrowUpRight, { className: "h-3 w-3" })
            ] }) })
          ] }, c.id);
        }) })
      ] }),
      !loading && totalPages > 1 && /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-4 border-t border-border/60 bg-background/20", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-xs text-muted-foreground", children: [
          "Exibindo ",
          /* @__PURE__ */ jsx("span", { className: "font-semibold text-foreground", children: Math.min(filtered.length, (currentPage - 1) * pageSize + 1) }),
          " a",
          " ",
          /* @__PURE__ */ jsx("span", { className: "font-semibold text-foreground", children: Math.min(filtered.length, currentPage * pageSize) }),
          " de",
          " ",
          /* @__PURE__ */ jsx("span", { className: "font-semibold text-foreground", children: filtered.length }),
          " distribuidores"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsx("span", { children: "Itens por página:" }),
            /* @__PURE__ */ jsx("select", { value: pageSize, onChange: (e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }, className: "bg-card border border-border rounded-md px-2 py-1 text-xs text-foreground focus:ring-1 focus:ring-primary focus:outline-none", children: [10, 15, 25, 50, 100].map((size) => /* @__PURE__ */ jsx("option", { value: size, children: size }, size)) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsx(Button, { variant: "outline", size: "icon", className: "h-8 w-8", onClick: () => setCurrentPage((p) => Math.max(1, p - 1)), disabled: currentPage === 1, children: /* @__PURE__ */ jsx(ChevronLeft, { className: "h-4 w-4" }) }),
            Array.from({
              length: Math.min(5, totalPages)
            }, (_, i) => {
              let pageNum = i + 1;
              if (currentPage > 3) {
                pageNum = currentPage - 3 + i;
              }
              if (pageNum + (4 - i) > totalPages) {
                pageNum = Math.max(1, totalPages - 4 + i);
              }
              if (pageNum > totalPages) return null;
              return /* @__PURE__ */ jsx(Button, { variant: currentPage === pageNum ? "default" : "outline", className: "h-8 w-8 text-xs font-medium", onClick: () => setCurrentPage(pageNum), children: pageNum }, pageNum);
            }),
            /* @__PURE__ */ jsx(Button, { variant: "outline", size: "icon", className: "h-8 w-8", onClick: () => setCurrentPage((p) => Math.min(totalPages, p + 1)), disabled: currentPage === totalPages || totalPages === 0, children: /* @__PURE__ */ jsx(ChevronRight, { className: "h-4 w-4" }) })
          ] })
        ] })
      ] })
    ] })
  ] });
}
export {
  CustomersPage as component
};
