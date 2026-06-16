import { MachineMaintenanceRepository } from '../repositories/machine-maintenance.repository';
import type {
  MachineMaintenance,
  CreateMachineMaintenanceDTO,
  UpdateMachineMaintenanceDTO,
} from '../dto/machine-maintenance.dto';

export class MachineMaintenanceService {
  private repository: MachineMaintenanceRepository;

  constructor() {
    this.repository = new MachineMaintenanceRepository();
  }

  async findAll(machineId?: string): Promise<MachineMaintenance[]> {
    return this.repository.findAll(machineId);
  }

  async findById(id: string): Promise<MachineMaintenance | null> {
    return this.repository.findById(id);
  }

  async create(dto: CreateMachineMaintenanceDTO): Promise<MachineMaintenance> {
    return this.repository.create(dto);
  }

  async update(id: string, dto: UpdateMachineMaintenanceDTO): Promise<MachineMaintenance> {
    return this.repository.update(id, dto);
  }

  async delete(id: string): Promise<void> {
    return this.repository.delete(id);
  }

  async findByMachineId(machineId: string): Promise<MachineMaintenance[]> {
    return this.repository.findByMachineId(machineId);
  }

  async findUpcoming(days: number = 30): Promise<MachineMaintenance[]> {
    return this.repository.findUpcoming(days);
  }

  async completeMaintenance(id: string, data: { duracao_horas_real: number; custo_real: number; observacoes?: string }): Promise<MachineMaintenance> {
    return this.repository.update(id, {
      status: 'completed',
      data_fim: new Date().toISOString(),
      duracao_horas_real: data.duracao_horas_real,
      custo_real: data.custo_real,
      observacoes: data.observacoes,
    });
  }

  async startMaintenance(id: string): Promise<MachineMaintenance> {
    return this.repository.update(id, {
      status: 'in_progress',
      data_inicio: new Date().toISOString(),
    });
  }

  async cancelMaintenance(id: string, motivo?: string): Promise<MachineMaintenance> {
    return this.repository.update(id, {
      status: 'cancelled',
      observacoes: motivo,
    });
  }
}
