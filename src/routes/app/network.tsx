import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { PageHeader } from "@/components/widgets/page-header";
import { ResponsiveContainer, Treemap, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { KpiCard } from "@/components/widgets/kpi-card";
import { useNetwork } from "@/hooks/network/useNetwork";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/app/network")({ component: NetworkPage });

function NetworkPage() {
  const { data: networkData, isError, error, refetch } = useNetwork(12);

  const customers = useMemo(() => (networkData as any)?.customers || [], [networkData]);
  const legs = useMemo(() => (networkData as any)?.legs || [], [networkData]);
  const relationships = useMemo(() => (networkData as any)?.relationships || [], [networkData]);

  const data = customers.map((c: any) => {
    const name = ((c as any).name || c.usuario || c.id_comprador || "D").split(" ")[0];
    // Calcular tamanho baseado em métricas reais se disponíveis
    const size = Math.max(1, Number(c.volume || c.total_orders || 1));
    return { name, size };
  });

  // Calcular equilíbrio binário baseado nas pernas
  const leftLegVolume = legs.reduce((sum: number, leg: any) => sum + Number(leg.esquerda || 0), 0);
  const rightLegVolume = legs.reduce((sum: number, leg: any) => sum + Number(leg.direita || 0), 0);
  const totalVolume = leftLegVolume + rightLegVolume;
  const balanceRatio = totalVolume > 0 ? Math.min(leftLegVolume, rightLegVolume) / totalVolume * 100 : 0;
  const balanceLabel = totalVolume > 0 ? `${balanceRatio.toFixed(1)}%` : "--";

  if (isError) {
    return (
      <div className="space-y-3">
        <PageHeader eyebrow="Rede MLM" title="Genealogia inteligente" subtitle="Falha ao carregar a rede." />
        <p className="text-sm text-destructive">Erro: {(error as any)?.message || "falha desconhecida"}</p>
        <button className="text-sm underline" onClick={() => refetch()}>
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Rede MLM" title="Genealogia inteligente" subtitle="Dados reais da rede no Supabase." />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <KpiCard label="Total na rede" value={String(customers.length)} accent="primary" />
        <KpiCard label="Pares binários" value={String(legs.length)} accent="success" />
        <KpiCard label="Relacionamentos" value={String(relationships.length)} accent="warning" />
        <KpiCard label="Equilíbrio binário" value={balanceLabel} />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="rounded-xl border border-border bg-card/60 p-5">
          <h3 className="text-sm font-semibold">Pernas binárias</h3>
          <div className="h-72 mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={legs}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="name" stroke="var(--color-muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={11} />
                <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="esquerda" stackId="a" fill="var(--color-primary)" />
                <Bar dataKey="direita" stackId="a" fill="var(--color-chart-2)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card/60 p-5">
          <h3 className="text-sm font-semibold">Mapa de calor da rede</h3>
          <div className="h-72 mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <Treemap data={data} dataKey="size" stroke="var(--color-background)" fill="var(--color-primary)" />
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <Card className="border-border/60 bg-card/60 p-5">
        <h3 className="text-sm font-semibold">Distribuidores recentes</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {customers.slice(0, 6).map((customer: any) => (
            <div key={customer.id_comprador || customer.id} className="rounded-lg border border-border/60 bg-background/30 p-3">
              <div className="text-sm font-medium">{customer.nome_completo || customer.name || customer.usuario || "Cliente"}</div>
              <div className="mt-1 text-xs text-muted-foreground">{customer.id_comprador || customer.id || "-"}</div>
              <div className="mt-2 text-xs text-muted-foreground">
                {customer.cidade || "-"} {customer.estado ? `· ${customer.estado}` : ""}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
