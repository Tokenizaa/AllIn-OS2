import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import { PaymentService } from "@/services/payments";
import { PlanService } from "@/services/plans";
import { CustomerService } from "@/services/customers";
import { OrderService } from "@/services/orders";

export function useCommissions() {
  return useQuery({
    queryKey: queryKeys.commissions,
    queryFn: async () => {
      const [payments, plansData, customersData] = await Promise.all([
        PaymentService.fetchPaymentsForCommissions(18),
        PlanService.fetchActivePlans(),
        CustomerService.fetchCustomersList(),
      ]);

      const rows = OrderService.transformCommissionRows(payments);

      return {
        rows,
        plans: plansData || [],
        customers: customersData || [],
      };
    },
  });
}
