import { z } from 'zod';
import {
  LocationService,
  MachineService,
  MaterialService,
  SupplierService,
  ProcessService,
  ProcessStepService,
  ProcessDocumentService,
  TimingService,
  TimingMeasurementService,
  CapacityService,
  CapacityHistoryService,
  ToolService,
  ProductIndustrialService,
  ComponentService,
  BOMService,
  MachineMaintenanceService,
  MachineDocumentService,
  MachinePhotoService,
} from '../services';
import {
  createLocationSchema,
  updateLocationSchema,
  createMachineSchema,
  updateMachineSchema,
  createMaterialSchema,
  updateMaterialSchema,
  createSupplierSchema,
  updateSupplierSchema,
  createProcessSchema,
  updateProcessSchema,
  createProcessStepSchema,
  updateProcessStepSchema,
  createProcessDocumentSchema,
  updateProcessDocumentSchema,
  createTimingRecordSchema,
  updateTimingRecordSchema,
  createTimingMeasurementSchema,
  updateTimingMeasurementSchema,
  createCapacitySchema,
  updateCapacitySchema,
  createCapacityHistorySchema,
  updateCapacityHistorySchema,
  createToolSchema,
  updateToolSchema,
  createProductIndustrialSchema,
  updateProductIndustrialSchema,
  createComponentSchema,
  updateComponentSchema,
  createBOMSchema,
  updateBOMSchema,
  createMachineMaintenanceSchema,
  updateMachineMaintenanceSchema,
  createMachineDocumentSchema,
  updateMachineDocumentSchema,
  createMachinePhotoSchema,
  updateMachinePhotoSchema,
} from '../dto';

// Services
const locationService = new LocationService();
const machineService = new MachineService();
const materialService = new MaterialService();
const supplierService = new SupplierService();
const processService = new ProcessService();
const processStepService = new ProcessStepService();
const processDocumentService = new ProcessDocumentService();
const timingService = new TimingService();
const timingMeasurementService = new TimingMeasurementService();
const capacityService = new CapacityService();
const capacityHistoryService = new CapacityHistoryService();
const toolService = new ToolService();
const productIndustrialService = new ProductIndustrialService();
const componentService = new ComponentService();
const bomService = new BOMService();
const machineMaintenanceService = new MachineMaintenanceService();
const machineDocumentService = new MachineDocumentService();
const machinePhotoService = new MachinePhotoService();

// Pagination schema
const paginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
});

// ============================================================================
// LOCATIONS
// ============================================================================

export const getLocations = async (data: unknown) => {
  try {
    const locations = await locationService.findAll();
    return { success: true, data: locations };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch locations',
    };
  }
};

export const getLocationById = async (data: unknown) => {
  const schema = z.object({ id: z.string().uuid() });
  const parsed = schema.parse(data);
  try {
    const location = await locationService.findById(parsed.id);
    if (!location) {
      return { success: false, error: 'Location not found' };
    }
    return { success: true, data: location };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch location',
    };
  }
};

export const createLocation = async (data: unknown) => {
  const parsed = createLocationSchema.parse(data);
  try {
    const location = await locationService.create(parsed);
    return { success: true, data: location };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create location',
    };
  }
};

export const updateLocation = async (data: unknown) => {
  const schema = z.object({ id: z.string().uuid() }).merge(updateLocationSchema);
  const parsed = schema.parse(data);
  try {
    const { id, ...updateData } = parsed;
    const location = await locationService.update(id, updateData);
    return { success: true, data: location };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update location',
    };
  }
};

export const deleteLocation = async (data: unknown) => {
  const schema = z.object({ id: z.string().uuid() });
  const parsed = schema.parse(data);
  try {
    await locationService.delete(parsed.id);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete location',
    };
  }
};

// ============================================================================
// MACHINES
// ============================================================================

export const getMachines = async (data: unknown) => {
  try {
    const machines = await machineService.findAll();
    return { success: true, data: machines };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch machines',
    };
  }
};

export const getMachineById = async (data: unknown) => {
  const schema = z.object({ id: z.string().uuid() });
  const parsed = schema.parse(data);
  try {
    const machine = await machineService.findById(parsed.id);
    if (!machine) {
      return { success: false, error: 'Machine not found' };
    }
    return { success: true, data: machine };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch machine',
    };
  }
};

export const createMachine = async (data: unknown) => {
  const parsed = createMachineSchema.parse(data);
  try {
    const machine = await machineService.create(parsed);
    return { success: true, data: machine };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create machine',
    };
  }
};

export const updateMachine = async (data: unknown) => {
  const schema = z.object({ id: z.string().uuid() }).merge(updateMachineSchema);
  const parsed = schema.parse(data);
  try {
    const { id, ...updateData } = parsed;
    const machine = await machineService.update(id, updateData);
    return { success: true, data: machine };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update machine',
    };
  }
};

