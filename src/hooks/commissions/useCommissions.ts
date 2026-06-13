import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import { PaymentService } from "@/services/payments";
import { PlanService } from "@/services/plans";
import { CustomerService } from "@/services/customers";
import { ProfileService } from "@/services/profiles";

export function useCommissions() {
  return useQuery({
    queryKey: queryKeys.commissions,
    staleTime: 0,
    refetchOnMount: "always",
    queryFn: async () => {
      // MIGRAÇÃO EM PROGRESSO: Usando ProfileService em vez de CustomerService
      const [payments, plansData, customersData] = await Promise.all([
        PaymentService.fetchPaymentsForCommissions(18),
        PlanService.fetchActivePlans(),
        ProfileService.fetchProfiles(),
      ]);

      // Mapear pagamentos para comissões com dados mais realistas
      const rows = (payments || []).map((p: any, i: number) => {
        // Usar data real do pagamento como referência de ciclo
        const paymentDate = p.created_at ? new Date(p.created_at) : new Date();
        const cycleLabel = paymentDate.toLocaleDateString("pt-BR", { month: "short", year: "2-digit" });

        // Determinar status baseado em dados do pagamento se disponíveis
        const paymentStatus = (p.status || "").toLowerCase();
        let status = "processando";
        if (paymentStatus === "completed" || paymentStatus === "pago" || paymentStatus === "approved") {
          status = "pago";
        } else if (paymentStatus === "failed" || paymentStatus === "cancelado") {
          status = "cancelado";
        }

        return {
          id: p.id || i,
          ciclo: cycleLabel,
          qualificados: Number(p.quantity || 1),
          pago: Number(p.amount || 0),
          status,
          planKey: p.plan_id || p.plan_name || p.plano_id || null,
          paymentId: p.id,
        };
      });

      return {
        rows,
        plans: plansData || [],
        customers: customersData || [],
      };
    },
  });
}
