import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "@tanstack/react-router";
import { RefreshCw, ShieldAlert, AlertTriangle, CheckCircle2, Sparkles, User, Mail, Lock, EyeOff, Eye, ArrowRight, LogIn } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { g as getRoleLabel, a as getRoleBadgeStyle } from "./rbac-utils-CjftAXfU.js";
import { n as Route, b as useAuth } from "./router-Piw3VGP8.js";
import "@tanstack/react-query";
import "./supabase-client-BdpvIS_G.js";
import "@supabase/supabase-js";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
function InviteActivationPage() {
  const {
    token
  } = Route.useParams();
  const navigate = useNavigate();
  const {
    getAdminInviteByToken,
    acceptAdminInvite
  } = useAuth();
  const [invite, setInvite] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  useEffect(() => {
    const match = getAdminInviteByToken(token);
    if (match) {
      setInvite(match);
      setName(match.full_name);
    }
    setLoaded(true);
  }, [token, getAdminInviteByToken]);
  const handleRegisterAdmin = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Por favor, preencha o seu nome completo.");
      return;
    }
    if (password.length < 6) {
      toast.error("A senha deve conter no mínimo 6 caracteres.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("As senhas inseridas não coincidem.");
      return;
    }
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1e3));
      await acceptAdminInvite(token, name.trim(), password);
      setSuccess(true);
      toast.success("Conta administrativa ativada com sucesso!");
      setTimeout(() => {
        navigate({
          to: "/"
        });
      }, 2500);
    } catch (err) {
      toast.error(err.message || "Erro ao registrar credenciais.");
    } finally {
      setLoading(false);
    }
  };
  if (!loaded) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center bg-[#04060a] text-white", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-2", children: [
      /* @__PURE__ */ jsx(RefreshCw, { className: "h-8 w-8 text-primary animate-spin" }),
      /* @__PURE__ */ jsx("p", { className: "text-xs font-mono text-muted-foreground uppercase tracking-wider", children: "Validando credenciais segurança..." })
    ] }) });
  }
  if (!invite) {
    return /* @__PURE__ */ jsxs("div", { className: "min-h-screen flex text-foreground bg-[#04060a] relative items-center justify-center p-4 overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-rose-500/5 blur-[100px] pointer-events-none" }),
      /* @__PURE__ */ jsxs(motion.div, { initial: {
        opacity: 0,
        y: 15
      }, animate: {
        opacity: 1,
        y: 0
      }, className: "w-full max-w-md rounded-2xl border border-rose-500/20 bg-card/60 p-6 backdrop-blur-md shadow-2xl relative z-10 text-center space-y-5", children: [
        /* @__PURE__ */ jsx("div", { className: "mx-auto h-12 w-12 rounded-full bg-rose-500/10 grid place-items-center border border-rose-500/25", children: /* @__PURE__ */ jsx(ShieldAlert, { className: "h-6 w-6 text-rose-400" }) }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold tracking-tight text-white", children: "Link de Convite Inválido" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: "O token de ativação fornecido é inválido, foi cancelado ou expirou o prazo de ativação regulamentar de 48 horas." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-3.5 rounded-lg border border-border bg-[#0b0f19] text-xs leading-relaxed text-muted-foreground text-left space-y-2", children: [
          /* @__PURE__ */ jsx("p", { className: "font-semibold text-white", children: "O que pode ser feito?" }),
          /* @__PURE__ */ jsxs("ul", { className: "list-disc pl-4 space-y-1 opacity-90 font-mono text-[10px]", children: [
            /* @__PURE__ */ jsx("li", { children: "Solicitar uma nova via de convite ao Admin Master." }),
            /* @__PURE__ */ jsx("li", { children: "Confirmar se o token foi copiado integralmente sem quebras." }),
            /* @__PURE__ */ jsx("li", { children: "Acessar com uma conta administrativa já ativada." })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "pt-2 flex flex-col gap-2", children: /* @__PURE__ */ jsx(Link, { to: "/login", className: "w-full h-10 inline-flex items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-750 text-white font-semibold text-xs transition-colors", children: "Ir para Tela de Login" }) })
      ] })
    ] });
  }
  if (invite.status !== "pending") {
    const isAccepted = invite.status === "accepted";
    const statusLabel = isAccepted ? "utilizado" : invite.status === "revoked" ? "revogado" : "expirado";
    const statusColor = isAccepted ? "text-emerald-400" : "text-rose-400";
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex text-foreground bg-[#04060a] relative items-center justify-center p-4 overflow-hidden", children: /* @__PURE__ */ jsxs(motion.div, { initial: {
      opacity: 0,
      y: 15
    }, animate: {
      opacity: 1,
      y: 0
    }, className: "w-full max-w-md rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-md shadow-2xl relative z-10 text-center space-y-5", children: [
      /* @__PURE__ */ jsx("div", { className: "mx-auto h-12 w-12 rounded-full bg-slate-800/80 grid place-items-center border border-border", children: /* @__PURE__ */ jsx(AlertTriangle, { className: `h-6 w-6 ${statusColor}` }) }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold tracking-tight text-white", children: "Convite Inativo" }),
        /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground leading-relaxed", children: [
          "Este convite gerado para ",
          /* @__PURE__ */ jsx("span", { className: "text-white font-semibold", children: invite.email }),
          " já está ",
          /* @__PURE__ */ jsx("span", { className: `font-semibold ${statusColor}`, children: statusLabel }),
          "."
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "pt-2 flex flex-col gap-2", children: /* @__PURE__ */ jsx(Link, { to: "/login", className: "w-full h-10 inline-flex items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-750 text-white font-semibold text-xs transition-colors", children: "Fazer Login Corporativo" }) })
    ] }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen flex text-foreground bg-[#04060a] relative overflow-hidden items-center justify-center p-4", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-primary/10 blur-[130px] pointer-events-none" }),
    /* @__PURE__ */ jsx("div", { className: "absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-fuchsia-500/5 blur-[120px] pointer-events-none" }),
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[linear-gradient(to_right,#080c14_1px,transparent_1px),linear-gradient(to_bottom,#080c14_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-40" }),
    /* @__PURE__ */ jsxs("div", { className: "w-full max-w-lg z-10 space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2.5 mb-2", children: [
        /* @__PURE__ */ jsx("div", { className: "h-8 w-8 rounded-lg bg-gradient-to-br from-primary via-fuchsia-500 to-cyan-400 grid place-items-center text-primary-foreground font-black text-sm shadow", children: "A" }),
        /* @__PURE__ */ jsx("p", { className: "font-bold tracking-tight text-md text-white", children: "Allin OS" }),
        /* @__PURE__ */ jsx("span", { className: "text-[9px] text-muted-foreground uppercase tracking-wider font-mono px-1.5 py-0.5 rounded border border-border bg-card/60", children: "Enterprise Staff" })
      ] }),
      success ? (
        /* Animated success display upon registration finish */
        /* @__PURE__ */ jsxs(motion.div, { initial: {
          opacity: 0,
          scale: 0.95
        }, animate: {
          opacity: 1,
          scale: 1
        }, className: "rounded-2xl border border-emerald-500/20 bg-card/60 p-8 text-center space-y-4 shadow-xl backdrop-blur-md", children: [
          /* @__PURE__ */ jsx("div", { className: "mx-auto h-12 w-12 rounded-full bg-emerald-500/10 grid place-items-center border border-emerald-500/30", children: /* @__PURE__ */ jsx(CheckCircle2, { className: "h-7 w-7 text-emerald-400 animate-bounce" }) }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold tracking-tight text-white", children: "Verificação Concluída!" }),
            /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground leading-relaxed", children: [
              "As credenciais da sua conta administrativa da equipe ",
              /* @__PURE__ */ jsx("span", { className: "font-semibold text-white", children: "Allin OS" }),
              " foram ativadas com absoluto sucesso."
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground/80", children: [
            /* @__PURE__ */ jsx(RefreshCw, { className: "h-3 w-3 animate-spin text-primary" }),
            "Sincronizando RBAC e redirecionando ao dashboard principal..."
          ] })
        ] })
      ) : (
        /* Standard registration/activation form */
        /* @__PURE__ */ jsxs(motion.div, { initial: {
          opacity: 0,
          y: 12
        }, animate: {
          opacity: 1,
          y: 0
        }, className: "rounded-2xl border border-border/80 bg-card/60 p-6 shadow-2xl backdrop-blur-md", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-1 mr-auto text-left border-b border-border/40 pb-4 mb-4", children: [
            /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20", children: [
              /* @__PURE__ */ jsx(Sparkles, { className: "h-3 w-3 animate-pulse" }),
              "Admissão Administrativa"
            ] }),
            /* @__PURE__ */ jsx("h1", { className: "text-xl font-bold tracking-tight text-white", children: "Ative sua Conta da Equipe" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: "Bem-vindo à equipe! Complete as informações abaixo para estabelecer sua segurança de acesso." })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mb-4 p-3.5 rounded-xl border border-border/60 bg-[#070a13] flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-0.5 text-left", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[9px] text-muted-foreground uppercase tracking-wider font-mono", children: "Cargo Autorizado:" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-white", children: getRoleLabel(invite.role) })
            ] }),
            /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: `py-1 px-2.5 ${getRoleBadgeStyle(invite.role)}`, children: [
              "RBAC Nível ",
              invite.permissions.length + 1
            ] })
          ] }),
          /* @__PURE__ */ jsxs("form", { onSubmit: handleRegisterAdmin, className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-1.5 text-left", children: [
              /* @__PURE__ */ jsxs("label", { className: "text-xs font-semibold text-muted-foreground flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(User, { className: "h-3 w-3" }),
                " Nome Completo"
              ] }),
              /* @__PURE__ */ jsx(Input, { placeholder: "Seu nome oficial", value: name, onChange: (e) => setName(e.target.value), className: "bg-background/40", required: true })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-1.5 text-left", children: [
              /* @__PURE__ */ jsxs("label", { className: "text-xs font-semibold text-muted-foreground flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(Mail, { className: "h-3 w-3" }),
                " E-mail de Admissão (Vinculado)"
              ] }),
              /* @__PURE__ */ jsx(Input, { type: "email", value: invite.email, className: "bg-background/30 opacity-60 cursor-not-allowed font-mono text-xs", disabled: true })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-1.5 text-left", children: [
              /* @__PURE__ */ jsxs("label", { className: "text-xs font-semibold text-muted-foreground flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(Lock, { className: "h-3 w-3" }),
                " Defina sua Senha Corporativa"
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsx(Input, { type: showPassword ? "text" : "password", placeholder: "Mínimo de 6 caracteres", value: password, onChange: (e) => setPassword(e.target.value), className: "bg-background/40 pl-3 pr-9", required: true }),
                /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setShowPassword(!showPassword), className: "absolute right-3 top-2.5 text-slate-500 hover:text-white", children: showPassword ? /* @__PURE__ */ jsx(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(Eye, { className: "h-4 w-4" }) })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-1.5 text-left", children: [
              /* @__PURE__ */ jsxs("label", { className: "text-xs font-semibold text-muted-foreground flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(Lock, { className: "h-3 w-3" }),
                " Confirme sua Senha"
              ] }),
              /* @__PURE__ */ jsx(Input, { type: showPassword ? "text" : "password", placeholder: "Redigite a senha corporativa", value: confirmPassword, onChange: (e) => setConfirmPassword(e.target.value), className: "bg-background/40", required: true })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "pt-2", children: /* @__PURE__ */ jsx(Button, { type: "submit", disabled: loading, className: "w-full text-xs font-semibold py-2 bg-gradient-to-r from-primary to-fuchsia-600 hover:opacity-95 text-white rounded-lg flex items-center justify-center gap-1", children: loading ? /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsx(RefreshCw, { className: "h-3.5 w-3.5 animate-spin" }),
              "Estruturando credenciais..."
            ] }) : /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
              "Finalizar Processo de Ativação",
              /* @__PURE__ */ jsx(ArrowRight, { className: "h-3.5 w-3.5 ml-1" })
            ] }) }) })
          ] })
        ] })
      ),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-[11px] text-muted-foreground px-1", children: [
        /* @__PURE__ */ jsxs("span", { children: [
          "Expira em: ",
          /* @__PURE__ */ jsx("strong", { className: "font-mono text-[10px] text-slate-400", children: new Date(invite.expires_at).toLocaleString("pt-BR") })
        ] }),
        /* @__PURE__ */ jsxs(Link, { to: "/login", className: "hover:text-white hover:underline flex items-center gap-1", children: [
          /* @__PURE__ */ jsx(LogIn, { className: "h-3 w-3" }),
          " Voltar ao Login"
        ] })
      ] })
    ] })
  ] });
}
export {
  InviteActivationPage as component
};
