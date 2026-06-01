import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

interface PlanAnalyticsProps {
  analytics?: any[];
}

export function PlanAnalytics({ analytics = [] }: PlanAnalyticsProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Analytics de Planos</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {analytics.map((plan: any) => (
          <Card key={plan.plan_id ?? plan.planId}>
            <CardHeader>
              <CardTitle className="text-lg">{plan.plan_name ?? plan.planName}</CardTitle>
              <CardDescription>Performance do plano</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Distribuidores</span>
                <span className="font-semibold">{plan.total_customers ?? plan.totalCustomers ?? 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Ativos</span>
                <span className="font-semibold">{plan.active_customers ?? plan.activeCustomers ?? 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Receita Total</span>
                <span className="font-semibold">
                  R$ {(plan.total_revenue ?? plan.totalRevenue ?? 0).toLocaleString("pt-BR")}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Ticket Médio</span>
                <span className="font-semibold">
                  R$ {(plan.avg_revenue_per_customer ?? plan.averageRevenuePerCustomer ?? 0).toLocaleString("pt-BR")}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Assinaturas Ativas</span>
                <span className="font-semibold">{plan.active_subscriptions ?? plan.activeSubscriptions ?? 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Novas Ativações (30d)</span>
                <span className="font-semibold">{plan.new_activations_30d ?? plan.newActivations30d ?? 0}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
