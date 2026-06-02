import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { m as motion } from "../_libs/framer-motion.mjs";
import { c as CircleCheck } from "../_libs/lucide-react.mjs";

import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/unenv.mjs";


import "../_libs/seroval-plugins.mjs";


import "../_libs/react-dom.mjs";
import "../_libs/isbot.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
function ResetPasswordPage() {
  const [password, setPassword] = reactExports.useState("");
  const [confirmPassword, setConfirmPassword] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const [success, setSuccess] = reactExports.useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("As senhas digitadas não batem.");
      return;
    }
    if (password.length < 6) {
      toast.error("A senha deve possuir ao menos 6 caracteres.");
      return;
    }
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setLoading(false);
    setSuccess(true);
    toast.success("Senha atualizada com sucesso no banco de dados.");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex text-foreground bg-[#04060a] relative overflow-hidden py-12 px-4 flex-col justify-center items-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-primary/10 blur-[130px] pointer-events-none" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-[linear-gradient(to_right,#080c14_1px,transparent_1px),linear-gradient(to_bottom,#080c14_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-40" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-[420px] space-y-8 relative z-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/login", className: "inline-flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 rounded-lg bg-gradient-to-br from-primary via-fuchsia-500 to-cyan-400 grid place-items-center text-primary-foreground font-black text-xs", children: "A" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold tracking-tight text-md text-white", children: "Allin OS" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold tracking-tight text-white font-sans mt-4", children: "Redefinir Chave de Acesso" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Cadastre sua nova senha forte para restabelecer os privilégios seguros de sua conta." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: {
        opacity: 0,
        scale: 0.98
      }, animate: {
        opacity: 1,
        scale: 1
      }, className: "rounded-xl border border-border/60 bg-[#090d16]/85 p-6 shadow-2xl backdrop-blur-md", children: success ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 text-center py-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 rounded-full bg-emerald-500/15 border border-emerald-500/25 grid place-items-center text-emerald-400 mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-6 w-6" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-white", children: "Senha Redefinida!" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Sua credencial de segurança foi atualizada em nossos nós PostgreSQL. Faça login agora com a nova chave." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", className: "w-full h-9 rounded-lg bg-primary hover:bg-primary/95 text-primary-foreground text-xs font-semibold transition-all flex items-center justify-center cursor-pointer pt-0.5", children: "Ir para Tela de Login Base" }) })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block", children: "Nova Senha de Acesso" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "password", required: true, value: password, onChange: (e) => setPassword(e.target.value), className: "w-full h-9 px-3.5 rounded-lg border border-border/60 bg-background/50 text-xs focus:outline-none focus:border-primary/80 transition-all text-white font-mono", placeholder: "Nova senha (min 6 caracteres)" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block", children: "Confirmar Nova Senha" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "password", required: true, value: confirmPassword, onChange: (e) => setConfirmPassword(e.target.value), className: "w-full h-9 px-3.5 rounded-lg border border-border/60 bg-background/50 text-xs focus:outline-none focus:border-primary/80 transition-all text-white font-mono", placeholder: "Redigite a nova senha" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: loading, className: "w-full h-9 rounded-lg bg-primary hover:bg-primary/95 text-primary-foreground text-xs font-semibold transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-primary/25 disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer pt-0.5", children: loading ? "Gravando nova senha..." : "Salvar Nova Senha de Segurança" })
      ] }) })
    ] })
  ] });
}
export {
  ResetPasswordPage as component
};
