import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import { PaymentService } from "@/services/payments";

export function usePayments(limit = 50) {
  return useQuery({ queryKey: queryKeys.payments, queryFn: () => PaymentService.fetchRecentPayments(limit) });
}
