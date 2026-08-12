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
          <h3 className="text-xs font-bold uppercase tracking-widest font-mono text-zinc-500">Comissão Direta</h3>
          <h4 className="text-sm font-bold text-white">Até 20% por Venda</h4>
          <p className="text-xs text-zinc-400 leading-relaxed">Receba comissão direta sobre vendas realizadas. Plano Afiliado: 20% direto. Planos Avanço/Excelência: comissões de rede.</p>
        </div>

        <div className="p-5 rounded-2xl border border-zinc-800 bg-[#090d16]/80 space-y-3 hover:border-zinc-700 transition-colors">
          <div className="h-8 w-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center"><Users className="h-4.5 w-4.5" /></div>
          <h3 className="text-xs font-bold uppercase tracking-widest font-mono text-zinc-500">Unilevel</h3>
          <h4 className="text-sm font-bold text-white">Comissões em Até 10 Gerações</h4>
          <p className="text-xs text-zinc-400 leading-relaxed">Ganhe comissão residual fixa de até 5% na primeira geração, 3% na segunda e 2% na terceira geração da sua rede.</p>
        </div>

        <div className="p-5 rounded-2xl border border-zinc-800 bg-[#090d16]/80 space-y-3 hover:border-zinc-700 transition-colors">
          <div className="h-8 w-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center"><TrendingUp className="h-4.5 w-4.5" /></div>
          <h3 className="text-xs font-bold uppercase tracking-widest font-mono text-zinc-500">Bônus Patrocínio</h3>
          <h4 className="text-sm font-bold text-white">18% sobre Indicados</h4>
          <p className="text-xs text-zinc-400 leading-relaxed">Receba 18% de bônus sobre as vendas dos distribuidores que você indicou diretamente para a rede.</p>
        </div>

        <div className="p-5 rounded-2xl border border-zinc-800 bg-[#090d16]/80 space-y-3 hover:border-zinc-700 transition-colors">
          <div className="h-8 w-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center"><Award className="h-4.5 w-4.5" /></div>
          <h3 className="text-xs font-bold uppercase tracking-widest font-mono text-zinc-500">Bônus Liderança</h3>
          <h4 className="text-sm font-bold text-white">2% a 4% por Volume</h4>
          <p className="text-xs text-zinc-400 leading-relaxed">Plano Excelência: ganhe +2% com 4-7 diretos ativos ou +4% com 8+ diretos ativos na sua equipe.</p>
        </div>
      </div>
    </section>
  );
}
