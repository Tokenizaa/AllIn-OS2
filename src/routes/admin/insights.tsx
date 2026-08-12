import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { PageHeader } from "@/components/widgets/page-header";
import { InsightCard } from "@/components/widgets/insight-card";
import { Skeleton } from "@/components/ui/skeleton";
import { getCustomerLabel } from "@/lib/customer-label";
import { useAnalytics } from "@/hooks/analytics/useAnalytics";

export const Route = createFileRoute("/admin/insights")({ component: InsightsPage });

function InsightsPage() {
  const { stats: paymentsResult, orders: ordersResult, customers: customersResult } = useAnalytics();

  const insights = useMemo(() => {
    const payments = Array.isArray(paymentsResult?.data?.data) ? paymentsResult.data.data : [];
    const orders = Array.isArray(ordersResult?.data?.data) ? ordersResult.data.data : [];
    const customers = Array.isArray((customersResult as any)?.data?.data) ? (customersResult as any).data.data : [];

    return [
      ...payments.map((p: any) => ({
        id: `pay-${p.id}`,
        title: "Pagamento registrado",
        detail: `Método ${p.payment_method || p.payment_method_type || "-"}`,
        severity: "success",
        action: "Abrir",
      })),
      ...orders.map((o: any) => ({
        id: `ord-${o.id}`,
        title: "Pedido atualizado",
        detail: `Status ${o.status_pedido || o.status || "-"}`,
        severity: "info",
        action: "Abrir",
      })),
      ...customers.map((c: any) => ({
        id: `cus-${c.id}`,
        title: "Cliente ativo",
        detail: getCustomerLabel(c),
        severity: "warning",
        action: "Abrir",
      })),
    ].slice(0, 9);
  }, [paymentsResult, ordersResult, customersResult]);

  const loading = paymentsResult.isLoading || ordersResult.isLoading || customersResult.isLoading;

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Executive · Intelligence" title="Insights da IA" subtitle="Sinais derivados de eventos reais no Supabase." />

      {loading ? (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-28 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
          {insights.map((i) => (
            <InsightCard key={i.id} insight={i} />
          ))}
        </div>
      )}
    </div>
  );
}
