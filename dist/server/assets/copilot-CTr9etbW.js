import { jsxs, jsx } from "react/jsx-runtime";
import { P as PageHeader } from "./page-header-BiG0inxH.js";
import { Sparkles, TrendingUp, AlertTriangle, Workflow } from "lucide-react";
import { B as Button } from "./router-C3cuB5ui.js";
import "@tanstack/react-query";
import "@tanstack/react-router";
import "react";
import "./supabase-client-BdpvIS_G.js";
import "@supabase/supabase-js";
import "./roles-DEW722fr.js";
import "framer-motion";
import "sonner";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
const prompts = [{
  icon: TrendingUp,
  title: "Resumir performance da última semana",
  category: "Executivo"
}, {
  icon: AlertTriangle,
  title: "Quais distribuidores estão prestes a churnar?",
  category: "CRM"
}, {
  icon: Workflow,
  title: "Sugira automação de recompra para Bronze",
  category: "Automação"
}, {
  icon: Sparkles,
  title: "Onde aumentar estoque agora?",
  category: "Comercial"
}];
function CopilotPage() {
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsx(PageHeader, { eyebrow: "Intelligence", title: "Copiloto Allin", subtitle: "Action-driven · Multi-tenant · Conhece toda a operação." }),
    /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-background to-fuchsia-500/5 p-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
        /* @__PURE__ */ jsx("div", { className: "h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-fuchsia-500 grid place-items-center text-white", children: /* @__PURE__ */ jsx(Sparkles, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold", children: "Como posso ajudar você hoje?" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Faça perguntas em linguagem natural ou execute ações operacionais." })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsx("input", { className: "flex-1 rounded-lg border border-border bg-background/80 px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40", placeholder: "Ex.: gere o relatório de comissões do último ciclo e me mostre anomalias…" }),
        /* @__PURE__ */ jsx(Button, { children: "Enviar" })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-2 gap-3", children: prompts.map((p) => {
      const Icon = p.icon;
      return /* @__PURE__ */ jsxs("button", { className: "text-left rounded-xl border border-border bg-card/60 p-4 hover:bg-card transition-colors", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs text-muted-foreground", children: [
          /* @__PURE__ */ jsx(Icon, { className: "h-4 w-4 text-primary" }),
          " ",
          p.category
        ] }),
        /* @__PURE__ */ jsx("p", { className: "mt-1.5 text-sm font-medium", children: p.title })
      ] }, p.title);
    }) })
  ] });
}
export {
  CopilotPage as component
};
