import { MachinePhotoRepository } from '../repositories/machine-photos.repository';
import type {
  MachinePhoto,
  CreateMachinePhotoDTO,
  UpdateMachinePhotoDTO,
} from '../dto/machine-photos.dto';

export class MachinePhotoService {
  private repository: MachinePhotoRepository;

  constructor() {
    this.repository = new MachinePhotoRepository();
  }

  async findAll(machineId?: string): Promise<MachinePhoto[]> {
    return this.repository.findAll(machineId);
  }

  async findById(id: string): Promise<MachinePhoto | null> {
    return this.repository.findById(id);
  }

  async create(dto: CreateMachinePhotoDTO): Promise<MachinePhoto> {
    return this.repository.create(dto);
  }

  async update(id: string, dto: UpdateMachinePhotoDTO): Promise<MachinePhoto> {
    return this.repository.update(id, dto);
  }

  async delete(id: string): Promise<void> {
    return this.repository.delete(id);
  }

  async findByMachineId(machineId: string): Promise<MachinePhoto[]> {
    return this.repository.findByMachineId(machineId);
  }

  async findByCategory(machineId: string, categoria: string): Promise<MachinePhoto[]> {
    return this.repository.findByCategory(machineId, categoria);
  }

  async updateOrder(id: string, ordem: number): Promise<MachinePhoto> {
    return this.repository.updateOrder(id, ordem);
  }

  async reorderPhotos(machineId: string, photoIds: string[]): Promise<void> {
    const updates = photoIds.map((id, index) =>
      this.repository.updateOrder(id, index)
    );
    await Promise.all(updates);
  }
}
