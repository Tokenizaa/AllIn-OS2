import { useQuery } from "@tanstack/react-query";

export function useReferralTrackingQuery(referralCode?: string | null) {
  return useQuery({
    queryKey: ["referral", "tracking", referralCode],
    queryFn: async () => {
      return { isValid: true, metadata: null };
    },
    enabled: !!referralCode,
  });
}
