import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { P as PageHeader } from "./page-header-DZhedIL1.js";
import { p as productsService, a as Badge } from "./router-OVqp2Aj1.js";
import { AlertTriangle } from "lucide-react";
import "@tanstack/react-query";
import "@tanstack/react-router";
import "./supabase-client-BdpvIS_G.js";
import "@supabase/supabase-js";
import "./roles-DEW722fr.js";
import "framer-motion";
import "sonner";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
function ProductsPage() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    (async () => {
      setProducts(await productsService.getAllProducts());
    })();
  }, []);
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsx(PageHeader, { eyebrow: "Comercial", title: "Catálogo de produtos", subtitle: "Dados reais vindos do Supabase." }),
    /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-2 xl:grid-cols-3 gap-3", children: products.map((p) => {
      const low = Number(p.stock || 0) < 200;
      const out = Number(p.stock || 0) === 0;
      return /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-border bg-card/60 p-4 hover:bg-card transition-colors", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground", children: [
              p.categorias || p.category || "-",
              " · ",
              p.sku || "-"
            ] }),
            /* @__PURE__ */ jsx("h3", { className: "text-base font-semibold mt-0.5", children: p.caption || p.name })
          ] }),
          /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "capitalize text-[10px]", children: out ? "sem estoque" : "ativo" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 text-xs text-muted-foreground", children: p.caption2 || p.description }),
        /* @__PURE__ */ jsxs("div", { className: "mt-4 grid grid-cols-3 gap-2 text-center", children: [
          /* @__PURE__ */ jsxs("div", { className: "rounded-md border border-border bg-background/40 p-2", children: [
            /* @__PURE__ */ jsx("p", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: "Preço" }),
            /* @__PURE__ */ jsxs("p", { className: "text-sm font-semibold tabular-nums", children: [
              "R$ ",
              Number(p.price || 0).toLocaleString("pt-BR", {
                minimumFractionDigits: 2
              })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-md border border-border bg-background/40 p-2", children: [
            /* @__PURE__ */ jsx("p", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: "Bônus" }),
            /* @__PURE__ */ jsxs("p", { className: "text-sm font-semibold text-primary", children: [
              p.metadata?.bonus_payment_percentage || p.bonus_payment_percentage || 0,
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: `rounded-md border p-2 ${out ? "border-destructive/40 bg-destructive/10" : low ? "border-warning/40 bg-warning/10" : "border-border bg-background/40"}`, children: [
            /* @__PURE__ */ jsx("p", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: "Estoque" }),
            /* @__PURE__ */ jsx("p", { className: `text-sm font-semibold tabular-nums ${out ? "text-destructive" : low ? "text-warning" : ""}`, children: p.stock || 0 })
          ] })
        ] }),
        out && /* @__PURE__ */ jsxs("p", { className: "mt-3 inline-flex items-center gap-1 text-xs text-destructive", children: [
          /* @__PURE__ */ jsx(AlertTriangle, { className: "h-3 w-3" }),
          " Sem estoque"
        ] })
      ] }, p.id);
    }) })
  ] });
}
export {
  ProductsPage as component
};
