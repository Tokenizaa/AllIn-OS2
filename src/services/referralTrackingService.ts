import { supabase } from '../lib/supabase-client';

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

/**
 * Referral Tracking Service
 * MIGRATED: Now uses Supabase referral_tracking table as single source of truth
 */
export const referralTrackingService = {
  /**
   * Get referral tracking for user
   */
  getReferralTracking: async (userId: string): Promise<ReferralTracking | null> => {
    const { data, error } = await supabase
      .from('referral_tracking')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null;
      }
      console.error('[referralTrackingService] Error fetching referral tracking:', error);
      throw error;
    }

    return data;
  },

  /**
   * Set referral tracking for user
   */
  setReferralTracking: async (input: ReferralTrackingInput): Promise<ReferralTracking> => {
    // Check if tracking already exists
    const existing = await referralTrackingService.getReferralTracking(input.user_id);

    if (existing) {
      // Update existing
      const { data, error } = await supabase
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

    // Insert new
    const { data, error } = await supabase
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

  /**
   * Clear referral tracking for user
   */
  clearReferralTracking: async (userId: string): Promise<void> => {
    const { error } = await supabase
      .from('referral_tracking')
      .delete()
      .eq('user_id', userId);

    if (error) {
      console.error('[referralTrackingService] Error clearing referral tracking:', error);
      throw error;
    }
  },

  /**
   * Get active distributor slug for user
   */
  getActiveDistributorSlug: async (userId: string): Promise<string | null> => {
    const tracking = await referralTrackingService.getReferralTracking(userId);
    return tracking?.distributor_slug || null;
  },

  /**
   * Get referrer for user
   */
  getReferrer: async (userId: string): Promise<string | null> => {
    const tracking = await referralTrackingService.getReferralTracking(userId);
    return tracking?.referrer_id || null;
  },
};
