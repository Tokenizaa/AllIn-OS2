import { useState, useEffect } from 'react';
import { LeadService } from '@/services/leads';

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

  // Fetch leads from Supabase via LeadService
  useEffect(() => {
    let mounted = true;
    const fetchLeads = async () => {
      setLoading(true);
      try {
        const leadsData = await LeadService.fetchLeads(userId);
        // Transform database leads to match expected format
        const transformedLeads = leadsData.map(l => ({
          id: l.id,
          name: l.name,
          whatsapp: l.whatsapp || l.phone || '',
          leadId: l.lead_id || '',
        }));
        if (mounted) {
          setLeads(transformedLeads);
        }
      } catch (err) {
        console.error("[useLeadManagement] fetch failed:", err);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };
    fetchLeads();
    return () => {
      mounted = false;
    };
  }, [userId]);

  // Save lead via LeadService
  const saveLead = async (leadData: LeadData) => {
    await LeadService.saveLead({
      name: leadData.name,
      whatsapp: leadData.whatsapp,
      leadId: leadData.leadId,
      user_id: userId || null,
    });

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
