import { NetworkRepository } from "../repositories/network.repository";
import { NetworkTree, DownlineNode, UplineNode, NetworkStats } from "../dto/network.dto";
import { PaginationParams, PaginatedResponse } from "../../../shared/types/common.types";

export class NetworkService {
  private repository: NetworkRepository;

  constructor() {
    this.repository = new NetworkRepository();
  }

  async getNetworkTree(idComprador: string, maxDepth: number = 5): Promise<NetworkTree | null> {
    return this.repository.getNetworkTree(idComprador, maxDepth);
  }

  async getDownlines(idComprador: string, params: PaginationParams & { maxDepth?: number }): Promise<PaginatedResponse<DownlineNode>> {
    const page = params.page || 1;
    const limit = params.limit || 20;
    const offset = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.repository.getDownlines(idComprador, { limit, offset, maxDepth: params.maxDepth }),
      this.repository.countDownlines(idComprador),
    ]);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getUpline(idComprador: string, maxLevels: number = 10): Promise<UplineNode[]> {
    return this.repository.getUpline(idComprador, maxLevels);
  }

  async getNetworkStats(idComprador?: string): Promise<NetworkStats> {
    return this.repository.getNetworkStats(idComprador);
  }

  async countDownlines(idComprador: string): Promise<number> {
    return this.repository.countDownlines(idComprador);
  }
}
