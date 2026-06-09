import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import { PaymentService } from "@/services/payments";
import { WalletService } from "@/services/wallets";
import { OrderService } from "@/services/orders";

// Regras de alerta baseadas em lógica de negócio
function calculateAlertSeverity(type: string, data: any): "critical" | "warning" | "info" {
  switch (type) {
    case "withdrawal": {
      // Saques com risco marcado ou valores altos são críticos
      if (data.risco) return "critical";
      if (Number(data.valor || 0) > 5000) return "warning";
      return "info";
    }
    case "payment": {
      // Pagamentos com valores altos são warnings
      if (Number(data.amount || 0) > 10000) return "warning";
      return "info";
    }
    case "order": {
      // Pedidos cancelados são warnings
      const status = (data.status_pedido || data.status || "").toLowerCase();
      if (status === "cancelado") return "warning";
      if (status === "pendente" && Number(data.valor_total || 0) > 5000) return "warning";
      return "info";
    }
    default:
      return "info";
  }
}

function generateAlertTitle(type: string, data: any): string {
  switch (type) {
    case "withdrawal":
      return `Saque de R$ ${Number(data.valor || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
    case "payment":
      return `Pagamento de R$ ${Number(data.amount || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
    case "order": {
      const status = data.status_pedido || data.status || "pendente";
      return `Pedido ${status} - R$ ${Number(data.valor_total || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
    }
    default:
      return "Evento registrado";
  }
}

export function useAlerts(limit = 12) {
  return useQuery({
    queryKey: [...queryKeys.alerts, limit],
    queryFn: async () => {
      const [payments, withdrawals, ordersResult] = await Promise.all([
        PaymentService.fetchRecentPayments(5),
        WalletService.fetchRecentWithdrawals(5),
        OrderService.fetchOrdersList(5),
      ]);

      const orders = ordersResult?.orders || [];

      const items = [
        ...(withdrawals || []).map((w: any) => ({
          id: `w-${w.id}`,
          title: generateAlertTitle("withdrawal", w),
          domain: "financeiro",
          at: w.created_at,
          severity: calculateAlertSeverity("withdrawal", w),
          data: w,
        })),
        ...(payments || []).map((p: any) => ({
          id: `p-${p.id}`,
          title: generateAlertTitle("payment", p),
          domain: "payments",
          at: p.created_at,
          severity: calculateAlertSeverity("payment", p),
          data: p,
        })),
        ...(orders || []).map((o: any) => ({
          id: `o-${o.id}`,
          title: generateAlertTitle("order", o),
          domain: "orders",
          at: o.created_at,
          severity: calculateAlertSeverity("order", o),
          data: o,
        })),
      ];

      // Ordenar por data (mais recente primeiro) e por severidade (critical primeiro)
      return items
        .sort((a, b) => {
          const severityOrder = { critical: 0, warning: 1, info: 2 };
          const severityDiff = severityOrder[a.severity] - severityOrder[b.severity];
          if (severityDiff !== 0) return severityDiff;
          return new Date(b.at || 0).getTime() - new Date(a.at || 0).getTime();
        })
        .slice(0, limit);
    },
  });
}
