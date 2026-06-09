import { Sparkles } from "lucide-react";
import { KpiCard } from "@/components/widgets/kpi-card";
import { formatBRL, calculateLTV, calculateTotalComprado, calculateChurnRisk } from "@/lib/customer-calculations";

interface CustomerKPIsProps {
  customer: any;
  orders: any[];
}

export function CustomerKPIs({ customer, orders }: CustomerKPIsProps) {
  const ltv = calculateLTV(orders);
  const totalComprado = calculateTotalComprado(orders);
  const churnRisk = calculateChurnRisk(customer, orders);

  return (
    <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-3">
      <KpiCard label="LTV" value={formatBRL(ltv)} />
      <KpiCard label="Total Comprado" value={formatBRL(totalComprado)} hint={`${orders.length} pedidos em folha`} />
      <KpiCard label="Pedidos na Conta" value={String(orders.length)} />
      <KpiCard label="Risco de Churn" value={churnRisk} />
      
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
