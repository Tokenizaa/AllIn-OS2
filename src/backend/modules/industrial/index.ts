// ============================================================================
// INDUSTRIAL FOUNDATION MODULE - INDEX
// ============================================================================

// Repositories
export { LocationRepository } from './repositories/location.repository';
export { MachineRepository } from './repositories/machine.repository';
export { MaterialRepository } from './repositories/material.repository';
export { SupplierRepository } from './repositories/supplier.repository';
export { ProcessRepository } from './repositories/process.repository';
export { TimingRepository } from './repositories/timing.repository';
export { CapacityRepository } from './repositories/capacity.repository';
export { ToolRepository } from './repositories/tool.repository';
export { ProductIndustrialRepository } from './repositories/product-industrial.repository';
export { ComponentRepository } from './repositories/component.repository';
export { BOMRepository } from './repositories/bom.repository';

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
  TimingRecord,
  CreateTimingRecordDTO,
  UpdateTimingRecordDTO,
  TimingRecordResponseDTO,
} from './dto/timing.dto';

export type {
  Capacity,
  CreateCapacityDTO,
  UpdateCapacityDTO,
  CapacityResponseDTO,
} from './dto/capacity.dto';

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
export { TimingService } from './services/timing.service';
export { CapacityService } from './services/capacity.service';
export { ToolService } from './services/tool.service';
export { ProductIndustrialService } from './services/product-industrial.service';
export { ComponentService } from './services/component.service';
export { BOMService } from './services/bom.service';

// API
export * from './api/industrial.api';
