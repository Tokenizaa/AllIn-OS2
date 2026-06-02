import { jsxs, jsx } from "react/jsx-runtime";
import { P as PageHeader } from "./page-header-BiG0inxH.js";
import { L as Label, S as Switch } from "./switch-DujuU3ID.js";
import "lucide-react";
import "./router-C3cuB5ui.js";
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
import "@radix-ui/react-label";
import "@radix-ui/react-switch";
function SettingsPage() {
  const flags = [{
    id: "ai_copilot",
    label: "Copiloto IA habilitado",
    desc: "Ativa o painel de assistência inteligente em toda a plataforma."
  }, {
    id: "anomaly_engine",
    label: "Motor de anomalias",
    desc: "Detecção automática de outliers em transações e operações."
  }, {
    id: "auto_workflows",
    label: "Workflows automáticos",
    desc: "Permite que a IA dispare automações baseadas em sinais."
  }, {
    id: "realtime",
    label: "Realtime everywhere",
    desc: "Eventos em tempo real para todas as entidades operacionais."
  }];
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsx(PageHeader, { eyebrow: "Sistema", title: "Configurações", subtitle: "Feature flags, tenant, integrações e preferências da plataforma." }),
    /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-border bg-card/60 p-5 space-y-4", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold", children: "Feature flags" }),
      flags.map((f) => /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-4 py-2 border-t border-border/60 first:border-t-0", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: f.id, className: "text-sm", children: f.label }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: f.desc })
        ] }),
        /* @__PURE__ */ jsx(Switch, { id: f.id, defaultChecked: true })
      ] }, f.id))
    ] })
  ] });
}
export {
  SettingsPage as component
};
