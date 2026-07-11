import { useInfiniteQuery } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import { CustomerService } from "@/services/customers";

export function useCustomerListInfinite(pageSize = 15) {
  const query = useInfiniteQuery({
    queryKey: [...queryKeys.customers, "infinite", pageSize],
    queryFn: ({ pageParam = 1 }) => CustomerService.fetchCustomersPage(pageParam, pageSize),
    getNextPageParam: (lastPage, allPages) => {
      const totalFetched = allPages.reduce((sum, p) => sum + p.customers.length, 0);
      if (totalFetched >= lastPage.totalCount) return undefined;
      return allPages.length + 1;
    },
    initialPageParam: 1,
  });

  const customers = query.data?.pages.flatMap((p) => p.customers) ?? [];
  const totalCount = query.data?.pages[0]?.totalCount ?? 0;

  return { ...query, customers, totalCount };
}
