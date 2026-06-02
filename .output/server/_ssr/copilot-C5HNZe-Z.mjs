import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { P as PageHeader } from "./page-header-R4VVQEB2.mjs";
import { B as Button } from "./router-BZaVudxP.mjs";
import "../_libs/sonner.mjs";
import { q as Sparkles, k as TrendingUp, ac as TriangleAlert, ad as Workflow } from "../_libs/lucide-react.mjs";

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
import "./supabase-client-BdpvIS_G.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/tslib.mjs";
import "../_libs/supabase__functions-js.mjs";
import "./roles-DEW722fr.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/framer-motion.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
const prompts = [{
  icon: TrendingUp,
  title: "Resumir performance da última semana",
  category: "Executivo"
}, {
  icon: TriangleAlert,
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { eyebrow: "Intelligence", title: "Copiloto Allin", subtitle: "Action-driven · Multi-tenant · Conhece toda a operação." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-background to-fuchsia-500/5 p-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-fuchsia-500 grid place-items-center text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold", children: "Como posso ajudar você hoje?" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Faça perguntas em linguagem natural ou execute ações operacionais." })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "flex-1 rounded-lg border border-border bg-background/80 px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40", placeholder: "Ex.: gere o relatório de comissões do último ciclo e me mostre anomalias…" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { children: "Enviar" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid md:grid-cols-2 gap-3", children: prompts.map((p) => {
      const Icon = p.icon;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "text-left rounded-xl border border-border bg-card/60 p-4 hover:bg-card transition-colors", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4 text-primary" }),
          " ",
          p.category
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1.5 text-sm font-medium", children: p.title })
      ] }, p.title);
    }) })
  ] });
}
export {
  CopilotPage as component
};
