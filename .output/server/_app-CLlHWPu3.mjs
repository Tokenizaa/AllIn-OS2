import { j as jsxRuntimeExports, r as reactExports } from "./_libs/react.mjs";
import { O as Outlet, f as useRouterState, g as useNavigate, L as Link } from "./_libs/tanstack__react-router.mjs";
import { S as Sheet, a as SheetContent, b as SheetHeader, c as SheetTitle, d as SheetDescription } from "./_ssr/sheet-1svGASis.mjs";
import { b as useAuth, c as cn, B as Button } from "./_ssr/router-BZaVudxP.mjs";
import { t as toast } from "./_libs/sonner.mjs";
import { U as UserRole, R as ROLE_DISPLAY_NAMES } from "./_ssr/roles-DEW722fr.mjs";
import { R as RouteGuard, u as usePermissions } from "./_ssr/RouteGuard-D88Vk6Da.mjs";
import { A as Avatar, a as AvatarFallback } from "./_ssr/avatar-BEKH3ihV.mjs";
import { I as Input } from "./_ssr/input-D1i_JeqC.mjs";
import { v as LayoutDashboard, q as Sparkles, K as Bell, U as Users, N as Network, W as Wallet, S as ShoppingBag, a7 as Boxes, a8 as Layers, a9 as Megaphone, d as ShieldCheck, aa as Settings2, E as LogOut, F as Search, ab as Command, k as TrendingUp, ac as TriangleAlert, ad as Workflow } from "./_libs/lucide-react.mjs";

import "./_libs/tanstack__router-core.mjs";
import "./_libs/tanstack__history.mjs";
import "./_libs/cookie-es.mjs";
import "./_libs/seroval.mjs";
import "./_libs/unenv.mjs";


import "./_libs/seroval-plugins.mjs";


