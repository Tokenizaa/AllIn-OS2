import { TimingRepository, TimingRecord } from '../repositories/timing.repository';
import { CreateTimingRecordDTO, UpdateTimingRecordDTO, TimingRecordResponseDTO } from '../dto/timing.dto';

export class TimingService {
  private repository: TimingRepository;

  constructor() {
    this.repository = new TimingRepository();
  }

  async create(dto: CreateTimingRecordDTO): Promise<TimingRecordResponseDTO> {
    const data: any = { ...dto };
    data.inicio = new Date(dto.inicio);
    if (dto.fim) {
      data.fim = new Date(dto.fim);
    }
    const timing = await this.repository.create(data);
    return this.toResponseDTO(timing);
  }

  async findById(id: string): Promise<TimingRecordResponseDTO | null> {
    const timing = await this.repository.findById(id);
    if (!timing) return null;
    return this.toResponseDTO(timing);
  }

  async findAll(): Promise<TimingRecordResponseDTO[]> {
    const timings = await this.repository.findAll();
    return timings.map(t => this.toResponseDTO(t));
  }

  async update(id: string, dto: UpdateTimingRecordDTO): Promise<TimingRecordResponseDTO> {
    const data: any = { ...dto };
    if (dto.inicio) {
      data.inicio = new Date(dto.inicio);
    }
    if (dto.fim) {
      data.fim = new Date(dto.fim);
    }
    const timing = await this.repository.update(id, data);
    return this.toResponseDTO(timing);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async findByProcess(processId: string): Promise<TimingRecordResponseDTO[]> {
    const timings = await this.repository.findByProcess(processId);
    return timings.map(t => this.toResponseDTO(t));
  }

  async findByOperator(operatorId: string): Promise<TimingRecordResponseDTO[]> {
    const timings = await this.repository.findByOperator(operatorId);
    return timings.map(t => this.toResponseDTO(t));
  }

  async findByDateRange(inicio: Date, fim: Date): Promise<TimingRecordResponseDTO[]> {
    const timings = await this.repository.findByDateRange(inicio, fim);
    return timings.map(t => this.toResponseDTO(t));
  }

  async calculateAverageTime(processId: string): Promise<number> {
    return this.repository.calculateAverageTime(processId);
  }

  async startTiming(processoId: string, operadorId: string): Promise<TimingRecordResponseDTO> {
    return this.create({
      processo_id: processoId,
      operador_id: operadorId,
      inicio: new Date(),
    });
  }

  async stopTiming(id: string, quantidadeProduzida?: number): Promise<TimingRecordResponseDTO> {
    const timing = await this.findById(id);
    if (!timing) throw new Error('Timing record not found');

    const fim = new Date();
    const inicio = new Date(timing.inicio);
    const duracaoSegundos = Math.floor((fim.getTime() - inicio.getTime()) / 1000);

    return this.update(id, {
      fim,
      duracao_segundos: duracaoSegundos,
      quantidade_produzida: quantidadeProduzida,
    });
  }

  private toResponseDTO(timing: TimingRecord): TimingRecordResponseDTO {
    return {
      id: timing.id,
      processo_id: timing.processo_id,
      operador_id: timing.operador_id,
      inicio: timing.inicio,
      fim: timing.fim,
      duracao_segundos: timing.duracao_segundos,
      produto_id: timing.produto_id,
      quantidade_produzida: timing.quantidade_produzida,
      observacoes: timing.observacoes,
      created_at: timing.created_at,
      updated_at: timing.updated_at,
      deleted_at: timing.deleted_at,
    };
  }
}
