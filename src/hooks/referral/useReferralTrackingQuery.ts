import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import { referralTrackingService } from "@/services/network/referral-tracking";

export function useReferralTrackingQuery(referralCode?: string | null) {
  return useQuery({
    queryKey: queryKeys.referral(referralCode || undefined),
    queryFn: async () => {
      if (!referralCode) return { isValid: false, metadata: null };
      const tracking = await referralTrackingService.getReferralTracking(referralCode);
      return { isValid: !!tracking, metadata: tracking?.metadata ?? null };
    },
    enabled: !!referralCode,
  });
}
