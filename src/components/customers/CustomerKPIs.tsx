import { Sparkles } from "lucide-react";
import { KpiCard } from "@/components/widgets/kpi-card";
import { formatBRL } from "@/lib/customer-calculations";

interface CustomerKPIsProps {
  customer: any;
  orders: any[];
  metrics?: any;
  networkMetrics?: any;
  score?: any;
}

export function CustomerKPIs({ customer, orders, metrics, networkMetrics, score }: CustomerKPIsProps) {
  // Usa dados reais do banco se disponíveis, fallback para cálculos no frontend
  const ltv = metrics?.ltv || 0;
  const totalGasto = metrics?.total_gasto || 0;
  const ticketMedio = metrics?.ticket_medio || 0;
  const numeroPedidos = metrics?.numero_pedidos || orders.length;
  const directIndications = networkMetrics?.direct_indications || 0;
  const totalNetworkSize = networkMetrics?.total_network_size || 0;
  const estimatedBonus = networkMetrics?.estimated_bonus || 0;
  const engagementScore = score?.score || 0;

  return (
    <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-3">
      <KpiCard label="LTV" value={formatBRL(ltv)} />
      <KpiCard label="Total Gasto" value={formatBRL(totalGasto)} hint={`${numeroPedidos} pedidos`} />
      <KpiCard label="Ticket Médio" value={formatBRL(ticketMedio)} />
      <KpiCard label="Score" value={String(engagementScore)} />
      
      <KpiCard label="Indicações Diretas" value={String(directIndications)} />
      <KpiCard label="Rede Total" value={String(totalNetworkSize)} />
      <KpiCard label="Bônus Estimado" value={formatBRL(estimatedBonus)} />
      <KpiCard label="Último Pedido" value={metrics?.ultimo_pedido ? new Date(metrics.ultimo_pedido).toLocaleDateString("pt-BR") : "-"} />
      
      <div className="col-span-2 md:col-span-4 rounded-xl border border-primary/30 bg-primary/5 p-4 flex items-start gap-3">
        <Sparkles className="h-4 w-4 text-primary mt-0.5" />
        <div className="flex-1">
          <p className="text-xs md:text-sm text-amber-550">
            <span className="font-semibold text-primary">Sincronização Ativa de Ledger:</span> Os dados financeiros, pontos de rede, downlines de genealogia e o histórico detalhado estão sendo carregados e operacionalizados em tempo real a partir das tabelas relacionais do Supabase.
          </p>
        </div>
      </div>
    </div>
  );
}
