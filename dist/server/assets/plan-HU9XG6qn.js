import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Crown, Check, Sparkles, ArrowUp, History } from "lucide-react";
import { a as Badge, B as Button, c as cn } from "./router-Piw3VGP8.js";
import { P as Progress } from "./progress-B1PovCGf.js";
import { s as supabase } from "./supabase-client-BdpvIS_G.js";
import { g as getPlanRule } from "./mlm-rules-RFBC3uMT.js";
import "@tanstack/react-query";
import "@tanstack/react-router";
import "sonner";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "@radix-ui/react-progress";
import "@supabase/supabase-js";
function formatBRL(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(value);
}
function PlanPage() {
  const [plans, setPlans] = useState([]);
  const [profile, setProfile] = useState(null);
  useEffect(() => {
    let mounted = true;
    void (async () => {
      const [{
        data: plansData
      }, {
        data: profileData
      }] = await Promise.all([supabase.from("plans").select("id, name, price, commission_percent, generations, benefits, is_active, sort_order").eq("is_active", true).order("sort_order", {
        ascending: true
      }), supabase.from("profiles").select("name, created_at").order("created_at", {
        ascending: false
      }).limit(1).maybeSingle()]);
      if (!mounted) return;
      setPlans(plansData || []);
      setProfile(profileData || null);
    })();
    return () => {
      mounted = false;
    };
  }, []);
  const current = plans[0];
  const next = plans[1] || plans[0];
  const createdAt = profile?.created_at ? new Date(profile.created_at).toLocaleDateString("pt-BR") : "-";
  const currentRule = getPlanRule(current?.name);
  const planCards = useMemo(() => plans.slice(0, 4), [plans]);
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl md:text-3xl font-bold tracking-tight", children: "Meu Plano" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Dados reais dos planos ativos no Supabase." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-4", children: [
      /* @__PURE__ */ jsxs(motion.div, { initial: {
        opacity: 0,
        y: 10
      }, animate: {
        opacity: 1,
        y: 0
      }, className: "lg:col-span-2 relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/15 via-fuchsia-500/10 to-transparent p-6", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute -top-20 -right-20 h-60 w-60 rounded-full bg-primary/20 blur-3xl" }),
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxs(Badge, { className: "bg-primary/20 text-primary border-primary/30", children: [
            /* @__PURE__ */ jsx(Crown, { className: "h-3 w-3 mr-1" }),
            " Plano atual"
          ] }),
          /* @__PURE__ */ jsx("h2", { className: "mt-2 text-3xl font-bold", children: current?.name || "Plano ativo" }),
          /* @__PURE__ */ jsxs("p", { className: "mt-1 text-sm text-muted-foreground", children: [
            "Ativo desde ",
            createdAt
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-6 grid grid-cols-3 gap-4", children: [
            /* @__PURE__ */ jsx(Metric, { label: "Bônus máximo", value: `${currentRule?.generationBonuses?.reduce((m, g) => Math.max(m, g.percentage), current?.commission_percent ?? 0) ?? current?.commission_percent ?? 0}%` }),
            /* @__PURE__ */ jsx(Metric, { label: "Gerações", value: String(currentRule?.generationBonuses?.length ?? current?.generations ?? 0) }),
            /* @__PURE__ */ jsx(Metric, { label: "Mensalidade", value: formatBRL(Number(current?.price ?? 0)) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-6", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-xs uppercase tracking-wider text-muted-foreground mb-3", children: "Benefícios" }),
            /* @__PURE__ */ jsx("ul", { className: "grid grid-cols-1 md:grid-cols-2 gap-2", children: (current?.benefits || []).slice(0, 6).map((benefit) => /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-2 text-sm", children: [
              /* @__PURE__ */ jsx(Check, { className: "h-4 w-4 text-success" }),
              " ",
              benefit
            ] }, benefit)) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "rounded-3xl border border-border/60 bg-card/60 p-6", children: [
        /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: "border-border/60", children: [
          /* @__PURE__ */ jsx(Sparkles, { className: "h-3 w-3 mr-1 text-primary" }),
          " Recomendação IA"
        ] }),
        /* @__PURE__ */ jsx("h3", { className: "mt-3 text-lg font-bold", children: next ? `Próximo plano: ${next.name}` : "Sem recomendação disponível" }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "A recomendação agora é baseada somente nos planos reais ativos." }),
        /* @__PURE__ */ jsxs("div", { className: "mt-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-xs mb-1.5", children: [
            /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Projeção de ganho" }),
            /* @__PURE__ */ jsx("span", { className: "font-semibold text-success", children: "+0%" })
          ] }),
          /* @__PURE__ */ jsx(Progress, { value: current ? 72 : 0, className: "h-1.5" })
        ] }),
        /* @__PURE__ */ jsxs(Button, { className: "mt-4 w-full gap-2 bg-gradient-to-r from-primary to-fuchsia-500", children: [
          /* @__PURE__ */ jsx(ArrowUp, { className: "h-3.5 w-3.5" }),
          " Fazer upgrade"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold mb-3", children: "Comparação de planos" }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: planCards.map((plan, index) => {
        const rule = getPlanRule(plan.name);
        return /* @__PURE__ */ jsxs(motion.div, { whileHover: {
          y: -4
        }, className: cn("relative rounded-2xl border p-5", index === 0 ? "border-primary/40 bg-primary/5" : index === 1 ? "border-fuchsia-500/40 bg-gradient-to-br from-fuchsia-500/10 to-transparent" : "border-border/60 bg-card/60"), children: [
          index === 0 && /* @__PURE__ */ jsx(Badge, { className: "absolute top-3 right-3 bg-primary/20 text-primary border-primary/30 text-[10px]", children: "Atual" }),
          index === 1 && /* @__PURE__ */ jsx(Badge, { className: "absolute top-3 right-3 bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30 text-[10px]", children: "Topo" }),
          /* @__PURE__ */ jsx("h4", { className: "text-lg font-bold", children: plan.name }),
          /* @__PURE__ */ jsxs("p", { className: "mt-1 text-2xl font-bold", children: [
            formatBRL(Number(plan.price || 0)),
            /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground font-normal", children: "/mês" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-3 flex gap-3 text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxs("span", { children: [
              "Bônus ",
              rule?.generationBonuses?.map((g) => g.percentage).join("/") || `${plan.commission_percent ?? 0}`,
              "%"
            ] }),
            /* @__PURE__ */ jsx("span", { children: "·" }),
            /* @__PURE__ */ jsxs("span", { children: [
              rule?.generationBonuses?.length ?? plan.generations ?? 0,
              " gerações"
            ] })
          ] }),
          /* @__PURE__ */ jsx("ul", { className: "mt-4 space-y-1.5 text-xs", children: (plan.benefits || []).slice(0, 4).map((benefit) => /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-1.5", children: [
            /* @__PURE__ */ jsx(Check, { className: "h-3 w-3 mt-0.5 text-success shrink-0" }),
            " ",
            benefit
          ] }, benefit)) }),
          index !== 0 && /* @__PURE__ */ jsx(Button, { size: "sm", variant: "outline", className: "mt-4 w-full", children: "Selecionar" })
        ] }, plan.id);
      }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-border/60 bg-card/60 p-5", children: [
      /* @__PURE__ */ jsxs("h3", { className: "text-sm font-semibold flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(History, { className: "h-4 w-4" }),
        " Histórico de upgrades"
      ] }),
      /* @__PURE__ */ jsx("p", { className: "mt-3 text-sm text-muted-foreground", children: "Esse histórico ainda depende de uma tabela específica de upgrades. A tela já não usa mais dados fictícios de plano." })
    ] })
  ] });
}
function Metric({
  label,
  value
}) {
  return /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-border/60 bg-background/40 p-3", children: [
    /* @__PURE__ */ jsx("p", { className: "text-[10px] text-muted-foreground uppercase tracking-wider", children: label }),
    /* @__PURE__ */ jsx("p", { className: "mt-1 text-xl font-bold", children: value })
  ] });
}
export {
  PlanPage as component
};
