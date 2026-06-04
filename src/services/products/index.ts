import { supabase } from "@/lib/supabase-client";

export const ProductService = {
  async fetchProducts(limit = 20) {
    const { data, error } = await supabase
      .from("products")
      .select("id, name, price")
      .limit(limit);
    if (error) throw error;
    return data || [];
  },

  async fetchStoresProducts(limit = 12) {
    const { data, error } = await supabase
      .from("products")
      .select("id, name, description, price, category")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data || [];
  },

  async fetchProductById(id: string) {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data;
  }
};
