import { supabase } from '../../lib/supabase/client';

export interface ReferralTracking {
  id: string;
  user_id: string;
  referrer_id: string | null;
  distributor_slug: string | null;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface ReferralTrackingInput {
  user_id: string;
  referrer_id?: string | null;
  distributor_slug?: string | null;
  metadata?: Record<string, any>;
}

export const referralTrackingService = {
  getReferralTracking: async (userId: string): Promise<ReferralTracking | null> => {
    const { data, error } = await supabase
      .schema('crm')
      .from('referral_tracking')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('[referralTrackingService] Error fetching referral tracking:', error);
      throw error;
    }

    return data;
  },

  setReferralTracking: async (input: ReferralTrackingInput): Promise<ReferralTracking> => {
    const existing = await referralTrackingService.getReferralTracking(input.user_id);

    if (existing) {
      const { data, error } = await supabase
        .schema('crm')
      .from('referral_tracking')
        .update({
          referrer_id: input.referrer_id,
          distributor_slug: input.distributor_slug,
          metadata: { ...existing.metadata, ...input.metadata },
        })
        .eq('user_id', input.user_id)
        .select('*')
        .single();

      if (error) {
        console.error('[referralTrackingService] Error updating referral tracking:', error);
        throw error;
      }

      return data;
    }

    const { data, error } = await supabase
      .schema('crm')
      .from('referral_tracking')
      .insert({
        user_id: input.user_id,
        referrer_id: input.referrer_id || null,
        distributor_slug: input.distributor_slug || null,
        metadata: input.metadata || {},
      })
      .select('*')
      .single();

    if (error) {
      console.error('[referralTrackingService] Error setting referral tracking:', error);
      throw error;
    }

    return data;
  },

  clearReferralTracking: async (userId: string): Promise<void> => {
    const { error } = await supabase
      .schema('crm')
      .from('referral_tracking')
      .delete()
      .eq('user_id', userId);

    if (error) {
      console.error('[referralTrackingService] Error clearing referral tracking:', error);
      throw error;
    }
  },

  getActiveDistributorSlug: async (userId: string): Promise<string | null> => {
    const tracking = await referralTrackingService.getReferralTracking(userId);
    return tracking?.distributor_slug || null;
  },

  getReferrer: async (userId: string): Promise<string | null> => {
    const tracking = await referralTrackingService.getReferralTracking(userId);
    return tracking?.referrer_id || null;
  },
};
