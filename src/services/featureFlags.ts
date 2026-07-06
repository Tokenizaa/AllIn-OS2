import { supabase } from "@/lib/supabase/client";

export interface FeatureFlag {
  id: string;
  enabled: boolean;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

const FEATURE_FLAGS_TABLE = "feature_flags";

export const FeatureFlagService = {
  async getAllFlags(): Promise<Record<string, boolean>> {
    try {
      const { data, error } = await supabase
        .from(FEATURE_FLAGS_TABLE)
        .select("id, enabled")
        .eq("is_global", true);

      if (error) {
        console.error("Error fetching feature flags:", error);
        return {};
      }

      const flags: Record<string, boolean> = {};
      if (data) {
        data.forEach((flag) => {
          flags[flag.id] = flag.enabled;
        });
      }

      return flags;
    } catch (error) {
      console.error("Exception in getAllFlags:", error);
      return {};
    }
  },

  async getFlag(id: string): Promise<boolean | null> {
    try {
      const { data, error } = await supabase
        .from(FEATURE_FLAGS_TABLE)
        .select("enabled")
        .eq("id", id)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          // Row not found
          return null;
        }
        console.error("Error fetching feature flag:", error);
        return null;
      }

      return data?.enabled ?? null;
    } catch (error) {
      console.error("Exception in getFlag:", error);
      return null;
    }
  },

  async setFlag(id: string, enabled: boolean): Promise<boolean> {
    try {
      const { error } = await supabase
        .from(FEATURE_FLAGS_TABLE)
        .upsert({ id, enabled, is_global: true, updated_at: new Date().toISOString() });

      if (error) {
        console.error("Error updating feature flag:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Exception in setFlag:", error);
      return false;
    }
  },

  async initializeDefaultFlags(): Promise<void> {
    const defaultFlags = [
      { id: "ai_copilot", enabled: false },
      { id: "anomaly_engine", enabled: false },
      { id: "auto_workflows", enabled: false },
      { id: "realtime", enabled: false },
    ];

    for (const flag of defaultFlags) {
      const existing = await this.getFlag(flag.id);
      if (existing === null) {
        // Flag doesn't exist, create it
        await this.setFlag(flag.id, flag.enabled);
      }
    }
  }
};
