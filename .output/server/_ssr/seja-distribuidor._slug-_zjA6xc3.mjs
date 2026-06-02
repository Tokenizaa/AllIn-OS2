import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useParams, L as Link } from "../_libs/tanstack__react-router.mjs";
import { d as useDistributor, b as useAuth, i as SupabaseService, P as PublicHeader } from "./router-BZaVudxP.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { C as ChevronRight, am as Trophy, U as Users, k as TrendingUp, h as Award, ao as Calculator } from "../_libs/lucide-react.mjs";
import { A as AnimatePresence, m as motion } from "../_libs/framer-motion.mjs";

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
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
function DistributorRecruitmentPage() {
  const params = useParams({
    strict: false
  });
  const {
    currentDistributor,
    setDistributorBySlug
  } = useDistributor();
  const {
    register
  } = useAuth();
  const routeSlug = params.slug?.toLowerCase().trim();
  const [plans, setPlans] = reactExports.useState([]);
  reactExports.useEffect(() => {
    if (routeSlug) {
      setDistributorBySlug(routeSlug);
    }
  }, [routeSlug, setDistributorBySlug]);
  reactExports.useEffect(() => {
    void (async () => {
      const data = await SupabaseService.fetchPlans();
      setPlans(data);
    })();
  }, []);
  const sponsorSlug = currentDistributor.slug;
  const distName = currentDistributor.name;
  const distRank = currentDistributor.rank;
  const [directs, setDirects] = reactExports.useState(3);
  const [multiplication, setMultiplication] = reactExports.useState(3);
  const [generations, setGenerations] = reactExports.useState(3);
  const [avgTicket, setAvgTicket] = reactExports.useState(300);
  let totalNetworkSize = 0;
  let estimatedMonthlyIncome = 0;
  for (let g = 1; g <= generations; g++) {
    const generationCount = directs * Math.pow(multiplication, g - 1);
    totalNetworkSize += generationCount;
    const unilevelPayout = avgTicket * 0.04;
    estimatedMonthlyIncome += generationCount * unilevelPayout;
  }
  const [name, setName] = reactExports.useState("");
  const [email, setEmail] = reactExports.useState("");
  const [phone, setPhone] = reactExports.useState("");
  const [cpf, setCpf] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [selectedPlan, setSelectedPlan] = reactExports.useState("pro");
  const [onboardingStep, setOnboardingStep] = reactExports.useState("form");
  const [submittingReg, setSubmittingReg] = reactExports.useState(false);
  const selectedPlanData = plans.find((plan) => String(plan.id) === selectedPlan) || plans[0];
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !phone || !cpf || !password) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }
    setSubmittingReg(true);
    try {
      await register(name, email, "distributor", {
        phone,
        cpf,
        sponsor_id: sponsorSlug,
        password
      });
      toast.success("Conta de distribuidor criada! Prossiga para ativação do plano.");
      setOnboardingStep("success");
    } catch {
      toast.error("Erro ao efetuar seu cadastro.");
    } finally {
      setSubmittingReg(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-[#06080d] text-white selection:bg-emerald-500/30 overflow-x-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-[#0b1220] border-b border-border/10 px-4 py-2.5 text-center flex items-center justify-center gap-2 text-xs relative z-40", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-2 w-2 rounded-full bg-emerald-500 animate-pulse" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-zinc-300", children: [
        "Você foi indicado por ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-white", children: distName }),
        " para licenciar uma franquia All-In Life."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/$slug", params: {
        slug: sponsorSlug
      }, className: "text-emerald-400 hover:text-emerald-300 ml-1.5 underline inline-flex items-center gap-0.5", children: [
        "Ver perfil ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-3 w-3" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(PublicHeader, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "relative py-12 md:py-16 border-b border-zinc-900 overflow-hidden bg-gradient-to-b from-indigo-950/10 via-background to-transparent", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-1/2 left-1/2 -translate-x-1/2 h-80 w-full max-w-5xl bg-gradient-to-tr from-emerald-500/10 to-indigo-500/5 blur-3xl pointer-events-none" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold tracking-widest font-mono text-emerald-400 bg-emerald-500/15 border border-emerald-500/20 px-3 py-1 rounded-full uppercase", children: "OPORTUNIDADE DISTRIBUIDOR AUTO-SUFICIENTE" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl sm:text-5xl font-black tracking-tight leading-snug max-w-4xl mx-auto", children: "Empreenda em Biotecnologia Celular de Luxo com All-In Brasil" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-zinc-400 leading-relaxed max-w-2xl mx-auto", children: "A All-In Life fornece um ecossistema completo para médicos, terapeutas e biohackers ampliarem seus resultados clínicos e financeiros de forma desacoplada e automatizada por IAs operacionais." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
            const el = document.getElementById("recruitment-form");
            if (el) el.scrollIntoView({
              behavior: "smooth"
            });
          }, className: "inline-flex h-10 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-black text-xs font-bold uppercase tracking-wider items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/15 cursor-pointer pt-0.5", children: "Iniciar Credenciamento" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
            const el = document.getElementById("calculator-simulator");
            if (el) el.scrollIntoView({
              behavior: "smooth"
            });
          }, className: "inline-flex h-10 px-6 rounded-xl border border-zinc-700 bg-background/50 hover:bg-background text-zinc-300 text-xs font-semibold items-center justify-center gap-1.5 cursor-pointer", children: "Simular Ganhos Residuais" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-20 relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { id: "compensation-structure", className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-2 max-w-2xl mx-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl sm:text-2xl font-bold tracking-tight text-white", children: "4 Vias de Bonificação Altamente Lucrativas" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-zinc-400", children: "Entenda de forma estrita e descomplicada como funciona a remuneração de nossa rede de biohackers." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-2 lg:grid-cols-4 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 rounded-2xl border border-zinc-800 bg-[#090d16]/80 space-y-3 hover:border-zinc-700 transition-colors", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "h-4.5 w-4.5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-bold uppercase tracking-widest font-mono text-zinc-500", children: "Lucro de Revenda" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-sm font-bold text-white", children: "Margem de 100% On-Line" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-zinc-400 leading-relaxed", children: "Compre a preço de fábrica (descontos de até 50%) e revenda ao consumidor final com 100% de margem e faturamento integrado." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 rounded-2xl border border-zinc-800 bg-[#090d16]/80 space-y-3 hover:border-zinc-700 transition-colors", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-4.5 w-4.5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-bold uppercase tracking-widest font-mono text-zinc-500", children: "Unilevel Infinito" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-sm font-bold text-white", children: "Pagamentos em 10 Gerações" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-zinc-400 leading-relaxed", children: "Ganhe comissão residual fixa de até 4% em todos os consumos ocorridos na sua rede, inclusive recompras de clientes finais." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 rounded-2xl border border-zinc-800 bg-[#090d16]/80 space-y-3 hover:border-zinc-700 transition-colors", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-4.5 w-4.5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-bold uppercase tracking-widest font-mono text-zinc-500", children: "Bônus Binário" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-sm font-bold text-white", children: "10% a 30% Perna Menor" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-zinc-400 leading-relaxed", children: "Sua rede é dividida em equipe Esquerda e Direita. Receba bônus de binário recorrentes sob o volume de faturamento semanal." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 rounded-2xl border border-zinc-800 bg-[#090d16]/80 space-y-3 hover:border-zinc-700 transition-colors", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "h-4.5 w-4.5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-bold uppercase tracking-widest font-mono text-zinc-500", children: "Bônus Ativação" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-sm font-bold text-white", children: "Adesão Direta de Franquias" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-zinc-400 leading-relaxed", children: "Ganhe bonificação imediata polpuda de até R$ 350,00 por novas distribuições que adentrarem seu time direto." })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-4 rounded-3xl border border-zinc-800 bg-[#090d16]/65 p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-bold text-white", children: "Planos ativos" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-zinc-400", children: "Lista carregada do Supabase." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid md:grid-cols-3 gap-4", children: plans.map((plan) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setSelectedPlan(String(plan.id)), className: `rounded-2xl border p-4 text-left transition-colors ${String(plan.id) === selectedPlan ? "border-emerald-500/40 bg-emerald-500/10" : "border-zinc-800 bg-[#06080d] hover:border-zinc-700"}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-white", children: plan.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-zinc-400", children: [
            plan.generations || 0,
            " gerações · ",
            plan.commission_percent || 0,
            "%"
          ] })
        ] }, plan.id)) }),
        selectedPlanData && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-zinc-400", children: [
          "Plano selecionado: ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-white", children: selectedPlanData.name })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { id: "calculator-simulator", className: "border border-zinc-800 bg-[#090d16]/65 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 right-0 h-48 w-48 bg-gradient-to-br from-emerald-500/5 to-indigo-500/5 blur-2xl rounded-full" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-12 gap-8 items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-7 space-y-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#a855f7]/15 text-[#a855f7] border border-[#a855f7]/25 font-mono", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Calculator, { className: "h-3 w-3" }),
              " SIMULADOR EXPONENCIAL MLM"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl sm:text-2xl font-bold tracking-tight text-white leading-tight", children: "Projete Seus Ganhos Passivos Recorrentes" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-zinc-400 leading-relaxed max-w-xl", children: "Altere os sliders abaixo para verificar como pequenas multiplicações de rede geram rendas residuais absurdas no longo prazo através de recompras e de consumos repetitivos de suplementos." }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 pt-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs font-medium", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-zinc-300", children: "Embaixadores cadastrados por você (Diretos):" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-emerald-400 font-bold font-mono", children: [
                    directs,
                    " diretos"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "range", min: "1", max: "15", value: directs, onChange: (e) => setDirects(parseInt(e.target.value)), className: "w-full accent-emerald-500 h-1 rounded-lg cursor-pointer" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs font-medium", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-zinc-300", children: "Duplicação de rede (Quantos cada parceiro recruta):" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-emerald-400 font-bold font-mono", children: [
                    multiplication,
                    " indicados"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "range", min: "1", max: "5", value: multiplication, onChange: (e) => setMultiplication(parseInt(e.target.value)), className: "w-full accent-emerald-500 h-1 rounded-lg cursor-pointer" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs font-medium", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-zinc-300", children: "Profundidade considerada (Gerações):" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-emerald-400 font-bold font-mono", children: [
                    generations,
                    " gerações"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "range", min: "1", max: "5", value: generations, onChange: (e) => setGenerations(parseInt(e.target.value)), className: "w-full accent-emerald-500 h-1 rounded-lg cursor-pointer" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs font-medium", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-zinc-300", children: "Consumo mensal médio de produtos por membro:" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-emerald-400 font-bold font-mono", children: [
                    "R$ ",
                    avgTicket,
                    " / mês"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "range", min: "100", max: "1000", step: "50", value: avgTicket, onChange: (e) => setAvgTicket(parseInt(e.target.value)), className: "w-full accent-emerald-500 h-1 rounded-lg cursor-pointer" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-5 rounded-2xl border border-zinc-800 bg-[#06080d] p-6 text-center space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] uppercase font-bold text-muted-foreground tracking-wider font-mono", children: "Prospecção de Ganhos Residual" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-widest text-[#25d366] font-bold font-mono leading-none", children: "RENDIMENTO MENSAL ESTIMADO" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-3xl sm:text-4xl font-black text-emerald-400 font-mono tracking-tight leading-none mt-1.5", children: estimatedMonthlyIncome.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL"
              }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-zinc-500 font-mono", children: "Simulação baseada em taxas residuais de 4% s/ consumo" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-zinc-900/50 rounded-xl border border-zinc-800 text-left text-xs font-mono space-y-1.5 divide-y divide-border/10", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-baseline pb-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Membros Ativos na Rede:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-white font-bold font-mono", children: [
                  totalNetworkSize,
                  " pessoas"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-baseline pt-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Volume Total Consumido:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white font-bold font-mono", children: (totalNetworkSize * avgTicket).toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL"
                }) })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
              const el = document.getElementById("recruitment-form");
              if (el) el.scrollIntoView({
                behavior: "smooth"
              });
            }, className: "w-full h-10 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-black text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer pt-0.5", children: [
              "Garantir Codificação @",
              sponsorSlug
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "recruitment-form", className: "max-w-4xl mx-auto rounded-3xl border border-zinc-800 bg-[#090d16]/95 overflow-hidden shadow-2xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: onboardingStep === "form" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
        opacity: 0
      }, animate: {
        opacity: 1
      }, exit: {
        opacity: 0
      }, className: "grid md:grid-cols-12", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-5 bg-gradient-to-br from-[#0d172e] via-[#090e1b] to-[#04060b] p-6 md:p-8 flex flex-col justify-between border-r border-[#141f39]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] bg-emerald-500/15 text-emerald-400 font-mono font-bold px-2.5 py-1 rounded-full border border-emerald-500/25", children: "PATROCÍNIO VINCULADO" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-md font-bold text-white", children: "Você Está se Credenciando Conosco" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 bg-black/40 border border-border/40 rounded-xl p-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: matchedUser?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(distName)}`, alt: distName, className: "h-10 w-10 rounded-full border border-emerald-500/40 object-cover" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-white text-xs", children: distName }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-emerald-400 font-mono leading-none mt-0.5", children: [
                  "@",
                  sponsorSlug
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-zinc-400 mt-1", children: distRank })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-zinc-400 leading-relaxed text-xs", children: "Seu patrocinador legítimo assegura sua vaga de nível superior na perna binária ativa. Seus bônus serão depositados semanalmente direto em conta bancária auditada pela administração." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-6 border-t border-zinc-800 text-[10px] text-zinc-500 space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-3.5 w-3.5 text-emerald-400 shrink-0" }),
              " Tecnologia de segurança com gateway Bacen"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Landmark, { className: "h-3.5 w-3.5 text-emerald-400 shrink-0" }),
              " Liquidação imediata de bônus binários"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleRegisterSubmit, className: "md:col-span-7 p-6 md:p-10 space-y-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-md font-bold text-white mb-2 leading-none", children: "Preencha Seu Credenciamento Oficial" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] uppercase font-bold text-muted-foreground font-mono", children: "Seu Nome Completo" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", required: true, value: name, onChange: (e) => setName(e.target.value), className: "w-full h-9 rounded-lg bg-background border border-border px-3 text-xs text-white", placeholder: "Ex: Nome Completo" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-2 gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] uppercase font-bold text-muted-foreground font-mono", children: "E-mail para Licença" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "email", required: true, value: email, onChange: (e) => setEmail(e.target.value), className: "w-full h-9 rounded-lg bg-background border border-border px-3 text-xs text-white", placeholder: "email@exemplo.com" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] uppercase font-bold text-muted-foreground font-mono", children: "Senha de Acesso ao Painel" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "password", required: true, value: password, onChange: (e) => setPassword(e.target.value), className: "w-full h-9 rounded-lg bg-background border border-border px-3 text-xs text-white", placeholder: "••••••••" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-2 gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] uppercase font-bold text-muted-foreground font-mono", children: "CPF para Auditoria Receita" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", required: true, value: cpf, onChange: (e) => setCpf(e.target.value), className: "w-full h-9 rounded-lg bg-background border border-border px-3 text-xs text-white", placeholder: "111.222.333-44" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] uppercase font-bold text-muted-foreground font-mono", children: "WhatsApp de Contato" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "tel", required: true, value: phone, onChange: (e) => setPhone(e.target.value), className: "w-full h-9 rounded-lg bg-background border border-border px-3 text-xs text-white", placeholder: "(11) 98765-4321" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 pt-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] uppercase font-bold text-zinc-500 font-mono", children: "Franquia / Kit de Adesão Inicial" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setSelectedPlan("starter"), className: `p-2.5 text-left rounded-xl border flex flex-col justify-between transition-all cursor-pointer ${selectedPlan === "starter" ? "border-emerald-500 bg-emerald-500/5" : "border-border hover:bg-background/25"}`, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold text-zinc-400", children: "Starter" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-black text-white font-mono mt-1", children: "R$ 199" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setSelectedPlan("pro"), className: `p-2.5 text-left rounded-xl border flex flex-col justify-between transition-all cursor-pointer ${selectedPlan === "pro" ? "border-emerald-500 bg-emerald-500/5" : "border-border hover:bg-background/25"}`, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold text-emerald-400", children: "Diamond Pro" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-black text-white font-mono mt-1", children: "R$ 499" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setSelectedPlan("platinum"), className: `p-2.5 text-left rounded-xl border flex flex-col justify-between transition-all cursor-pointer ${selectedPlan === "platinum" ? "border-emerald-500 bg-emerald-500/5" : "border-border hover:bg-background/25"}`, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold text-zinc-400", children: "Supreme PK" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-black text-white font-mono mt-1", children: "R$ 1.290" })
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: submittingReg, className: "w-full h-11 h-10 mt-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-black text-xs font-bold uppercase tracking-wider disabled:opacity-50 transition-all flex items-center justify-center gap-1.5 cursor-pointer pt-0.5", children: submittingReg ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-4 w-4 animate-spin rounded-full border border-t-transparent border-black" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            "Confirmar Credenciamento e Obter Link",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4" })
          ] }) })
        ] })
      ] }, "form-step") : /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
        opacity: 0,
        scale: 0.98
      }, animate: {
        opacity: 1,
        scale: 1
      }, className: "p-8 md:p-12 text-center space-y-6 bg-gradient-to-b from-[#081210]/95 to-background text-zinc-300 relative rounded-3xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-14 w-14 rounded-full bg-emerald-500/15 border border-emerald-500/25 grid place-items-center text-emerald-400 mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-7 w-7" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 max-w-lg mx-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-black text-white", children: "Credenciamento Homologado!" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-zinc-400 leading-relaxed", children: [
            "Seu perfil operacional de distribuidor foi inserido na plataforma All-In Life. Todas as suas comissões e as do seu sponsor ",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { className: "text-white", children: [
              "@",
              sponsorSlug
            ] }),
            " já estão vinculadas ao seu ledger."
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 border border-emerald-500/15 rounded-xl bg-emerald-500/5 text-[10px] text-muted-foreground font-mono space-y-1.5 max-w-sm mx-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-left font-sans text-[9px] uppercase tracking-wider text-muted-foreground mb-1 text-center", children: "Assinatura Certificada" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "h-3.5 w-3.5 text-emerald-400 shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "SPONSOR_ID: ",
              sponsorSlug.toUpperCase()
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[9px] text-emerald-500", children: [
            "Credenciados: ",
            name
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
          navigate({
            to: "/office/plan"
          });
        }, className: "inline-flex h-11 px-8 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black text-xs font-bold uppercase tracking-wider items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20 pt-0.5 cursor-pointer", children: [
          "Entrar no Escritório & Ativar Licença",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4" })
        ] })
      ] }, "success-step") }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "border-t border-zinc-900 bg-[#040609] py-12 relative z-10 text-xs text-zinc-500", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-white uppercase tracking-widest text-[11px]", children: "All-In Life · Sistema de Recrutamento MLM" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "max-w-md mx-auto leading-relaxed", children: "All-In Life é a plataforma operacional modular conectada ao ecossistema All-In Brasil e operada sob controle estrito da rede de fundadores originais." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px]", children: [
        "Patrocinador legitimado: ",
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-zinc-400 font-mono", children: [
          "@",
          sponsorSlug
        ] })
      ] })
    ] }) })
  ] });
}
export {
  DistributorRecruitmentPage as component
};
