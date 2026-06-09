import { Trophy, Users, TrendingUp, Award } from "lucide-react";

export function CompensationGrid() {
  return (
    <section id="compensation-structure" className="space-y-6">
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">4 Vias de Bonificação Altamente Lucrativas</h2>
        <p className="text-xs text-zinc-400">Entenda de forma estrita e descomplicada como funciona a remuneração de nossa rede de biohackers.</p>
      </div>

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
  );
}
