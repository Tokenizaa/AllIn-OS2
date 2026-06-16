import { httpClient } from "@/lib/api-client/http-client";

export const PlanService = {
  async fetchActivePlans() {
    const result = await httpClient.getPlans();
    if (!result.success) {
      throw new Error(result.error || "Failed to fetch active plans");
    }
    return result.data || [];
  }
};
