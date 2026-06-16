import { httpClient } from "@/lib/api-client/http-client";

export const ProductService = {
  async fetchProducts(limit = 20) {
    const result = await httpClient.getProducts({ limit });
    if (!result.success) {
      throw new Error(result.error || "Failed to fetch products");
    }
    return result.data || [];
  },

  async fetchStoresProducts(limit = 12) {
    const result = await httpClient.getStoresProducts({ limit });
    if (!result.success) {
      throw new Error(result.error || "Failed to fetch stores products");
    }
    return result.data || [];
  },

  async fetchProductById(id: string) {
    const result = await httpClient.getProductById(id);
    if (!result.success) {
      throw new Error(result.error || "Failed to fetch product by ID");
    }
    return result.data;
  }
};
