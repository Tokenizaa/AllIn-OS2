import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { C as Card, a as CardContent } from "./card-JWqKexpr.mjs";
import { F as Footer } from "./Footer-Brjh0GqW.mjs";
import { P as PublicHeader, B as Button, u as useSponsorLink, a as Badge } from "./router-BZaVudxP.mjs";
import { H as HeroIntroSection, A as Accordion, a as AccordionItem, b as AccordionTrigger, c as AccordionContent } from "./accordion-8HhFimnJ.mjs";
import { I as Input } from "./input-D1i_JeqC.mjs";
import { u as useToast } from "./use-toast-DdRhLTSk.mjs";
import { s as supabase } from "./supabase-client-BdpvIS_G.mjs";
import { A as Avatar, a as AvatarFallback } from "./avatar-BEKH3ihV.mjs";
import "../_libs/sonner.mjs";
import { A as ArrowRight, h as Award, i as Target, U as Users, H as Heart, j as Shield, Z as Zap, k as TrendingUp, l as Clock, D as DollarSign, B as BookOpen, m as Headphones, n as Star, o as Crown, G as Gem, p as Check, q as Sparkles, r as CircleCheckBig, s as Quote, L as Lock, t as ChevronDown, u as Send } from "../_libs/lucide-react.mjs";

