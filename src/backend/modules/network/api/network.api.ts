import { z } from "zod";
import { NetworkService } from "../services/network.service";
import { paginationSchema } from "../../../shared/dto/pagination.dto";

const networkService = new NetworkService();

export const getNetworkTree = async (data: unknown) => {
  const parsed = z.object({
    customerId: z.string().uuid(),
    maxDepth: z.coerce.number().min(1).max(10).default(5),
  }).parse(data);
  try {
    const tree = await networkService.getNetworkTree(parsed.customerId, parsed.maxDepth);
    if (!tree) {
      return {
        success: false,
        error: "Network tree not found",
      };
    }
    return {
      success: true,
      data: tree,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch network tree",
    };
  }
};

export const getDownlines = async (data: unknown) => {
  const parsed = paginationSchema.merge(
    z.object({
      customerId: z.string().uuid(),
      maxDepth: z.coerce.number().min(1).max(10).optional(),
    })
  ).parse(data);
  try {
    const result = await networkService.getDownlines(parsed.customerId, parsed);
    return {
      success: true,
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch downlines",
    };
  }
};

export const getUpline = async (data: unknown) => {
  const parsed = z.object({
    customerId: z.string().uuid(),
    maxLevels: z.coerce.number().min(1).max(20).default(10),
  }).parse(data);
  try {
    const upline = await networkService.getUpline(parsed.customerId, parsed.maxLevels);
    return {
      success: true,
      data: upline,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch upline",
    };
  }
};

export const getNetworkStats = async (data: unknown) => {
  const parsed = z.object({
    customerId: z.string().uuid().optional(),
  }).parse(data);
  try {
    const stats = await networkService.getNetworkStats(parsed.customerId);
    return {
      success: true,
      data: stats,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch network stats",
    };
  }
};
