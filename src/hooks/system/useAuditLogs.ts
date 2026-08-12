import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import { AnalyticsService as analyticsService } from "@/services/analytics";

export function useAuditLogs(limit: number = 10) {
  return useQuery({
    queryKey: [...queryKeys.auditLogs, limit] as const,
    queryFn: async () => {
      const data = await analyticsService.fetchAuditLogs(limit);
      return (data || []).map((row: any) => ({
        id: row.id,
        actor: row.user_id || "-",
        action: row.action || "-",
        entity: row.entity_type || "-",
        at: row.created_at ? new Date(row.created_at).toLocaleString("pt-BR") : "-",
      }));
    },
  });
}
