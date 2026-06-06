import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import { CustomerService } from "@/services/customers";

export function useCustomer(id: string) {
  return useQuery({
    queryKey: queryKeys.customer(id),
    queryFn: () => CustomerService.fetchCustomerById(id),
    enabled: !!id,
  });
}
