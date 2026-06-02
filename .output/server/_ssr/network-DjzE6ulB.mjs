import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { B as Button, a as Badge } from "./router-BZaVudxP.mjs";
import { I as Input } from "./input-D1i_JeqC.mjs";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-DH3dyAiq.mjs";
import { s as supabase } from "./supabase-client-BdpvIS_G.mjs";
import { g as getCustomerLabel } from "./customer-label-CvKl2zbr.mjs";
import "../_libs/sonner.mjs";
import { N as Network, az as GitMerge, a5 as UserPlus, U as Users, k as TrendingUp, q as Sparkles, x as ChartColumn, F as Search } from "../_libs/lucide-react.mjs";

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
import "../_libs/radix-ui__react-tabs.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-roving-focus.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/radix-ui__react-presence.mjs";
function NetworkPage() {
  const [nodes, setNodes] = reactExports.useState([]);
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [activeFilter, setActiveFilter] = reactExports.useState("all");
  reactExports.useEffect(() => {
    let mounted = true;
    void (async () => {
      const {
        data
      } = await supabase.from("customers").select("id, usuario, id_comprador, user_id, qualification, status, cidade, estado, name").limit(500);
      if (!mounted) return;
      setNodes(data || []);
    })();
    return () => {
      mounted = false;
    };
  }, []);
  const filtered = reactExports.useMemo(() => {
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-3xl font-bold tracking-tight text-white flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Network, { className: "h-8 w-8 text-primary shrink-0" }),
          " Minha Rede"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-1", children: "Base real: customers + network_relationships." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", className: "gap-2 border-border/60", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(GitMerge, { className: "h-4 w-4" }),
          " Exportar"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", className: "gap-2 bg-gradient-to-r from-primary to-fuchsia-500", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "h-4 w-4" }),
          " Cadastrar"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { label: "Rede total", value: String(total), icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-4 w-4 text-emerald-400" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { label: "Ativos", value: String(nodes.filter((n) => n.status !== "inactive").length), icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-4 w-4 text-fuchsia-400" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { label: "Qualificados", value: String(nodes.filter((n) => String(n.qualification || "").length > 0).length), icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-4 w-4 text-amber-400" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { label: "Inativos", value: String(nodes.filter((n) => n.status === "inactive").length), icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-4 w-4 text-rose-400" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "linear", className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "bg-background border border-border/50", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "linear", className: "gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-4 w-4" }),
          " Rede Linear"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "analytics", className: "gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "h-4 w-4" }),
          " Analytics"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "linear", className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 md:w-64", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), placeholder: "Buscar distribuidor...", className: "pl-9 h-9" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: activeFilter === "all" ? "default" : "outline", size: "sm", onClick: () => setActiveFilter("all"), children: "Todos" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: activeFilter === "active" ? "default" : "outline", size: "sm", onClick: () => setActiveFilter("active"), children: "Ativos" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: activeFilter === "leader" ? "default" : "outline", size: "sm", onClick: () => setActiveFilter("leader"), children: "Líderes" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: activeFilter === "critical" ? "default" : "outline", size: "sm", onClick: () => setActiveFilter("critical"), children: "Risco" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl border border-border/60 bg-card/40 p-1 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left border-collapse", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border/40 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider bg-black/20", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4", children: "Distribuidor" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4", children: "Qualificação" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4", children: "Cidade" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4", children: "Status" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border/20", children: filtered.map((node) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-muted/10 transition-colors", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-4 font-semibold text-white", children: getCustomerLabel(node) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", children: node.qualification || "-" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-4", children: [node.cidade, node.estado].filter(Boolean).join("/") || "-" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-4", children: node.status || "-" })
          ] }, node.id)) })
        ] }) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "analytics", className: "rounded-2xl border border-border/60 bg-card/60 p-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Analytics simplificado baseado em registros reais." }) })
    ] })
  ] });
}
function Card({
  label,
  value,
  icon
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border/60 bg-card/60 p-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-muted-foreground", children: label }),
      icon
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-2xl font-bold text-white", children: value })
  ] });
}
export {
  NetworkPage as component
};
