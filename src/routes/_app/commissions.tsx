import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useCommissions } from "@/hooks/commissions/useCommissions";
import { PageHeader } from "@/components/widgets/page-header";
import { KpiCard } from "@/components/widgets/kpi-card";
import { Button } from "@/components/ui/button";
import { computeGenerationBonus } from "@/modules/plans/mlm-rules";

export const Route = createFileRoute("/_app/commissions")({ component: CommissionsPage });

function CommissionsPage() {
  const { data: commissionsData, isError, error, refetch } = useCommissions();
  const [isRunningCycle, setIsRunningCycle] = useState(false);

  const rows = commissionsData?.rows || [];
  const plans = commissionsData?.plans || [];
  const customers = commissionsData?.customers || [];

  const total = rows.reduce((sum, r) => sum + Number(r.pago || 0), 0);
  const plan = plans[0];
  const activeDirects = customers.filter((c) => String(c.patrocinador_comprador || "").length > 0 && (c.status || "").toLowerCase() === "active").length;
  const simulation = computeGenerationBonus(plan?.name, total || 1000, activeDirects);

  const pendingCycles = rows.filter((r) => r.status !== "pago");

  const handleRunCycle = async () => {
    if (pendingCycles.length === 0) return;
    setIsRunningCycle(true);
    try {
      // Simulate running cycle - in a real implementation, this would:
      // 1. Calculate commissions based on MLM rules
      // 2. Update payment statuses
      // 3. Create commission records
      await new Promise(resolve => setTimeout(resolve, 2000));
      refetch();
    } catch (err) {
      console.error("Erro ao rodar ciclo:", err);
    } finally {
      setIsRunningCycle(false);
    }
  };

  if (isError) {
    return (
      <div className="space-y-3">
        <PageHeader eyebrow="Rede MLM" title="Comissões & Ciclos" subtitle="Falha ao carregar comissões." />
        <p className="text-sm text-destructive">Erro: {error instanceof Error ? error.message : "falha desconhecida"}</p>
        <button className="text-sm underline" onClick={() => refetch()}>
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Rede MLM" title="Comissões & Ciclos" subtitle="Processamento derivado de pagamentos reais e regras dos planos." actions={
        <Button size="sm" onClick={handleRunCycle} disabled={pendingCycles.length === 0 || isRunningCycle}>
          {isRunningCycle ? "Rodando ciclo..." : `Rodar ciclo (${pendingCycles.length} pendentes)`}
        </Button>
      } />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Total pago no mês" value={`R$ ${total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`} accent="success" />
        <KpiCard label="Bônus médio" value={`R$ ${(rows.length ? total / rows.length : 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`} />
        <KpiCard label="Ciclos no mês" value={String(rows.length)} />
        <KpiCard label="Pendente próximo ciclo" value={String(rows.filter((r) => r.status !== "pago").length)} accent="warning" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <KpiCard label="Comissão direta simulada" value={`R$ ${simulation.direct.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`} />
        <KpiCard label="Geração 1" value={`R$ ${(simulation.generations[0]?.amount || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`} />
        <KpiCard label="Bônus extra diretos" value={`R$ ${(simulation.extraDirects.reduce((sum, b) => sum + b.amount, 0)).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`} />
      </div>

      <div className="rounded-xl border border-border bg-card/40 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-background/40 text-[11px] uppercase tracking-wider text-muted-foreground">
            <tr><th className="px-4 py-2.5 text-left">Ciclo</th><th className="px-4 py-2.5 text-right">Qualificados</th><th className="px-4 py-2.5 text-right">Valor pago</th><th className="px-4 py-2.5 text-left">Status</th></tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {rows.map((r) => (
              <tr key={r.id} className="hover:bg-accent/30">
                <td className="px-4 py-3 font-medium">{r.ciclo}</td>
                <td className="px-4 py-3 text-right tabular-nums">{r.qualificados}</td>
                <td className="px-4 py-3 text-right tabular-nums">R$ {r.pago.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
                <td className="px-4 py-3 capitalize">{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
