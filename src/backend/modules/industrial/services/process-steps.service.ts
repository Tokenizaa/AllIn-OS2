import { ProcessStepRepository } from '../repositories/process-steps.repository';
import type {
  ProcessStep,
  CreateProcessStepDTO,
  UpdateProcessStepDTO,
} from '../dto/process-steps.dto';

export class ProcessStepService {
  private repository: ProcessStepRepository;

  constructor() {
    this.repository = new ProcessStepRepository();
  }

  async findAll(processId?: string): Promise<ProcessStep[]> {
    return this.repository.findAll(processId);
  }

  async findById(id: string): Promise<ProcessStep | null> {
    return this.repository.findById(id);
  }

  async create(dto: CreateProcessStepDTO): Promise<ProcessStep> {
    return this.repository.create(dto);
  }

  async update(id: string, dto: UpdateProcessStepDTO): Promise<ProcessStep> {
    return this.repository.update(id, dto);
  }

  async delete(id: string): Promise<void> {
    return this.repository.delete(id);
  }

  async findByProcessId(processId: string): Promise<ProcessStep[]> {
    return this.repository.findByProcessId(processId);
  }

  async reorderSteps(processId: string, stepIds: string[]): Promise<void> {
    const updates = stepIds.map((id, index) =>
      this.repository.update(id, { sequencia: index + 1 })
    );
    await Promise.all(updates);
  }
}
