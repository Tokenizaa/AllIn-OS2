import { jsxs, jsx } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { P as PageHeader } from "./page-header-BiG0inxH.js";
import { s as supabase } from "./supabase-client-BdpvIS_G.js";
import "lucide-react";
import "./router-C3cuB5ui.js";
import "@tanstack/react-query";
import "./roles-DEW722fr.js";
import "framer-motion";
import "sonner";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "@supabase/supabase-js";
const statusColor = {
  pago: "bg-success/15 text-success border-success/30",
  pendente: "bg-warning/15 text-warning border-warning/30",
  enviado: "bg-info/15 text-info border-info/30",
  entregue: "bg-success/15 text-success border-success/30",
  cancelado: "bg-destructive/15 text-destructive border-destructive/30"
};
function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  useEffect(() => {
    (async () => {
      const [{
        data: ordersData
      }, {
        data: customersData
      }] = await Promise.all([supabase.from("orders").select("*").order("created_at", {
        ascending: false
      }).limit(60), supabase.from("customers").select("id, usuario, id_comprador, user_id, qualification, telefone, metadata, name").order("created_at", {
        ascending: false
      })]);
      setOrders(ordersData || []);
      setCustomers(customersData || []);
    })();
  }, []);
  const total = orders.reduce((sum, o) => sum + Number(o.valor_total_pedido || o.valor_total || 0), 0);
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsx(PageHeader, { eyebrow: "Comercial", title: "Pedidos", subtitle: `${orders.length} pedidos no período · R$ ${total.toLocaleString("pt-BR", {
      minimumFractionDigits: 2
    })} em receita bruta` }),
    /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-border bg-card/40 overflow-hidden", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsx("thead", { className: "bg-background/40 text-[11px] uppercase tracking-wider text-muted-foreground", children: /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("th", { className: "px-4 py-2.5 text-left", children: "Pedido" }),
        /* @__PURE__ */ jsx("th", { className: "px-4 py-2.5 text-left", children: "Cliente" }),
        /* @__PURE__ */ jsx("th", { className: "px-4 py-2.5 text-left", children: "Status" }),
        /* @__PURE__ */ jsx("th", { className: "px-4 py-2.5 text-left", children: "Pagamento" }),
        /* @__PURE__ */ jsx("th", { className: "px-4 py-2.5 text-right", children: "Itens" }),
        /* @__PURE__ */ jsx("th", { className: "px-4 py-2.5 text-right", children: "Total" }),
        /* @__PURE__ */ jsx("th", { className: "px-4 py-2.5 text-left", children: "Data" })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-border/60", children: orders.map((o) => {
        const customer = customers.find((x) => x.id === o.customer_id);
        const customerLabel = customer?.name || customer?.usuario || customer?.id_comprador || customer?.user_id || customer?.id || o.customer_id;
        return /* @__PURE__ */ jsxs("tr", { className: "hover:bg-accent/30", children: [
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 font-mono text-xs", children: o.numero_pedido || o.id }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: customer ? /* @__PURE__ */ jsx(Link, { to: "/customers/$id", params: {
            id: customer.id
          }, className: "hover:text-primary", children: customerLabel }) : o.customer_id || "-" }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsx("span", { className: `inline-flex rounded-md border px-1.5 py-0.5 text-[10px] capitalize ${statusColor[o.status_pedido || "pendente"]}`, children: o.status_pedido || "pendente" }) }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-xs text-muted-foreground", children: o.payment_method || "-" }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-right tabular-nums", children: Array.isArray(o.items) ? o.items.length : 0 }),
          /* @__PURE__ */ jsxs("td", { className: "px-4 py-3 text-right tabular-nums font-medium", children: [
            "R$ ",
            Number(o.valor_total_pedido || o.valor_total || 0).toLocaleString("pt-BR", {
              minimumFractionDigits: 2
            })
          ] }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-xs text-muted-foreground", children: o.created_at ? new Date(o.created_at).toLocaleDateString("pt-BR") : "-" })
        ] }, o.id);
      }) })
    ] }) })
  ] });
}
export {
  OrdersPage as component
};
