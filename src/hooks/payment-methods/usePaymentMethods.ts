import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import { PaymentMethodService, FormaPagamento } from "@/services/payment-methods";

export function useActivePaymentMethods() {
  return useQuery<FormaPagamento[]>({
    queryKey: queryKeys.paymentMethods,
    queryFn: () => PaymentMethodService.fetchActivePaymentMethods(),
  });
}
