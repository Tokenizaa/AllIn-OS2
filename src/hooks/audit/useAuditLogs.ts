import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import { analyticsService } from "@/services/analytics/analytics.service";

export function useAuditLogs(limit = 10) {
  return useQuery({ queryKey: queryKeys.auditLogs, queryFn: () => analyticsService.fetchAuditLogs(limit) });
}
