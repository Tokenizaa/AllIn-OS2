/**
 * Departments Module Index
 * 
 * Exporta todos os componentes do módulo de departamentos.
 */

export { DepartmentRepository } from './repositories/department.repository';

export { DepartmentService } from './services/department.service';

export { DepartmentAPI } from './api/department.api';

export type {
  Department,
  CreateDepartmentDto,
  UpdateDepartmentDto,
} from './dto/department.dto';
