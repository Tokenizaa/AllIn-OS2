import { useQuery } from "@tanstack/react-query";
import { PaymentService, PedidoPagamento } from "@/services/payments";

/**
 * usePayments (Sprint 6 — REDESIGN)
 *
 * Hook canônico para buscar pagamentos de pedidos.
 *
 * Usa commerce.pedidos_pagamentos (tabela REAL).
 *
 * Migrado do antigo `usePayments` que consultava tabela inexistente (`payments`).
 */
export function usePayments(limit = 50) {
  return useQuery<PedidoPagamento[]>({
    queryKey: ["payments", "real", limit],
    queryFn: () => PaymentService.fetchRecentPayments(limit),
  });
}

export function usePaymentById(id: string | null) {
  return useQuery({
    queryKey: ["payments", "real", "id", id],
    queryFn: () => PaymentService.fetchPaymentById(id as string),
    enabled: !!id,
  });
}

export function usePaymentsByPedido(pedidoId: string | null) {
  return useQuery({
    queryKey: ["payments", "real", "pedido", pedidoId],
    queryFn: () => PaymentService.fetchPaymentsByPedido(pedidoId as string),
    enabled: !!pedidoId,
  });
}
