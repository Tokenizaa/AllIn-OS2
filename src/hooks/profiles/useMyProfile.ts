import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import { ProfileService } from "@/services/profiles";

export function useMyProfile() {
  return useQuery({
    queryKey: ["office-profile"] as const,
    queryFn: () => ProfileService.fetchMyProfile(),
  });
}