export const deleteMachine = async (data: unknown) => {
  const schema = z.object({ id: z.string().uuid() });
  const parsed = schema.parse(data);
  try {
    await machineService.delete(parsed.id);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete machine',
    };
  }
};

// ============================================================================
// MATERIALS
// ============================================================================

export const getMaterials = async (data: unknown) => {
  try {
    const materials = await materialService.findAll();
    return { success: true, data: materials };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch materials',
    };
  }
};

export const getMaterialById = async (data: unknown) => {
  const schema = z.object({ id: z.string().uuid() });
  const parsed = schema.parse(data);
  try {
    const material = await materialService.findById(parsed.id);
    if (!material) {
      return { success: false, error: 'Material not found' };
    }
    return { success: true, data: material };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch material',
    };
  }
};

export const createMaterial = async (data: unknown) => {
  const parsed = createMaterialSchema.parse(data);
  try {
    const material = await materialService.create(parsed);
    return { success: true, data: material };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create material',
    };
  }
};

export const updateMaterial = async (data: unknown) => {
  const schema = z.object({ id: z.string().uuid() }).merge(updateMaterialSchema);
  const parsed = schema.parse(data);
  try {
    const { id, ...updateData } = parsed;
    const material = await materialService.update(id, updateData);
    return { success: true, data: material };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update material',
    };
  }
};

export const deleteMaterial = async (data: unknown) => {
  const schema = z.object({ id: z.string().uuid() });
  const parsed = schema.parse(data);
  try {
    await materialService.delete(parsed.id);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete material',
    };
  }
};

// ============================================================================
// SUPPLIERS
// ============================================================================

export const getSuppliers = async (data: unknown) => {
  try {
    const suppliers = await supplierService.findAll();
    return { success: true, data: suppliers };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch suppliers',
    };
  }
};

export const getSupplierById = async (data: unknown) => {
  const schema = z.object({ id: z.string().uuid() });
  const parsed = schema.parse(data);
  try {
    const supplier = await supplierService.findById(parsed.id);
    if (!supplier) {
      return { success: false, error: 'Supplier not found' };
    }
    return { success: true, data: supplier };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch supplier',
    };
  }
};

export const createSupplier = async (data: unknown) => {
  const parsed = createSupplierSchema.parse(data);
  try {
    const supplier = await supplierService.create(parsed);
    return { success: true, data: supplier };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create supplier',
    };
  }
};

export const updateSupplier = async (data: unknown) => {
  const schema = z.object({ id: z.string().uuid() }).merge(updateSupplierSchema);
  const parsed = schema.parse(data);
  try {
    const { id, ...updateData } = parsed;
    const supplier = await supplierService.update(id, updateData);
    return { success: true, data: supplier };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update supplier',
    };
  }
};

export const deleteSupplier = async (data: unknown) => {
  const schema = z.object({ id: z.string().uuid() });
  const parsed = schema.parse(data);
  try {
    await supplierService.delete(parsed.id);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete supplier',
    };
  }
};

// ============================================================================
// PROCESSES
// ============================================================================

export const getProcesses = async (data: unknown) => {
  try {
    const processes = await processService.findAll();
    return { success: true, data: processes };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch processes',
    };
  }
};

export const getProcessById = async (data: unknown) => {
  const schema = z.object({ id: z.string().uuid() });
  const parsed = schema.parse(data);
  try {
    const process = await processService.findById(parsed.id);
    if (!process) {
      return { success: false, error: 'Process not found' };
    }
    return { success: true, data: process };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch process',
    };
  }
};

export const createProcess = async (data: unknown) => {
  const parsed = createProcessSchema.parse(data);
  try {
    const process = await processService.create(parsed);
    return { success: true, data: process };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create process',
    };
  }
};

export const updateProcess = async (data: unknown) => {
  const schema = z.object({ id: z.string().uuid() }).merge(updateProcessSchema);
  const parsed = schema.parse(data);
  try {
    const { id, ...updateData } = parsed;
    const process = await processService.update(id, updateData);
    return { success: true, data: process };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update process',
    };
  }
};

export const deleteProcess = async (data: unknown) => {
  const schema = z.object({ id: z.string().uuid() });
  const parsed = schema.parse(data);
  try {
    await processService.delete(parsed.id);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete process',
    };
  }
};

// ============================================================================
// TIMING RECORDS
// ============================================================================

export const getTimingRecords = async (data: unknown) => {
  try {
    const timings = await timingService.findAll();
    return { success: true, data: timings };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch timing records',
    };
  }
};

