import { useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Check, Crown, Sparkles, ArrowUp, History } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { PlanService } from "@/services/plans";
import { ProfileService } from "@/services/profiles";
import { getPlanRule } from "@/modules/plans/mlm-rules";
import { useQuery } from "@tanstack/react-query";

type PlanRow = {
  id: string;
  name?: string | null;
  price?: number | null;
  commission_percent?: number | null;
  generations?: number | null;
  benefits?: string[] | null;
  is_active?: boolean | null;
  sort_order?: number | null;
};

type ProfileRow = {
  name?: string | null;
  created_at?: string | null;
};

export const Route = createFileRoute("/office/plan")({ component: PlanPage });

function formatBRL(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

function PlanPage() {
  const { data: planPageData, isLoading } = useQuery({
    queryKey: ["office-plan"],
    queryFn: async () => {
      const [plansData, profileData] = await Promise.all([
        PlanService.fetchActivePlans(),
        ProfileService.fetchLastProfile(),
      ]);
      return {
        plans: (plansData as PlanRow[]) || [],
        profile: (profileData as ProfileRow) || null,
      };
    }
  });

  const plans = planPageData?.plans || [];
  const profile = planPageData?.profile || null;

  const current = plans[0];
  const next = plans[1] || plans[0];
  const createdAt = profile?.created_at ? new Date(profile.created_at).toLocaleDateString("pt-BR") : "-";
  const currentRule = getPlanRule(current?.name);

  const planCards = useMemo(() => plans.slice(0, 4), [plans]);

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
            <h2 className="mt-2 text-3xl font-bold">{current?.name || "Plano ativo"}</h2>
            <p className="mt-1 text-sm text-muted-foreground">Ativo desde {createdAt}</p>
            <div className="mt-6 grid grid-cols-3 gap-4">
              <Metric label="Bônus máximo" value={`${currentRule?.generationBonuses?.reduce((m, g) => Math.max(m, g.percentage), current?.commission_percent ?? 0) ?? current?.commission_percent ?? 0}%`} />
              <Metric label="Gerações" value={String(currentRule?.generationBonuses?.length ?? current?.generations ?? 0)} />
              <Metric label="Mensalidade" value={formatBRL(Number(current?.price ?? 0))} />
            </div>
            <div className="mt-6">
              <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Benefícios</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {(current?.benefits || []).slice(0, 6).map((benefit) => (
                  <li key={benefit} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-success" /> {benefit}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        <div className="rounded-3xl border border-border/60 bg-card/60 p-6">
          <Badge variant="outline" className="border-border/60"><Sparkles className="h-3 w-3 mr-1 text-primary" /> Recomendação IA</Badge>
          <h3 className="mt-3 text-lg font-bold">{next ? `Próximo plano: ${next.name}` : "Sem recomendação disponível"}</h3>
          <p className="mt-1 text-sm text-muted-foreground">A recomendação agora é baseada somente nos planos reais ativos.</p>
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
          {planCards.map((plan, index) => {
            const rule = getPlanRule(plan.name);
            return (
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
                <h4 className="text-lg font-bold">{plan.name}</h4>
                <p className="mt-1 text-2xl font-bold">{formatBRL(Number(plan.price || 0))}<span className="text-xs text-muted-foreground font-normal">/mês</span></p>
                <div className="mt-3 flex gap-3 text-xs text-muted-foreground">
                  <span>Bônus {rule?.generationBonuses?.map((g) => g.percentage).join("/") || `${plan.commission_percent ?? 0}`}%</span>
                  <span>·</span>
                  <span>{rule?.generationBonuses?.length ?? plan.generations ?? 0} gerações</span>
                </div>
                <ul className="mt-4 space-y-1.5 text-xs">
                  {(plan.benefits || []).slice(0, 4).map((benefit) => (
                    <li key={benefit} className="flex items-start gap-1.5"><Check className="h-3 w-3 mt-0.5 text-success shrink-0" /> {benefit}</li>
                  ))}
                </ul>
                {index !== 0 && <Button size="sm" variant="outline" className="mt-4 w-full">Selecionar</Button>}
              </motion.div>
            );
          })}
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
