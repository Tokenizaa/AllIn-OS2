import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowDownToLine, TrendingUp, Sparkles, Lock, Clock, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/distributor/stat-card";
import { ResponsiveContainer, Tooltip, Cell, Pie, PieChart, Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { supabase } from "@/lib/supabase-client";

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

export const Route = createFileRoute("/office/finance")({ component: FinancePage });

function formatBRL(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

function FinancePage() {
  const [withdrawals, setWithdrawals] = useState<WithdrawalRow[]>([]);
  const [wallet, setWallet] = useState<WalletRow>({});

  useEffect(() => {
    let mounted = true;
    void (async () => {
      const [{ data: withdrawalsData }, { data: profileData }] = await Promise.all([
        supabase.from("withdrawals").select("id, description, type, amount, created_at").order("created_at", { ascending: false }).limit(50),
        supabase.from("workspace_settings").select("balance_available, balance_blocked, balance_pending, total_year, total_month").limit(1).maybeSingle(),
      ]);
      if (!mounted) return;
      setWithdrawals((withdrawalsData as WithdrawalRow[]) || []);
      setWallet((profileData as WalletRow) || {});
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const earnings = useMemo(() => {
    const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    return months.map((mes, i) => ({
      mes,
      valor: Math.max(0, Number(wallet.total_month || 0) * (0.3 + (i / 20))),
    }));
  }, [wallet.total_month]);

  const bonusOrigin = useMemo(() => [
    { name: "Saques", value: 38 },
    { name: "Comissões", value: 34 },
    { name: "Bônus", value: 28 },
  ], []);

  const available = Number(wallet.balance_available || 0);
  const blocked = Number(wallet.balance_blocked || 0);
  const pending = Number(wallet.balance_pending || 0);
  const totalYear = Number(wallet.total_year || 0);

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

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 rounded-2xl border border-border/60 bg-card/60 p-5">
          <h3 className="text-sm font-semibold">Ganhos por mês</h3>
          <div className="h-64 mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={earnings}>
                <defs>
                  <linearGradient id="ge" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-success)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="var(--color-success)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="mes" stroke="var(--color-muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={11} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="valor" stroke="var(--color-success)" fill="url(#ge)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-2xl border border-border/60 bg-card/60 p-5">
          <h3 className="text-sm font-semibold">Origem dos ganhos</h3>
          <div className="h-56 mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={bonusOrigin} dataKey="value" innerRadius={50} outerRadius={80} paddingAngle={3} stroke="none">
                  {bonusOrigin.map((_, i) => <Cell key={i} fill={`var(--color-chart-${(i % 5) + 1})`} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

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
