import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import { MarketingService } from "@/services/marketing";

export function useCampaigns() {
  return useQuery({
    queryKey: [...queryKeys.marketing, "campaigns"] as const,
    queryFn: () => MarketingService.fetchCampaigns(),
  });
}
