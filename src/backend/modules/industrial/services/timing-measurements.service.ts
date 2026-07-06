import { TimingMeasurementRepository } from '../repositories/timing-measurements.repository';
import type {
  TimingMeasurement,
  CreateTimingMeasurementDTO,
  UpdateTimingMeasurementDTO,
} from '../dto/timing-measurements.dto';

export class TimingMeasurementService {
  private repository: TimingMeasurementRepository;

  constructor() {
    this.repository = new TimingMeasurementRepository();
  }

  async findAll(timingRecordId?: string): Promise<TimingMeasurement[]> {
    return this.repository.findAll(timingRecordId);
  }

  async findById(id: string): Promise<TimingMeasurement | null> {
    return this.repository.findById(id);
  }

  async create(dto: CreateTimingMeasurementDTO): Promise<TimingMeasurement> {
    return this.repository.create(dto);
  }

  async update(id: string, dto: UpdateTimingMeasurementDTO): Promise<TimingMeasurement> {
    return this.repository.update(id, dto);
  }

  async delete(id: string): Promise<void> {
    return this.repository.delete(id);
  }

  async findByTimingRecordId(timingRecordId: string): Promise<TimingMeasurement[]> {
    return this.repository.findByTimingRecordId(timingRecordId);
  }

  async findByMachineId(machineId: string): Promise<TimingMeasurement[]> {
    return this.repository.findByMachineId(machineId);
  }

  async findByProcessId(processId: string): Promise<TimingMeasurement[]> {
    return this.repository.findByProcessId(processId);
  }

  async calculateAverage(timingRecordId: string): Promise<number> {
    return this.repository.calculateAverage(timingRecordId);
  }

  async markAsInvalid(id: string): Promise<TimingMeasurement> {
    return this.repository.update(id, { status: 'invalid' });
  }

  async markAsOutlier(id: string): Promise<TimingMeasurement> {
    return this.repository.update(id, { status: 'outlier' });
  }
}
