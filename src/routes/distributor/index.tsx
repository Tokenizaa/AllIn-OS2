import { createFileRoute, Link } from "@tanstack/react-router";
import { Suspense, lazy } from "react";
import { useDashboard } from "@/modules/dashboard";
import { Wallet, Users, TrendingUp, Crown, Sparkles, ArrowUpRight, Copy, Share2, UserPlus, Trophy, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { StatCard } from "@/components/distributor/stat-card";
import { toast } from "sonner";
import { formatBRL } from "@/lib/customer-calculations";

const DashboardCharts = lazy(() => import("./-_dashboardCharts"));

const relTime = (value?: string | null) => (value ? new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(new Date(value)) : "-");

export const Route = createFileRoute("/distributor/")({ component: Dashboard });

function Dashboard() {
  const { data, isLoading, isError, error, refetch } = useDashboard();

  if (isError) {
    return (
      <div className="p-6 text-sm text-destructive">
        Erro ao carregar o dashboard: {error instanceof Error ? error.message : "falha desconhecida"}.
        <button className="ml-3 underline" onClick={() => refetch()}>
          Tentar novamente
        </button>
      </div>
    );
  }

  if (isLoading || !data) {
    return <div className="p-6 text-sm text-muted-foreground">Carregando dados reais...</div>;
  }

  const { stats: current = {} as any, salesSeries = [], bonusOrigin = [], topProducts = [], timeline = [], aiInsights = [], goals = [] } = data;

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-primary/15 via-fuchsia-500/10 to-cyan-400/5 p-6 md:p-8">
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-primary/20 text-primary border-primary/30 hover:bg-primary/20"><Crown className="h-3 w-3 mr-1" /> {current.qualificacao}</Badge>
              <Badge variant="outline" className="border-border/60">{current.plano}</Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Olá, {current.nome}</h1>
            <p className="mt-1.5 text-sm text-muted-foreground max-w-lg">Sua operação está lendo o Supabase em tempo real.</p>
            <div className="mt-4 max-w-md">
              <div className="flex items-center justify-between text-xs mb-1.5"><span className="text-muted-foreground">Progresso</span><span className="font-semibold">{current.progresso}%</span></div>
              <Progress value={current.progresso} className="h-2" />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" className="gap-2" onClick={() => { navigator.clipboard.writeText(current.linkLoja); toast.success("Link copiado!"); }}><Copy className="h-3.5 w-3.5" /> Link da loja</Button>
            <Button size="sm" variant="outline" className="gap-2"><Share2 className="h-3.5 w-3.5" /> Compartilhar</Button>
            <Button size="sm" className="gap-2 bg-gradient-to-r from-primary to-fuchsia-500"><UserPlus className="h-3.5 w-3.5" /> Cadastrar</Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Saldo disponível" value={formatBRL(current.saldoDisponivel)} delta={0} icon={Wallet} accent="success" />
        <StatCard label="Comissão acumulada" value={formatBRL(current.comissaoAcumulada)} delta={0} icon={Trophy} accent="primary" />
        <StatCard label="Total vendido" value={formatBRL(current.totalVendido)} delta={0} icon={TrendingUp} accent="info" />
        <StatCard label="Cadastros diretos" value={String(current.redeTotal)} delta={0} icon={Users} accent="warning" />
      </div>

      <Suspense fallback={<div className="h-72 rounded-2xl border border-border/60 bg-card/60 animate-pulse" />}>
        <DashboardCharts salesSeries={salesSeries} bonusOrigin={bonusOrigin} topProducts={topProducts} />
      </Suspense>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 space-y-3">
          <div className="flex items-baseline justify-between">
            <h3 className="text-sm font-semibold flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> Insights do Copiloto</h3>
            <Link to="/distributor/copilot" className="text-xs text-primary inline-flex items-center gap-0.5">Abrir copiloto <ArrowUpRight className="h-3 w-3" /></Link>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            {aiInsights.map((i) => (
              <div key={i.id} className="rounded-2xl border border-border/60 bg-card/60 p-4">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 shrink-0 rounded-lg grid place-items-center bg-info/15 text-info"><Sparkles className="h-4 w-4" /></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold leading-tight">{i.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{i.detail}</p>
                    <Button size="sm" variant="ghost" className="mt-2 -ml-2 h-7 text-xs text-primary">{i.action}</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-border/60 bg-card/60 p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold flex items-center gap-2"><Target className="h-4 w-4 text-primary" /> Metas</h3>
            <Badge variant="outline" className="text-[10px]">dados reais</Badge>
          </div>
          <ul className="mt-4 space-y-4">
            {goals.map((g) => {
              const pct = Math.min(100, Math.round((g.current / Math.max(1, g.target)) * 100));
              return (
                <li key={g.id}>
                  <div className="flex items-center justify-between text-xs mb-1.5"><span className="text-muted-foreground">{g.title}</span><span className="font-semibold">{pct}%</span></div>
                  <Progress value={pct} className="h-1.5" />
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 rounded-2xl border border-border/60 bg-card/60 p-5">
          <h3 className="text-sm font-semibold">Atividades recentes</h3>
          <ul className="mt-4 space-y-3">
            {timeline.map((t) => (
              <li key={t.id} className="flex items-start gap-3 rounded-xl border border-border/60 bg-background/40 p-3">
                <span className="mt-0.5 h-2 w-2 rounded-full bg-primary" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-tight">{t.title}</p>
                  <p className="text-xs text-muted-foreground">{t.description}</p>
                </div>
                <span className="text-[10px] text-muted-foreground whitespace-nowrap">{relTime(t.at)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
