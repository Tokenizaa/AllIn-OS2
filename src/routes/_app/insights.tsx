import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/widgets/page-header";
import { InsightCard } from "@/components/widgets/insight-card";
import { Skeleton } from "@/components/ui/skeleton";
import { getCustomers, getOrders, getPayments } from "@/backend/api";
import { getCustomerLabel } from "@/lib/customer-label";

export const Route = createFileRoute("/_app/insights")({ component: InsightsPage });

function InsightsPage() {
  const { data: paymentsResult, isLoading: paymentsLoading } = useQuery({
    queryKey: ["insights", "payments"],
    queryFn: () => getPayments({ page: 1, limit: 5 }),
  });

  const { data: ordersResult, isLoading: ordersLoading } = useQuery({
    queryKey: ["insights", "orders"],
    queryFn: () => getOrders({ page: 1, limit: 5 }),
  });

  const { data: customersResult, isLoading: customersLoading } = useQuery({
    queryKey: ["insights", "customers"],
    queryFn: () => getCustomers({ page: 1, limit: 5 }),
  });

  const insights = useMemo(() => {
    const payments = paymentsResult?.data?.data || [];
    const orders = ordersResult?.data?.data || [];
    const customers = customersResult?.data?.data || [];

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

  const loading = paymentsLoading || ordersLoading || customersLoading;

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
