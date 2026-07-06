import { MachineDocumentRepository } from '../repositories/machine-documents.repository';
import type {
  MachineDocument,
  CreateMachineDocumentDTO,
  UpdateMachineDocumentDTO,
} from '../dto/machine-documents.dto';

export class MachineDocumentService {
  private repository: MachineDocumentRepository;

  constructor() {
    this.repository = new MachineDocumentRepository();
  }

  async findAll(machineId?: string): Promise<MachineDocument[]> {
    return this.repository.findAll(machineId);
  }

  async findById(id: string): Promise<MachineDocument | null> {
    return this.repository.findById(id);
  }

  async create(dto: CreateMachineDocumentDTO): Promise<MachineDocument> {
    return this.repository.create(dto);
  }

  async update(id: string, dto: UpdateMachineDocumentDTO): Promise<MachineDocument> {
    return this.repository.update(id, dto);
  }

  async delete(id: string): Promise<void> {
    return this.repository.delete(id);
  }

  async findByMachineId(machineId: string): Promise<MachineDocument[]> {
    return this.repository.findByMachineId(machineId);
  }

  async findByType(machineId: string, tipo: string): Promise<MachineDocument[]> {
    return this.repository.findByType(machineId, tipo);
  }
}