export const getTimingRecordById = async (data: unknown) => {
  const schema = z.object({ id: z.string().uuid() });
  const parsed = schema.parse(data);
  try {
    const timing = await timingService.findById(parsed.id);
    if (!timing) {
      return { success: false, error: 'Timing record not found' };
    }
    return { success: true, data: timing };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch timing record',
    };
  }
};

export const createTimingRecord = async (data: unknown) => {
  const parsed = createTimingRecordSchema.parse(data);
  try {
    const timing = await timingService.create(parsed);
    return { success: true, data: timing };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create timing record',
    };
  }
};

export const updateTimingRecord = async (data: unknown) => {
  const schema = z.object({ id: z.string().uuid() }).merge(updateTimingRecordSchema);
  const parsed = schema.parse(data);
  try {
    const { id, ...updateData } = parsed;
    const timing = await timingService.update(id, updateData);
    return { success: true, data: timing };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update timing record',
    };
  }
};

export const deleteTimingRecord = async (data: unknown) => {
  const schema = z.object({ id: z.string().uuid() });
  const parsed = schema.parse(data);
  try {
    await timingService.delete(parsed.id);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete timing record',
    };
  }
};

// ============================================================================
// CAPACITY
// ============================================================================

export const getCapacities = async (data: unknown) => {
  try {
    const capacities = await capacityService.findAll();
    return { success: true, data: capacities };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch capacities',
    };
  }
};

export const getCapacityById = async (data: unknown) => {
  const schema = z.object({ id: z.string().uuid() });
  const parsed = schema.parse(data);
  try {
    const capacity = await capacityService.findById(parsed.id);
    if (!capacity) {
      return { success: false, error: 'Capacity not found' };
    }
    return { success: true, data: capacity };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch capacity',
    };
  }
};

export const createCapacity = async (data: unknown) => {
  const parsed = createCapacitySchema.parse(data);
  try {
    const capacity = await capacityService.create(parsed);
    return { success: true, data: capacity };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create capacity',
    };
  }
};

export const updateCapacity = async (data: unknown) => {
  const schema = z.object({ id: z.string().uuid() }).merge(updateCapacitySchema);
  const parsed = schema.parse(data);
  try {
    const { id, ...updateData } = parsed;
    const capacity = await capacityService.update(id, updateData);
    return { success: true, data: capacity };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update capacity',
    };
  }
};

export const deleteCapacity = async (data: unknown) => {
  const schema = z.object({ id: z.string().uuid() });
  const parsed = schema.parse(data);
  try {
    await capacityService.delete(parsed.id);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete capacity',
    };
  }
};

// ============================================================================
// TOOLS
// ============================================================================

export const getTools = async (data: unknown) => {
  try {
    const tools = await toolService.findAll();
    return { success: true, data: tools };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch tools',
    };
  }
};

export const getToolById = async (data: unknown) => {
  const schema = z.object({ id: z.string().uuid() });
  const parsed = schema.parse(data);
  try {
    const tool = await toolService.findById(parsed.id);
    if (!tool) {
      return { success: false, error: 'Tool not found' };
    }
    return { success: true, data: tool };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch tool',
    };
  }
};

export const createTool = async (data: unknown) => {
  const parsed = createToolSchema.parse(data);
  try {
    const tool = await toolService.create(parsed);
    return { success: true, data: tool };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create tool',
    };
  }
};

export const updateTool = async (data: unknown) => {
  const schema = z.object({ id: z.string().uuid() }).merge(updateToolSchema);
  const parsed = schema.parse(data);
  try {
    const { id, ...updateData } = parsed;
    const tool = await toolService.update(id, updateData);
    return { success: true, data: tool };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update tool',
    };
  }
};

export const deleteTool = async (data: unknown) => {
  const schema = z.object({ id: z.string().uuid() });
  const parsed = schema.parse(data);
  try {
    await toolService.delete(parsed.id);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete tool',
    };
  }
};

// ============================================================================
// PRODUCTS INDUSTRIAL
// ============================================================================

export const getProductsIndustrial = async (data: unknown) => {
  try {
    const products = await productIndustrialService.findAll();
    return { success: true, data: products };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch products',
    };
  }
};

export const getProductIndustrialById = async (data: unknown) => {
  const schema = z.object({ id: z.string().uuid() });
  const parsed = schema.parse(data);
  try {
    const product = await productIndustrialService.findById(parsed.id);
    if (!product) {
      return { success: false, error: 'Product not found' };
    }
    return { success: true, data: product };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch product',
    };
  }
};

export const createProductIndustrial = async (data: unknown) => {
  const parsed = createProductIndustrialSchema.parse(data);
  try {
    const product = await productIndustrialService.create(parsed);
    return { success: true, data: product };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create product',
    };
  }
};

