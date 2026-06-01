import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/widgets/page-header";
import { supabase } from "@/lib/supabase-client";

export const Route = createFileRoute("/_app/alerts")({ component: AlertsPage });

function AlertsPage() {
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const [{ data: payments }, { data: withdrawals }, { data: orders }] = await Promise.all([
        supabase.from("payments").select("*").order("created_at", { ascending: false }).limit(5),
        supabase.from("withdrawals").select("*").order("created_at", { ascending: false }).limit(5),
        supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(5),
      ]);
      const items = [
        ...(withdrawals || []).map((w: any) => ({ id: `w-${w.id}`, title: "Saque em processamento", domain: "financeiro", at: w.created_at, severity: w.risco ? "critical" : "warning" })),
        ...(payments || []).map((p: any) => ({ id: `p-${p.id}`, title: "Pagamento registrado", domain: "payments", at: p.created_at, severity: "info" })),
        ...(orders || []).map((o: any) => ({ id: `o-${o.id}`, title: "Pedido atualizado", domain: "orders", at: o.created_at, severity: "info" })),
      ];
      setAlerts(items.slice(0, 12));
    })();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Executive" title="Alertas operacionais" subtitle="Eventos críticos detectados em dados reais." />
      <div className="rounded-xl border border-border bg-card/40 divide-y divide-border/60">
        {alerts.map((a) => (
          <div key={a.id} className="flex items-center gap-3 px-4 py-3">
            <span className={`h-2 w-2 rounded-full ${a.severity === "critical" ? "bg-destructive" : a.severity === "warning" ? "bg-warning" : "bg-info"}`} />
            <div className="flex-1">
              <p className="text-sm font-medium">{a.title}</p>
              <p className="text-xs text-muted-foreground">{a.domain} · {a.at ? new Date(a.at).toLocaleString("pt-BR") : "-"}</p>
            </div>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{a.severity}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
