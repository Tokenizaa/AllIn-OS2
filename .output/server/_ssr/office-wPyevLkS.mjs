import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { O as Outlet, f as useRouterState, g as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { b as useAuth, c as cn, d as useDistributor, B as Button } from "./router-BZaVudxP.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { I as Input } from "./input-D1i_JeqC.mjs";
import { U as UserRole } from "./roles-DEW722fr.mjs";
import { R as RouteGuard } from "./RouteGuard-D88Vk6Da.mjs";
import { v as LayoutDashboard, o as Crown, S as ShoppingBag, w as Store, W as Wallet, N as Network, x as ChartColumn, y as Download, z as User, d as ShieldCheck, q as Sparkles, E as LogOut, F as Search, I as Copy, J as Share2, K as Bell } from "../_libs/lucide-react.mjs";

import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/unenv.mjs";


import "../_libs/seroval-plugins.mjs";


import "../_libs/react-dom.mjs";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
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
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/framer-motion.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
const items = [
  { to: "/office", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/office/plan", label: "Meu Plano", icon: Crown },
  { to: "/office/orders", label: "Pedidos", icon: ShoppingBag },
  { to: "/office/store", label: "Loja Virtual", icon: Store },
  { to: "/office/finance", label: "Financeiro", icon: Wallet },
  { to: "/office/network", label: "Minha Rede", icon: Network },
  { to: "/office/reports", label: "Relatórios", icon: ChartColumn },
  { to: "/office/downloads", label: "Downloads", icon: Download },
  { to: "/office/profile", label: "Meus Dados", icon: User },
  { to: "/office/verification", label: "Verificação", icon: ShieldCheck }
];
function OfficeSidebar() {
  const { location } = useRouterState();
  const navigate = useNavigate();
  const { user, distributorProfile, logout } = useAuth();
  const path = location.pathname;
  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Sessão finalizada com sucesso!");
      navigate({ to: "/login" });
    } catch (err) {
      toast.error("Erro ao encerrar sessão.");
    }
  };
  const displayName = user?.name || "Distribuidor";
  const displayQualification = distributorProfile?.qualification || "Distribuidor Pendente";
  const userInitials = displayName.split(" ").map((n) => n[0]).slice(0, 2).join("");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "hidden md:flex w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-16 items-center gap-3 px-5 border-b border-sidebar-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-9 w-9 rounded-xl bg-gradient-to-br from-primary via-fuchsia-500 to-cyan-400 grid place-items-center text-primary-foreground font-bold shadow-lg shadow-primary/30", children: "A" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col leading-tight", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", children: "Allin Office" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground uppercase tracking-wider", children: "Distribuidor" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "flex-1 overflow-y-auto px-3 py-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-2 pb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70", children: "Navegação" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-0.5", children: items.map((it) => {
        const active = it.exact ? path === it.to : path.startsWith(it.to) && it.to !== "/office";
        const isActive = it.exact ? path === it.to : active;
        const Icon = it.icon;
        return /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: it.to,
            className: cn(
              "group relative flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm transition-all",
              isActive ? "bg-gradient-to-r from-primary/20 to-transparent text-foreground" : "text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
            ),
            children: [
              isActive && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-full bg-primary" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: cn("h-4 w-4 shrink-0", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1", children: it.label })
            ]
          }
        ) }, it.to);
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 px-2 pb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70", children: "Inteligência" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/office/copilot", className: cn(
        "flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm transition-all",
        path.startsWith("/office/copilot") ? "bg-gradient-to-r from-primary/20 to-transparent text-foreground" : "text-sidebar-foreground/75 hover:bg-sidebar-accent/60"
      ), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-4 w-4 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1", children: "Copiloto IA" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-primary/20 px-1.5 py-0.5 text-[9px] font-bold text-primary uppercase tracking-wider", children: "Beta" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 border-t border-sidebar-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl bg-gradient-to-br from-primary/15 via-fuchsia-500/10 to-transparent border border-primary/20 p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-9 w-9 rounded-full bg-gradient-to-br from-primary to-fuchsia-500 grid place-items-center text-xs font-bold text-primary-foreground shrink-0 uppercase", children: userInitials }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0 leading-tight", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold truncate text-white", children: displayName }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "h-2.5 w-2.5 text-primary" }),
          " ",
          displayQualification
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: handleLogout,
          className: "p-1.5 rounded-md text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer shrink-0",
          title: "Sair do Escritório",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-3.5 w-3.5" })
        }
      )
    ] }) }) })
  ] });
}
function OfficeTopbar() {
  const { currentDistributor } = useDistributor();
  const copyLink = () => {
    if (currentDistributor.slug) {
      navigator.clipboard.writeText(`${window.location.origin}/loja/${currentDistributor.slug}`);
      toast.success("Link da sua loja copiado!");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "h-16 shrink-0 border-b border-border/60 bg-background/70 backdrop-blur-xl sticky top-0 z-30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-full px-4 md:px-8 flex items-center gap-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 max-w-xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Buscar pedidos, clientes, materiais…", className: "pl-9 h-10 bg-muted/40 border-border/60" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("kbd", { className: "absolute right-3 top-1/2 -translate-y-1/2 rounded bg-background/60 px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground border border-border/60", children: "⌘K" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: copyLink, className: "hidden md:inline-flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "h-3.5 w-3.5" }),
        " Copiar link"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", className: "hidden md:inline-flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "h-3.5 w-3.5" }),
        " Compartilhar"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", className: "gap-2 bg-gradient-to-r from-primary to-fuchsia-500 hover:opacity-90", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3.5 w-3.5" }),
        " Copiloto"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", size: "icon", className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-4 w-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-destructive" })
      ] })
    ] })
  ] }) });
}
function OfficeLayoutSecure() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(RouteGuard, { allowedRoles: [UserRole.DISTRIBUIDOR, UserRole.AFILIADO, UserRole.CLIENTE_FINAL, UserRole.ADMIN_MASTER, UserRole.GESTAO_ADMIN, UserRole.FINANCEIRO, UserRole.SUPORTE, UserRole.LOGISTICA, UserRole.MARKETING, UserRole.ANALYTICS, UserRole.AUDITOR, UserRole.OPERADOR], children: /* @__PURE__ */ jsxRuntimeExports.jsx(OfficeLayout, {}) });
}
function OfficeLayout() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex bg-background text-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(OfficeSidebar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(OfficeTopbar, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 overflow-y-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto w-full max-w-[1500px] px-4 md:px-8 py-6 md:py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) }) })
    ] })
  ] });
}
export {
  OfficeLayoutSecure as component
};
