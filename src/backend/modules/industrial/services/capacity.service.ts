import { CapacityRepository, Capacity } from '../repositories/capacity.repository';
import { CreateCapacityDTO, UpdateCapacityDTO, CapacityResponseDTO } from '../dto/capacity.dto';

export class CapacityService {
  private repository: CapacityRepository;

  constructor() {
    this.repository = new CapacityRepository();
  }

  async create(dto: CreateCapacityDTO): Promise<CapacityResponseDTO> {
    const data: any = { ...dto };
    if (dto.data_inicio) {
      data.data_inicio = new Date(dto.data_inicio);
    }
    if (dto.data_fim) {
      data.data_fim = new Date(dto.data_fim);
    }
    const capacity = await this.repository.create(data);
    return this.toResponseDTO(capacity);
  }

  async findById(id: string): Promise<CapacityResponseDTO | null> {
    const capacity = await this.repository.findById(id);
    if (!capacity) return null;
    return this.toResponseDTO(capacity);
  }

  async findAll(): Promise<CapacityResponseDTO[]> {
    const capacities = await this.repository.findAll();
    return capacities.map(c => this.toResponseDTO(c));
  }

  async update(id: string, dto: UpdateCapacityDTO): Promise<CapacityResponseDTO> {
    const data: any = { ...dto };
    if (dto.data_inicio) {
      data.data_inicio = new Date(dto.data_inicio);
    }
    if (dto.data_fim) {
      data.data_fim = new Date(dto.data_fim);
    }
    const capacity = await this.repository.update(id, data);
    return this.toResponseDTO(capacity);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async findByMachine(machineId: string): Promise<CapacityResponseDTO[]> {
    const capacities = await this.repository.findByMachine(machineId);
    return capacities.map(c => this.toResponseDTO(c));
  }

  async findByDateRange(dataInicio: Date, dataFim: Date): Promise<CapacityResponseDTO[]> {
    const capacities = await this.repository.findByDateRange(dataInicio, dataFim);
    return capacities.map(c => this.toResponseDTO(c));
  }

  async findCurrentCapacity(machineId: string): Promise<CapacityResponseDTO | null> {
    const capacity = await this.repository.findCurrentCapacity(machineId);
    if (!capacity) return null;
    return this.toResponseDTO(capacity);
  }

  private toResponseDTO(capacity: Capacity): CapacityResponseDTO {
    return {
      id: capacity.id,
      maquina_id: capacity.maquina_id,
      capacidade_teorica: capacity.capacidade_teorica,
      capacidade_observada: capacity.capacidade_observada,
      unidade_medida: capacity.unidade_medida,
      data_inicio: capacity.data_inicio,
      data_fim: capacity.data_fim,
      observacoes: capacity.observacoes,
      created_at: capacity.created_at,
      updated_at: capacity.updated_at,
      deleted_at: capacity.deleted_at,
    };
  }
}
