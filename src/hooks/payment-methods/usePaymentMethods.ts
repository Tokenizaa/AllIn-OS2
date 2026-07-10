import { useQuery } from "@tanstack/react-query";
import { PaymentMethodService, FormaPagamento } from "@/services/payment-methods";

/**
 * usePaymentMethods (Sprint 6 — REDESIGN)
 *
 * Hook canônico para formas de pagamento.
 *
 * Usa commerce.formas_pagamento (tabela REAL).
 */
export function useActivePaymentMethods() {
  return useQuery<FormaPagamento[]>({
    queryKey: ["payment-methods", "active"],
    queryFn: () => PaymentMethodService.fetchActivePaymentMethods(),
    staleTime: 30 * 60 * 1000,
  });
}
