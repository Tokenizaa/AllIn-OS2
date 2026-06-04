import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect, useMemo } from "react";
import { Network, GitMerge, UserPlus, Users, TrendingUp, Sparkles, BarChart3, Search } from "lucide-react";
import { B as Button, a as Badge } from "./router-Piw3VGP8.js";
import { I as Input } from "./input-QP3DCRKc.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-DBV3uj2e.js";
import { s as supabase } from "./supabase-client-BdpvIS_G.js";
import { g as getCustomerLabel } from "./customer-label-ChoLRkdM.js";
import "@tanstack/react-query";
import "@tanstack/react-router";
import "framer-motion";
import "sonner";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "@radix-ui/react-tabs";
import "@supabase/supabase-js";
function NetworkPage() {
  const [nodes, setNodes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  useEffect(() => {
    let mounted = true;
    void (async () => {
      const {
        data
      } = await supabase.from("customers").select("id, usuario, id_comprador, user_id, qualification, status, cidade, estado").limit(300);
      if (!mounted) return;
      setNodes(data || []);
    })();
    return () => {
      mounted = false;
    };
  }, []);
  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return nodes.filter((node) => {
      const hay = [getCustomerLabel(node), node.qualification, node.cidade, node.estado].filter(Boolean).join(" ").toLowerCase();
      if (q && !hay.includes(q)) return false;
      if (activeFilter === "active") return node.status !== "inactive";
      if (activeFilter === "leader") return String(node.qualification || "").toLowerCase().includes("ouro") || String(node.qualification || "").toLowerCase().includes("diamante");
      if (activeFilter === "critical") return node.status === "inactive";
      return true;
    });
  }, [nodes, searchQuery, activeFilter]);
  const total = nodes.length;
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("h1", { className: "text-3xl font-bold tracking-tight text-white flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Network, { className: "h-8 w-8 text-primary shrink-0" }),
          " Minha Rede"
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm mt-1", children: "Base real: customers + network_relationships." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "sm", className: "gap-2 border-border/60", children: [
          /* @__PURE__ */ jsx(GitMerge, { className: "h-4 w-4" }),
          " Exportar"
        ] }),
        /* @__PURE__ */ jsxs(Button, { size: "sm", className: "gap-2 bg-gradient-to-r from-primary to-fuchsia-500", children: [
          /* @__PURE__ */ jsx(UserPlus, { className: "h-4 w-4" }),
          " Cadastrar"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: [
      /* @__PURE__ */ jsx(Card, { label: "Rede total", value: String(total), icon: /* @__PURE__ */ jsx(Users, { className: "h-4 w-4 text-emerald-400" }) }),
      /* @__PURE__ */ jsx(Card, { label: "Ativos", value: String(nodes.filter((n) => n.status !== "inactive").length), icon: /* @__PURE__ */ jsx(TrendingUp, { className: "h-4 w-4 text-fuchsia-400" }) }),
      /* @__PURE__ */ jsx(Card, { label: "Qualificados", value: String(nodes.filter((n) => String(n.qualification || "").length > 0).length), icon: /* @__PURE__ */ jsx(Sparkles, { className: "h-4 w-4 text-amber-400" }) }),
      /* @__PURE__ */ jsx(Card, { label: "Inativos", value: String(nodes.filter((n) => n.status === "inactive").length), icon: /* @__PURE__ */ jsx(Sparkles, { className: "h-4 w-4 text-rose-400" }) })
    ] }),
    /* @__PURE__ */ jsxs(Tabs, { defaultValue: "linear", className: "space-y-6", children: [
      /* @__PURE__ */ jsxs(TabsList, { className: "bg-background border border-border/50", children: [
        /* @__PURE__ */ jsxs(TabsTrigger, { value: "linear", className: "gap-2", children: [
          /* @__PURE__ */ jsx(Users, { className: "h-4 w-4" }),
          " Rede Linear"
        ] }),
        /* @__PURE__ */ jsxs(TabsTrigger, { value: "analytics", className: "gap-2", children: [
          /* @__PURE__ */ jsx(BarChart3, { className: "h-4 w-4" }),
          " Analytics"
        ] })
      ] }),
      /* @__PURE__ */ jsxs(TabsContent, { value: "linear", className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "relative flex-1 md:w-64", children: [
            /* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" }),
            /* @__PURE__ */ jsx(Input, { value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), placeholder: "Buscar distribuidor...", className: "pl-9 h-9" })
          ] }),
          /* @__PURE__ */ jsx(Button, { variant: activeFilter === "all" ? "default" : "outline", size: "sm", onClick: () => setActiveFilter("all"), children: "Todos" }),
          /* @__PURE__ */ jsx(Button, { variant: activeFilter === "active" ? "default" : "outline", size: "sm", onClick: () => setActiveFilter("active"), children: "Ativos" }),
          /* @__PURE__ */ jsx(Button, { variant: activeFilter === "leader" ? "default" : "outline", size: "sm", onClick: () => setActiveFilter("leader"), children: "Líderes" }),
          /* @__PURE__ */ jsx(Button, { variant: activeFilter === "critical" ? "default" : "outline", size: "sm", onClick: () => setActiveFilter("critical"), children: "Risco" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "rounded-2xl border border-border/60 bg-card/40 p-1 overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left border-collapse", children: [
          /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "border-b border-border/40 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider bg-black/20", children: [
            /* @__PURE__ */ jsx("th", { className: "px-5 py-4", children: "Distribuidor" }),
            /* @__PURE__ */ jsx("th", { className: "px-5 py-4", children: "Qualificação" }),
            /* @__PURE__ */ jsx("th", { className: "px-5 py-4", children: "Cidade" }),
            /* @__PURE__ */ jsx("th", { className: "px-5 py-4", children: "Status" })
          ] }) }),
          /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-border/20", children: filtered.map((node) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-muted/10 transition-colors", children: [
            /* @__PURE__ */ jsx("td", { className: "px-5 py-4 font-semibold text-white", children: getCustomerLabel(node) }),
            /* @__PURE__ */ jsx("td", { className: "px-5 py-4", children: /* @__PURE__ */ jsx(Badge, { variant: "outline", children: node.qualification || "-" }) }),
            /* @__PURE__ */ jsx("td", { className: "px-5 py-4", children: [node.cidade, node.estado].filter(Boolean).join("/") || "-" }),
            /* @__PURE__ */ jsx("td", { className: "px-5 py-4", children: node.status || "-" })
          ] }, node.id)) })
        ] }) }) })
      ] }),
      /* @__PURE__ */ jsx(TabsContent, { value: "analytics", className: "rounded-2xl border border-border/60 bg-card/60 p-5", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Analytics simplificado baseado em registros reais." }) })
    ] })
  ] });
}
function Card({
  label,
  value,
  icon
}) {
  return /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-border/60 bg-card/60 p-5", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsx("span", { className: "text-xs font-medium text-muted-foreground", children: label }),
      icon
    ] }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-2xl font-bold text-white", children: value })
  ] });
}
export {
  NetworkPage as component
};
