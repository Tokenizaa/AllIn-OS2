import { useAuditLogs as useSystemAuditLogs } from "../system/useAuditLogs";

export function useAuditLogs(limit = 10) {
  return useSystemAuditLogs(limit);
}
