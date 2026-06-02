import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/widgets/page-header";
import { ResponsiveContainer, Treemap, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { KpiCard } from "@/components/widgets/kpi-card";
import { supabase } from "@/lib/supabase-client";

export const Route = createFileRoute("/_app/network")({ component: NetworkPage });

function NetworkPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [legs, setLegs] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const [{ data: customerData }, { data: relationshipData }] = await Promise.all([
        supabase.from("customers").select("id, usuario, id_comprador, qualification, status, cidade, estado, user_id, name").order("created_at", { ascending: false }).limit(20),
        supabase.from("network_relationships").select("*").order("created_at", { ascending: false }).limit(12),
      ]);
      setCustomers(customerData || []);
      setLegs((relationshipData || []).map((r: any, i: number) => ({
        name: `G${i + 1}`,
        esquerda: Number(r.left_count || r.left_side_count || 0),
        direita: Number(r.right_count || r.right_side_count || 0),
      })));
    })();
  }, []);

  const data = customers.map((c) => ({ name: (c.name || c.usuario || c.id_comprador || "D").split(" ")[0], size: Math.max(1, Number(c.id ? 1 : 0)) * 100 }));

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Rede MLM" title="Genealogia inteligente" subtitle="Dados reais da rede no Supabase." />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Total na rede" value={String(customers.length)} accent="primary" />
        <KpiCard label="Pares binários" value={String(legs.length)} accent="success" />
        <KpiCard label="Equilíbrio binário" value="--" />
        <KpiCard label="Ciclos pagos" value="--" accent="warning" />
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
    </div>
  );
}
