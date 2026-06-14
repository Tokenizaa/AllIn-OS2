import { MachineRepository, Machine } from '../repositories/machine.repository';
import { CreateMachineDTO, UpdateMachineDTO, MachineResponseDTO } from '../dto/machine.dto';

export class MachineService {
  private repository: MachineRepository;

  constructor() {
    this.repository = new MachineRepository();
  }

  async create(dto: CreateMachineDTO): Promise<MachineResponseDTO> {
    const data: any = { ...dto };
    if (dto.data_aquisicao) {
      data.data_aquisicao = new Date(dto.data_aquisicao);
    }
    const machine = await this.repository.create(data);
    return this.toResponseDTO(machine);
  }

  async findById(id: string): Promise<MachineResponseDTO | null> {
    const machine = await this.repository.findById(id);
    if (!machine) return null;
    return this.toResponseDTO(machine);
  }

  async findAll(): Promise<MachineResponseDTO[]> {
    const machines = await this.repository.findAll();
    return machines.map(m => this.toResponseDTO(m));
  }

  async update(id: string, dto: UpdateMachineDTO): Promise<MachineResponseDTO> {
    const data: any = { ...dto };
    if (dto.data_aquisicao) {
      data.data_aquisicao = new Date(dto.data_aquisicao);
    }
    const machine = await this.repository.update(id, data);
    return this.toResponseDTO(machine);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async findByStatus(status: string): Promise<MachineResponseDTO[]> {
    const machines = await this.repository.findByStatus(status);
    return machines.map(m => this.toResponseDTO(m));
  }

  async findByLocation(locationId: string): Promise<MachineResponseDTO[]> {
    const machines = await this.repository.findByLocation(locationId);
    return machines.map(m => this.toResponseDTO(m));
  }

  async findActive(): Promise<MachineResponseDTO[]> {
    const machines = await this.repository.findActive();
    return machines.map(m => this.toResponseDTO(m));
  }

  async findInMaintenance(): Promise<MachineResponseDTO[]> {
    const machines = await this.repository.findInMaintenance();
    return machines.map(m => this.toResponseDTO(m));
  }

  async activate(id: string): Promise<MachineResponseDTO> {
    return this.update(id, { status: 'active' });
  }

  async deactivate(id: string): Promise<MachineResponseDTO> {
    return this.update(id, { status: 'inactive' });
  }

  async setMaintenance(id: string): Promise<MachineResponseDTO> {
    return this.update(id, { status: 'maintenance' });
  }

  private toResponseDTO(machine: Machine): MachineResponseDTO {
    return {
      id: machine.id,
      nome: machine.nome,
      codigo: machine.codigo,
      fabricante: machine.fabricante,
      modelo: machine.modelo,
      numero_serie: machine.numero_serie,
      data_aquisicao: machine.data_aquisicao,
      valor_aquisicao: machine.valor_aquisicao,
      localizacao_id: machine.localizacao_id,
      localizacao_detalhe: machine.localizacao_detalhe,
      status: machine.status,
      capacidade_horaria: machine.capacidade_horaria,
      especificacoes: machine.especificacoes,
      observacoes: machine.observacoes,
      anexos: machine.anexos,
      created_at: machine.created_at,
      updated_at: machine.updated_at,
      deleted_at: machine.deleted_at,
    };
  }
}