export const updateProductIndustrial = async (data: unknown) => {
  const schema = z.object({ id: z.string().uuid() }).merge(updateProductIndustrialSchema);
  const parsed = schema.parse(data);
  try {
    const { id, ...updateData } = parsed;
    const product = await productIndustrialService.update(id, updateData);
    return { success: true, data: product };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update product',
    };
  }
};

export const deleteProductIndustrial = async (data: unknown) => {
  const schema = z.object({ id: z.string().uuid() });
  const parsed = schema.parse(data);
  try {
    await productIndustrialService.delete(parsed.id);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete product',
    };
  }
};

// ============================================================================
// COMPONENTS
// ============================================================================

export const getComponents = async (data: unknown) => {
  try {
    const components = await componentService.findAll();
    return { success: true, data: components };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch components',
    };
  }
};

export const getComponentById = async (data: unknown) => {
  const schema = z.object({ id: z.string().uuid() });
  const parsed = schema.parse(data);
  try {
    const component = await componentService.findById(parsed.id);
    if (!component) {
      return { success: false, error: 'Component not found' };
    }
    return { success: true, data: component };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch component',
    };
  }
};

export const createComponent = async (data: unknown) => {
  const parsed = createComponentSchema.parse(data);
  try {
    const component = await componentService.create(parsed);
    return { success: true, data: component };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create component',
    };
  }
};

export const updateComponent = async (data: unknown) => {
  const schema = z.object({ id: z.string().uuid() }).merge(updateComponentSchema);
  const parsed = schema.parse(data);
  try {
    const { id, ...updateData } = parsed;
    const component = await componentService.update(id, updateData);
    return { success: true, data: component };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update component',
    };
  }
};

export const deleteComponent = async (data: unknown) => {
  const schema = z.object({ id: z.string().uuid() });
  const parsed = schema.parse(data);
  try {
    await componentService.delete(parsed.id);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete component',
    };
  }
};

// ============================================================================
// BOM
// ============================================================================

export const getBOMs = async (data: unknown) => {
  try {
    const boms = await bomService.findAll();
    return { success: true, data: boms };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch BOMs',
    };
  }
};

export const getBOMById = async (data: unknown) => {
  const schema = z.object({ id: z.string().uuid() });
  const parsed = schema.parse(data);
  try {
    const bom = await bomService.findById(parsed.id);
    if (!bom) {
      return { success: false, error: 'BOM not found' };
    }
    return { success: true, data: bom };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch BOM',
    };
  }
};

export const createBOM = async (data: unknown) => {
  const parsed = createBOMSchema.parse(data);
  try {
    const bom = await bomService.create(parsed);
    return { success: true, data: bom };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create BOM',
    };
  }
};

export const updateBOM = async (data: unknown) => {
  const schema = z.object({ id: z.string().uuid() }).merge(updateBOMSchema);
  const parsed = schema.parse(data);
  try {
    const { id, ...updateData } = parsed;
    const bom = await bomService.update(id, updateData);
    return { success: true, data: bom };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update BOM',
    };
  }
};

export const deleteBOM = async (data: unknown) => {
  const schema = z.object({ id: z.string().uuid() });
  const parsed = schema.parse(data);
  try {
    await bomService.delete(parsed.id);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete BOM',
    };
  }
};

// ============================================================================
// MACHINE MAINTENANCE
// ============================================================================

export const getMachineMaintenances = async (data: unknown) => {
  const schema = z.object({ machineId: z.string().uuid().optional() });
  const parsed = schema.parse(data);
  try {
    const maintenances = await machineMaintenanceService.findAll(parsed.machineId);
    return { success: true, data: maintenances };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch machine maintenances',
    };
  }
};

export const getMachineMaintenanceById = async (data: unknown) => {
  const schema = z.object({ id: z.string().uuid() });
  const parsed = schema.parse(data);
  try {
    const maintenance = await machineMaintenanceService.findById(parsed.id);
    if (!maintenance) {
      return { success: false, error: 'Machine maintenance not found' };
    }
    return { success: true, data: maintenance };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch machine maintenance',
    };
  }
};

export const createMachineMaintenance = async (data: unknown) => {
  const parsed = createMachineMaintenanceSchema.parse(data);
  try {
    const maintenance = await machineMaintenanceService.create(parsed);
    return { success: true, data: maintenance };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create machine maintenance',
    };
  }
};

export const updateMachineMaintenance = async (data: unknown) => {
  const schema = z.object({ id: z.string().uuid() }).merge(updateMachineMaintenanceSchema);
  const parsed = schema.parse(data);
  try {
    const { id, ...updateData } = parsed;
    const maintenance = await machineMaintenanceService.update(id, updateData);
    return { success: true, data: maintenance };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update machine maintenance',
    };
  }
};

