import { supabase } from "@/lib/supabase/client";

export const CustomerNotesService = {
  async fetchNotes(filters: { customerId?: string; idComprador?: string }) {
    let query = supabase
      .schema("crm")
      .from("customer_notes")
      .select("*")
      .order("created_at", { ascending: false });

    if (filters.customerId) query = query.eq("customer_id", filters.customerId);
    if (filters.idComprador) query = query.eq("id_comprador", filters.idComprador);

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async createNote(data: {
    customerId?: string;
    idComprador?: string;
    note: string;
    noteType?: string;
    createdBy?: string;
  }) {
    const { data: note, error } = await supabase
      .schema("crm")
      .from("customer_notes")
      .insert({
        customer_id: data.customerId,
        id_comprador: data.idComprador,
        note: data.note,
        note_type: data.noteType || "general",
        created_by: data.createdBy || "system",
        is_private: false,
        metadata: {},
      })
      .select()
      .single();
    if (error) throw error;
    return note;
  },
};
