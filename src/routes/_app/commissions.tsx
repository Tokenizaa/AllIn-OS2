import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/widgets/page-header";
import { KpiCard } from "@/components/widgets/kpi-card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase-client";
import { computeGenerationBonus } from "@/modules/plans/mlm-rules";

export const Route = createFileRoute("/_app/commissions")({ component: CommissionsPage });

function CommissionsPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const [{ data: payments }, { data: plansData }, { data: customersData }] = await Promise.all([
        supabase.from("payments").select("id, amount, quantity, plan_id, plan_name, plano_id, created_at").order("created_at", { ascending: false }).limit(18),
        supabase.from("plans").select("id, name, price, commission_percent, generations, benefits, is_active, sort_order").eq("is_active", true).order("sort_order", { ascending: true }),
        supabase.from("customers").select("id, user_id, usuario, id_comprador, qualification, patrocinador_comprador, status, created_at").limit(300),
      ]);

      setRows((payments || []).map((p: any, i: number) => ({
        id: p.id || i,
        ciclo: `Lançamento #${i + 1}`,
        qualificados: Number(p.quantity || 1),
        pago: Number(p.amount || 0),
        status: i < 2 ? "processando" : "pago",
        planKey: p.plan_id || p.plan_name || p.plano_id || null,
      })));
      setPlans(plansData || []);
      setCustomers(customersData || []);
    })();
  }, []);

  const total = rows.reduce((sum, r) => sum + Number(r.pago || 0), 0);
  const plan = plans[0];
  const activeDirects = useMemo(() => customers.filter((c) => String(c.patrocinador_comprador || "").length > 0 && (c.status || "").toLowerCase() === "active").length, [customers]);
  const simulation = computeGenerationBonus(plan?.name, total || 1000, activeDirects);

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Rede MLM" title="Comissões & Ciclos" subtitle="Processamento derivado de pagamentos reais e regras dos planos." actions={<Button size="sm">Rodar ciclo</Button>} />
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