export const deleteMachineMaintenance = async (data: unknown) => {
  const schema = z.object({ id: z.string().uuid() });
  const parsed = schema.parse(data);
  try {
    await machineMaintenanceService.delete(parsed.id);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete machine maintenance',
    };
  }
};

export const getMachineMaintenancesByMachineId = async (data: unknown) => {
  const schema = z.object({ machineId: z.string().uuid() });
  const parsed = schema.parse(data);
  try {
    const maintenances = await machineMaintenanceService.findByMachineId(parsed.machineId);
    return { success: true, data: maintenances };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch machine maintenances by machine',
    };
  }
};

export const getUpcomingMaintenances = async (data: unknown) => {
  const schema = z.object({ days: z.number().default(30) });
  const parsed = schema.parse(data);
  try {
    const maintenances = await machineMaintenanceService.findUpcoming(parsed.days);
    return { success: true, data: maintenances };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch upcoming maintenances',
    };
  }
};

export const completeMaintenance = async (data: unknown) => {
  const schema = z.object({
    id: z.string().uuid(),
    duracao_horas_real: z.number(),
    custo_real: z.number(),
    observacoes: z.string().optional(),
  });
  const parsed = schema.parse(data);
  try {
    const maintenance = await machineMaintenanceService.completeMaintenance(parsed.id, {
      duracao_horas_real: parsed.duracao_horas_real,
      custo_real: parsed.custo_real,
      observacoes: parsed.observacoes,
    });
    return { success: true, data: maintenance };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to complete maintenance',
    };
  }
};

export const startMaintenance = async (data: unknown) => {
  const schema = z.object({ id: z.string().uuid() });
  const parsed = schema.parse(data);
  try {
    const maintenance = await machineMaintenanceService.startMaintenance(parsed.id);
    return { success: true, data: maintenance };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to start maintenance',
    };
  }
};

export const cancelMaintenance = async (data: unknown) => {
  const schema = z.object({ id: z.string().uuid(), motivo: z.string().optional() });
  const parsed = schema.parse(data);
  try {
    const maintenance = await machineMaintenanceService.cancelMaintenance(parsed.id, parsed.motivo);
    return { success: true, data: maintenance };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to cancel maintenance',
    };
  }
};

// ============================================================================
// MACHINE DOCUMENTS
// ============================================================================

export const getMachineDocuments = async (data: unknown) => {
  const schema = z.object({ machineId: z.string().uuid().optional() });
  const parsed = schema.parse(data);
  try {
    const documents = await machineDocumentService.findAll(parsed.machineId);
    return { success: true, data: documents };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch machine documents',
    };
  }
};

export const getMachineDocumentById = async (data: unknown) => {
  const schema = z.object({ id: z.string().uuid() });
  const parsed = schema.parse(data);
  try {
    const document = await machineDocumentService.findById(parsed.id);
    if (!document) {
      return { success: false, error: 'Machine document not found' };
    }
    return { success: true, data: document };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch machine document',
    };
  }
};

export const createMachineDocument = async (data: unknown) => {
  const parsed = createMachineDocumentSchema.parse(data);
  try {
    const document = await machineDocumentService.create(parsed);
    return { success: true, data: document };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create machine document',
    };
  }
};

export const updateMachineDocument = async (data: unknown) => {
  const schema = z.object({ id: z.string().uuid() }).merge(updateMachineDocumentSchema);
  const parsed = schema.parse(data);
  try {
    const { id, ...updateData } = parsed;
    const document = await machineDocumentService.update(id, updateData);
    return { success: true, data: document };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update machine document',
    };
  }
};

export const deleteMachineDocument = async (data: unknown) => {
  const schema = z.object({ id: z.string().uuid() });
  const parsed = schema.parse(data);
  try {
    await machineDocumentService.delete(parsed.id);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete machine document',
    };
  }
};

export const getMachineDocumentsByMachineId = async (data: unknown) => {
  const schema = z.object({ machineId: z.string().uuid() });
  const parsed = schema.parse(data);
  try {
    const documents = await machineDocumentService.findByMachineId(parsed.machineId);
    return { success: true, data: documents };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch machine documents by machine',
    };
  }
};

export const getMachineDocumentsByType = async (data: unknown) => {
  const schema = z.object({ machineId: z.string().uuid(), tipo: z.string() });
  const parsed = schema.parse(data);
  try {
    const documents = await machineDocumentService.findByType(parsed.machineId, parsed.tipo);
    return { success: true, data: documents };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch machine documents by type',
    };
  }
};

// ============================================================================
// MACHINE PHOTOS
// ============================================================================

