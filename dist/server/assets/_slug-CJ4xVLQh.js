import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "@tanstack/react-router";
import { d as useDistributor, h as useProducts, P as PublicHeader, B as Button } from "./router-Piw3VGP8.js";
import { Crown, MapPin, ShoppingBag, ArrowRight, Share2, MessageSquare, Instagram, Star, ChevronRight, Check, ShieldCheck } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import "@tanstack/react-query";
import "./supabase-client-BdpvIS_G.js";
import "@supabase/supabase-js";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
function DistributorPage() {
  const params = useParams({
    strict: false
  });
  const {
    currentDistributor,
    setDistributorBySlug
  } = useDistributor();
  const navigate = useNavigate();
  const {
    products
  } = useProducts();
  const formatBRL = (value) => {
    const num = parseFloat(value);
    return num.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });
  };
  const routeSlug = params.slug?.toLowerCase().trim();
  useEffect(() => {
    if (routeSlug) {
      setDistributorBySlug(routeSlug);
    }
  }, [routeSlug, setDistributorBySlug]);
  const sponsorSlug = currentDistributor.slug;
  const theme = currentDistributor.theme;
  const distName = currentDistributor.name;
  const distRank = currentDistributor.rank;
  const distAvatar = currentDistributor.avatar;
  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadOption, setLeadOption] = useState("all");
  const [submittingLead, setSubmittingLead] = useState(false);
  const [leadSuccess, setLeadSuccess] = useState(false);
  const handleLeadSubmit = (e) => {
    e.preventDefault();
    if (!leadName || !leadEmail || !leadPhone) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }
    setSubmittingLead(true);
    setTimeout(() => {
      setSubmittingLead(false);
      setLeadSuccess(true);
      toast.success("Lead cadastrado com sucesso e vinculado à rede!");
    }, 1500);
  };
  const shareProfile = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link do perfil copiado para compartilhamento!");
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-[#06080d] text-white selection:bg-emerald-500/30 overflow-x-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-emerald-950/20 via-transparent to-transparent blur-3xl pointer-events-none" }),
    /* @__PURE__ */ jsx("div", { className: `absolute top-1/4 -right-1/4 w-96 h-96 bg-gradient-to-r ${theme.color} opacity-10 blur-3xl pointer-events-none rounded-full` }),
    /* @__PURE__ */ jsx("div", { className: "absolute bottom-1/4 -left-1/4 w-96 h-96 bg-indigo-500/5 blur-3xl pointer-events-none rounded-full" }),
    /* @__PURE__ */ jsx(PublicHeader, {}),
    /* @__PURE__ */ jsxs("main", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-16 relative", children: [
      /* @__PURE__ */ jsxs("section", { id: "profile-hero", className: "grid lg:grid-cols-12 gap-8 items-center pt-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "lg:col-span-7 space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2", children: [
            /* @__PURE__ */ jsxs("span", { className: `inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border ${theme.badgeBg}`, children: [
              /* @__PURE__ */ jsx(Crown, { className: "h-3 w-3 shrink-0" }),
              " ",
              distRank
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono text-muted-foreground border border-border/40 bg-background/50", children: [
              /* @__PURE__ */ jsx(MapPin, { className: "h-3 w-3 shrink-0" }),
              " SP / Brasil"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxs("h1", { className: "text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight", children: [
              "Espaço Autoral de ",
              /* @__PURE__ */ jsx("br", {}),
              /* @__PURE__ */ jsx("span", { className: "bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent", children: distName })
            ] }),
            /* @__PURE__ */ jsxs("p", { className: "text-md font-medium text-muted-foreground italic leading-relaxed font-sans max-w-xl", children: [
              '"',
              theme.slogan,
              '"'
            ] })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-400 max-w-2xl leading-relaxed", children: theme.bio }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-3.5 pt-2", children: [
            /* @__PURE__ */ jsxs(Link, { to: "/loja/$slug", params: {
              slug: sponsorSlug
            }, className: "inline-flex items-center justify-center gap-2 h-10 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:opacity-90 transition-all font-bold text-black text-xs shadow-lg shadow-emerald-500/10 cursor-pointer", children: [
              /* @__PURE__ */ jsx(ShoppingBag, { className: "h-4 w-4" }),
              "Explorar Vitrine On-Line"
            ] }),
            /* @__PURE__ */ jsxs(Link, { to: "/seja-distribuidor/$slug", params: {
              slug: sponsorSlug
            }, className: "inline-flex items-center justify-center gap-2 h-10 px-6 rounded-xl border border-border/80 bg-background/40 hover:bg-background/80 transition-all font-semibold text-white text-xs cursor-pointer", children: [
              "Trabalhar Conosco",
              /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4 text-emerald-400" })
            ] }),
            /* @__PURE__ */ jsx("button", { onClick: shareProfile, className: "h-10 w-10 rounded-xl border border-border/50 bg-[#090d16] flex items-center justify-center cursor-pointer hover:border-border text-muted-foreground hover:text-white", children: /* @__PURE__ */ jsx(Share2, { className: "h-4 w-4" }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "pt-6 grid grid-cols-3 gap-6 max-w-lg border-t border-border/15", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsx("p", { className: "text-2xl font-black text-white", children: "500+" }),
              /* @__PURE__ */ jsx("p", { className: "text-[10px] uppercase font-mono tracking-wider text-muted-foreground", children: "Clientes Atendidos" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsx("p", { className: "text-2xl font-black text-white", children: "600+" }),
              /* @__PURE__ */ jsx("p", { className: "text-[10px] uppercase font-mono tracking-wider text-muted-foreground", children: "Parceiros de Rede" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsx("p", { className: "text-2xl font-black text-white", children: "R$ 400k+" }),
              /* @__PURE__ */ jsx("p", { className: "text-[10px] uppercase font-mono tracking-wider text-muted-foreground", children: "Vendas Efetuadas" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "lg:col-span-5 flex justify-center lg:justify-end", children: /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute -inset-2.5 rounded-3xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-indigo-500 opacity-25 blur-lg group-hover:opacity-45 transition duration-1000" }),
          /* @__PURE__ */ jsxs("div", { className: "relative rounded-2xl border border-border/60 bg-[#090d16] p-4 text-center w-full max-w-[340px] space-y-4", children: [
            /* @__PURE__ */ jsx("div", { className: "relative w-32 h-32 mx-auto rounded-full overflow-hidden border-2 border-emerald-500/30", children: /* @__PURE__ */ jsx("img", { src: distAvatar, alt: distName, referrerPolicy: "no-referrer", className: "w-full h-full object-cover" }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "text-md font-bold text-white font-sans", children: distName }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-emerald-400 font-mono mt-0.5", children: distRank })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "p-3 bg-background/50 rounded-xl text-left text-xs font-mono space-y-1.5 border border-border/40", children: [
              /* @__PURE__ */ jsx("p", { className: "text-[9px] uppercase font-bold text-muted-foreground tracking-wider font-sans mb-1 text-center", children: "Contato Autorizado" }),
              /* @__PURE__ */ jsxs("p", { className: "flex justify-between", children: [
                "Email: ",
                /* @__PURE__ */ jsx("span", { className: "text-white truncate max-w-[150px]", children: `${sponsorSlug}@allin.io` })
              ] }),
              /* @__PURE__ */ jsxs("p", { className: "flex justify-between", children: [
                "Código: ",
                /* @__PURE__ */ jsxs("span", { className: "text-emerald-400 font-bold", children: [
                  "@",
                  sponsorSlug
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxs("a", { href: `https://wa.me/5511987654321?text=Ola%20${encodeURIComponent(distName)},%20gostaria%20de%20saber%20mais%20sobre%20os%20produtos%20da%20Allin`, target: "_blank", className: "w-full h-9 rounded-xl bg-[#25d366]/10 hover:bg-[#25d366]/20 border border-[#25d366]/20 text-[#25d366] text-xs font-bold transition-colors flex items-center justify-center gap-1.5 pt-0.5", children: [
                /* @__PURE__ */ jsx(MessageSquare, { className: "h-4 w-4" }),
                "Falar pelo WhatsApp"
              ] }),
              /* @__PURE__ */ jsxs("a", { href: "https://instagram.com", target: "_blank", className: "w-full h-9 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 text-indigo-400 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 pt-0.5", children: [
                /* @__PURE__ */ jsx(Instagram, { className: "h-4 w-4" }),
                "Acompanhar Instagram"
              ] })
            ] })
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("section", { id: "distributor-quote", className: "rounded-2xl border border-zinc-800 bg-[#090d16]/30 p-6 md:p-8 text-center relative overflow-hidden", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-10 h-32 w-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" }),
        /* @__PURE__ */ jsx(Star, { className: "h-6 w-6 text-emerald-400 mx-auto opacity-75 mb-3" }),
        /* @__PURE__ */ jsxs("p", { className: "text-md sm:text-lg font-medium text-white max-w-3xl mx-auto italic leading-relaxed", children: [
          '"',
          theme.quote,
          '"'
        ] }),
        /* @__PURE__ */ jsx("p", { className: "mt-3 text-xs font-mono text-zinc-500 uppercase tracking-widest", children: "— Manifesto Orgânico Celular" })
      ] }),
      /* @__PURE__ */ jsxs("section", { id: "store-vitrine", className: "space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-baseline", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold uppercase tracking-widest text-[#a855f7] bg-purple-500/15 border border-purple-500/20 px-2.5 py-1 rounded-full font-mono", children: "Vitrine Exclusiva" }),
            /* @__PURE__ */ jsx("h2", { className: "text-xl sm:text-2xl font-bold tracking-tight text-white mt-1.5", children: "Nossos Lançamentos de Alta Performance" })
          ] }),
          /* @__PURE__ */ jsxs(Link, { to: "/loja/$slug", params: {
            slug: sponsorSlug
          }, className: "text-xs text-emerald-400 hover:underline flex items-center gap-0.5 cursor-pointer", children: [
            "Ver vitrine completa ",
            /* @__PURE__ */ jsx(ChevronRight, { className: "h-3.5 w-3.5" })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-4 gap-4", children: products.slice(0, 4).map((prod) => /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-border/45 bg-[#090d16]/90 overflow-hidden flex flex-col justify-between hover:border-zinc-700 hover:scale-[1.01] transition-all p-1", children: [
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx("img", { src: prod.imgSrc, alt: prod.caption, referrerPolicy: "no-referrer", className: "w-full h-44 object-cover rounded-xl opacity-80" }),
            /* @__PURE__ */ jsx("span", { className: "absolute top-2 right-2 text-[9px] font-bold font-mono tracking-wider text-emerald-400 bg-[#06080d]/90 px-2 py-0.5 rounded-md uppercase border border-emerald-500/25", children: prod.categorias })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "p-4 space-y-3.5 flex-1 flex flex-col justify-between", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-white line-clamp-1 leading-snug", children: prod.caption }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground leading-relaxed line-clamp-2 mt-1", children: prod.caption2 })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2 pt-2 border-t border-border/20", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-baseline", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[10px] text-muted-foreground font-mono", children: "Valor Comercial:" }),
                /* @__PURE__ */ jsx("strong", { className: "text-md font-bold text-white", children: formatBRL(prod.price) })
              ] }),
              /* @__PURE__ */ jsx(Link, { to: "/produto/$id", params: {
                id: prod.id
              }, search: {
                ref: sponsorSlug
              }, className: "w-full h-8 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-black text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer pt-0.5", children: "Detalhes do Produto" })
            ] })
          ] })
        ] }, prod.id)) })
      ] }),
      /* @__PURE__ */ jsxs("section", { id: "lead-recruitment", className: "grid lg:grid-cols-12 gap-8 items-center border border-border/50 bg-gradient-to-br from-[#090d16]/85 via-[#0c1322]/30 to-[#070b12] rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 h-40 w-40 bg-purple-500/5 blur-2xl rounded-full" }),
        /* @__PURE__ */ jsxs("div", { className: "lg:col-span-6 space-y-4", children: [
          /* @__PURE__ */ jsx("span", { className: "text-[9px] uppercase tracking-widest font-mono text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full", children: "WORKFLOW DE CAPTAÇÃO LEAD" }),
          /* @__PURE__ */ jsx("h2", { className: "text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight", children: "Inicie Sua Jornada na All-In Life em Nosso Time Especializado" }),
          /* @__PURE__ */ jsxs("p", { className: "text-sm text-zinc-300 leading-relaxed", children: [
            "Trabalhe em colaboração direta com ",
            /* @__PURE__ */ jsx("strong", { className: "text-white", children: distName }),
            ". Ganhe acesso imediato ao material de prospecção corporativo, webinars semanais operados por IA e taxas preferenciais no licenciamento global de rede."
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2 text-xs text-zinc-400", children: [
            /* @__PURE__ */ jsxs("p", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Check, { className: "h-4 w-4 text-emerald-400 shrink-0" }),
              " Patrocínio garantido sob código ",
              /* @__PURE__ */ jsxs("strong", { className: "text-white", children: [
                "@",
                sponsorSlug
              ] })
            ] }),
            /* @__PURE__ */ jsxs("p", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Check, { className: "h-4 w-4 text-emerald-400 shrink-0" }),
              " Treinamentos e scripts para mídias sociais inclusos"
            ] }),
            /* @__PURE__ */ jsxs("p", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Check, { className: "h-4 w-4 text-emerald-400 shrink-0" }),
              " Licenciamento e ativação em menos de 10 minutos"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "lg:col-span-6", children: /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: !leadSuccess ? /* @__PURE__ */ jsxs(motion.form, { onSubmit: handleLeadSubmit, initial: {
          opacity: 0,
          y: 10
        }, animate: {
          opacity: 1,
          y: 0
        }, exit: {
          opacity: 0,
          y: -10
        }, className: "rounded-2xl border border-zinc-800 bg-[#06080d]/90 p-6 space-y-4", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-md font-bold text-white text-center", children: "Fale Direto Com Nosso Especialista" }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsx("label", { className: "text-[10px] uppercase font-bold text-muted-foreground font-mono", children: "Nome Completo" }),
              /* @__PURE__ */ jsx("input", { type: "text", required: true, value: leadName, onChange: (e) => setLeadName(e.target.value), className: "w-full h-9 rounded-lg bg-background/50 border border-border px-3 text-xs text-white", placeholder: "Ex: Carlos Silva" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid sm:grid-cols-2 gap-3", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsx("label", { className: "text-[10px] uppercase font-bold text-muted-foreground font-mono", children: "E-mail Corporativo" }),
                /* @__PURE__ */ jsx("input", { type: "email", required: true, value: leadEmail, onChange: (e) => setLeadEmail(e.target.value), className: "w-full h-9 rounded-lg bg-background/50 border border-border px-3 text-xs text-white", placeholder: "carlos@gmail.com" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsx("label", { className: "text-[10px] uppercase font-bold text-muted-foreground font-mono", children: "Telefone (WhatsApp)" }),
                /* @__PURE__ */ jsx("input", { type: "tel", required: true, value: leadPhone, onChange: (e) => setLeadPhone(e.target.value), className: "w-full h-9 rounded-lg bg-background/50 border border-border px-3 text-xs text-white", placeholder: "(11) 99999-0000" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsx("label", { className: "text-[10px] uppercase font-bold text-muted-foreground font-mono", children: "Seu Principal Interesse" }),
              /* @__PURE__ */ jsxs("select", { value: leadOption, onChange: (e) => setLeadOption(e.target.value), className: "w-full h-9 rounded-lg bg-[#06080d] border border-border px-3 text-xs text-white cursor-pointer", children: [
                /* @__PURE__ */ jsx("option", { value: "all", children: "Quero consumir produtos e fazer rede MLM" }),
                /* @__PURE__ */ jsx("option", { value: "retail", children: "Quero ser apenas consumidor licenciado (descontos de até 40%)" }),
                /* @__PURE__ */ jsx("option", { value: "sales", children: "Quero revender e ganhar na margem comercial de 100%" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx("button", { type: "submit", disabled: submittingLead, className: "w-full h-10 mt-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-black text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer pt-0.5", children: submittingLead ? /* @__PURE__ */ jsx("span", { className: "h-4 w-4 animate-spin rounded-full border border-t-transparent border-black" }) : /* @__PURE__ */ jsxs(Fragment, { children: [
            "Sim, Quero Me Cadastrar No Time!",
            /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4" })
          ] }) })
        ] }, "lead-form") : /* @__PURE__ */ jsxs(motion.div, { initial: {
          opacity: 0,
          scale: 0.96
        }, animate: {
          opacity: 1,
          scale: 1
        }, className: "rounded-2xl border border-emerald-500/25 bg-emerald-500/5 p-8 text-center space-y-4", children: [
          /* @__PURE__ */ jsx("div", { className: "h-12 w-12 rounded-full bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto", children: /* @__PURE__ */ jsx(ShieldCheck, { className: "h-6 w-6" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "text-md font-bold text-white", children: "Solicitação Vinculada!" }),
            /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground leading-relaxed mt-1 max-w-sm mx-auto", children: [
              "Parabéns, ",
              /* @__PURE__ */ jsx("strong", { className: "text-white", children: leadName }),
              "! Suas informações foram anexadas no ledger do patrocinador ",
              /* @__PURE__ */ jsxs("strong", { className: "text-emerald-400", children: [
                "@",
                sponsorSlug
              ] }),
              ". Entraremos em contato via WhatsApp nas próximas 2 horas."
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex gap-2 justify-center pt-2", children: /* @__PURE__ */ jsx(Button, { size: "sm", variant: "outline", className: "text-xs font-mono", onClick: () => navigate({
            to: "/seja-distribuidor/$slug",
            params: {
              slug: sponsorSlug
            }
          }), children: "Acessar Onboarding MLM" }) })
        ] }, "lead-success") }) })
      ] })
    ] }),
    /* @__PURE__ */ jsx("footer", { className: "border-t border-zinc-900 bg-[#040609] py-12 relative z-10 text-xs", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid md:grid-cols-4 gap-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxs("span", { className: "font-sans font-extrabold text-[15px] uppercase tracking-wider text-white", children: [
          "All-In ",
          /* @__PURE__ */ jsx("span", { className: "text-emerald-400", children: "life" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-zinc-500 leading-relaxed", children: "Plataforma de expansão de rede MLM descentralizada conectada à All-In Brasil e operada por inteligência artificial contextual." })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h4", { className: "font-bold text-white mb-3", children: "Links Corporativos" }),
        /* @__PURE__ */ jsxs("ul", { className: "space-y-2 text-zinc-400", children: [
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/login", className: "hover:text-white transition-colors", children: "Entrar na Área Restrita" }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/cadastro", className: "hover:text-white transition-colors", children: "Criar Nova Distribuidora" }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "#", className: "hover:text-white transition-colors", children: "Termos de Conformidade" }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "#", className: "hover:text-white transition-colors", children: "Guia de Compliance MLM" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h4", { className: "font-bold text-white mb-3", children: "Patrocinador Ativo" }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("img", { src: distAvatar, alt: distName, className: "h-8 w-8 rounded-full border border-border/40" }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "font-semibold text-white leading-none", children: distName }),
            /* @__PURE__ */ jsxs("p", { className: "text-[10px] text-emerald-400 font-mono mt-0.5", children: [
              "@",
              sponsorSlug
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 text-[10px] text-zinc-500", children: "Qualificação ativa auditada em tempo real." })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h4", { className: "font-bold text-white mb-3", children: "Aviso Legal" }),
        /* @__PURE__ */ jsx("p", { className: "text-zinc-500 border-l border-zinc-800 pl-3 leading-relaxed", children: "All-In Life é uma marca registrada de nutrição de precisão patenteada. Os resultados financeiros MLM variam dependendo da volumetria, esforço individual e captação legítima de rede." })
      ] })
    ] }) })
  ] });
}
export {
  DistributorPage as component
};
