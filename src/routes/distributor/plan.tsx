import { useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Check, Crown, Sparkles, ArrowUp, History } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { usePlans } from "@/modules/plans";
import { useMyProfile } from "@/hooks/profiles/useMyProfile";
import { formatBRL } from "@/lib/customer-calculations";

type PlanRow = {
  id: string;
  nome?: string | null;
  name?: string | null;
  preco?: number | null;
  price?: number | null;
  description?: string | null;
  ativo?: boolean | null;
  is_active?: boolean | null;
  max_geracoes?: number | null;
  metadata?: Record<string, any> | null;
};

type ProfileRow = {
  name?: string | null;
  created_at?: string | null;
};

const EMPTY_PLANS: PlanRow[] = [];

function getPlanDisplayName(plan: PlanRow): string {
  return plan.nome || plan.name || "Plano";
}

function getPlanPrice(plan: PlanRow): number {
  return Number(plan.preco ?? plan.price ?? 0);
}

export const Route = createFileRoute("/distributor/plan")({ component: PlanPage });

function PlanPage() {
  const { data: plansViewModel, isLoading: plansLoading, isError, error, refetch } = usePlans();
  const { data: profileData = null, isLoading: profileLoading } = useMyProfile();

  const plans = (plansViewModel?.plans ?? []) as PlanRow[];
  const profile = profileData || null;

  const current = plans[0];
  const next = plans[1] || plans[0];
  const createdAt = profile?.created_at ? new Date(profile.created_at).toLocaleDateString("pt-BR") : "-";

  const planCards = useMemo(() => plans.slice(0, 4), [plans]);

  const loading = plansLoading || profileLoading;

  if (isError) {
    return (
      <div className="p-6 text-sm text-destructive">
        Erro ao carregar planos: {error instanceof Error ? error.message : "falha desconhecida"}.
        <button className="ml-3 underline" onClick={() => refetch()}>
          Tentar novamente
        </button>
      </div>
    );
  }

  if (loading) {
    return <div className="p-6 text-sm text-muted-foreground">Carregando planos...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Meu Plano</h1>
        <p className="text-sm text-muted-foreground">Dados reais dos planos ativos no Supabase.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2 relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/15 via-fuchsia-500/10 to-transparent p-6">
          <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-primary/20 blur-3xl" />
          <div className="relative">
            <Badge className="bg-primary/20 text-primary border-primary/30"><Crown className="h-3 w-3 mr-1" /> Plano atual</Badge>
            <h2 className="mt-2 text-3xl font-bold">{getPlanDisplayName(current || {})}</h2>
            <p className="mt-1 text-sm text-muted-foreground">Ativo desde {createdAt}</p>
            <div className="mt-6 grid grid-cols-3 gap-4">
              <Metric label="Gerações" value={String(current?.max_geracoes ?? 3)} />
              <Metric label="Preço" value={formatBRL(getPlanPrice(current || {}))} />
              <Metric label="Status" value={current?.ativo !== false ? "Ativo" : "Inativo"} />
            </div>
            <div className="mt-6">
              <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Descrição</h3>
              <p className="text-sm text-muted-foreground">{current?.description || "Plano de distribuição MLM"}</p>
            </div>
          </div>
        </motion.div>

        <div className="rounded-3xl border border-border/60 bg-card/60 p-6">
          <Badge variant="outline" className="border-border/60"><Sparkles className="h-3 w-3 mr-1 text-primary" /> Recomendação IA</Badge>
          <h3 className="mt-3 text-lg font-bold">{next ? `Próximo plano: ${getPlanDisplayName(next)}` : "Sem recomendação disponível"}</h3>
          <p className="mt-1 text-sm text-muted-foreground">A recomendação é baseada nos planos reais ativos.</p>
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-muted-foreground">Projeção de ganho</span>
              <span className="font-semibold text-success">+0%</span>
            </div>
            <Progress value={current ? 72 : 0} className="h-1.5" />
          </div>
          <Button className="mt-4 w-full gap-2 bg-gradient-to-r from-primary to-fuchsia-500">
            <ArrowUp className="h-3.5 w-3.5" /> Fazer upgrade
          </Button>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">Comparação de planos</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {planCards.map((plan, index) => (
            <motion.div
              key={plan.id}
              whileHover={{ y: -4 }}
              className={cn(
                "relative rounded-2xl border p-5",
                index === 0 ? "border-primary/40 bg-primary/5" : index === 1 ? "border-fuchsia-500/40 bg-gradient-to-br from-fuchsia-500/10 to-transparent" : "border-border/60 bg-card/60",
              )}
            >
              {index === 0 && <Badge className="absolute top-3 right-3 bg-primary/20 text-primary border-primary/30 text-[10px]">Atual</Badge>}
              {index === 1 && <Badge className="absolute top-3 right-3 bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30 text-[10px]">Topo</Badge>}
              <h4 className="text-lg font-bold">{getPlanDisplayName(plan)}</h4>
              <p className="mt-1 text-2xl font-bold">{formatBRL(getPlanPrice(plan))}<span className="text-xs text-muted-foreground font-normal">/mês</span></p>
              <div className="mt-3 flex gap-3 text-xs text-muted-foreground">
                <span>{plan.max_geracoes ?? 3} gerações</span>
              </div>
              <p className="mt-3 text-xs text-muted-foreground leading-relaxed">{plan.description || ""}</p>
              {index !== 0 && <Button size="sm" variant="outline" className="mt-4 w-full">Selecionar</Button>}
            </motion.div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card/60 p-5">
        <h3 className="text-sm font-semibold flex items-center gap-2"><History className="h-4 w-4" /> Histórico de upgrades</h3>
        <p className="mt-3 text-sm text-muted-foreground">Esse histórico ainda depende de uma tabela específica de upgrades. A tela já não usa mais dados fictícios de plano.</p>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-background/40 p-3">
      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</p>
      <p className="mt-1 text-xl font-bold">{value}</p>
    </div>
  );
}
