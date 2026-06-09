import { supabase } from "@/lib/supabase-client";

export const LeadService = {
  async fetchLeads(userId?: string) {
    let query = supabase.from("leads").select("*");
    if (userId) {
      query = query.eq("user_id", userId);
    }
    const { data, error } = await query.order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async saveLead(lead: { name: string; whatsapp?: string; phone?: string; leadId?: string; lead_id?: string; user_id?: string | null; source?: string; status?: string; metadata?: any }) {
    const payload = {
      name: lead.name,
      whatsapp: lead.whatsapp || lead.phone,
      phone: lead.phone || lead.whatsapp,
      lead_id: lead.leadId || lead.lead_id,
      user_id: lead.user_id || null,
      source: lead.source || "landing_page",
      status: lead.status || "new",
      metadata: lead.metadata || { captured_at: new Date().toISOString() },
    };

    const { data, error } = await supabase.from("leads").insert(payload);
    if (error) throw error;
    return data;
  }
};
