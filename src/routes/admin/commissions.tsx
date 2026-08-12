import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useCommissionsDashboard } from "@/modules/commissions";
import { PageHeader } from "@/components/widgets/page-header";
import { KpiCard } from "@/components/widgets/kpi-card";
import { Button } from "@/components/ui/button";
import { MlmEngineService } from "@/services/mlm-engine";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/commissions")({ component: CommissionsPage });

function CommissionsPage() {
  const { data: commissionsData, isError, error, refetch } = useCommissionsDashboard();
  const [isRunningCycle, setIsRunningCycle] = useState(false);

  const rows = commissionsData?.rows || [];
  const pendingCycles = rows.filter((r) => r.status !== "pago");

  const handleRunCycle = async () => {
    setIsRunningCycle(true);
    try {
      const result = await MlmEngineService.commissions.runCycle();
      toast.success(result.message || "Ciclo processado com sucesso!");
      refetch();
    } catch (err: any) {
      toast.error(err.message || "Erro ao rodar ciclo.");
    } finally {
      setIsRunningCycle(false);
    }
  };

  const total = rows.reduce((sum, r) => sum + Number(r.pago || 0), 0);

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
        <KpiCard label="Pendente próximo ciclo" value={String(pendingCycles.length)} accent="warning" />
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
