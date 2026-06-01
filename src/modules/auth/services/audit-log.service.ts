import { supabase } from "@/lib/supabase-client";

/**
 * Audit Log Service for tracking system actions in Supabase
 * Replaces localStorage-based audit logging
 */
export class AuditLogService {
  /**
   * Log an audit entry to the database
   */
  static async logAudit(params: {
    userId?: string;
    action: string;
    entityType: string;
    entityId?: string;
    oldValue?: any;
    newValue?: any;
    ipAddress?: string;
    userAgent?: string;
    success?: boolean;
    errorMessage?: string;
    metadata?: any;
  }) {
    try {
      const { data, error } = await supabase
        .from("audit_log")
        .insert({
          user_id: params.userId || null,
          action: params.action,
          entity_type: params.entityType,
          entity_id: params.entityId || null,
          old_value: params.oldValue || null,
          new_value: params.newValue || null,
          ip_address: params.ipAddress || null,
          user_agent: params.userAgent || null,
          success: params.success !== undefined ? params.success : true,
          error_message: params.errorMessage || null,
          metadata: params.metadata || {},
        })
        .select()
        .single();

      if (error) {
        console.error("[AuditLogService] Error logging audit:", error);
        return null;
      }

      console.log("[AuditLogService] Audit logged successfully:", data.id);
      return data;
    } catch (error) {
      console.error("[AuditLogService] Error in logAudit:", error);
      return null;
    }
  }

  /**
   * Fetch audit logs for a specific user
   */
  static async fetchAuditLogsForUser(userId: string, limit = 50) {
    try {
      const { data, error } = await supabase
        .from("audit_log")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) {
        console.error("[AuditLogService] Error fetching audit logs:", error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error("[AuditLogService] Error in fetchAuditLogsForUser:", error);
      return [];
    }
  }

  /**
   * Fetch audit logs for a specific entity
   */
  static async fetchAuditLogsForEntity(entityType: string, entityId: string, limit = 50) {
    try {
      const { data, error } = await supabase
        .from("audit_log")
        .select("*")
        .eq("entity_type", entityType)
        .eq("entity_id", entityId)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) {
        console.error("[AuditLogService] Error fetching audit logs:", error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error("[AuditLogService] Error in fetchAuditLogsForEntity:", error);
      return [];
    }
  }

  /**
   * Fetch recent audit logs (admin view)
   */
  static async fetchRecentAuditLogs(limit = 100) {
    try {
      const { data, error } = await supabase
        .from("audit_log")
        .select(`
          *,
          profiles:user_id (
            name,
            email
          )
        `)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) {
        console.error("[AuditLogService] Error fetching recent audit logs:", error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error("[AuditLogService] Error in fetchRecentAuditLogs:", error);
      return [];
    }
  }

  /**
   * Get client IP address
   */
  static async getClientIpAddress(): Promise<string | null> {
    try {
      // In a real implementation, this would use a service to get the IP
      // For now, return null as it requires server-side implementation
      return null;
    } catch {
      return null;
    }
  }

  /**
   * Get user agent
   */
  static getUserAgent(): string | null {
    if (typeof window === "undefined") return null;
    return navigator.userAgent || null;
  }
}
