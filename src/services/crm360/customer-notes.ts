import { supabase } from "@/lib/supabase/client";

export interface CustomerNote {
  id: string;
  customer_id: string;
  id_comprador: string;
  note: string;
  note_type: 'general' | 'support' | 'compliance' | 'payment' | 'network';
  created_by: string;
  is_private: boolean;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export const CustomerNotesService = {
  async fetchCustomerNotes(customerId: string, idComprador?: string) {
    const { data, error } = await supabase
      .from("crm.customer_notes")
      .select("*")
      .or(`customer_id.eq.${customerId}${idComprador ? `,id_comprador.eq.${idComprador}` : ''}`)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async fetchCustomerNotesByComprador(idComprador: string) {
    const { data, error } = await supabase
      .from("crm.customer_notes")
      .select("*")
      .eq("id_comprador", idComprador)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async createNote(note: Omit<CustomerNote, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from("crm.customer_notes")
      .insert(note)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateNote(noteId: string, updates: Partial<Omit<CustomerNote, 'id' | 'created_at' | 'created_by'>>) {
    const { data, error } = await supabase
      .from("crm.customer_notes")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", noteId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteNote(noteId: string) {
    const { error } = await supabase
      .from("crm.customer_notes")
      .delete()
      .eq("id", noteId);

    if (error) throw error;
    return true;
  }
};