export const getMachinePhotos = async (data: unknown) => {
  const schema = z.object({ machineId: z.string().uuid().optional() });
  const parsed = schema.parse(data);
  try {
    const photos = await machinePhotoService.findAll(parsed.machineId);
    return { success: true, data: photos };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch machine photos',
    };
  }
};

export const getMachinePhotoById = async (data: unknown) => {
  const schema = z.object({ id: z.string().uuid() });
  const parsed = schema.parse(data);
  try {
    const photo = await machinePhotoService.findById(parsed.id);
    if (!photo) {
      return { success: false, error: 'Machine photo not found' };
    }
    return { success: true, data: photo };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch machine photo',
    };
  }
};

export const createMachinePhoto = async (data: unknown) => {
  const parsed = createMachinePhotoSchema.parse(data);
  try {
    const photo = await machinePhotoService.create(parsed);
    return { success: true, data: photo };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create machine photo',
    };
  }
};

export const updateMachinePhoto = async (data: unknown) => {
  const schema = z.object({ id: z.string().uuid() }).merge(updateMachinePhotoSchema);
  const parsed = schema.parse(data);
  try {
    const { id, ...updateData } = parsed;
    const photo = await machinePhotoService.update(id, updateData);
    return { success: true, data: photo };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update machine photo',
    };
  }
};

export const deleteMachinePhoto = async (data: unknown) => {
  const schema = z.object({ id: z.string().uuid() });
  const parsed = schema.parse(data);
  try {
    await machinePhotoService.delete(parsed.id);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete machine photo',
    };
  }
};

export const getMachinePhotosByMachineId = async (data: unknown) => {
  const schema = z.object({ machineId: z.string().uuid() });
  const parsed = schema.parse(data);
  try {
    const photos = await machinePhotoService.findByMachineId(parsed.machineId);
    return { success: true, data: photos };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch machine photos by machine',
    };
  }
};

export const getMachinePhotosByCategory = async (data: unknown) => {
  const schema = z.object({ machineId: z.string().uuid(), categoria: z.string() });
  const parsed = schema.parse(data);
  try {
    const photos = await machinePhotoService.findByCategory(parsed.machineId, parsed.categoria);
    return { success: true, data: photos };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch machine photos by category',
    };
  }
};

export const updateMachinePhotoOrder = async (data: unknown) => {
  const schema = z.object({ id: z.string().uuid(), ordem: z.number() });
  const parsed = schema.parse(data);
  try {
    const photo = await machinePhotoService.updateOrder(parsed.id, parsed.ordem);
    return { success: true, data: photo };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update machine photo order',
    };
  }
};

export const reorderMachinePhotos = async (data: unknown) => {
  const schema = z.object({ machineId: z.string().uuid(), photoIds: z.array(z.string().uuid()) });
  const parsed = schema.parse(data);
  try {
    await machinePhotoService.reorderPhotos(parsed.machineId, parsed.photoIds);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to reorder machine photos',
    };
  }
};

// ============================================================================
// PROCESS STEPS
// ============================================================================

export const getProcessSteps = async (data: unknown) => {
  const schema = z.object({ processId: z.string().uuid().optional() });
  const parsed = schema.parse(data);
  try {
    const steps = await processStepService.findAll(parsed.processId);
    return { success: true, data: steps };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch process steps',
    };
  }
};

export const getProcessStepById = async (data: unknown) => {
  const schema = z.object({ id: z.string().uuid() });
  const parsed = schema.parse(data);
  try {
    const step = await processStepService.findById(parsed.id);
    if (!step) {
      return { success: false, error: 'Process step not found' };
    }
    return { success: true, data: step };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch process step',
    };
  }
};

export const createProcessStep = async (data: unknown) => {
  const parsed = createProcessStepSchema.parse(data);
  try {
    const step = await processStepService.create(parsed);
    return { success: true, data: step };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create process step',
    };
  }
};

export const updateProcessStep = async (data: unknown) => {
  const schema = z.object({ id: z.string().uuid() }).merge(updateProcessStepSchema);
  const parsed = schema.parse(data);
  try {
    const { id, ...updateData } = parsed;
    const step = await processStepService.update(id, updateData);
    return { success: true, data: step };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update process step',
    };
  }
};

export const deleteProcessStep = async (data: unknown) => {
  const schema = z.object({ id: z.string().uuid() });
  const parsed = schema.parse(data);
  try {
    await processStepService.delete(parsed.id);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete process step',
    };
  }
};

export const getProcessStepsByProcessId = async (data: unknown) => {
  const schema = z.object({ processId: z.string().uuid() });
  const parsed = schema.parse(data);
  try {
    const steps = await processStepService.findByProcessId(parsed.processId);
    return { success: true, data: steps };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch process steps by process',
    };
  }
};

