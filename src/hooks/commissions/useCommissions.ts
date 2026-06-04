import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import { PaymentService } from "@/services/payments";
import { PlanService } from "@/services/plans";
import { CustomerService } from "@/services/customers";

export function useCommissions() {
  return useQuery({
    queryKey: queryKeys.commissions,
    staleTime: 0,
    refetchOnMount: "always",
    queryFn: async () => {
      const [payments, plansData, customersData] = await Promise.all([
        PaymentService.fetchPaymentsForCommissions(18),
        PlanService.fetchActivePlans(),
        CustomerService.fetchCustomersList(),
      ]);

      const rows = (payments || []).map((p: any, i: number) => ({
        id: p.id || i,
        ciclo: `Lançamento #${i + 1}`,
        qualificados: Number(p.quantity || 1),
        pago: Number(p.amount || 0),
        status: i < 2 ? "processando" : "pago",
        planKey: p.plan_id || p.plan_name || p.plano_id || null,
      }));

      return {
        rows,
        plans: plansData || [],
        customers: customersData || [],
      };
    },
  });
}