import "./_libs/react-dom.mjs";
import "./_libs/isbot.mjs";
import "./_libs/radix-ui__react-dialog.mjs";
import "./_libs/radix-ui__primitive.mjs";
import "./_libs/radix-ui__react-compose-refs.mjs";
import "./_libs/radix-ui__react-context.mjs";
import "./_libs/radix-ui__react-id.mjs";
import "./_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "./_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "./_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "./_libs/radix-ui__react-primitive.mjs";
import "./_libs/radix-ui__react-slot.mjs";
import "./_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "./_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "./_libs/radix-ui__react-focus-scope.mjs";
import "./_libs/radix-ui__react-portal.mjs";
import "./_libs/radix-ui__react-presence.mjs";
import "./_libs/radix-ui__react-focus-guards.mjs";
import "./_libs/react-remove-scroll.mjs";
import "./_libs/tslib.mjs";
import "./_libs/react-remove-scroll-bar.mjs";
import "./_libs/react-style-singleton.mjs";
import "./_libs/get-nonce.mjs";
import "./_libs/use-sidecar.mjs";
import "./_libs/use-callback-ref.mjs";
import "./_libs/aria-hidden.mjs";
import "./_libs/class-variance-authority.mjs";
import "./_libs/clsx.mjs";
import "./_libs/tanstack__query-core.mjs";
import "./_libs/tanstack__react-query.mjs";
import "./_ssr/supabase-client-BdpvIS_G.mjs";
import "./_libs/supabase__supabase-js.mjs";
import "./_libs/supabase__postgrest-js.mjs";
import "./_libs/supabase__realtime-js.mjs";
import "./_libs/supabase__phoenix.mjs";
import "./_libs/supabase__storage-js.mjs";
import "./_libs/iceberg-js.mjs";
import "./_libs/supabase__auth-js.mjs";
import "./_libs/supabase__functions-js.mjs";
import "./_libs/tailwind-merge.mjs";
import "./_libs/framer-motion.mjs";
import "./_libs/motion-dom.mjs";
import "./_libs/motion-utils.mjs";
import "./_libs/radix-ui__react-avatar.mjs";
import "./_libs/@radix-ui/react-use-is-hydrated+[...].mjs";
import "./_libs/use-sync-external-store.mjs";
function CopilotDrawer({ open, onOpenChange }) {
  const suggestions = [
    { icon: TrendingUp, title: "Resumir a performance dos últimos 7 dias" },
    { icon: TriangleAlert, title: "Listar distribuidores com alto risco de churn" },
    { icon: Workflow, title: "Sugerir automação para reativar inativos" },
    { icon: Sparkles, title: "Quais produtos devo aumentar estoque?" }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Sheet, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetContent, { className: "w-full sm:max-w-md p-0 flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetHeader, { className: "border-b border-border p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetTitle, { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-4 w-4 text-primary" }),
        " Copiloto Allin"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SheetDescription, { children: "Contexto da plataforma · Action-driven · Multi-tenant" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto p-4 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-border bg-card/60 p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm", children: [
        "Olá. Detectei ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-medium", children: "3 sinais relevantes" }),
        " nas últimas horas. Quer que eu resuma o estado operacional ou execute uma ação específica?"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium uppercase tracking-wider text-muted-foreground", children: "Sugestões contextuais" }),
        suggestions.map((s) => {
          const Icon = s.icon;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "w-full text-left rounded-lg border border-border bg-card/40 px-3 py-2.5 text-sm hover:bg-accent transition-colors flex items-center gap-2.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4 text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1", children: s.title })
          ] }, s.title);
        })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-border p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          className: "flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40",
          placeholder: "Pergunte ou descreva uma ação…"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", children: "Enviar" })
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "hidden md:flex w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-14 items-center gap-2 border-b border-sidebar-border px-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-7 w-7 place-items-center rounded-md bg-gradient-to-br from-primary to-fuchsia-500 font-bold text-primary-foreground", children: "A" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col leading-tight", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-white", children: "Allin OS" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] uppercase tracking-wider text-muted-foreground font-mono", children: "Enterprise" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "flex-1 space-y-4 overflow-y-auto px-2 py-3", children: filteredSections.map((section) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70", children: section.label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-0.5", children: section.items.map((item) => {
        const active = item.to === "/" ? path === "/" : path === item.to || path.startsWith(`${item.to}/`);
        const Icon = item.icon;
        return /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: item.to,
            className: cn(
              "group flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors",
              active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
            ),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: cn("h-4 w-4", active ? "text-primary" : "text-muted-foreground") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1", children: item.label }),
              item.badge && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-primary/15 px-1.5 py-0.5 text-[10px] font-medium text-primary", children: item.badge })
            ]
          }
        ) }, item.to);
      }) })
    ] }, section.label)) }),
    user && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2 border-t border-sidebar-border p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 rounded-lg border border-border/45 bg-sidebar-accent/50 p-2.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "img",
        {
          src: user.avatar || "https://api.dicebear.com/7.x/initials/svg?seed=Admin",
          alt: user.name,
          className: "h-7 w-7 rounded-full border border-primary/20 bg-background",
          referrerPolicy: "no-referrer"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1 leading-tight", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-xs font-semibold text-white", children: user.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block font-mono text-[9px] font-bold uppercase tracking-wider text-primary", children: getRoleLabel(user.role) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: handleLogout,
          className: "cursor-pointer rounded-md p-1 text-muted-foreground transition-all hover:bg-rose-500/10 hover:text-rose-400",
          title: "Encerrar Sessao",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-3.5 w-3.5" })
        }
      )
    ] }) })
  ] });
}
function Topbar({ onCopilot }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 max-w-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Buscar no painel (⌘K)", className: "h-9 pl-8 bg-card/60 border-border/60" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("kbd", { className: "hidden md:inline-flex absolute right-2 top-1.5 items-center gap-1 rounded border border-border bg-muted/40 px-1.5 py-0.5 text-[10px] text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Command, { className: "h-3 w-3" }),
        "K"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: onCopilot, className: "gap-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-4 w-4 text-primary" }),
      "Copiloto"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", "aria-label": "Notificacoes", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-4 w-4" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { className: "h-8 w-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "bg-gradient-to-br from-primary to-fuchsia-500 text-xs text-white", children: "AO" }) })
  ] });
}
function AppLayoutSecure() {
  const {
    loading
  } = useAuth();
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-[#06080d]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(RouteGuard, { allowedRoles: [UserRole.ADMIN_MASTER, UserRole.GESTAO_ADMIN, UserRole.FINANCEIRO, UserRole.SUPORTE], children: /* @__PURE__ */ jsxRuntimeExports.jsx(AppLayout, {}) });
}
function AppLayout() {
  const [copilotOpen, setCopilotOpen] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCopilotOpen((value) => !value);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-h-screen bg-background text-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarNav, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-w-0 flex-1 flex-col", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Topbar, { onCopilot: () => setCopilotOpen(true) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 overflow-y-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto w-full max-w-[1600px] px-4 py-6 md:px-8 md:py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CopilotDrawer, { open: copilotOpen, onOpenChange: setCopilotOpen })
  ] });
}
export {
  AppLayoutSecure as component
};
