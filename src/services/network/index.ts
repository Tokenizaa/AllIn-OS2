import { httpClient } from "@/lib/api-client/http-client";

export const NetworkService = {
  async fetchNetworkRelationships(limit = 12) {
    // TODO: Add method to HTTP client for network relationships
    throw new Error("fetchNetworkRelationships not yet implemented in HTTP client");
  },

  async fetchRecentNetworkRelationships(limit = 12) {
    // TODO: Add method to HTTP client for recent network relationships
    throw new Error("fetchRecentNetworkRelationships not yet implemented in HTTP client");
  },

  async fetchSponsorRelationship(idComprador: string) {
    const result = await httpClient.getUpline(idComprador);
    if (!result.success) {
      throw new Error(result.error || "Failed to fetch sponsor relationship");
    }
    return result.data?.[0]; // Return first upline (sponsor)
  },

  async fetchUplineRelationships(idComprador: string) {
    const result = await httpClient.getUpline(idComprador);
    if (!result.success) {
      throw new Error(result.error || "Failed to fetch upline relationships");
    }
    return result.data || [];
  },

  async countDirectRelationships(idComprador: string) {
    const result = await httpClient.getDownlines(idComprador);
    if (!result.success) {
      throw new Error(result.error || "Failed to count direct relationships");
    }
    return result.data?.length || 0;
  }
};
