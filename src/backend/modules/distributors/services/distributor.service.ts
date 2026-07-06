import { DistribuidorRepository, Distribuidor } from '../repositories/distributor.repository';
import { PaginationParams, PaginatedResponse } from '../../../shared/types/common.types';

export class DistributorService {
  private repository: DistribuidorRepository;

  constructor() {
    this.repository = new DistribuidorRepository();
  }

  async findAll(params: PaginationParams & { status?: string }): Promise<PaginatedResponse<Distribuidor>> {
    const page = params.page || 1;
    const limit = params.limit || 20;
    const offset = (page - 1) * limit;

    const filters: Record<string, any> = {};
    if (params.status) {
      filters.status = params.status;
    }

    const [data, total] = await Promise.all([
      this.repository.findAll({ filters, limit, offset }),
      this.repository.count(filters),
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

  async findById(id: string): Promise<Distribuidor | null> {
    return this.repository.findById(id);
  }

  async findByUsuario(usuario: string): Promise<Distribuidor | null> {
    return this.repository.findByUsuario(usuario);
  }

  async findByEmail(email: string): Promise<Distribuidor | null> {
    return this.repository.findByEmail(email);
  }

  async getBySponsorId(sponsorId: string, params: PaginationParams): Promise<PaginatedResponse<Distribuidor>> {
    const page = params.page || 1;
    const limit = params.limit || 20;
    const offset = (page - 1) * limit;

    const filters: Record<string, any> = { patrocinador_id: sponsorId };

    const [data, total] = await Promise.all([
      this.repository.findAll({ filters, limit, offset }),
      this.repository.count(filters),
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

  async getStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    pending: number;
  }> {
    const allDistributors = await this.repository.findAll();
    
    const active = allDistributors.filter(d => d.status === '1' || d.ativo === true).length;
    const inactive = allDistributors.filter(d => d.status === '3' || d.ativo === false).length;
    const pending = allDistributors.filter(d => d.status === 'pending' || d.status === '0').length;

    return {
      total: allDistributors.length,
      active,
      inactive,
      pending,
    };
  }
}
