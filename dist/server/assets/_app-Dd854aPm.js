import { jsx, jsxs } from "react/jsx-runtime";
import { useRouterState, useNavigate, Link, Outlet } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { S as Sheet, a as SheetContent, b as SheetHeader, c as SheetTitle, d as SheetDescription } from "./sheet-Cs3qIN9i.js";
import { B as Button, b as useAuth, c as cn } from "./router-C3cuB5ui.js";
import { Sparkles, TrendingUp, AlertTriangle, Workflow, LayoutDashboard, Bell, Users, Network, Wallet, ShoppingBag, Boxes, Layers, Megaphone, ShieldCheck, Settings2, LogOut, Search, Command } from "lucide-react";
import { toast } from "sonner";
import { R as ROLE_DISPLAY_NAMES, U as UserRole } from "./roles-DEW722fr.js";
import { u as usePermissions, R as RouteGuard } from "./RouteGuard-SpRgPNqu.js";
import { A as Avatar, a as AvatarFallback } from "./avatar-avb1vYhy.js";
import { I as Input } from "./input-CnOu4Y2I.js";
import "@radix-ui/react-dialog";
import "class-variance-authority";
import "@tanstack/react-query";
import "./supabase-client-BdpvIS_G.js";
import "@supabase/supabase-js";
import "framer-motion";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "@radix-ui/react-avatar";
function CopilotDrawer({ open, onOpenChange }) {
  const suggestions = [
    { icon: TrendingUp, title: "Resumir a performance dos últimos 7 dias" },
    { icon: AlertTriangle, title: "Listar distribuidores com alto risco de churn" },
    { icon: Workflow, title: "Sugerir automação para reativar inativos" },
    { icon: Sparkles, title: "Quais produtos devo aumentar estoque?" }
  ];
  return /* @__PURE__ */ jsx(Sheet, { open, onOpenChange, children: /* @__PURE__ */ jsxs(SheetContent, { className: "w-full sm:max-w-md p-0 flex flex-col", children: [
    /* @__PURE__ */ jsxs(SheetHeader, { className: "border-b border-border p-4", children: [
      /* @__PURE__ */ jsxs(SheetTitle, { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Sparkles, { className: "h-4 w-4 text-primary" }),
        " Copiloto Allin"
      ] }),
      /* @__PURE__ */ jsx(SheetDescription, { children: "Contexto da plataforma · Action-driven · Multi-tenant" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 overflow-y-auto p-4 space-y-4", children: [
      /* @__PURE__ */ jsx("div", { className: "rounded-lg border border-border bg-card/60 p-3", children: /* @__PURE__ */ jsxs("p", { className: "text-sm", children: [
        "Olá. Detectei ",
        /* @__PURE__ */ jsx("span", { className: "text-primary font-medium", children: "3 sinais relevantes" }),
        " nas últimas horas. Quer que eu resuma o estado operacional ou execute uma ação específica?"
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs font-medium uppercase tracking-wider text-muted-foreground", children: "Sugestões contextuais" }),
        suggestions.map((s) => {
          const Icon = s.icon;
          return /* @__PURE__ */ jsxs("button", { className: "w-full text-left rounded-lg border border-border bg-card/40 px-3 py-2.5 text-sm hover:bg-accent transition-colors flex items-center gap-2.5", children: [
            /* @__PURE__ */ jsx(Icon, { className: "h-4 w-4 text-primary" }),
            /* @__PURE__ */ jsx("span", { className: "flex-1", children: s.title })
          ] }, s.title);
        })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "border-t border-border p-3", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          className: "flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40",
          placeholder: "Pergunte ou descreva uma ação…"
        }
      ),
      /* @__PURE__ */ jsx(Button, { size: "sm", children: "Enviar" })
    ] }) })
  ] }) });
}
const APP_NAV_SECTIONS = [
  {
    label: "Executivo",
    items: [
      { to: "/analytics", label: "Dashboard Executivo", icon: LayoutDashboard, module: "dashboard" },
      { to: "/insights", label: "Insights", icon: Sparkles, badge: "5", module: "analytics" },
      { to: "/alerts", label: "Alertas", icon: Bell, badge: "3", module: "dashboard" }
    ]
  },
  {
    label: "CRM",
    items: [{ to: "/customers", label: "Distribuidores", icon: Users, module: "support" }]
  },
  {
    label: "Rede",
    items: [
      { to: "/network", label: "Genealogia", icon: Network, module: "network" },
      { to: "/commissions", label: "Comissoes", icon: Wallet, module: "finance" }
    ]
  },
  {
    label: "Comercial",
    items: [
      { to: "/orders", label: "Pedidos", icon: ShoppingBag, module: "orders" },
      { to: "/products", label: "Produtos", icon: Boxes, module: "products" },
      { to: "/plans", label: "Planos", icon: Layers, module: "products" }
    ]
  },
  {
    label: "Financeiro",
    items: [{ to: "/wallets", label: "Carteiras", icon: Wallet, module: "finance" }]
  },
  {
    label: "Marketing",
    items: [{ to: "/marketing", label: "Campanhas", icon: Megaphone, module: "marketing" }]
  },
  {
    label: "Sistema",
    items: [
      { to: "/system", label: "Admin & Auditoria", icon: ShieldCheck, module: "system" },
      { to: "/settings", label: "Configuracoes", icon: Settings2, module: "settings" }
    ]
  }
];
function SidebarNav() {
  const { location } = useRouterState();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { hasPermission } = usePermissions();
  const path = location.pathname;
  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Sessao finalizada com sucesso!");
      navigate({ to: "/login" });
    } catch {
      toast.error("Erro ao encerrar sessao.");
    }
  };
  const filteredSections = APP_NAV_SECTIONS.map((section) => ({
    ...section,
    items: section.items.filter((item) => hasPermission(item.module, "read"))
  })).filter((section) => section.items.length > 0);
  const getRoleLabel = (role) => ROLE_DISPLAY_NAMES[role] || role;
  return /* @__PURE__ */ jsxs("aside", { className: "hidden md:flex w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex h-14 items-center gap-2 border-b border-sidebar-border px-4", children: [
      /* @__PURE__ */ jsx("div", { className: "grid h-7 w-7 place-items-center rounded-md bg-gradient-to-br from-primary to-fuchsia-500 font-bold text-primary-foreground", children: "A" }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col leading-tight", children: [
        /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold text-white", children: "Allin OS" }),
        /* @__PURE__ */ jsx("span", { className: "text-[10px] uppercase tracking-wider text-muted-foreground font-mono", children: "Enterprise" })
      ] })
    ] }),
    /* @__PURE__ */ jsx("nav", { className: "flex-1 space-y-4 overflow-y-auto px-2 py-3", children: filteredSections.map((section) => /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("div", { className: "px-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70", children: section.label }),
      /* @__PURE__ */ jsx("ul", { className: "space-y-0.5", children: section.items.map((item) => {
        const active = item.to === "/" ? path === "/" : path === item.to || path.startsWith(`${item.to}/`);
        const Icon = item.icon;
        return /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(
          Link,
          {
            to: item.to,
            className: cn(
              "group flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors",
              active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
            ),
            children: [
              /* @__PURE__ */ jsx(Icon, { className: cn("h-4 w-4", active ? "text-primary" : "text-muted-foreground") }),
              /* @__PURE__ */ jsx("span", { className: "flex-1", children: item.label }),
              item.badge && /* @__PURE__ */ jsx("span", { className: "rounded-full bg-primary/15 px-1.5 py-0.5 text-[10px] font-medium text-primary", children: item.badge })
            ]
          }
        ) }, item.to);
      }) })
    ] }, section.label)) }),
    user && /* @__PURE__ */ jsx("div", { className: "space-y-2 border-t border-sidebar-border p-3", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5 rounded-lg border border-border/45 bg-sidebar-accent/50 p-2.5", children: [
      /* @__PURE__ */ jsx(
        "img",
        {
          src: user.avatar || "https://api.dicebear.com/7.x/initials/svg?seed=Admin",
          alt: user.name,
          className: "h-7 w-7 rounded-full border border-primary/20 bg-background",
          referrerPolicy: "no-referrer"
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1 leading-tight", children: [
        /* @__PURE__ */ jsx("p", { className: "truncate text-xs font-semibold text-white", children: user.name }),
        /* @__PURE__ */ jsx("span", { className: "block font-mono text-[9px] font-bold uppercase tracking-wider text-primary", children: getRoleLabel(user.role) })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: handleLogout,
          className: "cursor-pointer rounded-md p-1 text-muted-foreground transition-all hover:bg-rose-500/10 hover:text-rose-400",
          title: "Encerrar Sessao",
          children: /* @__PURE__ */ jsx(LogOut, { className: "h-3.5 w-3.5" })
        }
      )
    ] }) })
  ] });
}
function Topbar({ onCopilot }) {
  return /* @__PURE__ */ jsxs("header", { className: "sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur", children: [
    /* @__PURE__ */ jsxs("div", { className: "relative flex-1 max-w-2xl", children: [
      /* @__PURE__ */ jsx(Search, { className: "pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" }),
      /* @__PURE__ */ jsx(Input, { placeholder: "Buscar no painel (⌘K)", className: "h-9 pl-8 bg-card/60 border-border/60" }),
      /* @__PURE__ */ jsxs("kbd", { className: "hidden md:inline-flex absolute right-2 top-1.5 items-center gap-1 rounded border border-border bg-muted/40 px-1.5 py-0.5 text-[10px] text-muted-foreground", children: [
        /* @__PURE__ */ jsx(Command, { className: "h-3 w-3" }),
        "K"
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "sm", onClick: onCopilot, className: "gap-1.5", children: [
      /* @__PURE__ */ jsx(Sparkles, { className: "h-4 w-4 text-primary" }),
      "Copiloto"
    ] }),
    /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", "aria-label": "Notificacoes", children: /* @__PURE__ */ jsx(Bell, { className: "h-4 w-4" }) }),
    /* @__PURE__ */ jsx(Avatar, { className: "h-8 w-8", children: /* @__PURE__ */ jsx(AvatarFallback, { className: "bg-gradient-to-br from-primary to-fuchsia-500 text-xs text-white", children: "AO" }) })
  ] });
}
function AppLayoutSecure() {
  const {
    loading
  } = useAuth();
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "flex min-h-screen items-center justify-center bg-[#06080d]", children: /* @__PURE__ */ jsx("div", { className: "h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" }) });
  }
  return /* @__PURE__ */ jsx(RouteGuard, { allowedRoles: [UserRole.ADMIN_MASTER, UserRole.GESTAO_ADMIN, UserRole.FINANCEIRO, UserRole.SUPORTE], children: /* @__PURE__ */ jsx(AppLayout, {}) });
}
function AppLayout() {
  const [copilotOpen, setCopilotOpen] = useState(false);
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCopilotOpen((value) => !value);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return /* @__PURE__ */ jsxs("div", { className: "flex min-h-screen bg-background text-foreground", children: [
    /* @__PURE__ */ jsx(SidebarNav, {}),
    /* @__PURE__ */ jsxs("div", { className: "flex min-w-0 flex-1 flex-col", children: [
      /* @__PURE__ */ jsx(Topbar, { onCopilot: () => setCopilotOpen(true) }),
      /* @__PURE__ */ jsx("main", { className: "flex-1 overflow-y-auto", children: /* @__PURE__ */ jsx("div", { className: "mx-auto w-full max-w-[1600px] px-4 py-6 md:px-8 md:py-8", children: /* @__PURE__ */ jsx(Outlet, {}) }) })
    ] }),
    /* @__PURE__ */ jsx(CopilotDrawer, { open: copilotOpen, onOpenChange: setCopilotOpen })
  ] });
}
export {
  AppLayoutSecure as component
};
