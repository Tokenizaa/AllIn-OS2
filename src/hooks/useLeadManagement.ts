import { useState, useEffect } from 'react';
import { SupabaseService } from '@/modules/auth/services/supabase.service';
import { supabase } from '@/lib/supabase-client';

export interface LeadData {
  id?: string;
  name: string;
  whatsapp: string;
  leadId: string;
}

export const useLeadManagement = (userId?: string) => {
  const [leads, setLeads] = useState<LeadData[]>([]);
  const [currentLead, setCurrentLead] = useState<LeadData | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch leads from Supabase
  useEffect(() => {
    const fetchLeads = async () => {
      setLoading(true);
      const leadsData = await SupabaseService.fetchLeads(userId);
      // Transform database leads to match expected format
      const transformedLeads = leadsData.map(l => ({
        id: l.id,
        name: l.name,
        whatsapp: l.whatsapp,
        leadId: l.lead_id,
      }));
      setLeads(transformedLeads);
      setLoading(false);
    };
    fetchLeads();
  }, [userId]);

  // Save lead to Supabase
  const saveLead = async (leadData: LeadData) => {
    const { error } = await supabase.from("leads").insert({
      name: leadData.name,
      whatsapp: leadData.whatsapp,
      lead_id: leadData.leadId,
      user_id: userId || null,
    });

    if (error) {
      console.error("[useLeadManagement] Failed to save lead:", error);
      throw error;
    }

    setLeads([...leads, leadData]);
    setCurrentLead(leadData);
  };

  // Update current lead
  const updateChatStateWithLead = (leadData: LeadData) => {
    setCurrentLead(leadData);
  };

  return {
    leads,
    currentLead,
    saveLead,
    updateChatStateWithLead,
    loading
  };
};
