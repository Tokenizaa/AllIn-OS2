import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { a as Badge, B as Button } from "./router-BZaVudxP.mjs";
import { I as Input } from "./input-D1i_JeqC.mjs";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-DH3dyAiq.mjs";
import { s as supabase } from "./supabase-client-BdpvIS_G.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { z as User, av as Camera, p as Check, I as Copy, aw as Building, j as Shield } from "../_libs/lucide-react.mjs";

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
import "./roles-DEW722fr.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/framer-motion.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/tslib.mjs";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/radix-ui__react-tabs.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-roving-focus.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/radix-ui__react-presence.mjs";
function ProfilePage() {
  const [profile, setProfile] = reactExports.useState(null);
  const [isCopied, setIsCopied] = reactExports.useState(false);
  reactExports.useEffect(() => {
    let mounted = true;
    void (async () => {
      const {
        data
      } = await supabase.from("profiles").select("id, name, email, phone, cpf, sponsor_id, city, state, role").order("created_at", {
        ascending: false
      }).limit(1).maybeSingle();
      if (mounted) setProfile(data || null);
    })();
    return () => {
      mounted = false;
    };
  }, []);
  const copySponsorLink = async () => {
    const value = profile?.sponsor_id || "";
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setIsCopied(true);
    toast.success("Link copiado para compartilhamento!");
    setTimeout(() => setIsCopied(false), 2e3);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-3xl font-bold tracking-tight text-white flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-8 w-8 text-primary shrink-0" }),
        "Meus Dados"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-1", children: "Perfil carregado do Supabase." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-4 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-1 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border/60 bg-card/60 p-5 text-center flex flex-col items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group cursor-pointer", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-20 w-20 rounded-full bg-gradient-to-tr from-primary via-fuchsia-500 to-cyan-400 p-0.5 shadow-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full w-full rounded-full bg-slate-900 flex items-center justify-center text-xl font-bold text-white uppercase", children: (profile?.name || "U").split(" ").map((n) => n[0]).slice(0, 2).join("") }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] uppercase font-mono", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "h-4 w-4" }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-white truncate max-w-[150px] mx-auto", children: profile?.name || "-" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
              "ID: ",
              profile?.id || "-"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-1 w-full pt-1.5 border-t border-border/20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Papel:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-primary/20 text-primary border-primary/30 text-[9px] px-1.5 py-0", children: profile?.role || "-" })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border/60 bg-blue-500/5 p-4 space-y-2.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold text-primary uppercase tracking-wider font-mono block", children: "Link de Recrutador" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground leading-snug", children: "Esse dado agora vem do perfil real." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1.5 pt-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "text", value: profile?.sponsor_id || "", readOnly: true, className: "h-8 text-[10px] font-mono bg-background/50 flex-1 border-border/60" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", className: "h-8 w-8 p-0 shrink-0 border-border/60 hover:text-white", onClick: copySponsorLink, children: isCopied ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3.5 w-3.5 text-emerald-400" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "h-3.5 w-3.5" }) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "perfil", className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "bg-background border border-border/50 max-w-full flex justify-start items-center overflow-x-auto gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "perfil", className: "gap-1.5 text-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-3.5 w-3.5" }),
            " Meu Perfil"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "financeiro", className: "gap-1.5 text-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Building, { className: "h-3.5 w-3.5" }),
            " Conta & PIX"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "seguranca", className: "gap-1.5 text-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-3.5 w-3.5" }),
            " Segurança & Logs"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "perfil", className: "space-y-5 rounded-2xl border border-border/60 bg-card/40 p-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-bold text-white uppercase tracking-wider font-mono", children: "Dados Cadastrais Básicos" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Os campos agora são preenchidos a partir de profiles." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Nome Completo", value: profile?.name || "-" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Endereço de E-mail", value: profile?.email || "-" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Número de Telefone", value: profile?.phone || "-" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "CPF Fiscal", value: profile?.cpf || "-" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "financeiro", className: "rounded-2xl border border-border/60 bg-card/40 p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "A carteira bancária foi removida daqui porque agora vive no backend." }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "seguranca", className: "rounded-2xl border border-border/60 bg-card/40 p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Logs e auditoria devem vir da tabela audit_log." }) })
      ] }) })
    ] })
  ] });
}
function Field({
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value, readOnly: true, className: "h-9 text-xs bg-muted/20 text-muted-foreground cursor-not-allowed" })
  ] });
}
export {
  ProfilePage as component
};
