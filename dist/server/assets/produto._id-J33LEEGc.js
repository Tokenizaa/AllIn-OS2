import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { R as Route, b as useAuth, d as useDistributor, a as Badge, P as PublicHeader } from "./router-OVqp2Aj1.js";
import { s as supabase } from "./supabase-client-BdpvIS_G.js";
import { ChevronRight, ShoppingCart, ShieldCheck, Award } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import "@tanstack/react-query";
import "./roles-DEW722fr.js";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "@supabase/supabase-js";
function ProductDetailPage() {
  const {
    id
  } = Route.useParams();
  const {
    triggerBinomialBonusPay,
    addAuditLog
  } = useAuth();
  const {
    currentDistributor,
    setDistributorBySlug
  } = useDistributor();
  const [prod, setProd] = useState(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [custName, setCustName] = useState("");
  const [custEmail, setCustEmail] = useState("");
  const [custCPF, setCustCPF] = useState("");
  const [custPhone, setCustPhone] = useState("");
  useEffect(() => {
    void (async () => {
      const {
        data
      } = await supabase.from("products").select("*").eq("id", id).maybeSingle();
      setProd(data || null);
    })();
  }, [id]);
  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get("ref")?.toLowerCase().trim();
    if (slug) setDistributorBySlug(slug);
  }, [setDistributorBySlug]);
  const sponsorSlug = currentDistributor.slug;
  const distName = currentDistributor.name;
  const distRank = currentDistributor.rank;
  if (!prod) return /* @__PURE__ */ jsx("div", { className: "p-8 text-sm text-muted-foreground", children: "Carregando produto real..." });
  const formatBRL = (value) => new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(value);
  const finalPrice = Number(prod.price || 0);
  const handleQuickCheckoutSubmit = (e) => {
    e.preventDefault();
    if (!custName || !custEmail || !custCPF || !custPhone) {
      toast.error("Por favor, preencha todos os dados obrigatórios.");
      return;
    }
    setCheckoutOpen(false);
    void triggerBinomialBonusPay(Number(prod.bonus_payment_percentage || 0), finalPrice * 0.25, finalPrice);
    addAuditLog?.({
      id: `tx-${Math.random().toString(36).substring(3, 11)}`,
      action: "RETAIL_SALE",
      userId: "guest",
      userName: custName,
      userRole: "customer",
      module: "orders",
      details: `Compra de ${prod.name} via loja de @${sponsorSlug}.`,
      ip: "0.0.0.0"
    });
    toast.success("Checkout iniciado.");
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-[#06080d] text-white overflow-x-hidden", children: [
    /* @__PURE__ */ jsxs("div", { className: "bg-[#0b1220] border-b border-border/10 px-4 py-2.5 text-center flex items-center justify-center gap-2 text-xs relative z-40", children: [
      /* @__PURE__ */ jsx("span", { className: "h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" }),
      /* @__PURE__ */ jsxs("p", { className: "text-zinc-300", children: [
        "Você está visualizando este produto sob indicação de ",
        /* @__PURE__ */ jsx("strong", { className: "text-white", children: distName })
      ] }),
      /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-[9px] font-mono leading-none py-0.5 uppercase", children: distRank }),
      /* @__PURE__ */ jsxs(Link, { to: "/$slug", params: {
        slug: sponsorSlug
      }, className: "text-emerald-400 hover:text-emerald-300 ml-1.5 underline inline-flex items-center gap-0.5", children: [
        "Ver perfil ",
        /* @__PURE__ */ jsx(ChevronRight, { className: "h-3 w-3" })
      ] })
    ] }),
    /* @__PURE__ */ jsx(PublicHeader, {}),
    /* @__PURE__ */ jsxs("main", { className: "mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-12", children: [
      /* @__PURE__ */ jsxs("section", { className: "grid md:grid-cols-12 gap-8 items-start", children: [
        /* @__PURE__ */ jsx("div", { className: "md:col-span-5 space-y-4", children: /* @__PURE__ */ jsxs("div", { className: "relative rounded-2xl overflow-hidden border border-zinc-800 bg-[#090d16] p-1.5 shadow-2xl", children: [
          /* @__PURE__ */ jsx("img", { src: prod.image || "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=500", alt: prod.name, className: "w-full h-80 object-cover rounded-xl opacity-90" }),
          /* @__PURE__ */ jsx("span", { className: "absolute top-4 right-4 text-[9px] font-bold font-mono text-emerald-400 bg-background/90 border border-emerald-500/25 px-2.5 py-1 rounded-md uppercase", children: prod.category || "Produto" })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "md:col-span-7 space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx("h1", { className: "text-2xl sm:text-3xl font-black tracking-tight leading-snug", children: prod.name }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-300 leading-relaxed", children: prod.description || "Produto real carregado do Supabase." })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "border-t border-b border-zinc-800 py-4 grid grid-cols-3 gap-3 text-center text-xs", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-0.5", children: [
              /* @__PURE__ */ jsx("p", { className: "text-[10px] text-zinc-500 font-mono", children: "Código" }),
              /* @__PURE__ */ jsx("p", { className: "font-bold text-white font-mono", children: prod.id })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-0.5 border-l border-r border-zinc-800/60", children: [
              /* @__PURE__ */ jsx("p", { className: "text-[10px] text-zinc-500 font-mono", children: "Categoria" }),
              /* @__PURE__ */ jsx("p", { className: "font-bold text-white", children: prod.category || "-" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-0.5", children: [
              /* @__PURE__ */ jsx("p", { className: "text-[10px] text-zinc-500 font-mono", children: "Pontos" }),
              /* @__PURE__ */ jsxs("p", { className: "font-bold text-emerald-400 font-mono", children: [
                "+",
                prod.bonus_payment_percentage || 0
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-3 pt-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-baseline gap-2", children: [
              /* @__PURE__ */ jsx("span", { className: "text-xs text-zinc-500", children: "Preço:" }),
              /* @__PURE__ */ jsx("strong", { className: "text-3xl font-extrabold text-emerald-400 tracking-tight", children: formatBRL(Number(prod.price || 0)) })
            ] }),
            /* @__PURE__ */ jsxs("button", { onClick: () => setCheckoutOpen(true), className: "flex-1 h-11 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-black text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/15 cursor-pointer pt-0.5", children: [
              /* @__PURE__ */ jsx(ShoppingCart, { className: "h-4 w-4" }),
              " Comprar Online"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "pt-4 grid grid-cols-2 gap-4 text-xs text-zinc-400 border-t border-zinc-800", children: [
            /* @__PURE__ */ jsxs("p", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(ShieldCheck, { className: "h-4 w-4 text-emerald-400 shrink-0" }),
              " Checkout verificado"
            ] }),
            /* @__PURE__ */ jsxs("p", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Award, { className: "h-4 w-4 text-emerald-400 shrink-0" }),
              " Dados reais do banco"
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx(AnimatePresence, { children: checkoutOpen && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4", children: /* @__PURE__ */ jsxs(motion.div, { initial: {
        opacity: 0,
        scale: 0.95
      }, animate: {
        opacity: 1,
        scale: 1
      }, exit: {
        opacity: 0,
        scale: 0.95
      }, className: "rounded-3xl border border-zinc-800 bg-[#090d16] p-6 max-w-md w-full space-y-6 overflow-hidden", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center border-b border-zinc-850 pb-3", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-md font-bold text-white leading-tight", children: "Painel de Checkout Direto" }),
          /* @__PURE__ */ jsx("button", { onClick: () => setCheckoutOpen(false), className: "text-xs text-zinc-400 hover:text-white font-mono cursor-pointer bg-[#06080d] px-2.5 py-1 rounded-lg border border-border/30", children: "Recuar" })
        ] }),
        /* @__PURE__ */ jsxs("form", { onSubmit: handleQuickCheckoutSubmit, className: "space-y-4", children: [
          /* @__PURE__ */ jsx("input", { className: "w-full rounded bg-black/40 border border-zinc-700 p-2 text-sm", placeholder: "Nome", value: custName, onChange: (e) => setCustName(e.target.value) }),
          /* @__PURE__ */ jsx("input", { className: "w-full rounded bg-black/40 border border-zinc-700 p-2 text-sm", placeholder: "Email", value: custEmail, onChange: (e) => setCustEmail(e.target.value) }),
          /* @__PURE__ */ jsx("input", { className: "w-full rounded bg-black/40 border border-zinc-700 p-2 text-sm", placeholder: "CPF", value: custCPF, onChange: (e) => setCustCPF(e.target.value) }),
          /* @__PURE__ */ jsx("input", { className: "w-full rounded bg-black/40 border border-zinc-700 p-2 text-sm", placeholder: "Telefone", value: custPhone, onChange: (e) => setCustPhone(e.target.value) }),
          /* @__PURE__ */ jsx(Button, { type: "submit", className: "w-full", children: "Confirmar compra" })
        ] })
      ] }) }) })
    ] })
  ] });
}
export {
  ProductDetailPage as component
};
