import { z } from 'zod';
import {
  LocationService,
  MachineService,
  MaterialService,
  SupplierService,
  ProcessService,
  TimingService,
  CapacityService,
  ToolService,
  ProductIndustrialService,
  ComponentService,
  BOMService,
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
  createTimingRecordSchema,
  updateTimingRecordSchema,
  createCapacitySchema,
  updateCapacitySchema,
  createToolSchema,
  updateToolSchema,
  createProductIndustrialSchema,
  updateProductIndustrialSchema,
  createComponentSchema,
  updateComponentSchema,
  createBOMSchema,
  updateBOMSchema,
} from '../dto';

// Services
const locationService = new LocationService();
const machineService = new MachineService();
const materialService = new MaterialService();
const supplierService = new SupplierService();
const processService = new ProcessService();
const timingService = new TimingService();
const capacityService = new CapacityService();
const toolService = new ToolService();
const productIndustrialService = new ProductIndustrialService();
const componentService = new ComponentService();
const bomService = new BOMService();

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
