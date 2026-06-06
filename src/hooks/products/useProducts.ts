import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import { ProductService } from "@/services/products";

export function useProducts(limit = 12) {
  return useQuery({
    queryKey: [...queryKeys.products, limit],
    queryFn: () => ProductService.fetchStoresProducts(limit),
  });
}
