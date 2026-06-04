import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "@tanstack/react-router";
import { Sparkles, ShieldCheck, EyeOff, Eye, LogIn, Crown, Wallet, Headphones, Users } from "lucide-react";
import { toast } from "sonner";
import { U as UserRole, g as getDemoRedirectPath, b as useAuth, f as getRoleRedirectPath, B as Button } from "./router-Piw3VGP8.js";
import { I as Input } from "./input-QP3DCRKc.js";
import "@tanstack/react-query";
import "./supabase-client-BdpvIS_G.js";
import "@supabase/supabase-js";
import "framer-motion";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
const DEFAULT_TEST_LOGIN_ACCOUNTS = [
  { role: UserRole.ADMIN_MASTER, email: "admin@allin.io", password: "admin123", label: "Admin Master" },
  { role: UserRole.GESTAO_ADMIN, email: "gestao@allin.io", password: "gestao123", label: "Gestao Admin" },
  { role: UserRole.FINANCEIRO, email: "financeiro@allin.io", password: "finance123", label: "Financeiro" },
  { role: UserRole.SUPORTE, email: "suporte@allin.io", password: "support123", label: "Suporte" },
  { role: UserRole.LOGISTICA, email: "logistica@allin.io", password: "logistica123", label: "Logistica" },
  { role: UserRole.MARKETING, email: "marketing@allin.io", password: "marketing123", label: "Marketing" },
  { role: UserRole.ANALYTICS, email: "analytics@allin.io", password: "analytics123", label: "Analytics" },
  { role: UserRole.AUDITOR, email: "auditor@allin.io", password: "auditor123", label: "Auditor" },
  { role: UserRole.OPERADOR, email: "operador@allin.io", password: "operador123", label: "Operador" },
  { role: UserRole.DISTRIBUIDOR, email: "distributor@allin.io", password: "distributor123", label: "Distribuidor" },
  { role: UserRole.AFILIADO, email: "afiliado@allin.io", password: "affiliate123", label: "Afiliado" },
  { role: UserRole.CLIENTE_FINAL, email: "customer@allin.io", password: "client123", label: "Cliente" }
];
function getTestLoginAccounts() {
  {
    return DEFAULT_TEST_LOGIN_ACCOUNTS.map((account) => ({
      ...account,
      destination: getDemoRedirectPath(account.role)
    }));
  }
}
function LoginView() {
  const navigate = useNavigate();
  const { login, user, activeSponsor } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  useEffect(() => {
    if (user) {
      navigate({ to: getRoleRedirectPath(user), replace: true });
    }
  }, [navigate, user]);
  const submitLogin = async (nextEmail, nextPassword, redirectTo) => {
    setLoading(true);
    try {
      const loggedUser = await login(nextEmail, nextPassword);
      toast.success(`Bem-vindo, ${loggedUser.name}!`);
      navigate({ to: redirectTo || getRoleRedirectPath(loggedUser), replace: true });
    } catch (error) {
      toast.error(error?.message || "Erro ao efetuar login.");
    } finally {
      setLoading(false);
    }
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error("Preencha e-mail e senha.");
      return;
    }
    await submitLogin(email.trim(), password);
  };
  const onQuickLogin = async (account) => {
    setEmail(account.email);
    setPassword(account.password);
    await submitLogin(account.email, account.password, getDemoRedirectPath(account.role));
  };
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-[#05070d] text-white", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto grid min-h-screen max-w-7xl lg:grid-cols-[0.95fr_1.05fr]", children: [
    /* @__PURE__ */ jsxs("aside", { className: "hidden lg:flex flex-col justify-between border-r border-white/10 bg-white/[0.03] p-12", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "grid h-11 w-11 place-items-center rounded-2xl bg-[#ffb84d] text-[#111318] font-black", children: "A" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs uppercase tracking-[0.35em] text-white/40", children: "AllIn OS" }),
          /* @__PURE__ */ jsx("p", { className: "text-lg font-semibold", children: "Login leve" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "max-w-xl space-y-6", children: [
        /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/70", children: [
          /* @__PURE__ */ jsx(Sparkles, { className: "h-3.5 w-3.5 text-[#ffb84d]" }),
          "Acesso rapido com perfis de teste"
        ] }),
        /* @__PURE__ */ jsx("h1", { className: "text-5xl font-semibold leading-tight tracking-tight", children: "Login simples, sem peso visual e sem perder os atalhos de perfil." }),
        /* @__PURE__ */ jsx("p", { className: "max-w-lg text-sm leading-6 text-white/60", children: "Entre com sua conta ou use os botoes demo para validar cada area do sistema com um clique." }),
        /* @__PURE__ */ jsxs("div", { className: "grid gap-3 sm:grid-cols-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-white/10 bg-white/5 p-4", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs uppercase tracking-[0.25em] text-white/40", children: "Fluxo" }),
            /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-white/80", children: "Autenticacao normal com redirecionamento por role." })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-white/10 bg-white/5 p-4", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs uppercase tracking-[0.25em] text-white/40", children: "Teste" }),
            /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-white/80", children: "Perfis demo apontando para rotas reais do app." })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs text-white/45", children: [
        /* @__PURE__ */ jsx(ShieldCheck, { className: "h-4 w-4 text-emerald-400" }),
        "Sessao validada pelo Auth atual."
      ] })
    ] }),
    /* @__PURE__ */ jsx("main", { className: "flex items-center justify-center px-5 py-8 sm:px-8 lg:px-10", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-xl", children: [
      /* @__PURE__ */ jsx("div", { className: "mb-6 lg:hidden", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "grid h-10 w-10 place-items-center rounded-2xl bg-[#ffb84d] text-[#111318] font-black", children: "A" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs uppercase tracking-[0.35em] text-white/40", children: "AllIn OS" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-white/75", children: "Login" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "rounded-[28px] border border-white/10 bg-[#0b1019]/95 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs uppercase tracking-[0.35em] text-white/35", children: "Acesso" }),
          /* @__PURE__ */ jsx("h2", { className: "text-3xl font-semibold tracking-tight", children: "Entrar na plataforma" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-white/55", children: "Use e-mail e senha ou escolha um perfil demo." })
        ] }),
        activeSponsor && /* @__PURE__ */ jsxs("div", { className: "mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300", children: [
          "Referencia ativa: ",
          /* @__PURE__ */ jsxs("span", { className: "font-semibold", children: [
            "@",
            activeSponsor
          ] })
        ] }),
        /* @__PURE__ */ jsxs("form", { onSubmit, className: "mt-6 space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs font-medium uppercase tracking-[0.25em] text-white/40", children: "E-mail" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                type: "email",
                value: email,
                onChange: (e) => setEmail(e.target.value),
                placeholder: "seu@email.com",
                autoComplete: "email",
                className: "h-11 rounded-xl border-white/10 bg-white/5 text-white placeholder:text-white/30 focus-visible:ring-amber-500/40"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3", children: [
              /* @__PURE__ */ jsx("label", { className: "text-xs font-medium uppercase tracking-[0.25em] text-white/40", children: "Senha" }),
              /* @__PURE__ */ jsx(Link, { to: "/recuperar-senha", className: "text-xs text-[#ffb84d] hover:text-[#ffd56b] hover:underline", children: "Esqueceu?" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx(
                Input,
                {
                  type: showPassword ? "text" : "password",
                  value: password,
                  onChange: (e) => setPassword(e.target.value),
                  placeholder: "••••••••",
                  autoComplete: "current-password",
                  className: "h-11 rounded-xl border-white/10 bg-white/5 pr-11 text-white placeholder:text-white/30 focus-visible:ring-amber-500/40"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setShowPassword((value) => !value),
                  className: "absolute inset-y-0 right-3 grid place-items-center text-white/45 hover:text-white",
                  "aria-label": showPassword ? "Ocultar senha" : "Mostrar senha",
                  children: showPassword ? /* @__PURE__ */ jsx(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(Eye, { className: "h-4 w-4" })
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsx(
            Button,
            {
              type: "submit",
              disabled: loading,
              className: "h-11 w-full rounded-xl bg-[#ffb84d] font-semibold text-[#111318] shadow-lg shadow-orange-500/20 hover:bg-[#ffd56b]",
              children: loading ? /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx("span", { className: "h-4 w-4 animate-spin rounded-full border-2 border-[#111318]/30 border-t-[#111318]" }),
                "Entrando..."
              ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(LogIn, { className: "h-4 w-4" }),
                "Entrar"
              ] })
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-7 flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "h-px flex-1 bg-white/10" }),
          /* @__PURE__ */ jsx("span", { className: "text-[11px] uppercase tracking-[0.3em] text-white/35", children: "Perfis de teste" }),
          /* @__PURE__ */ jsx("div", { className: "h-px flex-1 bg-white/10" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mt-5 grid gap-2 sm:grid-cols-2", children: getTestLoginAccounts().map((account) => {
          const icon = account.role === UserRole.ADMIN_MASTER || account.role === UserRole.GESTAO_ADMIN ? /* @__PURE__ */ jsx(Crown, { className: "h-4 w-4 text-amber-300" }) : account.role === UserRole.FINANCEIRO ? /* @__PURE__ */ jsx(Wallet, { className: "h-4 w-4 text-sky-300" }) : account.role === UserRole.SUPORTE ? /* @__PURE__ */ jsx(Headphones, { className: "h-4 w-4 text-cyan-300" }) : /* @__PURE__ */ jsx(Users, { className: "h-4 w-4 text-fuchsia-300" });
          return /* @__PURE__ */ jsxs(
            Button,
            {
              type: "button",
              variant: "outline",
              disabled: loading,
              onClick: () => onQuickLogin(account),
              className: "h-auto min-h-12 justify-start gap-3 rounded-xl border-white/10 bg-white/5 px-4 py-3 text-left text-white hover:bg-white/10 hover:text-white",
              children: [
                icon,
                /* @__PURE__ */ jsxs("span", { className: "flex min-w-0 flex-1 flex-col", children: [
                  /* @__PURE__ */ jsx("span", { className: "truncate text-sm font-medium", children: account.label }),
                  /* @__PURE__ */ jsx("span", { className: "truncate text-[11px] text-white/35", children: getDemoRedirectPath(account.role) })
                ] })
              ]
            },
            account.email
          );
        }) }),
        /* @__PURE__ */ jsxs("div", { className: "mt-6 flex flex-col gap-3 border-t border-white/10 pt-5 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left", children: [
          /* @__PURE__ */ jsxs("p", { className: "text-sm text-white/55", children: [
            "Ainda nao tem conta?",
            " ",
            /* @__PURE__ */ jsx(Link, { to: "/seja-distribuidor", className: "font-medium text-[#ffb84d] hover:text-[#ffd56b] hover:underline", children: "Seja um distribuidor" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-white/35", children: "Acesso preparado para desktop e mobile." })
        ] })
      ] })
    ] }) })
  ] }) });
}
function LoginRoute() {
  return /* @__PURE__ */ jsx(LoginView, {});
}
export {
  LoginRoute as component
};
