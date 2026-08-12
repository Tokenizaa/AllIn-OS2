import { lazy, Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowDownToLine, TrendingUp, Sparkles, Lock, Clock, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/distributor/stat-card";
import { useOfficeFinance } from "@/modules/finance";
import { formatBRL } from "@/lib/customer-calculations";

const FinanceCharts = lazy(() => import("./-_financeCharts"));

type WalletRow = {
  balance_available?: number | null;
  balance_blocked?: number | null;
  balance_pending?: number | null;
  total_year?: number | null;
  total_month?: number | null;
};

type WithdrawalRow = {
  id: string;
  description?: string | null;
  type?: string | null;
  amount?: number | null;
  created_at?: string | null;
};

export const Route = createFileRoute("/distributor/finance")({ component: FinancePage });

function FinancePage() {
  const { data: financeData, isError, error, refetch } = useOfficeFinance();

  const withdrawals = financeData?.withdrawals || [];
  const wallet = (financeData?.wallet || {}) as WalletRow;

  const available = Number(wallet.balance_available || 0);
  const blocked = Number(wallet.balance_blocked || 0);
  const pending = Number(wallet.balance_pending || 0);
  const totalYear = Number(wallet.total_year || 0);

  if (isError) {
    return (
      <div className="p-6 text-sm text-destructive">
        Erro ao carregar financeiro: {error instanceof Error ? error.message : "falha desconhecida"}.
        <button className="ml-3 underline" onClick={() => refetch()}>
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Financeiro</h1>
          <p className="text-sm text-muted-foreground">Saldos e extrato carregados do Supabase.</p>
        </div>
        <Button className="gap-2 bg-gradient-to-r from-primary to-fuchsia-500"><ArrowDownToLine className="h-4 w-4" /> Solicitar saque</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/20 via-fuchsia-500/10 to-transparent p-6">
          <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-primary/20 blur-3xl" />
          <div className="relative">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Saldo disponível</p>
            <p className="mt-2 text-4xl md:text-5xl font-bold">{formatBRL(available)}</p>
            <div className="mt-6 grid grid-cols-3 gap-4">
              <Mini icon={Lock} label="Bloqueado" value={formatBRL(blocked)} />
              <Mini icon={Clock} label="A liberar" value={formatBRL(pending)} />
              <Mini icon={TrendingUp} label="Ganho no ano" value={formatBRL(totalYear)} />
            </div>
          </div>
        </div>
        <div className="rounded-3xl border border-border/60 bg-card/60 p-5">
          <Badge variant="outline" className="border-border/60"><Sparkles className="h-3 w-3 mr-1 text-primary" /> Forecast IA</Badge>
          <h3 className="mt-3 text-base font-semibold">Próximos 30 dias</h3>
          <p className="mt-1 text-2xl font-bold text-success">{formatBRL(available + pending)}</p>
          <p className="mt-1 text-xs text-muted-foreground">Baseado no saldo real e liberações pendentes.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Ganho no ano" value={formatBRL(totalYear)} delta={0} icon={Wallet} accent="success" />
        <StatCard label="Saques realizados" value={String(withdrawals.length)} delta={0} accent="info" />
        <StatCard label="Bônus pendentes" value={formatBRL(pending)} accent="warning" hint="Saldo ainda não liberado" />
        <StatCard label="Próxima liberação" value={withdrawals[0]?.created_at ? new Date(withdrawals[0].created_at).toLocaleDateString("pt-BR") : "-"} accent="primary" hint="Último registro do extrato" />
      </div>

      <Suspense fallback={<div className="h-64 animate-pulse bg-muted rounded-2xl" />}>
        <FinanceCharts totalMonth={Number(wallet.total_month || 0)} />
      </Suspense>

      <div className="rounded-2xl border border-border/60 bg-card/60 p-5">
        <h3 className="text-sm font-semibold mb-3">Extrato recente</h3>
        <ul className="space-y-2">
          {withdrawals.map((entry) => (
            <li key={entry.id} className="flex items-center justify-between rounded-lg border border-border/60 bg-background/40 p-3 text-sm">
              <div>
                <p className="font-medium">{entry.description || "Movimentação financeira"}</p>
                <p className="text-xs text-muted-foreground">{entry.type || "registro"} · {entry.created_at ? new Date(entry.created_at).toLocaleDateString("pt-BR") : "-"}</p>
              </div>
              <span className="font-semibold">{formatBRL(Number(entry.amount || 0))}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Mini({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-background/40 p-3">
      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground uppercase tracking-wider"><Icon className="h-3 w-3" /> {label}</div>
      <p className="mt-1 text-sm font-semibold">{value}</p>
    </div>
  );
}