import "../_libs/tanstack__react-router.mjs";
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
import "../_libs/radix-ui__react-accordion.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-collapsible.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/radix-ui__react-avatar.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-is-hydrated+[...].mjs";
import "../_libs/use-sync-external-store.mjs";
const successTeam = "/assets/success-team-C-dkeUXV.jpg";
const BenefitsSection = () => {
  const benefits = [
    {
      icon: DollarSign,
      title: "Múltiplas Fontes de Renda",
      description: "Afiliados ganham 20% em vendas online. Distribuidores lucram com vendas diretas (50% de desconto na compra) e ainda ganham 38% nas vendas pelo link!"
    },
    {
      icon: TrendingUp,
      title: "Mercado em Explosão",
      description: "Entre agora no setor wellness que cresce 15% ao ano e já movimenta mais de R$ 2.3 bilhões no Brasil - oportunidade limitada!"
    },
    {
      icon: Users,
      title: "Renda Exponencial",
      description: "Construa sua rede e multiplique seus ganhos com comissões em até 3 níveis: 5% + 3% + 2%. Quanto maior sua rede, maior seu rendimento passivo!"
    },
    {
      icon: BookOpen,
      title: "Sistema Completo",
      description: "Fornecemos tudo: treinamentos exclusivos, materiais prontos e estratégias comprovadas para você começar a vender desde o primeiro dia."
    },
    {
      icon: Headphones,
      title: "Suporte Garantido",
      description: "Nunca estará sozinho! Atendimento especializado e IA disponível 24h para maximizar suas vendas e solucionar qualquer dúvida instantaneamente."
    },
    {
      icon: Award,
      title: "Produtos Revolucionários",
      description: "Tênis terapêuticos com tecnologia exclusiva que realmente funcionam e geram vendas recorrentes - 89% dos clientes compram novamente!"
    },
    {
      icon: Clock,
      title: "Liberdade Total",
      description: "Trabalhe quando e onde quiser - negócio 100% flexível para criar a vida que você sempre sonhou, com renda ilimitada."
    },
    {
      icon: Shield,
      title: "Segurança Financeira",
      description: "Empresa sólida, pagamentos garantidos em até 72h e sistema transparente para você acompanhar cada centavo dos seus ganhos."
    }
  ];
  const stats = [
    {
      number: "R$ 3.200",
      label: "Ganho médio mensal",
      sublabel: "distribuidores ativos"
    },
    {
      number: "72h",
      label: "Pagamento garantido",
      sublabel: "sem burocracia"
    },
    {
      number: "95%",
      label: "Satisfação comprovada",
      sublabel: "resultados reais"
    },
    {
      number: "+500",
      label: "Parceiros de sucesso",
      sublabel: "em todo Brasil"
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "beneficios", className: "py-20 bg-allin-bg-light-3 dark:bg-allin-bg-dark-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-16 animate-fade-in", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-4xl md:text-5xl font-bold mb-6 text-allin-dark dark:text-allin-white", children: [
        "Por Que Se Tornar ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-allin-orange", children: "Parte da All-in?" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xl text-allin-dark/80 dark:text-allin-white/80 max-w-3xl mx-auto", children: [
        "Transforme sua realidade financeira com uma oportunidade única para quem quer ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "resultados extraordinários." })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-2 gap-16 items-center mb-20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative animate-slide-up glass-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: successTeam,
            alt: "Equipe de sucesso Allin",
            className: "rounded-2xl shadow-2xl w-full transition-all duration-300 hover:scale-105"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -bottom-6 -right-6 bg-allin-orange rounded-2xl p-6 text-allin-dark shadow-2xl transition-all duration-300 hover:scale-110 glass-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-bold", children: "+500" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm", children: "Histórias de Sucesso" })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 animate-slide-up glass-card", style: { animationDelay: "0.2s" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-3xl font-bold mb-8 text-allin-dark dark:text-allin-white", children: [
          "Vantagens ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-allin-orange", children: "Exclusivas" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4 p-4 bg-allin-bg-light-2 dark:bg-allin-bg-dark-2 border border-allin-orange rounded-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-1 glass-card", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 bg-allin-orange rounded-lg flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "w-6 h-6 text-allin-dark" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-semibold text-lg mb-1 text-allin-dark dark:text-allin-white", children: "Oportunidade em Ascensão" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-allin-dark/80 dark:text-allin-white/80", children: [
                "Entre no mercado wellness que cresce 15% ao ano.",
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: " Vagas limitadas" }),
                " para distribuidores em cada região!"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4 p-4 bg-allin-bg-light-2 dark:bg-allin-bg-dark-2 border border-allin-orange rounded-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-1 glass-card", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 bg-allin-orange rounded-lg flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110", children: /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "w-6 h-6 text-allin-dark" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-semibold text-lg mb-1 text-allin-dark dark:text-allin-white", children: "Ganhos Multiplicados" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-allin-dark/80 dark:text-allin-white/80", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Como Afiliado:" }),
                " 20% sem investimento.",
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: " Como Distribuidor:" }),
                " 50% na revenda + 38% nas vendas online + bônus em rede!"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4 p-4 bg-allin-bg-light-2 dark:bg-allin-bg-dark-2 border border-allin-orange rounded-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-1 glass-card", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 bg-allin-orange rounded-lg flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "w-6 h-6 text-allin-dark" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-semibold text-lg mb-1 text-allin-dark dark:text-allin-white", children: "Produtos Que Vendem Sozinhos" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-allin-dark/80 dark:text-allin-white/80", children: [
                "Tênis terapêuticos com tecnologias exclusivas e patenteadas.",
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: " 89% de taxa de recompra" }),
                " - clientes voltam sempre!"
              ] })
            ] })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-allin-orange rounded-2xl p-8 mb-16 text-allin-dark animate-slide-up glass-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-3xl font-bold text-center mb-8", children: "Resultados Comprovados" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid md:grid-cols-4 gap-8", children: stats.map((stat, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center transition-all duration-300 hover:scale-110", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-4xl font-bold mb-2", children: stat.number }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg font-semibold mb-1", children: stat.label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm opacity-90", children: stat.sublabel })
      ] }, index)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid md:grid-cols-2 lg:grid-cols-4 gap-6", children: benefits.map((benefit, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-allin-bg-light-2 dark:bg-allin-bg-dark-2 border border-allin-orange group animate-slide-up glass-card", style: { animationDelay: `${0.1 * index}s` }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "pt-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 bg-allin-orange rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:scale-110", children: /* @__PURE__ */ jsxRuntimeExports.jsx(benefit.icon, { className: "w-8 h-8 text-allin-dark" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold mb-2 text-allin-dark dark:text-allin-white", children: benefit.title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-allin-dark/80 dark:text-allin-white/80 text-sm leading-relaxed", children: benefit.description })
    ] }) }, index)) })
  ] }) });
};
const AboutHistorySection = () => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-16 px-4 bg-allin-bg-light-1 dark:bg-allin-bg-dark-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto max-w-6xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl md:text-4xl font-bold text-allin-dark dark:text-allin-white mb-4", children: "Nossa História" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg text-allin-dark/70 dark:text-allin-white/70 max-w-3xl mx-auto", children: "A All In Brasil nasceu da paixão por transformar vidas através de produtos terapêuticos de alta qualidade." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-3 gap-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-6 bg-white/30 dark:bg-allin-bg-dark-2/30 rounded-lg border border-allin-orange/10 hover:shadow-lg transition-shadow", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 bg-allin-orange/10 rounded-full flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "w-6 h-6 text-allin-orange" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold text-allin-dark dark:text-allin-white mb-2", children: "Qualidade" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-allin-dark/70 dark:text-allin-white/70", children: "Produtos desenvolvidos com tecnologia avançada e materiais de primeira linha." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-6 bg-white/30 dark:bg-allin-bg-dark-2/30 rounded-lg border border-allin-orange/10 hover:shadow-lg transition-shadow", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 bg-allin-orange/10 rounded-full flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { className: "w-6 h-6 text-allin-orange" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold text-allin-dark dark:text-allin-white mb-2", children: "Inovação" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-allin-dark/70 dark:text-allin-white/70", children: "Sempre buscando novas tecnologias para melhorar a qualidade de vida das pessoas." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-6 bg-white/30 dark:bg-allin-bg-dark-2/30 rounded-lg border border-allin-orange/10 hover:shadow-lg transition-shadow", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 bg-allin-orange/10 rounded-full flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-6 h-6 text-allin-orange" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold text-allin-dark dark:text-allin-white mb-2", children: "Comunidade" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-allin-dark/70 dark:text-allin-white/70", children: "Milhares de distribuidores satisfeitos fazendo parte da nossa família." })
      ] })
    ] })
  ] }) });
};
const AboutValuesSection = () => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-16 px-4 bg-allin-bg-light-2 dark:bg-allin-bg-dark-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto max-w-6xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl md:text-4xl font-bold text-allin-dark dark:text-allin-white mb-4", children: "Nossos Valores" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg text-allin-dark/70 dark:text-allin-white/70 max-w-3xl mx-auto", children: "O que nos move e define quem somos como empresa." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-6 bg-white/30 dark:bg-allin-bg-dark-2/30 rounded-lg border border-allin-orange/10 hover:shadow-lg transition-shadow", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 bg-allin-orange/10 rounded-full flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "w-6 h-6 text-allin-orange" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold text-allin-dark dark:text-allin-white mb-2", children: "Paixão" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-allin-dark/70 dark:text-allin-white/70", children: "Amamos o que fazemos e nos dedicamos a transformar vidas." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-6 bg-white/30 dark:bg-allin-bg-dark-2/30 rounded-lg border border-allin-orange/10 hover:shadow-lg transition-shadow", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 bg-allin-orange/10 rounded-full flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-6 h-6 text-allin-orange" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold text-allin-dark dark:text-allin-white mb-2", children: "Integridade" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-allin-dark/70 dark:text-allin-white/70", children: "Atuamos com transparência e honestidade em todas as relações." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-6 bg-white/30 dark:bg-allin-bg-dark-2/30 rounded-lg border border-allin-orange/10 hover:shadow-lg transition-shadow", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 bg-allin-orange/10 rounded-full flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-6 h-6 text-allin-orange" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold text-allin-dark dark:text-allin-white mb-2", children: "Inovação" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-allin-dark/70 dark:text-allin-white/70", children: "Buscamos constantemente novas tecnologias e soluções." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-6 bg-white/30 dark:bg-allin-bg-dark-2/30 rounded-lg border border-allin-orange/10 hover:shadow-lg transition-shadow", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 bg-allin-orange/10 rounded-full flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "w-6 h-6 text-allin-orange" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold text-allin-dark dark:text-allin-white mb-2", children: "Crescimento" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-allin-dark/70 dark:text-allin-white/70", children: "Crescemos juntos com nossos distribuidores e clientes." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-6 bg-white/30 dark:bg-allin-bg-dark-2/30 rounded-lg border border-allin-orange/10 hover:shadow-lg transition-shadow", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 bg-allin-orange/10 rounded-full flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-6 h-6 text-allin-orange" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold text-allin-dark dark:text-allin-white mb-2", children: "Pontualidade" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-allin-dark/70 dark:text-allin-white/70", children: "Respeitamos prazos e compromissos com nossos parceiros." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-6 bg-white/30 dark:bg-allin-bg-dark-2/30 rounded-lg border border-allin-orange/10 hover:shadow-lg transition-shadow", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 bg-allin-orange/10 rounded-full flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "w-6 h-6 text-allin-orange" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold text-allin-dark dark:text-allin-white mb-2", children: "Excelência" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-allin-dark/70 dark:text-allin-white/70", children: "Buscamos a qualidade em tudo o que fazemos." })
      ] })
    ] })
  ] }) });
};
const CTAMainSection = () => {
  const { handleCadastro } = useSponsorLink();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "py-16 px-4 bg-gradient-to-br from-allin-orange to-allin-orange/80 dark:from-allin-orange dark:to-allin-orange/90 relative overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-float" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-float", style: { animationDelay: "1s" } })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto max-w-6xl relative z-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-12", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-4 h-4 text-white" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-white", children: "Oportunidade Limitada" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl md:text-5xl font-bold text-white mb-4", children: "Comece Sua Jornada Hoje" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl text-white/90 max-w-3xl mx-auto", children: "Junte-se a milhares de distribuidores que já transformaram suas vidas com a All In Brasil." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-3 gap-6 mb-12", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-6 h-6 text-white flex-shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white font-medium", children: "Zero investimento inicial" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-6 h-6 text-white flex-shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white font-medium", children: "Suporte completo" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-6 h-6 text-white flex-shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white font-medium", children: "Comissões atrativas" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          size: "lg",
          onClick: handleCadastro,
          className: "bg-white text-allin-orange hover:bg-white/90 font-semibold px-8 py-4 shadow-lg group",
          children: [
            "Quero Me Tornar Distribuidor",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" })
          ]
        }
      ) })
    ] })
  ] });
};
const CTATrustSection = () => {
  const trustIndicators = [
    {
      icon: Shield,
      title: "100% Seguro",
      description: "Seus dados protegidos com a mais alta segurança"
    },
    {
      icon: Lock,
      title: "Sem Taxas Ocultas",
      description: "Transparência total em todas as transações"
    },
    {
      icon: Headphones,
      title: "Suporte 24/7",
      description: "Sempre disponíveis para ajudar você"
    },
    {
      icon: CircleCheckBig,
      title: "Garantia de Satisfação",
      description: "Satisfação garantida ou seu dinheiro de volta"
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-16 px-4 bg-allin-bg-light-1 dark:bg-allin-bg-dark-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto max-w-6xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl md:text-4xl font-bold text-allin-dark dark:text-allin-white mb-4", children: "Por Que Confiar na All In Brasil?" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg text-allin-dark/70 dark:text-allin-white/70 max-w-3xl mx-auto", children: "Milhares de distribuidores confiam em nós há anos." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid md:grid-cols-2 lg:grid-cols-4 gap-6", children: trustIndicators.map((indicator, index) => {
      const Icon = indicator.icon;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Card,
        {
          className: "p-6 bg-white/30 dark:bg-allin-bg-dark-2/30 rounded-lg border border-allin-orange/10 text-center hover:shadow-lg transition-shadow",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 bg-allin-orange/10 rounded-full flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-6 h-6 text-allin-orange" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold text-allin-dark dark:text-allin-white mb-2", children: indicator.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-allin-dark/70 dark:text-allin-white/70 text-sm", children: indicator.description })
          ]
        },
        index
      );
    }) })
  ] }) });
};
const HomeFAQSection = () => {
  const faqCategories = [
    {
      category: "Oportunidade de Negócio",
      questions: [
        {
          q: "Como funciona o sistema de comissões?",
          a: "Nossos distribuidores ganham comissões sobre cada venda realizada através do seu link de indicação. As comissões variam de 10% a 30% dependendo do plano escolhido."
        },
        {
          q: "Preciso investir dinheiro para começar?",
          a: "Não! Você pode começar gratuitamente com nosso plano Iniciante. Planos pagos oferecem benefícios adicionais, mas não são obrigatórios."
        },
        {
          q: "Posso trabalhar de onde quiser?",
          a: "Sim! Nosso sistema é 100% online, permitindo que você trabalhe de qualquer lugar e no horário que preferir."
        }
      ]
    },
    {
      category: "Processo de Cadastro",
      questions: [
        {
          q: "Como me cadastro como distribuidor?",
          a: 'O cadastro é simples e rápido. Basta clicar no botão "Quero Me Tornar Distribuidor", preencher seus dados básicos e você já estará pronto para começar.'
        },
        {
          q: "Quais documentos são necessários?",
          a: "Para o cadastro inicial, apenas precisamos do seu nome completo e WhatsApp. Documentos adicionais podem ser solicitados quando você começar a receber pagamentos."
        },
        {
          q: "Quanto tempo demora para ativar minha conta?",
          a: "A ativação é imediata! Assim que você completar o cadastro, já terá acesso ao painel de distribuidor."
        }
      ]
    },
    {
      category: "Comissões e Pagamentos",
      questions: [
        {
          q: "Quando recebo minhas comissões?",
          a: "As comissões são processadas mensalmente, até o dia 30 de cada mês, para vendas realizadas no mês anterior."
        },
        {
          q: "Como recebo meus pagamentos?",
          a: "Os pagamentos são realizados via PIX ou transferência bancária, conforme sua preferência cadastrada no painel."
        },
        {
          q: "Existe valor mínimo para saque?",
          a: "Sim, o valor mínimo para saque é de R$ 50,00."
        }
      ]
    },
    {
      category: "Suporte e Treinamento",
      questions: [
        {
          q: "Que tipo de suporte oferecem?",
          a: "Oferecemos suporte por email, WhatsApp e comunidade exclusiva. Planos pagos incluem suporte prioritário e consultoria personalizada."
        },
        {
          q: "Tenho acesso a treinamentos?",
          a: "Sim! Todos os distribuidores têm acesso a treinamentos básicos. Planos Profissional e Empresário incluem treinamentos avançados e presenciais."
        },
        {
          q: "Posso participar de eventos presenciais?",
          a: "Eventos presenciais estão disponíveis para distribuidores dos planos Profissional e Empresário."
        }
      ]
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-16 px-4 bg-allin-bg-light-1 dark:bg-allin-bg-dark-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto max-w-4xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl md:text-4xl font-bold text-allin-dark dark:text-allin-white mb-4", children: "Perguntas Frequentes" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg text-allin-dark/70 dark:text-allin-white/70", children: "Tire suas dúvidas sobre como se tornar um distribuidor All In Brasil." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-8", children: faqCategories.map((category, categoryIndex) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold text-allin-orange mb-4", children: category.category }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Accordion, { type: "single", collapsible: true, className: "space-y-4", children: category.questions.map((faq, questionIndex) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        AccordionItem,
        {
          value: `item-${categoryIndex}-${questionIndex}`,
          className: "bg-white/30 dark:bg-allin-bg-dark-2/30 rounded-lg border border-allin-orange/10 px-6",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(AccordionTrigger, { className: "text-left text-allin-dark dark:text-allin-white hover:text-allin-orange", children: [
              faq.q,
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "w-4 h-4 ml-auto" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(AccordionContent, { className: "text-allin-dark/70 dark:text-allin-white/70", children: faq.a })
          ]
        },
        questionIndex
      )) })
    ] }, categoryIndex)) })
  ] }) });
};
const LeadCaptureSection = () => {
  const [name, setName] = reactExports.useState("");
  const [whatsapp, setWhatsapp] = reactExports.useState("");
  const [isSubmitting, setIsSubmitting] = reactExports.useState(false);
  const [isSubmitted, setIsSubmitted] = reactExports.useState(false);
  const { toast } = useToast();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !whatsapp.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive"
      });
      return;
    }
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("leads").insert({
        name: name.trim(),
        phone: whatsapp.trim(),
        source: "landing_page",
        status: "new",
        metadata: {
          captured_at: (/* @__PURE__ */ new Date()).toISOString()
        }
      });
      if (error) {
        throw error;
      }
      window.dispatchEvent(new CustomEvent("leadCaptured", {
        detail: { name: name.trim(), whatsapp: whatsapp.trim() }
      }));
      setIsSubmitted(true);
      toast({
        title: "Sucesso!",
        description: "Seus dados foram enviados. Entraremos em contato em breve."
      });
      setName("");
      setWhatsapp("");
    } catch (error) {
      console.error("[LeadCaptureSection] Error saving lead:", error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar seus dados. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  if (isSubmitted) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "cadastro", className: "py-16 px-4 bg-allin-bg-light-2 dark:bg-allin-bg-dark-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto max-w-2xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-8 bg-white/30 dark:bg-allin-bg-dark-2/30 rounded-lg border border-allin-orange/10 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-8 h-8 text-green-500" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-2xl font-bold text-allin-dark dark:text-allin-white mb-2", children: "Cadastro Realizado!" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-allin-dark/70 dark:text-allin-white/70 mb-6", children: "Obrigado pelo seu interesse! Entraremos em contato em breve." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => setIsSubmitted(false), children: "Cadastrar outra pessoa" })
    ] }) }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "cadastro", className: "py-16 px-4 bg-allin-bg-light-2 dark:bg-allin-bg-dark-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto max-w-2xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl md:text-4xl font-bold text-allin-dark dark:text-allin-white mb-4", children: "Cadastre-se Agora" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg text-allin-dark/70 dark:text-allin-white/70", children: "Preencha seus dados e entraremos em contato com você." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-8 bg-white/30 dark:bg-allin-bg-dark-2/30 rounded-lg border border-allin-orange/10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "name", className: "block text-sm font-medium text-allin-dark dark:text-allin-white mb-2", children: "Nome Completo" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "name",
            type: "text",
            value: name,
            onChange: (e) => setName(e.target.value),
            placeholder: "Seu nome completo",
            className: "bg-white/50 dark:bg-allin-bg-dark-1/50 border-allin-orange/20",
            required: true
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "whatsapp", className: "block text-sm font-medium text-allin-dark dark:text-allin-white mb-2", children: "WhatsApp" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "whatsapp",
            type: "tel",
            value: whatsapp,
            onChange: (e) => setWhatsapp(e.target.value),
            placeholder: "(11) 99999-9999",
            className: "bg-white/50 dark:bg-allin-bg-dark-1/50 border-allin-orange/20",
            required: true
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          type: "submit",
          disabled: isSubmitting,
          className: "w-full bg-allin-orange hover:bg-allin-orange/90 text-white",
          children: isSubmitting ? "Enviando..." : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            "Enviar Cadastro",
            /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "w-4 h-4 ml-2" })
          ] })
        }
      )
    ] }) })
  ] }) });
};
const PlansOverviewSection = () => {
  const { handleCadastro } = useSponsorLink();
  const plans = [
    {
      name: "Iniciante",
      icon: Star,
      price: "Grátis",
      period: "para sempre",
      features: [
        "Acesso aos produtos",
        "Comissões básicas",
        "Suporte por email",
        "Material de marketing básico"
      ],
      popular: false
    },
    {
      name: "Profissional",
      icon: Crown,
      price: "R$ 197",
      period: "/mês",
      features: [
        "Tudo do plano Iniciante",
        "Comissões aumentadas",
        "Suporte prioritário",
        "Material de marketing avançado",
        "Treinamentos exclusivos",
        "Acesso à comunidade VIP"
      ],
      popular: true
    },
    {
      name: "Empresário",
      icon: Gem,
      price: "R$ 497",
      period: "/mês",
      features: [
        "Tudo do plano Profissional",
        "Comissões máximas",
        "Suporte dedicado 24/7",
        "Material de marketing premium",
        "Treinamentos presenciais",
        "Acesso à comunidade VIP",
        "Bônus exclusivos",
        "Consultoria personalizada"
      ],
      popular: false
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-16 px-4 bg-allin-bg-light-1 dark:bg-allin-bg-dark-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto max-w-6xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl md:text-4xl font-bold text-allin-dark dark:text-allin-white mb-4", children: "Escolha Seu Plano" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg text-allin-dark/70 dark:text-allin-white/70 max-w-3xl mx-auto", children: "Planos flexíveis para cada etapa da sua jornada como distribuidor." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid md:grid-cols-3 gap-8", children: plans.map((plan, index) => {
      const Icon = plan.icon;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Card,
        {
          className: `p-6 bg-white/30 dark:bg-allin-bg-dark-2/30 rounded-lg border ${plan.popular ? "border-allin-orange shadow-xl scale-105" : "border-allin-orange/10"} hover:shadow-lg transition-all relative`,
          children: [
            plan.popular && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "absolute -top-3 left-1/2 -translate-x-1/2 bg-allin-orange text-white", children: "Mais Popular" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 bg-allin-orange/10 rounded-full flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-8 h-8 text-allin-orange" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-2xl font-bold text-allin-dark dark:text-allin-white mb-2", children: plan.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline justify-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-3xl font-bold text-allin-orange", children: plan.price }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-allin-dark/70 dark:text-allin-white/70", children: plan.period })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-3 mb-6", children: plan.features.map((feature, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-5 h-5 text-allin-orange flex-shrink-0 mt-0.5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-allin-dark/80 dark:text-allin-white/80 text-sm", children: feature })
            ] }, idx)) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                onClick: handleCadastro,
                variant: plan.popular ? "vibrant" : "outline",
                className: "w-full",
                children: "Começar Agora"
              }
            )
          ]
        },
        index
      );
    }) })
  ] }) });
};
const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Maria Silva",
      role: "Distribuidora Excelência",
      avatar: "MS",
      location: "São Paulo, SP",
      rating: 5,
      text: "Em 6 meses como distribuidora Allin, já consegui uma renda extra de R$ 4.500/mês. Os produtos vendem sozinhos, a qualidade é excepcional e o suporte da empresa é fantástico!",
      highlight: "R$ 4.500/mês em 6 meses"
    },
    {
      name: "João Santos",
      role: "Distribuidor Avanço",
      avatar: "JS",
      location: "Rio de Janeiro, RJ",
      rating: 5,
      text: "Comecei como afiliado gratuito e em 8 meses já migrei para o plano Excelência. Minha rede tem mais de 50 pessoas e os ganhos residuais fazem toda diferença.",
      highlight: "Rede com +50 pessoas"
    },
    {
      name: "Ana Costa",
      role: "Distribuidora Avanço",
      avatar: "AC",
      location: "Belo Horizonte, MG",
      rating: 5,
      text: "Os tênis Allin mudaram minha vida! Além de usar e sentir os benefícios, consigo ajudar outras pessoas e ainda ganhar uma renda extra significativa. Recomendo de olhos fechados!",
      highlight: "Transformação pessoal e profissional"
    },
    {
      name: "Carlos Ferreira",
      role: "Distribuidor Excelência",
      avatar: "CF",
      location: "Porto Alegre, RS",
      rating: 5,
      text: "Trabalho com vendas há 15 anos e nunca vi produtos com tanta aceitação no mercado. A Allin oferece treinamento completo e ferramentas que facilitam muito as vendas.",
      highlight: "15 anos de experiência em vendas"
    },
    {
      name: "Luciana Oliveira",
      role: "Distribuidora Avanço",
      avatar: "LO",
      location: "Brasília, DF",
      rating: 5,
      text: "Além dos ganhos financeiros, me sinto realizada ajudando pessoas a terem mais qualidade de vida. Os produtos realmente funcionam e os clientes sempre voltam!",
      highlight: "Realização pessoal e financeira"
    },
    {
      name: "Roberto Lima",
      role: "Distribuidor Excelência",
      avatar: "RL",
      location: "Salvador, BA",
      rating: 5,
      text: "Em 1 ano como distribuidor, já consegui substituir minha renda principal. A Allin me deu a oportunidade de ter mais tempo com a família e liberdade financeira.",
      highlight: "Substituiu renda principal em 1 ano"
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-20 bg-allin-bg-light-1 dark:bg-allin-bg-dark-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-16", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-4xl md:text-5xl font-bold mb-6 text-allin-dark dark:text-allin-white", children: [
        "Casos de ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-allin-orange", children: "Sucesso" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl text-allin-dark/80 dark:text-allin-white/80 max-w-3xl mx-auto", children: "Veja os depoimentos reais de distribuidores que transformaram suas vidas com a oportunidade Allin" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16", children: testimonials.map((testimonial, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-allin-bg-dark-3 border border-allin-orange/20 relative overflow-hidden group", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-4 right-4 text-allin-orange/20 group-hover:text-allin-orange/40 transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Quote, { className: "w-8 h-8" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "pt-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center mb-4", children: [...Array(testimonial.rating)].map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "w-5 h-5 text-allin-orange fill-current" }, i)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-allin-dark/80 dark:text-allin-white/80 text-center mb-6 leading-relaxed italic", children: [
          '"',
          testimonial.text,
          '"'
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-allin-orange text-allin-dark text-center text-sm font-semibold py-2 px-4 rounded-full mb-4", children: testimonial.highlight }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { className: "w-12 h-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "bg-allin-orange text-allin-dark font-semibold", children: testimonial.avatar }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-allin-dark dark:text-allin-white", children: testimonial.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-allin-orange font-medium", children: testimonial.role }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-allin-dark/60 dark:text-allin-white/60", children: testimonial.location })
          ] })
        ] })
      ] })
    ] }, index)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center bg-allin-orange rounded-2xl p-8 text-allin-dark", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-2xl font-bold mb-4 text-allin-dark", children: "Junte-se a Mais de 500 Distribuidores de Sucesso" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg mb-6 text-allin-dark/90", children: "Faça parte de uma comunidade que está transformando vidas através de produtos inovadores e oportunidades reais de crescimento." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-center gap-8 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-bold text-allin-dark", children: "95%" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-allin-dark/80", children: "Satisfação" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-bold text-allin-dark", children: "4.8/5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-allin-dark/80", children: "Avaliação Média" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-bold text-allin-dark", children: "89%" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-allin-dark/80", children: "Taxa de Retenção" })
        ] })
      ] })
    ] })
  ] }) });
};
function DistribuidoresPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PublicHeader, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(HeroIntroSection, { title: "Bem-vindo", subtitle: "Conheça nossos produtos" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AboutHistorySection, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AboutValuesSection, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(BenefitsSection, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(PlansOverviewSection, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CTAMainSection, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TestimonialsSection, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CTATrustSection, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-16 bg-allin-bg-light-2 dark:bg-allin-bg-dark-2 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl md:text-4xl font-bold text-allin-dark dark:text-allin-white mb-4", children: "Viu os Resultados? Agora é Sua Vez!" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg text-allin-dark/70 dark:text-allin-white/70 mb-8", children: "Milhares já transformaram suas vidas. Cadastre-se e comece sua jornada de sucesso." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "default", size: "lg", className: "font-semibold px-8 py-4 bg-allin-orange hover:bg-allin-orange/90 text-allin-dark", onClick: () => document.getElementById("cadastro")?.scrollIntoView({
          behavior: "smooth"
        }), children: [
          "Começar Agora",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "ml-2 w-5 h-5" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(HomeFAQSection, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(LeadCaptureSection, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {})
    ] })
  ] });
}
export {
  DistribuidoresPage as component
};
