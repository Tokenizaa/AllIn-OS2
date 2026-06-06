import { useEffect } from "react";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useAuth } from "@/modules/auth";
import { useDistributor } from "@/lib/distributor-context";
import { ChevronRight } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { PublicHeader } from "@/components/app/public-header";
import { useDistributorPlans } from "@/hooks/distributor/useDistributorPlans";
import { useEarningsCalculator } from "@/hooks/distributor/useEarningsCalculator";
import { useDistributorRegistration } from "@/hooks/distributor/useDistributorRegistration";
import { CompensationGrid } from "@/components/distributor/CompensationGrid";
import { EarningsCalculator } from "@/components/distributor/EarningsCalculator";
import { DistributorPlans } from "@/components/distributor/DistributorPlans";
import { RegistrationForm } from "@/components/distributor/RegistrationForm";
import { RegistrationSuccess } from "@/components/distributor/RegistrationSuccess";

export const Route = createFileRoute("/seja-distribuidor/$slug")({
  component: DistributorRecruitmentPage,
});

function DistributorRecruitmentPage() {
  const params = useParams({ strict: false }) as { slug?: string };
  const { currentDistributor, setDistributorBySlug } = useDistributor();
  const { register } = useAuth();
  
  const routeSlug = params.slug?.toLowerCase().trim();
  
  useEffect(() => {
    if (routeSlug) {
      setDistributorBySlug(routeSlug);
    }
  }, [routeSlug, setDistributorBySlug]);

  const sponsorSlug = currentDistributor.slug;
  const distName = currentDistributor.name;
  const distRank = currentDistributor.rank;

  const { plans } = useDistributorPlans();
  
  const {
    directs,
    setDirects,
    multiplication,
    setMultiplication,
    generations,
    setGenerations,
    avgTicket,
    setAvgTicket,
    totalNetworkSize,
    estimatedMonthlyIncome,
  } = useEarningsCalculator();

  const {
    name,
    setName,
    email,
    setEmail,
    phone,
    setPhone,
    cpf,
    setCpf,
    password,
    setPassword,
    selectedPlan,
    setSelectedPlan,
    onboardingStep,
    setOnboardingStep,
    submittingReg,
    handleRegisterSubmit,
  } = useDistributorRegistration({ register, sponsorSlug });

  return (
    <div className="min-h-screen bg-[#06080d] text-white selection:bg-emerald-500/30 overflow-x-hidden">
      
      {/* PIN HEADER BAR */}
      <div className="bg-[#0b1220] border-b border-border/10 px-4 py-2.5 text-center flex items-center justify-center gap-2 text-xs relative z-40">
        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        <p className="text-zinc-300">
          Você foi indicado por <strong className="text-white">{distName}</strong> para licenciar uma franquia All-In Life.
        </p>
        <Link to="/$slug" params={{ slug: sponsorSlug }} className="text-emerald-400 hover:text-emerald-300 ml-1.5 underline inline-flex items-center gap-0.5">
          Ver perfil <ChevronRight className="h-3 w-3" />
        </Link>
      </div>

      <PublicHeader />

      {/* COMPARED HEADER HERO */}
      <header className="relative py-12 md:py-16 border-b border-zinc-900 overflow-hidden bg-gradient-to-b from-indigo-950/10 via-background to-transparent">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 h-80 w-full max-w-5xl bg-gradient-to-tr from-emerald-500/10 to-indigo-500/5 blur-3xl pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="text-[10px] font-bold tracking-widest font-mono text-emerald-400 bg-emerald-500/15 border border-emerald-500/20 px-3 py-1 rounded-full uppercase">
            OPORTUNIDADE DISTRIBUIDOR AUTO-SUFICIENTE
          </span>
          
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-snug max-w-4xl mx-auto">
            Empreenda em Biotecnologia Celular de Luxo com All-In Brasil
          </h1>
          
          <p className="text-sm text-zinc-400 leading-relaxed max-w-2xl mx-auto">
            A All-In Life fornece um ecossistema completo para médicos, terapeutas e biohackers ampliarem seus resultados clínicos e financeiros de forma desacoplada e automatizada por IAs operacionais.
          </p>

          <div className="flex justify-center gap-3">
            <button
              onClick={() => {
                const el = document.getElementById("recruitment-form");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex h-10 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-black text-xs font-bold uppercase tracking-wider items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/15 cursor-pointer pt-0.5"
            >
              Iniciar Credenciamento
            </button>
            <button
              onClick={() => {
                const el = document.getElementById("calculator-simulator");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex h-10 px-6 rounded-xl border border-zinc-700 bg-background/50 hover:bg-background text-zinc-300 text-xs font-semibold items-center justify-center gap-1.5 cursor-pointer"
            >
              Simular Ganhos Residuais
            </button>
          </div>
        </div>
      </header>

      {/* CORE CONTENT */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-20 relative">
        <CompensationGrid />

        <DistributorPlans plans={plans} selectedPlan={selectedPlan} setSelectedPlan={setSelectedPlan} />

        <EarningsCalculator
          directs={directs}
          setDirects={setDirects}
          multiplication={multiplication}
          setMultiplication={setMultiplication}
          generations={generations}
          setGenerations={setGenerations}
          avgTicket={avgTicket}
          setAvgTicket={setAvgTicket}
          totalNetworkSize={totalNetworkSize}
          estimatedMonthlyIncome={estimatedMonthlyIncome}
          sponsorSlug={sponsorSlug}
        />

        {/* REGISTRATION FORM (THE MLM CAPTURE PORTAL) */}
        <section id="recruitment-form" className="max-w-4xl mx-auto rounded-3xl border border-zinc-800 bg-[#090d16]/95 overflow-hidden shadow-2xl">
          <AnimatePresence mode="wait">
            {onboardingStep === "form" ? (
              <RegistrationForm
                distName={distName}
                sponsorSlug={sponsorSlug}
                distRank={distRank}
                name={name}
                setName={setName}
                email={email}
                setEmail={setEmail}
                phone={phone}
                setPhone={setPhone}
                cpf={cpf}
                setCpf={setCpf}
                password={password}
                setPassword={setPassword}
                selectedPlan={selectedPlan}
                setSelectedPlan={setSelectedPlan}
                submittingReg={submittingReg}
                handleRegisterSubmit={handleRegisterSubmit}
              />
            ) : (
              <RegistrationSuccess
                name={name}
                sponsorSlug={sponsorSlug}
              />
            )}
          </AnimatePresence>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-zinc-900 bg-[#040609] py-12 relative z-10 text-xs text-zinc-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <p className="font-semibold text-white uppercase tracking-widest text-[11px]">All-In Life · Sistema de Recrutamento MLM</p>
          <p className="max-w-md mx-auto leading-relaxed">
            All-In Life é a plataforma operacional modular conectada ao ecossistema All-In Brasil e operada sob controle estrito da rede de fundadores originais.
          </p>
          <p className="text-[10px]">Patrocinador legitimado: <span className="text-zinc-400 font-mono">@{sponsorSlug}</span></p>
        </div>
      </footer>
    </div>
  );
}
