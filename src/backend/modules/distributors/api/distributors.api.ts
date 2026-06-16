import { z } from "zod";
import { DistributorSyncService } from "../services/distributor-sync.service";

const distributorSyncService = new DistributorSyncService();

export const syncAllDistributors = async () => {
  try {
    const result = await distributorSyncService.syncAllDistributors();
    return {
      success: true,
      data: result,
      message: "Distributor synchronization completed",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to synchronize distributors",
    };
  }
};

export const syncDistributorById = async (data: unknown) => {
  const parsed = z.object({ allinId: z.number() }).parse(data);
  try {
    const distributor = await distributorSyncService.syncDistributorById(parsed.allinId);
    if (!distributor) {
      return {
        success: false,
        error: "Distributor not found or sync failed",
      };
    }
    return {
      success: true,
      data: distributor,
      message: "Distributor synchronized successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to synchronize distributor",
    };
  }
};

export const getDistributorSyncStatus = async () => {
  try {
    const status = await distributorSyncService.getSyncStatus();
    return {
      success: true,
      data: status,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get sync status",
    };
  }
};
