import { CapacityHistoryRepository } from '../repositories/capacity-history.repository';
import type {
  CapacityHistory,
  CreateCapacityHistoryDTO,
  UpdateCapacityHistoryDTO,
} from '../dto/capacity-history.dto';

export class CapacityHistoryService {
  private repository: CapacityHistoryRepository;

  constructor() {
    this.repository = new CapacityHistoryRepository();
  }

  async findAll(capacityId?: string): Promise<CapacityHistory[]> {
    return this.repository.findAll(capacityId);
  }

  async findById(id: string): Promise<CapacityHistory | null> {
    return this.repository.findById(id);
  }

  async create(dto: CreateCapacityHistoryDTO): Promise<CapacityHistory> {
    return this.repository.create(dto);
  }

  async update(id: string, dto: UpdateCapacityHistoryDTO): Promise<CapacityHistory> {
    return this.repository.update(id, dto);
  }

  async delete(id: string): Promise<void> {
    return this.repository.delete(id);
  }

  async findByCapacityId(capacityId: string): Promise<CapacityHistory[]> {
    return this.repository.findByCapacityId(capacityId);
  }

  async findByDateRange(startDate: string, endDate: string): Promise<CapacityHistory[]> {
    return this.repository.findByDateRange(startDate, endDate);
  }

  async findByMachineId(machineId: string): Promise<CapacityHistory[]> {
    return this.repository.findByMachineId(machineId);
  }

  async calculateAverageEfficiency(capacityId: string): Promise<number> {
    return this.repository.calculateAverageEfficiency(capacityId);
  }
}
