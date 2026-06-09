import { User, AuditLog } from "../context/auth.types";
import { supabase } from "@/lib/supabase-client";

/**
 * Audit service for tracking system actions
 * Uses Supabase audit_log table with correct schema
 */
export class AuditService {
  /**
   * Log audit entry to Supabase
   */
  static async logAudit(
    action: string,
    entity: string,
    details?: string,
    user?: User | null
  ): Promise<void> {
    try {
      const userId = user ? user.id : null;
      
      const { error } = await supabase
        .from("audit_log")
        .insert({
          user_id: userId,
          action: action,
          entity_type: entity,
          metadata: details ? { details } : {},
          ip_address: null, // TODO: Get real IP from server
          user_agent: typeof window !== "undefined" ? navigator.userAgent : null,
          success: true,
        });

      if (error) {
        console.error("[AuditService] Error logging audit:", error);
      }
    } catch (error) {
      console.error("[AuditService] Error in logAudit:", error);
    }
  }

  /**
   * Add custom audit log to Supabase
   */
  static async addAuditLog(
    logInput: any,
    user?: User | null
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from("audit_log")
        .insert({
          user_id: logInput.userId || user?.id || null,
          action: logInput.action || "PAY_ORDER",
          entity_type: logInput.module || "orders",
          metadata: logInput.details ? { details: logInput.details } : {},
          ip_address: logInput.ip || null,
          user_agent: typeof window !== "undefined" ? navigator.userAgent : null,
          success: true,
        });

      if (error) {
        console.error("[AuditService] Error adding audit log:", error);
      }
    } catch (error) {
      console.error("[AuditService] Error in addAuditLog:", error);
    }
  }

  /**
   * Trigger binomial bonus payment
   * TODO: Implement business logic for binomial bonus
   */
  static async triggerBinomialBonusPay(
    points: number,
    commission: number,
    value: number,
    activeSponsor: string | null
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from("audit_log")
        .insert({
          user_id: null, // System action
          action: "BINOMIAL_BONUS_PAY",
          entity_type: "bonus",
          metadata: {
            points,
            commission,
            value,
            sponsor: activeSponsor,
          },
          success: true,
        });

      if (error) {
        console.error("[AuditService] Error logging binomial bonus:", error);
      }
    } catch (error) {
      console.error("[AuditService] Error in triggerBinomialBonusPay:", error);
    }
  }

  /**
   * Fetch audit logs for a user
   */
  static async fetchAuditLogs(userId: string, limit = 50): Promise<AuditLog[]> {
    try {
      const { data, error } = await supabase
        .from("audit_log")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) {
        console.error("[AuditService] Error fetching audit logs:", error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error("[AuditService] Error in fetchAuditLogs:", error);
      return [];
    }
  }
}
