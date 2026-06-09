import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import { ProductService } from "@/services/products";

export function useProductDetail(id: string) {
  return useQuery({
    queryKey: queryKeys.productDetail(id),
    queryFn: () => ProductService.fetchProductById(id),
    enabled: !!id,
  });
}
