import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import { CustomerService } from "@/services/customers";

export function useCustomers(page = 1, pageSize = 15) {
  return useQuery({
    queryKey: [...queryKeys.customers, page, pageSize],
    queryFn: () => CustomerService.fetchCustomersWithOrderStats(page, pageSize) as any,
  });
}