export const reorderProcessSteps = async (data: unknown) => {
  const schema = z.object({ processId: z.string().uuid(), stepIds: z.array(z.string().uuid()) });
  const parsed = schema.parse(data);
  try {
    await processStepService.reorderSteps(parsed.processId, parsed.stepIds);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to reorder process steps',
    };
  }
};

// ============================================================================
// PROCESS DOCUMENTS
// ============================================================================

export const getProcessDocuments = async (data: unknown) => {
  const schema = z.object({ processId: z.string().uuid().optional() });
  const parsed = schema.parse(data);
  try {
    const documents = await processDocumentService.findAll(parsed.processId);
    return { success: true, data: documents };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch process documents',
    };
  }
};

export const getProcessDocumentById = async (data: unknown) => {
  const schema = z.object({ id: z.string().uuid() });
  const parsed = schema.parse(data);
  try {
    const document = await processDocumentService.findById(parsed.id);
    if (!document) {
      return { success: false, error: 'Process document not found' };
    }
    return { success: true, data: document };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch process document',
    };
  }
};

export const createProcessDocument = async (data: unknown) => {
  const parsed = createProcessDocumentSchema.parse(data);
  try {
    const document = await processDocumentService.create(parsed);
    return { success: true, data: document };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create process document',
    };
  }
};

export const updateProcessDocument = async (data: unknown) => {
  const schema = z.object({ id: z.string().uuid() }).merge(updateProcessDocumentSchema);
  const parsed = schema.parse(data);
  try {
    const { id, ...updateData } = parsed;
    const document = await processDocumentService.update(id, updateData);
    return { success: true, data: document };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update process document',
    };
  }
};

export const deleteProcessDocument = async (data: unknown) => {
  const schema = z.object({ id: z.string().uuid() });
  const parsed = schema.parse(data);
  try {
    await processDocumentService.delete(parsed.id);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete process document',
    };
  }
};

export const getProcessDocumentsByProcessId = async (data: unknown) => {
  const schema = z.object({ processId: z.string().uuid() });
  const parsed = schema.parse(data);
  try {
    const documents = await processDocumentService.findByProcessId(parsed.processId);
    return { success: true, data: documents };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch process documents by process',
    };
  }
};

export const getProcessDocumentsByType = async (data: unknown) => {
  const schema = z.object({ processId: z.string().uuid(), tipo: z.string() });
  const parsed = schema.parse(data);
  try {
    const documents = await processDocumentService.findByType(parsed.processId, parsed.tipo);
    return { success: true, data: documents };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch process documents by type',
    };
  }
};

// ============================================================================
// TIMING MEASUREMENTS
// ============================================================================

export const getTimingMeasurements = async (data: unknown) => {
  const schema = z.object({ timingRecordId: z.string().uuid().optional() });
  const parsed = schema.parse(data);
  try {
    const measurements = await timingMeasurementService.findAll(parsed.timingRecordId);
    return { success: true, data: measurements };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch timing measurements',
    };
  }
};

export const getTimingMeasurementById = async (data: unknown) => {
  const schema = z.object({ id: z.string().uuid() });
  const parsed = schema.parse(data);
  try {
    const measurement = await timingMeasurementService.findById(parsed.id);
    if (!measurement) {
      return { success: false, error: 'Timing measurement not found' };
    }
    return { success: true, data: measurement };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch timing measurement',
    };
  }
};

export const createTimingMeasurement = async (data: unknown) => {
  const parsed = createTimingMeasurementSchema.parse(data);
  try {
    const measurement = await timingMeasurementService.create(parsed);
    return { success: true, data: measurement };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create timing measurement',
    };
  }
};

export const updateTimingMeasurement = async (data: unknown) => {
  const schema = z.object({ id: z.string().uuid() }).merge(updateTimingMeasurementSchema);
  const parsed = schema.parse(data);
  try {
    const { id, ...updateData } = parsed;
    const measurement = await timingMeasurementService.update(id, updateData);
    return { success: true, data: measurement };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update timing measurement',
    };
  }
};

export const deleteTimingMeasurement = async (data: unknown) => {
  const schema = z.object({ id: z.string().uuid() });
  const parsed = schema.parse(data);
  try {
    await timingMeasurementService.delete(parsed.id);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete timing measurement',
    };
  }
};

export const getTimingMeasurementsByTimingRecordId = async (data: unknown) => {
  const schema = z.object({ timingRecordId: z.string().uuid() });
  const parsed = schema.parse(data);
  try {
    const measurements = await timingMeasurementService.findByTimingRecordId(parsed.timingRecordId);
    return { success: true, data: measurements };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch timing measurements by timing record',
    };
  }
};

