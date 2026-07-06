import { useState, useEffect } from "react";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useAuth } from "@/modules/auth";
import { useDistributor } from "@/lib/distributor-context";
import { SupabaseService } from "@/modules/auth/services/supabase.service";
import { Users, TrendingUp, Trophy, Award, ChevronRight, Calculator } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { PublicHeader } from "@/components/app/public-header";
import { UserRole } from "@/shared/types/roles";

export const Route = createFileRoute("/seja-distribuidor/$slug")({
  component: DistributorRecruitmentPage,
  // Sprint 3: Implementar loader para carregar dados antes da renderização
  loader: async ({ params }) => {
    const slug = params.slug?.toLowerCase().trim();
    if (!slug) {
      return { distributor: null };
    }
    const distributor = await resolveDistributor(slug);
    return { distributor };
  },
});

function DistributorRecruitmentPage() {
  const params = useParams({ strict: false }) as { slug?: string };
  const { currentDistributor, setDistributorBySlug } = useDistributor();
  const { register } = useAuth();
  
  const routeSlug = params.slug?.toLowerCase().trim();
  const [plans, setPlans] = useState<any[]>([]);
  
  useEffect(() => {
    if (routeSlug) {
      setDistributorBySlug(routeSlug);
    }
  }, [routeSlug, setDistributorBySlug]);

  useEffect(() => {
    void (async () => {
      const data = await SupabaseService.fetchPlans();
      setPlans(data);
    })();
  }, []);

  const sponsorSlug = currentDistributor.slug;
  const distName = currentDistributor.name;
  const distRank = currentDistributor.rank;

  // Earnings Simulator State
  const [directs, setDirects] = useState(3);
  const [multiplication, setMultiplication] = useState(3);
  const [generations, setGenerations] = useState(3);
  const [avgTicket, setAvgTicket] = useState(300);

  // Network math
  let totalNetworkSize = 0;
  let estimatedMonthlyIncome = 0;

  for (let g = 1; g <= generations; g++) {
    const generationCount = directs * Math.pow(multiplication, g - 1);
    totalNetworkSize += generationCount;
    
    // Average passive residual unilevel commission payout per generation active: 4% of avgTicket
    const unilevelPayout = avgTicket * 0.04;
    estimatedMonthlyIncome += generationCount * unilevelPayout;
  }

  // Registration form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("pro");
  const [onboardingStep, setOnboardingStep] = useState<"form" | "success">("form");
  const [submittingReg, setSubmittingReg] = useState(false);
  const selectedPlanData = plans.find((plan) => String(plan.id) === selectedPlan) || plans[0];

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !cpf || !password) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    setSubmittingReg(true);
    try {
      // Execute simulated register with distributor role
      await register(name, email, UserRole.DISTRIBUIDOR, {
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

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl border border-zinc-800 bg-[#090d16]/80 space-y-3 hover:border-zinc-700 transition-colors">
              <div className="h-8 w-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center"><Trophy className="h-4.5 w-4.5" /></div>
              <h3 className="text-xs font-bold uppercase tracking-widest font-mono text-zinc-500">Lucro de Revenda</h3>
              <h4 className="text-sm font-bold text-white">Margem de 100% On-Line</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">Compre a preço de fábrica (descontos de até 50%) e revenda ao consumidor final com 100% de margem e faturamento integrado.</p>
            </div>

            <div className="p-5 rounded-2xl border border-zinc-800 bg-[#090d16]/80 space-y-3 hover:border-zinc-700 transition-colors">
              <div className="h-8 w-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center"><Users className="h-4.5 w-4.5" /></div>
              <h3 className="text-xs font-bold uppercase tracking-widest font-mono text-zinc-500">Unilevel Infinito</h3>
              <h4 className="text-sm font-bold text-white">Pagamentos em 10 Gerações</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">Ganhe comissão residual fixa de até 4% em todos os consumos ocorridos na sua rede, inclusive recompras de clientes finais.</p>
            </div>

            <div className="p-5 rounded-2xl border border-zinc-800 bg-[#090d16]/80 space-y-3 hover:border-zinc-700 transition-colors">
              <div className="h-8 w-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center"><TrendingUp className="h-4.5 w-4.5" /></div>
              <h3 className="text-xs font-bold uppercase tracking-widest font-mono text-zinc-500">Bônus Binário</h3>
              <h4 className="text-sm font-bold text-white">10% a 30% Perna Menor</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">Sua rede é dividida em equipe Esquerda e Direita. Receba bônus de binário recorrentes sob o volume de faturamento semanal.</p>
            </div>

            <div className="p-5 rounded-2xl border border-zinc-800 bg-[#090d16]/80 space-y-3 hover:border-zinc-700 transition-colors">
              <div className="h-8 w-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center"><Award className="h-4.5 w-4.5" /></div>
              <h3 className="text-xs font-bold uppercase tracking-widest font-mono text-zinc-500">Bônus Ativação</h3>
              <h4 className="text-sm font-bold text-white">Adesão Direta de Franquias</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">Ganhe bonificação imediata polpuda de até R$ 350,00 por novas distribuições que adentrarem seu time direto.</p>
            </div>
          </div>
        </section>

        <section className="space-y-4 rounded-3xl border border-zinc-800 bg-[#090d16]/65 p-6">
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-white">Planos ativos</h2>
            <p className="text-xs text-zinc-400">Lista carregada do Supabase.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {plans.map((plan) => (
              <button
                key={plan.id}
                type="button"
                onClick={() => setSelectedPlan(String(plan.id))}
                className={`rounded-2xl border p-4 text-left transition-colors ${String(plan.id) === selectedPlan ? "border-emerald-500/40 bg-emerald-500/10" : "border-zinc-800 bg-[#06080d] hover:border-zinc-700"}`}
              >
                <p className="text-sm font-bold text-white">{plan.name}</p>
                <p className="text-xs text-zinc-400">{plan.generations || 0} gerações · {plan.commission_percent || 0}%</p>
              </button>
            ))}
          </div>
          {selectedPlanData && (
            <p className="text-xs text-zinc-400">Plano selecionado: <strong className="text-white">{selectedPlanData.name}</strong></p>
          )}
        </section>

        {/* DYNAMIC EARNINGS CALCULATOR */}
        <section id="calculator-simulator" className="border border-zinc-800 bg-[#090d16]/65 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 h-48 w-48 bg-gradient-to-br from-emerald-500/5 to-indigo-500/5 blur-2xl rounded-full" />
          
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            {/* Controls */}
            <div className="lg:col-span-7 space-y-6">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#a855f7]/15 text-[#a855f7] border border-[#a855f7]/25 font-mono">
                <Calculator className="h-3 w-3" /> SIMULADOR EXPONENCIAL MLM
              </span>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-tight">Projete Seus Ganhos Passivos Recorrentes</h3>
              <p className="text-xs text-zinc-400 leading-relaxed max-w-xl">
                Altere os sliders abaixo para verificar como pequenas multiplicações de rede geram rendas residuais absurdas no longo prazo através de recompras e de consumos repetitivos de suplementos.
              </p>

              <div className="space-y-4 pt-2">
                {/* Sliders */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-zinc-300">Embaixadores cadastrados por você (Diretos):</span>
                    <span className="text-emerald-400 font-bold font-mono">{directs} diretos</span>
                  </div>
                  <input 
                    type="range" min="1" max="15" value={directs} onChange={(e) => setDirects(parseInt(e.target.value))}
                    className="w-full accent-emerald-500 h-1 rounded-lg cursor-pointer"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-zinc-300">Duplicação de rede (Quantos cada parceiro recruta):</span>
                    <span className="text-emerald-400 font-bold font-mono">{multiplication} indicados</span>
                  </div>
                  <input 
                    type="range" min="1" max="5" value={multiplication} onChange={(e) => setMultiplication(parseInt(e.target.value))}
                    className="w-full accent-emerald-500 h-1 rounded-lg cursor-pointer"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-zinc-300">Profundidade considerada (Gerações):</span>
                    <span className="text-emerald-400 font-bold font-mono">{generations} gerações</span>
                  </div>
                  <input 
                    type="range" min="1" max="5" value={generations} onChange={(e) => setGenerations(parseInt(e.target.value))}
                    className="w-full accent-emerald-500 h-1 rounded-lg cursor-pointer"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-zinc-300">Consumo mensal médio de produtos por membro:</span>
                    <span className="text-emerald-400 font-bold font-mono">R$ {avgTicket} / mês</span>
                  </div>
                  <input 
                    type="range" min="100" max="1000" step="50" value={avgTicket} onChange={(e) => setAvgTicket(parseInt(e.target.value))}
                    className="w-full accent-emerald-500 h-1 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Estimates box */}
            <div className="lg:col-span-5 rounded-2xl border border-zinc-800 bg-[#06080d] p-6 text-center space-y-4">
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider font-mono">Prospecção de Ganhos Residual</span>
              
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-widest text-[#25d366] font-bold font-mono leading-none">RENDIMENTO MENSAL ESTIMADO</p>
                <p className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono tracking-tight leading-none mt-1.5">
                  {estimatedMonthlyIncome.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </p>
                <p className="text-[10px] text-zinc-500 font-mono">Simulação baseada em taxas residuais de 4% s/ consumo</p>
              </div>

              <div className="p-3 bg-zinc-900/50 rounded-xl border border-zinc-800 text-left text-xs font-mono space-y-1.5 divide-y divide-border/10">
                <div className="flex justify-between items-baseline pb-1.5">
                  <span>Membros Ativos na Rede:</span>
                  <span className="text-white font-bold font-mono">{totalNetworkSize} pessoas</span>
                </div>
                <div className="flex justify-between items-baseline pt-1.5">
                  <span>Volume Total Consumido:</span>
                  <span className="text-white font-bold font-mono">{(totalNetworkSize * avgTicket).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  const el = document.getElementById("recruitment-form");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full h-10 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-black text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer pt-0.5"
              >
                Garantir Codificação @{sponsorSlug}
              </button>
            </div>
          </div>
        </section>

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
