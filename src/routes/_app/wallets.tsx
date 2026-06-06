import { createFileRoute } from "@tanstack/react-router";
import { useWithdrawals } from "@/hooks/wallets/useWithdrawals";
import { PageHeader } from "@/components/widgets/page-header";
import { KpiCard } from "@/components/widgets/kpi-card";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WalletDashboard } from "@/components/payments/wallet-dashboard";
import { PaymentHistory } from "@/components/payments/payment-history";

export const Route = createFileRoute("/_app/wallets")({ component: WalletsPage });

function WalletsPage() {
  const { data: saquesData, isError, error, refetch } = useWithdrawals();

  const saques = saquesData?.saques || [];
  const summary = saquesData?.summary || { total: 0, pending: 0, approved: 0, anomalies: 0 };

  if (isError) {
    return (
      <div className="space-y-3">
        <PageHeader eyebrow="Financeiro" title="Carteiras & Saques" subtitle="Falha ao carregar saques." />
        <p className="text-sm text-destructive">Erro: {error instanceof Error ? error.message : "falha desconhecida"}</p>
        <button className="text-sm underline" onClick={() => refetch()}>
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Financeiro" title="Carteiras & Saques" subtitle="Operações financeiras com dados reais do Supabase." actions={<Button size="sm">Aprovar em massa</Button>} />
      <Tabs defaultValue="saques" className="space-y-4">
        <TabsList>
          <TabsTrigger value="saques">Saques</TabsTrigger>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="historico">Histórico de Pagamentos</TabsTrigger>
        </TabsList>
        <TabsContent value="saques" className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <KpiCard label="Saldo total carteiras" value={`R$ ${summary.total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`} accent="primary" />
            <KpiCard label="Saques pendentes" value={String(summary.pending)} accent="warning" />
            <KpiCard label="Saques aprovados" value={String(summary.approved)} />
            <KpiCard label="Anomalias detectadas" value={String(summary.anomalies)} accent="destructive" />
          </div>

          <div className="rounded-xl border border-warning/30 bg-warning/5 p-3 flex items-center gap-3">
            <ShieldAlert className="h-4 w-4 text-warning" />
            <p className="text-sm flex-1"><span className="font-medium">{summary.anomalies} saques</span> marcados com risco.</p>
          </div>

          <div className="rounded-xl border border-border bg-card/40 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-background/40 text-[11px] uppercase tracking-wider text-muted-foreground">
                <tr><th className="px-4 py-2.5 text-left">Distribuidor</th><th className="px-4 py-2.5 text-right">Valor</th><th className="px-4 py-2.5 text-left">Método</th><th className="px-4 py-2.5 text-left">Status</th><th className="px-4 py-2.5 text-left">IA</th></tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {saques.map((s) => (
                  <tr key={s.id} className="hover:bg-accent/30">
                    <td className="px-4 py-3">{s.user}</td>
                    <td className="px-4 py-3 text-right tabular-nums font-medium">R$ {s.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{s.metodo}</td>
                    <td className="px-4 py-3 capitalize">{s.status}</td>
                    <td className="px-4 py-3">{s.risco && <span className="text-xs text-destructive">⚠ anomalia</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
        <TabsContent value="dashboard"><WalletDashboard /></TabsContent>
        <TabsContent value="historico"><PaymentHistory /></TabsContent>
      </Tabs>
    </div>
  );
}
