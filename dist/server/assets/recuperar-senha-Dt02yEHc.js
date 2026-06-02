import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
function RecoverPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Por favor, preencha o campo de e-mail.");
      return;
    }
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setLoading(false);
    setSent(true);
    toast.success("E-mail de redefinição enviado com sucesso (simulado).");
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen flex text-foreground bg-[#04060a] relative overflow-hidden py-12 px-4 flex-col justify-center items-center", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-primary/10 blur-[130px] pointer-events-none" }),
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[linear-gradient(to_right,#080c14_1px,transparent_1px),linear-gradient(to_bottom,#080c14_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-40" }),
    /* @__PURE__ */ jsxs("div", { className: "w-full max-w-[420px] space-y-8 relative z-10", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center space-y-2", children: [
        /* @__PURE__ */ jsxs(Link, { to: "/login", className: "inline-flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("div", { className: "h-8 w-8 rounded-lg bg-gradient-to-br from-primary via-fuchsia-500 to-cyan-400 grid place-items-center text-primary-foreground font-black text-xs", children: "A" }),
          /* @__PURE__ */ jsx("p", { className: "font-bold tracking-tight text-md text-white", children: "Allin OS" })
        ] }),
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold tracking-tight text-white font-sans mt-4", children: "Recuperar Chave de Acesso" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Insira seu email corporativo cadastrado para receber as instruções de recuperação de segurança." })
      ] }),
      /* @__PURE__ */ jsx(motion.div, { initial: {
        opacity: 0,
        scale: 0.98
      }, animate: {
        opacity: 1,
        scale: 1
      }, className: "rounded-xl border border-border/60 bg-[#090d16]/85 p-6 shadow-2xl backdrop-blur-md", children: sent ? /* @__PURE__ */ jsxs("div", { className: "space-y-4 text-center py-4", children: [
        /* @__PURE__ */ jsx("div", { className: "h-12 w-12 rounded-full bg-emerald-500/15 border border-emerald-500/25 grid place-items-center text-emerald-400 mx-auto", children: /* @__PURE__ */ jsx(CheckCircle2, { className: "h-6 w-6" }) }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-white", children: "Link enviado com sucesso!" }),
          /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground leading-relaxed", children: [
            "Enviamos um código de segurança privado para ",
            /* @__PURE__ */ jsx("strong", { className: "text-white", children: email }),
            ". Siga as instruções descritas no corpo do e-mail."
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "pt-2", children: /* @__PURE__ */ jsxs(Link, { to: "/redefinir-senha", className: "w-full h-9 rounded-lg bg-primary hover:bg-primary/95 text-primary-foreground text-xs font-semibold transition-all flex items-center justify-center gap-1 cursor-pointer pt-0.5", children: [
          "Seguir para Redefinição de Senha",
          /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4" })
        ] }) })
      ] }) : /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx("label", { className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block", children: "E-mail Cadastrado" }),
          /* @__PURE__ */ jsx("input", { type: "email", required: true, value: email, onChange: (e) => setEmail(e.target.value), className: "w-full h-9 px-3.5 rounded-lg border border-border/60 bg-background/50 text-xs placeholder-muted-foreground focus:outline-none focus:border-primary/80 transition-all text-white font-mono", placeholder: "Seu email cadastrado" })
        ] }),
        /* @__PURE__ */ jsx("button", { type: "submit", disabled: loading, className: "w-full h-9 rounded-lg bg-primary hover:bg-primary/95 text-primary-foreground text-xs font-semibold transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-primary/25 disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer pt-0.5", children: loading ? "Enviando link..." : "Receber Link de Recuperação" })
      ] }) }),
      /* @__PURE__ */ jsxs("p", { className: "text-center text-xs text-muted-foreground", children: [
        "Voltar para o",
        " ",
        /* @__PURE__ */ jsx(Link, { to: "/login", className: "text-primary hover:underline font-semibold", children: "Login Principal" })
      ] })
    ] })
  ] });
}
export {
  RecoverPasswordPage as component
};
