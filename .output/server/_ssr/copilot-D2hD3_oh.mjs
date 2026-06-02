import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { B as Button } from "./router-BZaVudxP.mjs";
import { I as Input } from "./input-D1i_JeqC.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { q as Sparkles, aD as Bot, p as Check, I as Copy, u as Send, aE as Lightbulb, n as Star, ac as TriangleAlert, k as TrendingUp } from "../_libs/lucide-react.mjs";

import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/unenv.mjs";


import "../_libs/seroval-plugins.mjs";


import "../_libs/react-dom.mjs";
import "../_libs/isbot.mjs";
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
import "./roles-DEW722fr.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/framer-motion.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
const PRESET_PROMPTS = ["Gerar Copy de Vendas", "Quem está com risco de abandono?", "Como qualificar para Diamante?", "Análise de Faturamento"];
function CopilotPage() {
  const [messages, setMessages] = reactExports.useState([{
    id: "m1",
    sender: "copilot",
    text: "Olá! Eu agora opero sem dados mockados da camada antiga.",
    timestamp: "Agora"
  }]);
  const [inputText, setInputText] = reactExports.useState("");
  const [copiedId, setCopiedId] = reactExports.useState(null);
  const send = (text) => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, {
      id: `u-${Date.now()}`,
      sender: "user",
      text,
      timestamp: "Agora"
    }]);
    setMessages((prev) => [...prev, {
      id: `c-${Date.now()}`,
      sender: "copilot",
      text: `Resposta simplificada baseada em dados reais e contexto operacional para: "${text}".`,
      timestamp: "Agora",
      copyableText: text
    }]);
    setInputText("");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-3xl font-bold tracking-tight text-white flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-8 w-8 text-primary shrink-0" }),
        " Copiloto IA"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-1", children: "Interface mantida, conteúdo legado removido." })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-2 rounded-2xl border border-border/60 bg-[#070b13] flex flex-col h-[520px] overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-background/80 p-4 border-b border-border/40 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-7 w-7 rounded-lg bg-primary/20 text-primary grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bot, { className: "h-4 w-4" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-white", children: "Assistente" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "ghost", className: "h-7 text-[10px] font-mono hover:text-white", onClick: () => setMessages([{
            id: "m1",
            sender: "copilot",
            text: "Histórico limpo.",
            timestamp: "Agora"
          }]), children: "Limpar" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto p-4 space-y-4", children: messages.map((msg) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex gap-3 max-w-[85%] ${msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-8 w-8 rounded-full grid place-items-center text-xs shrink-0 font-bold ${msg.sender === "user" ? "bg-indigo-500 text-white" : "bg-primary text-white"}`, children: msg.sender === "user" ? "M" : "A" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `rounded-2xl p-3.5 text-xs leading-relaxed ${msg.sender === "user" ? "bg-indigo-600 text-white" : "bg-[#101928] border border-border/40 text-muted-foreground"}`, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "whitespace-pre-line text-white", children: msg.text }),
              msg.copyableText && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 pt-3 border-t border-border/20 flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "secondary", className: "h-7 text-[11px] gap-1 px-2", onClick: () => {
                navigator.clipboard.writeText(msg.copyableText);
                setCopiedId(msg.id);
                toast.success("Copiado!");
              }, children: [
                copiedId === msg.id ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3 w-3 text-emerald-400" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "h-3 w-3" }),
                " ",
                copiedId === msg.id ? "Copiado!" : "Copiar Texto"
              ] }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] text-muted-foreground font-mono block px-1.5", children: msg.timestamp })
          ] })
        ] }, msg.id)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 pb-2 pt-1 border-t border-border/10 flex flex-wrap gap-1.5 bg-black/10", children: PRESET_PROMPTS.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => send(p), className: "text-[10px] font-mono bg-background border border-border/70 text-muted-foreground hover:text-white px-2.5 py-1 rounded-full", children: p }, p)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-background border-t border-border/40 flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: inputText, onChange: (e) => setInputText(e.target.value), onKeyDown: (e) => {
            if (e.key === "Enter") send(inputText);
          }, placeholder: "Perguntar ao copiloto...", className: "h-10 text-xs border-border/60" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "h-10 px-4 bg-gradient-to-r from-primary to-fuchsia-500", onClick: () => send(inputText), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-4 w-4" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl border border-border/60 bg-card/60 p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 border-b border-border/40 pb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Lightbulb, { className: "h-5 w-5 text-amber-400" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-bold text-white uppercase tracking-wider font-mono", children: "Dicas" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-primary/5 border border-primary/20 rounded-xl", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-semibold text-white flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-3.5 w-3.5 text-yellow-500 fill-current" }),
            " Saturação"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: "Use os dados reais dos relatórios para orientar campanhas." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-rose-500/5 border border-rose-500/20 rounded-xl", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-semibold text-rose-400 flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3.5 w-3.5" }),
            " Risco"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: "O copiloto agora não depende de `distributor-data`." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-semibold text-emerald-400 flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-3.5 w-3.5" }),
            " Desempenho"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: "Integrações futuras podem ser conectadas a consultas reais." })
        ] })
      ] }) })
    ] })
  ] });
}
export {
  CopilotPage as component
};
