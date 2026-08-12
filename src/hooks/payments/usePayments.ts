import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import { PaymentService, PedidoPagamento } from "@/services/payments";

export function usePayments(limit = 50) {
  return useQuery<PedidoPagamento[]>({
    queryKey: queryKeys.payments2.list(limit),
    queryFn: () => PaymentService.fetchRecentPayments(limit),
  });
}

export function usePaymentById(id: string | null) {
  return useQuery({
    queryKey: queryKeys.payments2.byId(id || ""),
    queryFn: () => PaymentService.fetchPaymentById(id as string),
    enabled: !!id,
  });
}

export function usePaymentsByPedido(pedidoId: string | null) {
  return useQuery({
    queryKey: queryKeys.payments2.byPedido(pedidoId || ""),
    queryFn: () => PaymentService.fetchPaymentsByPedido(pedidoId as string),
    enabled: !!pedidoId,
  });
}
