import { supabase } from "@/lib/supabase/client";

export interface Document {
  id: string;
  id_comprador: string;
  name: string;
  type: string;
  status: "approved" | "pending" | "missing" | "rejected";
  required: boolean;
  updated_at?: string;
  created_at?: string;
}

export const DocumentService = {
  async fetchCustomerDocuments(idComprador: string): Promise<Document[]> {
    const { data, error } = await supabase
      .from("crm.customer_documents")
      .select("*")
      .eq("id_comprador", idComprador)
      .order("created_at", { ascending: false });
    
    if (error) {
      console.error("Error fetching customer documents:", error);
      return [];
    }
    
    return data || [];
  },

  async updateDocumentStatus(documentId: string, status: string): Promise<boolean> {
    const { error } = await supabase
      .from("crm.customer_documents")
      .update({ 
        status, 
        updated_at: new Date().toISOString() 
      })
      .eq("id", documentId);
    
    if (error) {
      console.error("Error updating document status:", error);
      return false;
    }
    
    return true;
  },

  async createDocument(document: Omit<Document, "id" | "created_at" | "updated_at">): Promise<Document | null> {
    const { data, error } = await supabase
      .from("crm.customer_documents")
      .insert({
        ...document,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) {
      console.error("Error creating document:", error);
      return null;
    }
    
    return data;
  }
};
