import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect, useMemo } from "react";
import { ShoppingBag, Truck, Search, Filter, Download, RotateCcw } from "lucide-react";
import { B as Button, a as Badge } from "./router-OVqp2Aj1.js";
import { I as Input } from "./input-DlRe9qBQ.js";
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
const statusColors = {
  pago: "bg-success/15 text-success border-success/30",
  entregue: "bg-primary/15 text-primary border-primary/30",
  enviado: "bg-info/15 text-info border-info/30",
  pendente: "bg-warning/15 text-warning border-warning/30",
  cancelado: "bg-destructive/15 text-destructive border-destructive/30"
};
function formatBRL(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(value);
}
function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  useEffect(() => {
    let mounted = true;
    void (async () => {
      const {
        data
      } = await supabase.from("orders").select("id, order_number, status, order_type, payment_method, total_amount, customer_name, created_at").order("created_at", {
        ascending: false
      }).limit(200);
      if (mounted) setOrders(data || []);
    })();
    return () => {
      mounted = false;
    };
  }, []);
  const filteredOrders = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return orders;
    return orders.filter((order) => {
      return [order.order_number, order.customer_name, order.status, order.order_type, order.payment_method].filter(Boolean).some((value) => String(value).toLowerCase().includes(q));
    });
  }, [orders, search]);
  const total = filteredOrders.reduce((sum, order) => sum + Number(order.total_amount || 0), 0);
  const ticket = filteredOrders.length ? total / filteredOrders.length : 0;
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl md:text-3xl font-bold tracking-tight", children: "Meus Pedidos" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Pedidos reais carregados do Supabase." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [
      /* @__PURE__ */ jsx(StatCard, { label: "Total comprado", value: formatBRL(total), delta: 0, icon: ShoppingBag, accent: "primary" }),
      /* @__PURE__ */ jsx(StatCard, { label: "Ticket médio", value: formatBRL(ticket), delta: 0, accent: "info" }),
      /* @__PURE__ */ jsx(StatCard, { label: "Pedidos no mês", value: String(filteredOrders.length), delta: 0, accent: "success" }),
      /* @__PURE__ */ jsx(StatCard, { label: "Em trânsito", value: String(filteredOrders.filter((o) => o.status === "enviado").length), accent: "warning", icon: Truck })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-border/60 bg-card/60", children: [
      /* @__PURE__ */ jsxs("div", { className: "p-4 flex flex-wrap items-center gap-2 border-b border-border/60", children: [
        /* @__PURE__ */ jsxs("div", { className: "relative flex-1 min-w-[240px]", children: [
          /* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
          /* @__PURE__ */ jsx(Input, { value: search, onChange: (e) => setSearch(e.target.value), placeholder: "Buscar por pedido, cliente, status...", className: "pl-9 bg-muted/40" })
        ] }),
        /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "sm", className: "gap-2", children: [
          /* @__PURE__ */ jsx(Filter, { className: "h-3.5 w-3.5" }),
          " Filtros"
        ] }),
        /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "sm", className: "gap-2", children: [
          /* @__PURE__ */ jsx(Download, { className: "h-3.5 w-3.5" }),
          " Exportar"
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsx("thead", { className: "text-xs text-muted-foreground uppercase tracking-wider", children: /* @__PURE__ */ jsxs("tr", { className: "border-b border-border/60", children: [
          /* @__PURE__ */ jsx("th", { className: "text-left font-medium px-4 py-3", children: "Pedido" }),
          /* @__PURE__ */ jsx("th", { className: "text-left font-medium px-4 py-3", children: "Cliente" }),
          /* @__PURE__ */ jsx("th", { className: "text-left font-medium px-4 py-3", children: "Status" }),
          /* @__PURE__ */ jsx("th", { className: "text-left font-medium px-4 py-3", children: "Tipo" }),
          /* @__PURE__ */ jsx("th", { className: "text-left font-medium px-4 py-3", children: "Pagamento" }),
          /* @__PURE__ */ jsx("th", { className: "text-right font-medium px-4 py-3", children: "Total" }),
          /* @__PURE__ */ jsx("th", { className: "px-4 py-3" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { children: filteredOrders.map((order) => /* @__PURE__ */ jsxs("tr", { className: "border-b border-border/40 hover:bg-muted/30 transition-colors", children: [
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 font-mono text-xs", children: order.order_number || order.id }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: order.customer_name || "-" }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsx(Badge, { variant: "outline", className: statusColors[String(order.status || "pendente")] || statusColors.pendente, children: order.status || "pendente" }) }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-xs text-muted-foreground capitalize", children: order.order_type || "-" }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-xs", children: order.payment_method || "-" }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-right font-semibold", children: formatBRL(Number(order.total_amount || 0)) }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ jsxs(Button, { size: "sm", variant: "ghost", className: "h-7 gap-1.5 text-xs", children: [
            /* @__PURE__ */ jsx(RotateCcw, { className: "h-3 w-3" }),
            " Reorder"
          ] }) })
        ] }, order.id)) })
      ] }) })
    ] })
  ] });
}
export {
  OrdersPage as component
};
