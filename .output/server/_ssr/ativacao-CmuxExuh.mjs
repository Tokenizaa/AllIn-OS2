import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { g as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { b as useAuth, i as SupabaseService } from "./router-BZaVudxP.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { h as Award } from "../_libs/lucide-react.mjs";
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
function ActivationPage() {
  const navigate = useNavigate();
  const {
    user,
    loading,
    activateDistributorOffice,
    logout
  } = useAuth();
  const [selectedPlan, setSelectedPlan] = reactExports.useState("plan-pro");
  const [paymentStep, setPaymentStep] = reactExports.useState("select");
  const [paymentMethod, setPaymentMethod] = reactExports.useState("pix");
  const [coupon, setCoupon] = reactExports.useState("");
  const [discount, setDiscount] = reactExports.useState(0);
  const [plans, setPlans] = reactExports.useState([]);
  reactExports.useEffect(() => {
    const fetchPlans = async () => {
      const plansData = await SupabaseService.fetchPlans();
      const transformedPlans = plansData.map((plan) => ({
        id: plan.id,
        name: plan.name,
        price: parseFloat(plan.price),
        points: `${plan.metadata?.points || 0} Pontos`,
        binary: `${plan.metadata?.binary_percentage || 0}% de Binário`,
        description: plan.description || "",
        features: plan.metadata?.features || []
      }));
      setPlans(transformedPlans);
    };
    fetchPlans();
  }, []);
  reactExports.useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate({
          to: "/login"
        });
      } else if (user.role !== "distributor") {
        navigate({
          to: "/"
        });
      } else if (user.status === "active") {
        navigate({
          to: "/office"
        });
      }
    }
  }, [user, loading, navigate]);
  const currentPlan = plans.find((p) => p.id === selectedPlan) || plans[0];
  const finalPrice = currentPlan.price - discount;
  const handleApplyCoupon = () => {
    if (coupon.trim().toUpperCase() === "ALLIN10") {
      setDiscount(currentPlan.price * 0.1);
      toast.success("Cupom de 10% de desconto aplicado com sucesso!");
    } else {
      toast.error("Cupom inválido ou expirado.");
    }
  };
  const handleCheckoutInit = () => {
    setPaymentStep("checkout");
  };
  const handleSimulatePayment = () => {
    setPaymentStep("processing");
    setTimeout(async () => {
      try {
        await activateDistributorOffice(selectedPlan);
        setPaymentStep("success");
        toast.success("Pagamento confirmado! Licença comercial ativada.");
      } catch (err) {
        toast.error(err.message || "Erro ao realizar ativação.");
        setPaymentStep("checkout");
      }
    }, 2500);
  };
  if (loading || !user) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center bg-[#04060a]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen text-foreground bg-[#04060a] relative overflow-hidden py-12 px-4 md:px-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-primary/10 blur-[130px] pointer-events-none" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-fuchsia-500/5 blur-[120px] pointer-events-none" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[1240px] mx-auto text-center space-y-3 mb-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold bg-primary/15 text-primary border border-primary/20", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "h-3.5 w-3.5" }),
        "Onboarding de Distribuidor Autorizado"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight", children: "Ativação de Escritório Digital" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground max-w-xl mx-auto", children: [
        "Olá, ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-white", children: user.name }),
        ". Para assumir sua posição na matriz binária do Allin OS e começar a lucrar com sua rede de vendas, adquira sua licença empresarial inicial."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center gap-3 pt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: logout, className: "text-xs px-4 py-1.5 rounded-lg border border-border/60 hover:bg-border/30 text-muted-foreground hover:text-white transition-colors cursor-pointer", children: "Sair da Conta (Fazer outro Login)" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-[1240px] mx-auto relative z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AnimatePresence, { mode: "wait", children: [
      paymentStep === "select" && /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
        opacity: 0,
        y: 15
      }, animate: {
        opacity: 1,
        y: 0
      }, exit: {
        opacity: 0,
        y: -15
      }, transition: {
        duration: 0.3
      }, className: "space-y-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid md:grid-cols-3 gap-6 items-stretch", children: plans.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { onClick: () => setSelectedPlan(p.id), className: `relative rounded-2xl border transition-all cursor-pointer p-6 flex flex-col justify-between ${selectedPlan === p.id ? "border-primary bg-primary/5 shadow-2xl shadow-primary/10" : "border-border/65 bg-[#090d16]/75 hover:border-border"} ${p.featured ? "md:scale-105" : ""}`, children: [
          p.featured && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -top-3 left-1/2 transform -translate-x-1/2 rounded-full bg-gradient-to-r from-primary to-fuchsia-500 px-3 py-1 text-[10px] font-bold text-white uppercase tracking-wider", children: "Mais Recomendado" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold text-white mb-1.5", children: p.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: p.description })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-background/40 py-2.5 px-3.5 rounded-lg border border-border/40 flex justify-between items-center text-xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-emerald-400 font-semibold", children: p.binary }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-bold uppercase tracking-wider", children: p.points })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-3xl font-extrabold text-white", children: [
                "R$ ",
                p.price.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2
                })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground block mt-1", children: "Taxa única de licenciamento anual" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-border/40 pt-4 space-y-2.5", children: p.features.map((f, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2.5 text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-4 w-4 rounded-full bg-primary/10 text-primary grid place-items-center shrink-0 text-[10px] font-bold", children: "✓" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: f })
            ] }, idx)) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-6 mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: `w-full py-2.5 rounded-lg text-xs font-bold transition-all ${selectedPlan === p.id ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25" : "bg-background/60 hover:bg-background border border-border text-white"}`, children: selectedPlan === p.id ? "Pacote Selecionado" : "Selecionar Licença" }) })
        ] }, p.id)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center pt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleCheckoutInit, className: "rounded-xl bg-gradient-to-r from-primary to-fuchsia-500 hover:from-primary/90 hover:to-fuchsia-500/90 text-primary-foreground py-3.5 px-12 text-sm font-bold tracking-wide shadow-lg shadow-primary/20 flex items-center gap-2.5 transition-all cursor-pointer", children: [
          "Seguir para Pagamento de Ativação",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4.5 w-4.5" })
        ] }) })
      ] }, "step-select"),
      paymentStep === "checkout" && /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
        opacity: 0,
        scale: 0.98
      }, animate: {
        opacity: 1,
        scale: 1
      }, exit: {
        opacity: 0,
        scale: 0.95
      }, transition: {
        duration: 0.25
      }, className: "max-w-4xl mx-auto rounded-2xl border border-border/80 bg-[#090d16]/90 p-6 md:p-8 backdrop-blur-md grid md:grid-cols-5 gap-8 shadow-2xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-2 space-y-6 md:border-r md:border-border/60 md:pr-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold uppercase tracking-wider text-muted-foreground", children: "Resumo do Pedido" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 p-4 rounded-xl bg-background/50 border border-border/40 space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center text-xs", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-mono", children: "Licença Comercial:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-white", children: currentPlan.name })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center text-xs", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-mono", children: "Pontuação Unilevel:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-primary", children: currentPlan.points })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center text-xs", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-mono", children: "Binário Configurado:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-emerald-400", children: currentPlan.binary })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border/40 pt-3 flex justify-between items-center text-xs", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-mono", children: "Preço Base:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-white", children: [
                  "R$ ",
                  currentPlan.price.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2
                  })
                ] })
              ] }),
              discount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center text-xs text-rose-400", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Desconto aplicado:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  "- R$ ",
                  discount.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2
                  })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border/40 pt-3 flex justify-between items-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-white uppercase", children: "Total Geral:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { className: "text-xl text-primary font-extrabold", children: [
                  "R$ ",
                  finalPrice.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2
                  })
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block", children: "Possui um Cupom de Desconto?" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: coupon, onChange: (e) => setCoupon(e.target.value), className: "flex-1 h-9 px-3 rounded-lg border border-border/60 bg-background/50 text-xs text-white uppercase font-mono", placeholder: "Cupom: ALLIN10" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: handleApplyCoupon, className: "bg-primary/25 hover:bg-primary/35 border border-primary/35 text-primary text-xs font-bold rounded-lg px-3.5 transition-colors cursor-pointer", children: "Aplicar" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setPaymentStep("select"), className: "w-full text-center text-xs text-muted-foreground hover:text-white underline transition-colors pt-2 block font-mono", children: "← Alterar plano selecionado" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-3 space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4", children: "Escolha o Método de Pagamento" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3 mb-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setPaymentMethod("pix"), className: `h-11 rounded-lg border flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wide transition-all cursor-pointer ${paymentMethod === "pix" ? "border-primary bg-primary/5 text-primary" : "border-border/60 hover:bg-background/40 text-muted-foreground"}`, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(QrCode, { className: "h-4 w-4" }),
                "PIX Instantâneo"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setPaymentMethod("card"), className: `h-11 rounded-lg border flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wide transition-all cursor-pointer ${paymentMethod === "card" ? "border-primary bg-primary/5 text-primary" : "border-border/60 hover:bg-background/40 text-muted-foreground"}`, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "h-4 w-4" }),
                "Cartão de Crédito"
              ] })
            ] })
          ] }),
          paymentMethod === "pix" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-[#0e1422]/60 border border-border/50 rounded-xl p-5 text-center space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-block bg-white p-3.5 rounded-xl mb-1 shadow-lg shadow-white/5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-32 w-32 border border-slate-200 bg-slate-100 flex items-center justify-center text-slate-800 font-bold p-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-4 gap-1 w-full h-full p-2 opacity-85", children: Array.from({
              length: 16
            }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `rounded-sm ${i % 3 === 0 || i % 7 === 1 ? "bg-slate-900" : "bg-transparent"}` }, i)) }) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-white uppercase", children: "Chave Copia e Cola Gerada" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground font-mono truncate max-w-[280px] mx-auto bg-background/50 px-2.5 py-1 rounded border border-border/40", children: "00020126580014br.gov.bcb.pix0136allinos-payment-gateway-pix-120000bc" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
              toast.success("Código Copia e Cola salvo na área de transferência!");
            }, className: "text-xs text-primary font-mono inline-flex items-center gap-1.5 hover:underline", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardCopy, { className: "h-3.5 w-3.5" }),
              " Copiar Código Pix"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground max-w-xs mx-auto", children: 'O pagamento Pix é verificado de forma automatizada pelo gateway All-In. Após efetuar a simulação, clique em "Confirmar Pagamento Simulado".' })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-widest", children: "Número do cartão" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", disabled: true, className: "w-full h-9 px-3 rounded-lg border border-border/40 bg-background/40 text-xs text-white", value: "••••  ••••  ••••  5592 (Cartão corporativo pré-carregado)" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-widest", children: "Expiração" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", disabled: true, className: "w-full h-9 px-3 rounded-lg border border-border/40 bg-background/40 text-xs text-white", value: "04/2030" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-widest", children: "CVC" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "password", disabled: true, className: "w-full h-9 px-3 rounded-lg border border-border/40 bg-background/40 text-xs text-white", value: "•••" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: handleSimulatePayment, className: "w-full h-11 mt-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-500/20 cursor-pointer pt-0.5", children: [
            "Confirmar Pagamento Simulado (R$ ",
            finalPrice.toLocaleString("pt-BR", {
              minimumFractionDigits: 2
            }),
            ")"
          ] })
        ] })
      ] }, "step-checkout"),
      paymentStep === "processing" && /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
        opacity: 0
      }, animate: {
        opacity: 1
      }, className: "max-w-md mx-auto text-center py-12 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex items-center justify-center mx-auto h-20 w-20", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-16 w-16 animate-spin rounded-full border-4 border-t-emerald-500 border-r-transparent border-b-transparent border-l-transparent" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute h-10 w-10 animate-pulse rounded-full bg-emerald-500/10" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold text-white", children: "Processando com o Gateway..." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: "Consultando o banco de dados do Banco Central e as chaves Pix associadas para o All-In. Aguarde a validação da transação unificada." })
      ] }, "step-processing"),
      paymentStep === "success" && /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
        opacity: 0,
        scale: 0.95
      }, animate: {
        opacity: 1,
        scale: 1
      }, className: "max-w-md mx-auto text-center border border-emerald-500/30 bg-[#081210]/95 p-8 rounded-2xl shadow-emerald-500/10 shadow-2xl space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-16 w-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 grid place-items-center text-emerald-400 mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCircle, { className: "h-8 w-8 text-emerald-400" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold text-white", children: "Membro Ativo All-In!" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground leading-relaxed", children: [
            "Licença ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-white", children: currentPlan.name }),
            " confirmada com sucesso! Seu nó na rede MLM foi estruturado e ativado, e sua carteira de bônus inicial já está pronta."
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => navigate({
          to: "/office"
        }), className: "w-full h-10 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer pt-0.5", children: [
          "Acessar Meu Backoffice",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4" })
        ] })
      ] }, "step-success")
    ] }) })
  ] });
}
export {
  ActivationPage as component
};
