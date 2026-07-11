import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import { MarketingService } from "@/services/marketing";

export function useUpgradeSuggestions() {
  return useQuery({
    queryKey: [...queryKeys.plans, "upgrade-suggestions"] as const,
    queryFn: () => MarketingService.fetchUpgradeSuggestions(),
  });
}
