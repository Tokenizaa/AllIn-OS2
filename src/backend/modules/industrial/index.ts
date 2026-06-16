// ============================================================================
// INDUSTRIAL FOUNDATION MODULE - INDEX
// ============================================================================

// Repositories
export { LocationRepository } from './repositories/location.repository';
export { MachineRepository } from './repositories/machine.repository';
export { MaterialRepository } from './repositories/material.repository';
export { SupplierRepository } from './repositories/supplier.repository';
export { ProcessRepository } from './repositories/process.repository';
export { ProcessStepRepository } from './repositories/process-steps.repository';
export { ProcessDocumentRepository } from './repositories/process-documents.repository';
export { TimingRepository } from './repositories/timing.repository';
export { TimingMeasurementRepository } from './repositories/timing-measurements.repository';
export { CapacityRepository } from './repositories/capacity.repository';
export { CapacityHistoryRepository } from './repositories/capacity-history.repository';
export { ToolRepository } from './repositories/tool.repository';
export { ProductIndustrialRepository } from './repositories/product-industrial.repository';
export { ComponentRepository } from './repositories/component.repository';
export { BOMRepository } from './repositories/bom.repository';
export { MachineMaintenanceRepository } from './repositories/machine-maintenance.repository';
export { MachineDocumentRepository } from './repositories/machine-documents.repository';
export { MachinePhotoRepository } from './repositories/machine-photos.repository';

// DTOs
export type {
  Location,
  CreateLocationDTO,
  UpdateLocationDTO,
  LocationResponseDTO,
} from './dto/location.dto';

export type {
  Machine,
  CreateMachineDTO,
  UpdateMachineDTO,
  MachineResponseDTO,
} from './dto/machine.dto';

export type {
  MachineMaintenance,
  CreateMachineMaintenanceDTO,
  UpdateMachineMaintenanceDTO,
  MachineMaintenanceResponseDTO,
} from './dto/machine-maintenance.dto';

export type {
  MachineDocument,
  CreateMachineDocumentDTO,
  UpdateMachineDocumentDTO,
  MachineDocumentResponseDTO,
} from './dto/machine-documents.dto';

export type {
  MachinePhoto,
  CreateMachinePhotoDTO,
  UpdateMachinePhotoDTO,
  MachinePhotoResponseDTO,
} from './dto/machine-photos.dto';

export type {
  Material,
  CreateMaterialDTO,
  UpdateMaterialDTO,
  MaterialResponseDTO,
} from './dto/material.dto';

export type {
  Supplier,
  CreateSupplierDTO,
  UpdateSupplierDTO,
  SupplierResponseDTO,
} from './dto/supplier.dto';

export type {
  Process,
  CreateProcessDTO,
  UpdateProcessDTO,
  ProcessResponseDTO,
} from './dto/process.dto';

export type {
  ProcessStep,
  CreateProcessStepDTO,
  UpdateProcessStepDTO,
  ProcessStepResponseDTO,
} from './dto/process-steps.dto';

export type {
  ProcessDocument,
  CreateProcessDocumentDTO,
  UpdateProcessDocumentDTO,
  ProcessDocumentResponseDTO,
} from './dto/process-documents.dto';

export type {
  TimingRecord,
  CreateTimingRecordDTO,
  UpdateTimingRecordDTO,
  TimingRecordResponseDTO,
} from './dto/timing.dto';

export type {
  TimingMeasurement,
  CreateTimingMeasurementDTO,
  UpdateTimingMeasurementDTO,
  TimingMeasurementResponseDTO,
} from './dto/timing-measurements.dto';

export type {
  Capacity,
  CreateCapacityDTO,
  UpdateCapacityDTO,
  CapacityResponseDTO,
} from './dto/capacity.dto';

export type {
  CapacityHistory,
  CreateCapacityHistoryDTO,
  UpdateCapacityHistoryDTO,
  CapacityHistoryResponseDTO,
} from './dto/capacity-history.dto';

export type {
  Tool,
  CreateToolDTO,
  UpdateToolDTO,
  ToolResponseDTO,
} from './dto/tool.dto';

export type {
  ProductIndustrial,
  CreateProductIndustrialDTO,
  UpdateProductIndustrialDTO,
  ProductIndustrialResponseDTO,
} from './dto/product-industrial.dto';

export type {
  Component,
  CreateComponentDTO,
  UpdateComponentDTO,
  ComponentResponseDTO,
} from './dto/component.dto';

export type {
  BOM,
  CreateBOMDTO,
  UpdateBOMDTO,
  BOMResponseDTO,
} from './dto/bom.dto';

// Services
export { LocationService } from './services/location.service';
export { MachineService } from './services/machine.service';
export { MaterialService } from './services/material.service';
export { SupplierService } from './services/supplier.service';
export { ProcessService } from './services/process.service';
export { ProcessStepService } from './services/process-steps.service';
export { ProcessDocumentService } from './services/process-documents.service';
export { TimingService } from './services/timing.service';
export { TimingMeasurementService } from './services/timing-measurements.service';
export { CapacityService } from './services/capacity.service';
export { CapacityHistoryService } from './services/capacity-history.service';
export { ToolService } from './services/tool.service';
export { ProductIndustrialService } from './services/product-industrial.service';
export { ComponentService } from './services/component.service';
export { BOMService } from './services/bom.service';
export { MachineMaintenanceService } from './services/machine-maintenance.service';
export { MachineDocumentService } from './services/machine-documents.service';
export { MachinePhotoService } from './services/machine-photos.service';

// API
export * from './api/industrial.api';
