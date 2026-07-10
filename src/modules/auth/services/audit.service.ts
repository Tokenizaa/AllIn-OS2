import { User } from "../context/auth.types";
import { supabase } from "@/lib/supabase/client";

export class AuditService {
  static async logAudit(
    action: string,
    entityType: string,
    description: string,
    user: User | null
  ): Promise<void> {
    try {
      await supabase.from("audit_logs").insert({
        action,
        entity_type: entityType,
        description,
        user_id: user?.id || null,
        user_email: user?.email || null,
        created_at: new Date().toISOString(),
      });
    } catch (err) {
      console.error("[AuditService] Error logging audit:", err);
    }
  }
}