export const getTimingMeasurementsByMachineId = async (data: unknown) => {
  const schema = z.object({ machineId: z.string().uuid() });
  const parsed = schema.parse(data);
  try {
    const measurements = await timingMeasurementService.findByMachineId(parsed.machineId);
    return { success: true, data: measurements };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch timing measurements by machine',
    };
  }
};

export const getTimingMeasurementsByProcessId = async (data: unknown) => {
  const schema = z.object({ processId: z.string().uuid() });
  const parsed = schema.parse(data);
  try {
    const measurements = await timingMeasurementService.findByProcessId(parsed.processId);
    return { success: true, data: measurements };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch timing measurements by process',
    };
  }
};

export const calculateAverageTiming = async (data: unknown) => {
  const schema = z.object({ timingRecordId: z.string().uuid() });
  const parsed = schema.parse(data);
  try {
    const average = await timingMeasurementService.calculateAverage(parsed.timingRecordId);
    return { success: true, data: { average } };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to calculate average timing',
    };
  }
};

export const markTimingMeasurementAsInvalid = async (data: unknown) => {
  const schema = z.object({ id: z.string().uuid() });
  const parsed = schema.parse(data);
  try {
    const measurement = await timingMeasurementService.markAsInvalid(parsed.id);
    return { success: true, data: measurement };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to mark timing measurement as invalid',
    };
  }
};

export const markTimingMeasurementAsOutlier = async (data: unknown) => {
  const schema = z.object({ id: z.string().uuid() });
  const parsed = schema.parse(data);
  try {
    const measurement = await timingMeasurementService.markAsOutlier(parsed.id);
    return { success: true, data: measurement };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to mark timing measurement as outlier',
    };
  }
};

// ============================================================================
// CAPACITY HISTORY
// ============================================================================

export const getCapacityHistory = async (data: unknown) => {
  const schema = z.object({ capacityId: z.string().uuid().optional() });
  const parsed = schema.parse(data);
  try {
    const history = await capacityHistoryService.findAll(parsed.capacityId);
    return { success: true, data: history };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch capacity history',
    };
  }
};

export const getCapacityHistoryById = async (data: unknown) => {
  const schema = z.object({ id: z.string().uuid() });
  const parsed = schema.parse(data);
  try {
    const history = await capacityHistoryService.findById(parsed.id);
    if (!history) {
      return { success: false, error: 'Capacity history not found' };
    }
    return { success: true, data: history };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch capacity history',
    };
  }
};

export const createCapacityHistory = async (data: unknown) => {
  const parsed = createCapacityHistorySchema.parse(data);
  try {
    const history = await capacityHistoryService.create(parsed);
    return { success: true, data: history };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create capacity history',
    };
  }
};

export const updateCapacityHistory = async (data: unknown) => {
  const schema = z.object({ id: z.string().uuid() }).merge(updateCapacityHistorySchema);
  const parsed = schema.parse(data);
  try {
    const { id, ...updateData } = parsed;
    const history = await capacityHistoryService.update(id, updateData);
    return { success: true, data: history };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update capacity history',
    };
  }
};

export const deleteCapacityHistory = async (data: unknown) => {
  const schema = z.object({ id: z.string().uuid() });
  const parsed = schema.parse(data);
  try {
    await capacityHistoryService.delete(parsed.id);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete capacity history',
    };
  }
};

export const getCapacityHistoryByCapacityId = async (data: unknown) => {
  const schema = z.object({ capacityId: z.string().uuid() });
  const parsed = schema.parse(data);
  try {
    const history = await capacityHistoryService.findByCapacityId(parsed.capacityId);
    return { success: true, data: history };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch capacity history by capacity',
    };
  }
};

export const getCapacityHistoryByDateRange = async (data: unknown) => {
  const schema = z.object({ startDate: z.string(), endDate: z.string() });
  const parsed = schema.parse(data);
  try {
    const history = await capacityHistoryService.findByDateRange(parsed.startDate, parsed.endDate);
    return { success: true, data: history };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch capacity history by date range',
    };
  }
};

export const getCapacityHistoryByMachineId = async (data: unknown) => {
  const schema = z.object({ machineId: z.string().uuid() });
  const parsed = schema.parse(data);
  try {
    const history = await capacityHistoryService.findByMachineId(parsed.machineId);
    return { success: true, data: history };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch capacity history by machine',
    };
  }
};

export const calculateAverageEfficiency = async (data: unknown) => {
  const schema = z.object({ capacityId: z.string().uuid() });
  const parsed = schema.parse(data);
  try {
    const average = await capacityHistoryService.calculateAverageEfficiency(parsed.capacityId);
    return { success: true, data: { average } };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to calculate average efficiency',
    };
  }
};
