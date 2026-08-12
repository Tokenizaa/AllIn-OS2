import { supabase } from "@/lib/supabase/client";

export const CustomerDocumentsService = {
  async fetchDocuments(customerId: string) {
    const { data, error } = await supabase
      .schema("crm")
      .from("customer_documents")
      .select("*")
      .eq("customer_id", customerId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async updateDocumentStatus(docId: string, status: string) {
    const { error } = await supabase
      .schema("crm")
      .from("customer_documents")
      .update({
        status,
        updated_at: status === "rejected" ? null : new Date().toISOString(),
      })
      .eq("id", docId);
    if (error) throw error;
  },

  async approveAll(customerIds: string[]) {
    const results = await Promise.all(
      customerIds.map((id) =>
        supabase
          .schema("crm")
          .from("customer_documents")
          .update({ status: "approved", updated_at: new Date().toISOString() })
          .eq("id", id)
      )
    );
    return results.every((r) => !r.error);
  },
};
