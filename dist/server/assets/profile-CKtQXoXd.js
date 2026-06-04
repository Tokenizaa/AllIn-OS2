import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { User, Camera, Check, Copy, Building, Shield } from "lucide-react";
import { a as Badge, B as Button } from "./router-Piw3VGP8.js";
import { I as Input } from "./input-QP3DCRKc.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-DBV3uj2e.js";
import { s as supabase } from "./supabase-client-BdpvIS_G.js";
import { toast } from "sonner";
import "@tanstack/react-query";
import "@tanstack/react-router";
import "framer-motion";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "@radix-ui/react-tabs";
import "@supabase/supabase-js";
function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [isCopied, setIsCopied] = useState(false);
  useEffect(() => {
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
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs("h1", { className: "text-3xl font-bold tracking-tight text-white flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(User, { className: "h-8 w-8 text-primary shrink-0" }),
        "Meus Dados"
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm mt-1", children: "Perfil carregado do Supabase." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-4 gap-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-1 space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-border/60 bg-card/60 p-5 text-center flex flex-col items-center gap-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "relative group cursor-pointer", children: [
            /* @__PURE__ */ jsx("div", { className: "h-20 w-20 rounded-full bg-gradient-to-tr from-primary via-fuchsia-500 to-cyan-400 p-0.5 shadow-lg", children: /* @__PURE__ */ jsx("div", { className: "h-full w-full rounded-full bg-slate-900 flex items-center justify-center text-xl font-bold text-white uppercase", children: (profile?.name || "U").split(" ").map((n) => n[0]).slice(0, 2).join("") }) }),
            /* @__PURE__ */ jsx("div", { className: "absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] uppercase font-mono", children: /* @__PURE__ */ jsx(Camera, { className: "h-4 w-4" }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-white truncate max-w-[150px] mx-auto", children: profile?.name || "-" }),
            /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
              "ID: ",
              profile?.id || "-"
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-1 w-full pt-1.5 border-t border-border/20", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-xs", children: [
            /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Papel:" }),
            /* @__PURE__ */ jsx(Badge, { className: "bg-primary/20 text-primary border-primary/30 text-[9px] px-1.5 py-0", children: profile?.role || "-" })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-border/60 bg-blue-500/5 p-4 space-y-2.5", children: [
          /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-primary uppercase tracking-wider font-mono block", children: "Link de Recrutador" }),
          /* @__PURE__ */ jsx("p", { className: "text-[11px] text-muted-foreground leading-snug", children: "Esse dado agora vem do perfil real." }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-1.5 pt-1", children: [
            /* @__PURE__ */ jsx(Input, { type: "text", value: profile?.sponsor_id || "", readOnly: true, className: "h-8 text-[10px] font-mono bg-background/50 flex-1 border-border/60" }),
            /* @__PURE__ */ jsx(Button, { size: "sm", variant: "outline", className: "h-8 w-8 p-0 shrink-0 border-border/60 hover:text-white", onClick: copySponsorLink, children: isCopied ? /* @__PURE__ */ jsx(Check, { className: "h-3.5 w-3.5 text-emerald-400" }) : /* @__PURE__ */ jsx(Copy, { className: "h-3.5 w-3.5" }) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "lg:col-span-3", children: /* @__PURE__ */ jsxs(Tabs, { defaultValue: "perfil", className: "space-y-6", children: [
        /* @__PURE__ */ jsxs(TabsList, { className: "bg-background border border-border/50 max-w-full flex justify-start items-center overflow-x-auto gap-1", children: [
          /* @__PURE__ */ jsxs(TabsTrigger, { value: "perfil", className: "gap-1.5 text-xs", children: [
            /* @__PURE__ */ jsx(User, { className: "h-3.5 w-3.5" }),
            " Meu Perfil"
          ] }),
          /* @__PURE__ */ jsxs(TabsTrigger, { value: "financeiro", className: "gap-1.5 text-xs", children: [
            /* @__PURE__ */ jsx(Building, { className: "h-3.5 w-3.5" }),
            " Conta & PIX"
          ] }),
          /* @__PURE__ */ jsxs(TabsTrigger, { value: "seguranca", className: "gap-1.5 text-xs", children: [
            /* @__PURE__ */ jsx(Shield, { className: "h-3.5 w-3.5" }),
            " Segurança & Logs"
          ] })
        ] }),
        /* @__PURE__ */ jsxs(TabsContent, { value: "perfil", className: "space-y-5 rounded-2xl border border-border/60 bg-card/40 p-6", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-white uppercase tracking-wider font-mono", children: "Dados Cadastrais Básicos" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Os campos agora são preenchidos a partir de profiles." })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsx(Field, { label: "Nome Completo", value: profile?.name || "-" }),
            /* @__PURE__ */ jsx(Field, { label: "Endereço de E-mail", value: profile?.email || "-" }),
            /* @__PURE__ */ jsx(Field, { label: "Número de Telefone", value: profile?.phone || "-" }),
            /* @__PURE__ */ jsx(Field, { label: "CPF Fiscal", value: profile?.cpf || "-" })
          ] })
        ] }),
        /* @__PURE__ */ jsx(TabsContent, { value: "financeiro", className: "rounded-2xl border border-border/60 bg-card/40 p-6", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "A carteira bancária foi removida daqui porque agora vive no backend." }) }),
        /* @__PURE__ */ jsx(TabsContent, { value: "seguranca", className: "rounded-2xl border border-border/60 bg-card/40 p-6", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Logs e auditoria devem vir da tabela audit_log." }) })
      ] }) })
    ] })
  ] });
}
function Field({
  label,
  value
}) {
  return /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
    /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: label }),
    /* @__PURE__ */ jsx(Input, { value, readOnly: true, className: "h-9 text-xs bg-muted/20 text-muted-foreground cursor-not-allowed" })
  ] });
}
export {
  ProfilePage as component
};
