import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import { PaymentService } from "@/services/payments";
import { WithdrawalService } from "@/services/withdrawals";
import { OrderService } from "@/services/orders";

export function useAlerts(limit = 12) {
  return useQuery({
    queryKey: [...queryKeys.alerts, limit],
    queryFn: async () => {
      const [payments, withdrawals, orders] = await Promise.all([
        PaymentService.fetchRecentPayments(5),
        WithdrawalService.fetchRecentWithdrawals(5),
        OrderService.fetchOrdersList(5),
      ]);
      const items = [
        ...withdrawals.map((w: any) => ({ id: `w-${w.id}`, title: "Saque em processamento", domain: "financeiro", at: w.created_at, severity: w.risco ? "critical" : "warning" })),
        ...(payments || []).map((p: any) => ({ id: `p-${p.id}`, title: "Pagamento registrado", domain: "payments", at: p.created_at, severity: "info" })),
        ...(orders || []).map((o: any) => ({ id: `o-${o.id}`, title: "Pedido atualizado", domain: "orders", at: o.created_at, severity: "info" })),
      ];
      return items.slice(0, limit);
    },
  });
}
