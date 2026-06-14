import { ProcessRepository, Process } from '../repositories/process.repository';
import { CreateProcessDTO, UpdateProcessDTO, ProcessResponseDTO } from '../dto/process.dto';

export class ProcessService {
  private repository: ProcessRepository;

  constructor() {
    this.repository = new ProcessRepository();
  }

  async create(dto: CreateProcessDTO): Promise<ProcessResponseDTO> {
    const process = await this.repository.create(dto);
    return this.toResponseDTO(process);
  }

  async findById(id: string): Promise<ProcessResponseDTO | null> {
    const process = await this.repository.findById(id);
    if (!process) return null;
    return this.toResponseDTO(process);
  }

  async findAll(): Promise<ProcessResponseDTO[]> {
    const processes = await this.repository.findAll();
    return processes.map(p => this.toResponseDTO(p));
  }

  async update(id: string, dto: UpdateProcessDTO): Promise<ProcessResponseDTO> {
    const process = await this.repository.update(id, dto);
    return this.toResponseDTO(process);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async findBySequence(sequencia: number): Promise<ProcessResponseDTO[]> {
    const processes = await this.repository.findBySequence(sequencia);
    return processes.map(p => this.toResponseDTO(p));
  }

  async findByStatus(status: string): Promise<ProcessResponseDTO[]> {
    const processes = await this.repository.findByStatus(status);
    return processes.map(p => this.toResponseDTO(p));
  }

  async findActive(): Promise<ProcessResponseDTO[]> {
    const processes = await this.repository.findActive();
    return processes.map(p => this.toResponseDTO(p));
  }

  async activate(id: string): Promise<ProcessResponseDTO> {
    return this.update(id, { status: 'active' });
  }

  async deactivate(id: string): Promise<ProcessResponseDTO> {
    return this.update(id, { status: 'inactive' });
  }

  private toResponseDTO(process: Process): ProcessResponseDTO {
    return {
      id: process.id,
      nome: process.nome,
      descricao: process.descricao,
      sequencia: process.sequencia,
      entradas: process.entradas,
      saidas: process.saidas,
      maquinas: process.maquinas,
      responsaveis: process.responsaveis,
      tempo_padrao_minutos: process.tempo_padrao_minutos,
      status: process.status,
      observacoes: process.observacoes,
      created_at: process.created_at,
      updated_at: process.updated_at,
      deleted_at: process.deleted_at,
    };
  }
}
