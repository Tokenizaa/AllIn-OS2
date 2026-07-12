import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/widgets/page-header";
import { useAlerts } from "@/hooks/alerts/useAlerts";

export const Route = createFileRoute("/admin/alerts")({ component: AlertsPage });

function AlertsPage() {
  const { data: alerts = [], isError, error, refetch } = useAlerts(12);

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Executive" title="Alertas operacionais" subtitle="Eventos críticos detectados em dados reais." />
      {isError && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          Erro: {error instanceof Error ? error.message : "falha desconhecida"}
          <button className="ml-3 underline" onClick={() => refetch()}>
            Tentar novamente
          </button>
        </div>
      )}
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
