import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import { CustomerService } from "@/services/customers";

export function useCustomers() {
  return useQuery({
    queryKey: queryKeys.customers,
    queryFn: CustomerService.fetchCustomersList,
  });
}
