import { ProcessDocumentRepository } from '../repositories/process-documents.repository';
import type {
  ProcessDocument,
  CreateProcessDocumentDTO,
  UpdateProcessDocumentDTO,
} from '../dto/process-documents.dto';

export class ProcessDocumentService {
  private repository: ProcessDocumentRepository;

  constructor() {
    this.repository = new ProcessDocumentRepository();
  }

  async findAll(processId?: string): Promise<ProcessDocument[]> {
    return this.repository.findAll(processId);
  }

  async findById(id: string): Promise<ProcessDocument | null> {
    return this.repository.findById(id);
  }

  async create(dto: CreateProcessDocumentDTO): Promise<ProcessDocument> {
    return this.repository.create(dto);
  }

  async update(id: string, dto: UpdateProcessDocumentDTO): Promise<ProcessDocument> {
    return this.repository.update(id, dto);
  }

  async delete(id: string): Promise<void> {
    return this.repository.delete(id);
  }

  async findByProcessId(processId: string): Promise<ProcessDocument[]> {
    return this.repository.findByProcessId(processId);
  }

  async findByType(processId: string, tipo: string): Promise<ProcessDocument[]> {
    return this.repository.findByType(processId, tipo);
  }
}
