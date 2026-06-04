import { jsxs, jsx } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { c as createSsrRpc } from "./createSsrRpc-KmjJ5KSm.js";
import { a as createServerFn } from "./server-8ECQmlZz.js";
import { z } from "zod";
import { C as Card, b as CardHeader, c as CardTitle, d as CardDescription, a as CardContent, e as CardFooter } from "./card-Cyhv06K2.js";
import { a as Badge, B as Button } from "./router-Piw3VGP8.js";
import { Star, TrendingUp, Users, Check, AlertTriangle, Zap, ArrowRight, Plus, Activity, DollarSign } from "lucide-react";
import "node:async_hooks";
import "h3-v2";
import "@tanstack/router-core";
import "seroval";
import "@tanstack/history";
import "@tanstack/router-core/ssr/client";
import "@tanstack/router-core/ssr/server";
import "react";
import "@tanstack/react-router";
import "@tanstack/react-router/ssr/server";
import "./supabase-client-BdpvIS_G.js";
import "@supabase/supabase-js";
import "framer-motion";
import "sonner";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
const getAllPlans = createServerFn({
  method: "GET"
}).handler(createSsrRpc("18b86dd39a0847c4987ec96c969d7c136e5c7de7c656c0969b0fa38f39bb6c35"));
createServerFn({
  method: "POST"
}).inputValidator(z.object({
  slug: z.string()
})).handler(createSsrRpc("3071ff5575e65b754ef7bfc6391ad048f057ac17b85b40c0f5cc334e07ac7cb3"));
const getPlanBonuses = createServerFn({
  method: "POST"
}).inputValidator(z.object({
  planId: z.string()
})).handler(createSsrRpc("3ced513fb2a1fda72c6b5854c2c653ec130312af70f1a7200d63f4a4c3025803"));
createServerFn({
  method: "POST"
}).inputValidator(z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  price: z.number().min(0),
  activation_fee: z.number().min(0).default(0),
  plan_type: z.string().optional(),
  is_affiliate: z.boolean().default(false),
  is_active: z.boolean().default(true),
  max_generations: z.number().min(1).default(1),
  direct_bonus_percentage: z.number().min(0).max(100).default(0),
  metadata: z.record(z.any()).optional()
})).handler(createSsrRpc("050064d7975a31fb11f5d68088e654493c845574c552a79cefa9ece40fa24f18"));
createServerFn({
  method: "POST"
}).inputValidator(z.object({
  id: z.string().uuid(),
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  price: z.number().min(0).optional(),
  activation_fee: z.number().min(0).optional(),
  plan_type: z.string().optional(),
  is_affiliate: z.boolean().optional(),
  is_active: z.boolean().optional(),
  max_generations: z.number().min(1).optional(),
  direct_bonus_percentage: z.number().min(0).max(100).optional(),
  metadata: z.record(z.any()).optional()
})).handler(createSsrRpc("0c61013e79296bfd2f0e3d7a0f337c2d540b301128ba7a46ab95994485882257"));
createServerFn({
  method: "POST"
}).inputValidator(z.object({
  plan_id: z.string().uuid(),
  generation: z.number().min(0),
  bonus_percentage: z.number().min(0).max(100),
  required_directs: z.number().min(0).default(0),
  bonus_type: z.string().default("generation")
})).handler(createSsrRpc("a737e29bae9dd7cc9bdb3a61f81f1c26d32a91d5c9fd79f317c62e0c8c76b457"));
createServerFn({
  method: "POST"
}).inputValidator(z.object({
  id: z.string().uuid()
})).handler(createSsrRpc("6646d5692bff2387c957c29d3a191ef6d39ca21994ab2af619a819563fc00665"));
createServerFn({
  method: "POST"
}).inputValidator(z.object({
  customer_id: z.string().uuid(),
  plan_id: z.string().uuid(),
  expires_at: z.string().optional()
})).handler(createSsrRpc("f7c35280584b64d251054fbdce10e5f4373bb750ffcb0c51ba73955ea80bd76b"));
createServerFn({
  method: "POST"
}).inputValidator(z.object({
  customer_id: z.string().uuid()
})).handler(createSsrRpc("2f79a501eef3e785e69c7615c8d1cc6ac6b44746a4ff706725ad37a7778f7a63"));
createServerFn({
  method: "POST"
}).inputValidator(z.object({
  customerId: z.string().uuid()
})).handler(createSsrRpc("aecaee80caf6b4b21fefd99ac5907bb0e1c302a6e9dcdf67311018148bd6de62"));
const getPlanAnalytics = createServerFn({
  method: "GET"
}).handler(createSsrRpc("1ad5e57b505b4ae9415f3284011a61154b1346e34c7c7217ab593e84ee5afed9"));
createServerFn({
  method: "GET"
}).handler(createSsrRpc("203bd02d39b60d512df9648a12382419ecd1d7145ce7deba9d30cf4ccea29327"));
createServerFn({
  method: "GET"
}).handler(createSsrRpc("744d12898554b49d71ba6dd8b9b75fe5b489ee83bca8335df20e978e80063335"));
function PlanCard({ plan }) {
  const { data: bonuses } = useQuery({
    queryKey: ["plan-bonuses", plan.id],
    queryFn: () => getPlanBonuses({ planId: plan.id })
  });
  const generationBonuses = bonuses?.filter((b) => b.bonus_type === "generation") || [];
  const directBonuses = bonuses?.filter((b) => b.bonus_type === "direct_bonus") || [];
  return /* @__PURE__ */ jsxs(Card, { className: "relative overflow-hidden", children: [
    plan.is_affiliate && /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 bg-gradient-to-l from-purple-500 to-transparent w-32 h-32 opacity-20" }),
    /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(CardTitle, { className: "text-xl", children: plan.name }),
        /* @__PURE__ */ jsx(CardDescription, { className: "mt-2", children: plan.description })
      ] }),
      plan.is_affiliate && /* @__PURE__ */ jsxs(Badge, { variant: "secondary", className: "gap-1", children: [
        /* @__PURE__ */ jsx(Star, { className: "h-3 w-3" }),
        "Afiliado"
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs(CardContent, { className: "space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "text-3xl font-bold", children: plan.price === 0 ? "Grátis" : `R$ ${plan.price.toLocaleString("pt-BR")}` }),
        plan.activation_fee > 0 && /* @__PURE__ */ jsxs("div", { className: "text-sm text-muted-foreground", children: [
          "+ R$ ",
          plan.activation_fee.toLocaleString("pt-BR"),
          " taxa de ativação"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
          /* @__PURE__ */ jsx(TrendingUp, { className: "h-4 w-4 text-green-500" }),
          /* @__PURE__ */ jsx("span", { className: "font-medium", children: "Comissão Direta:" }),
          /* @__PURE__ */ jsxs("span", { children: [
            plan.direct_bonus_percentage,
            "%"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
          /* @__PURE__ */ jsx(Users, { className: "h-4 w-4 text-blue-500" }),
          /* @__PURE__ */ jsx("span", { className: "font-medium", children: "Máximo de Gerações:" }),
          /* @__PURE__ */ jsx("span", { children: plan.max_generations })
        ] })
      ] }),
      generationBonuses.length > 0 && /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h4", { className: "font-semibold mb-3 text-sm", children: "Bônus por Geração" }),
        /* @__PURE__ */ jsx("div", { className: "space-y-2", children: generationBonuses.map((bonus) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
          /* @__PURE__ */ jsx(Check, { className: "h-4 w-4 text-green-500" }),
          /* @__PURE__ */ jsxs("span", { children: [
            "Geração ",
            bonus.generation,
            ":"
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "font-semibold", children: [
            bonus.bonus_percentage,
            "%"
          ] })
        ] }, bonus.id)) })
      ] }),
      directBonuses.length > 0 && /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h4", { className: "font-semibold mb-3 text-sm", children: "Bônus Extras por Diretos" }),
        /* @__PURE__ */ jsx("div", { className: "space-y-2", children: directBonuses.map((bonus) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
          /* @__PURE__ */ jsx(Check, { className: "h-4 w-4 text-green-500" }),
          /* @__PURE__ */ jsxs("span", { children: [
            bonus.required_directs,
            "+ diretos:"
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "font-semibold", children: [
            bonus.bonus_percentage,
            "%"
          ] })
        ] }, bonus.id)) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(CardFooter, { className: "flex gap-2", children: [
      /* @__PURE__ */ jsx(Button, { className: "flex-1", children: "Ver Detalhes" }),
      /* @__PURE__ */ jsx(Button, { variant: "outline", children: "Editar" })
    ] })
  ] });
}
function PlanAnalytics({ analytics = [] }) {
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold mb-6", children: "Analytics de Planos" }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: analytics.map((plan) => /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsx(CardTitle, { className: "text-lg", children: plan.plan_name ?? plan.planName }),
        /* @__PURE__ */ jsx(CardDescription, { children: "Performance do plano" })
      ] }),
      /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
          /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: "Distribuidores" }),
          /* @__PURE__ */ jsx("span", { className: "font-semibold", children: plan.total_customers ?? plan.totalCustomers ?? 0 })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
          /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: "Ativos" }),
          /* @__PURE__ */ jsx("span", { className: "font-semibold", children: plan.active_customers ?? plan.activeCustomers ?? 0 })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
          /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: "Receita Total" }),
          /* @__PURE__ */ jsxs("span", { className: "font-semibold", children: [
            "R$ ",
            (plan.total_revenue ?? plan.totalRevenue ?? 0).toLocaleString("pt-BR")
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
          /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: "Ticket Médio" }),
          /* @__PURE__ */ jsxs("span", { className: "font-semibold", children: [
            "R$ ",
            (plan.avg_revenue_per_customer ?? plan.averageRevenuePerCustomer ?? 0).toLocaleString("pt-BR")
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
          /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: "Assinaturas Ativas" }),
          /* @__PURE__ */ jsx("span", { className: "font-semibold", children: plan.active_subscriptions ?? plan.activeSubscriptions ?? 0 })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
          /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: "Novas Ativações (30d)" }),
          /* @__PURE__ */ jsx("span", { className: "font-semibold", children: plan.new_activations_30d ?? plan.newActivations30d ?? 0 })
        ] })
      ] })
    ] }, plan.plan_id ?? plan.planId)) })
  ] });
}
function UpgradeSuggestions() {
  const suggestions = [
    {
      type: "opportunity",
      icon: TrendingUp,
      title: "Oportunidade de Upgrade",
      description: "3 distribuidores qualificados para upgrade para Avanço",
      action: "Ver Detalhes",
      color: "text-green-500"
    },
    {
      type: "risk",
      icon: AlertTriangle,
      title: "Risco de Churn",
      description: "5 distribuidores com atividade baixa no plano Afiliado",
      action: "Ver Lista",
      color: "text-yellow-500"
    },
    {
      type: "potential",
      icon: Zap,
      title: "Potencial de Liderança",
      description: "2 distribuidores com alto potencial de crescimento",
      action: "Ver Perfis",
      color: "text-blue-500"
    }
  ];
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold mb-6", children: "Sugestões de IA" }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: suggestions.map((suggestion, index) => /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx(suggestion.icon, { className: `h-5 w-5 ${suggestion.color}` }),
            /* @__PURE__ */ jsx(CardTitle, { className: "text-lg", children: suggestion.title })
          ] }),
          /* @__PURE__ */ jsx(Badge, { variant: "outline", children: "IA" })
        ] }),
        /* @__PURE__ */ jsx(CardDescription, { children: suggestion.description })
      ] }),
      /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs(Button, { variant: "ghost", className: "w-full justify-between", children: [
        suggestion.action,
        /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4" })
      ] }) })
    ] }, index)) })
  ] });
}
function PlansDashboard() {
  const { data: plans, isLoading: plansLoading } = useQuery({
    queryKey: ["plans"],
    queryFn: getAllPlans
  });
  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ["plan-analytics"],
    queryFn: getPlanAnalytics
  });
  if (plansLoading || analyticsLoading) {
    return /* @__PURE__ */ jsx("div", { className: "p-8", children: "Carregando..." });
  }
  const totalPlans = plans?.length || 0;
  const totalCustomers = analytics?.reduce((sum, a) => sum + (a.totalCustomers ?? a.total_customers ?? 0), 0) || 0;
  const totalRevenue = analytics?.reduce((sum, a) => sum + (a.totalRevenue ?? a.total_revenue ?? 0), 0) || 0;
  const activeSubscriptions = analytics?.reduce((sum, a) => sum + (a.activeSubscriptions ?? a.active_subscriptions ?? 0), 0) || 0;
  return /* @__PURE__ */ jsxs("div", { className: "p-8 space-y-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold", children: "Planos MLM" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Gerencie planos, bônus e comissões da rede" })
      ] }),
      /* @__PURE__ */ jsxs(Button, { className: "gap-2", children: [
        /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
        "Novo Plano"
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", children: [
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-medium", children: "Total de Planos" }),
          /* @__PURE__ */ jsx(Users, { className: "h-4 w-4 text-muted-foreground" })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { children: [
          /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold", children: totalPlans }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Planos ativos no sistema" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-medium", children: "Distribuidores Ativos" }),
          /* @__PURE__ */ jsx(Activity, { className: "h-4 w-4 text-muted-foreground" })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { children: [
          /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold", children: totalCustomers }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Distribuidores com planos ativos" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-medium", children: "Receita Total" }),
          /* @__PURE__ */ jsx(DollarSign, { className: "h-4 w-4 text-muted-foreground" })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxs("div", { className: "text-2xl font-bold", children: [
            "R$ ",
            totalRevenue.toLocaleString("pt-BR")
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Receita gerada por planos" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-medium", children: "Assinaturas Ativas" }),
          /* @__PURE__ */ jsx(TrendingUp, { className: "h-4 w-4 text-muted-foreground" })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { children: [
          /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold", children: activeSubscriptions }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Assinaturas ativas atualmente" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(UpgradeSuggestions, {}),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold mb-6", children: "Planos Disponíveis" }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: (plans || []).map((plan) => /* @__PURE__ */ jsx(PlanCard, { plan }, plan.id)) })
    ] }),
    /* @__PURE__ */ jsx(PlanAnalytics, { analytics: analytics || [] })
  ] });
}
function PlansPage() {
  return /* @__PURE__ */ jsx(PlansDashboard, {});
}
export {
  PlansPage as component
};
