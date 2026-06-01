import { supabase } from "@/lib/supabase-client";

export interface StoreInfo {
  id: string;
  name: string;
  slug: string;
  description: string;
  logo?: string;
  banner?: string;
  contact: {
    whatsapp: string;
    instagram: string;
    email: string;
    address: string;
  };
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
  };
  settings?: {
    primaryColor?: string;
    secondaryColor?: string;
    customDomain?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export const storeManagementService = {
  getStoreBySlug: async (slug: string): Promise<StoreInfo | null> => {
    const { data, error } = await supabase.from("landing_pages").select("*").eq("slug", slug).maybeSingle();
    if (error || !data) return null;
    return data as StoreInfo;
  },
  createStore: async (storeData: Partial<StoreInfo>): Promise<StoreInfo> => {
    const payload = {
      name: storeData.name || "Store",
      slug: storeData.slug || "store",
      description: storeData.description || "",
      ...storeData,
    };
    const { data, error } = await supabase.from("landing_pages").insert(payload).select("*").single();
    if (error || !data) throw error || new Error("Failed to create store");
    return data as StoreInfo;
  },
  updateStore: async (id: string, storeData: Partial<StoreInfo>): Promise<StoreInfo> => {
    const { data, error } = await supabase.from("landing_pages").update(storeData).eq("id", id).select("*").single();
    if (error || !data) throw error || new Error("Failed to update store");
    return data as StoreInfo;
  },
  deleteStore: async (id: string): Promise<void> => {
    const { error } = await supabase.from("landing_pages").delete().eq("id", id);
    if (error) throw error;
  },
  checkSlugAvailability: async (slug: string): Promise<boolean> => {
    const { data } = await supabase.from("landing_pages").select("id").eq("slug", slug).maybeSingle();
    return !data;
  },
  getStoreStats: async (storeId: string): Promise<any> => {
    const [{ count: totalProducts }, { count: totalOrders }] = await Promise.all([
      supabase.from("products").select("id", { count: "exact", head: true }).eq("store_id", storeId),
      supabase.from("orders").select("id", { count: "exact", head: true }).eq("store_id", storeId),
    ]);
    return { totalProducts: totalProducts || 0, totalOrders: totalOrders || 0, totalRevenue: 0, activeCustomers: 0 };
  },
};
