import { Calculator } from "lucide-react";

interface EarningsCalculatorProps {
  directs: number;
  setDirects: (value: number) => void;
  multiplication: number;
  setMultiplication: (value: number) => void;
  generations: number;
  setGenerations: (value: number) => void;
  avgTicket: number;
  setAvgTicket: (value: number) => void;
  totalNetworkSize: number;
  estimatedMonthlyIncome: number;
  sponsorSlug: string;
}

export function EarningsCalculator({
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
  sponsorSlug,
}: EarningsCalculatorProps) {
  return (
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
            <p className="text-[10px] text-zinc-500 font-mono">Simulação baseada em taxas residuais de 5%/3%/2% s/ consumo</p>
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
  );
}
