import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useMemo } from "react";
import { Download, Play, Clock, Sparkles, Info, Search } from "lucide-react";
import { a as Badge, B as Button } from "./router-Piw3VGP8.js";
import { I as Input } from "./input-QP3DCRKc.js";
import { P as Progress } from "./progress-B1PovCGf.js";
import { toast } from "sonner";
import "@tanstack/react-query";
import "@tanstack/react-router";
import "./supabase-client-BdpvIS_G.js";
import "@supabase/supabase-js";
import "framer-motion";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "@radix-ui/react-progress";
function DownloadsPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [favorites] = useState([]);
  const videoProgress = 65;
  const items = useMemo(() => [{
    id: "p1",
    title: "Guia de Produto",
    category: "treinamento"
  }, {
    id: "p2",
    title: "Kit de Campanha",
    category: "campanha"
  }, {
    id: "p3",
    title: "Estratégia de Vendas",
    category: "estratégia"
  }], []);
  const filteredLibrary = items.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) || item.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "all" || item.category === activeCategory || activeCategory === "favorites" && favorites.includes(item.id);
    return matchesSearch && matchesCategory;
  });
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsx("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4", children: /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs("h1", { className: "text-3xl font-bold tracking-tight text-white flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Download, { className: "h-8 w-8 text-primary shrink-0" }),
        " Biblioteca & Onboarding"
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm mt-1", children: "A lista foi reduzida para itens neutros enquanto o catálogo real é conectado ao Supabase." })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 rounded-2xl border border-border/60 bg-[#06090f] p-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-b border-border/40 pb-3 mb-4", children: [
          /* @__PURE__ */ jsxs("span", { className: "text-xs font-semibold text-primary uppercase tracking-wider flex items-center gap-1.5 font-mono", children: [
            /* @__PURE__ */ jsx(Play, { className: "h-3 w-3 fill-primary text-primary" }),
            " Onboarding"
          ] }),
          /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-[10px] border-emerald-500/20 text-emerald-400 bg-emerald-500/5", children: "Ativo" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1.5 pt-1", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-xs", children: [
            /* @__PURE__ */ jsxs("span", { className: "text-muted-foreground flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(Clock, { className: "h-3.5 w-3.5" }),
              " Progresso"
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "font-semibold text-white", children: [
              videoProgress,
              "% completo"
            ] })
          ] }),
          /* @__PURE__ */ jsx(Progress, { value: videoProgress, className: "h-1.5" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-border/60 bg-card/60 p-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 border-b border-border/40 pb-3", children: [
            /* @__PURE__ */ jsx(Sparkles, { className: "h-5 w-5 text-primary shrink-0" }),
            /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-white uppercase tracking-wider font-mono", children: "Indicações" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: "A biblioteca de apoio será preenchida com conteúdo real em outra tabela ou storage." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-primary/5 rounded-xl border border-primary/20 p-3 flex items-center gap-2 text-[10px] text-muted-foreground font-mono mt-4", children: [
          /* @__PURE__ */ jsx(Info, { className: "h-4 w-4 text-primary shrink-0" }),
          /* @__PURE__ */ jsx("span", { children: "Downloads concluídos geram pontos de qualificação residual (PV)." })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative w-full sm:max-w-xs", children: [
        /* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" }),
        /* @__PURE__ */ jsx(Input, { value: search, onChange: (e) => setSearch(e.target.value), type: "text", placeholder: "Buscar treinamentos...", className: "pl-9 h-9 text-xs" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1", children: ["all", "treinamento", "estratégia", "campanha", "favorites"].map((cat) => /* @__PURE__ */ jsx(Button, { variant: activeCategory === cat ? "default" : "outline", size: "sm", onClick: () => setActiveCategory(cat), className: "h-8 text-[11px] px-3 font-medium", children: cat === "all" ? "Todos" : cat }, cat)) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: filteredLibrary.map((item) => /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-border/60 bg-card/60 p-4 flex flex-col justify-between min-h-[160px]", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-[10px]", children: item.category }),
        /* @__PURE__ */ jsx("h3", { className: "mt-2 text-sm font-semibold text-white", children: item.title })
      ] }),
      /* @__PURE__ */ jsxs(Button, { size: "sm", variant: "outline", className: "mt-4 w-full gap-2", onClick: () => toast.success("Download preparado em fluxo real."), children: [
        /* @__PURE__ */ jsx(Download, { className: "h-3.5 w-3.5" }),
        " Baixar"
      ] })
    ] }, item.id)) })
  ] });
}
export {
  DownloadsPage as component
};
