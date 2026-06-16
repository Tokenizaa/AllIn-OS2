import { DepartmentService } from "../services/department.service";
import { CreateDepartmentDto, UpdateDepartmentDto } from "../dto/department.dto";

export class DepartmentAPI {
  private service: DepartmentService;

  constructor() {
    this.service = new DepartmentService();
  }

  /**
   * POST /api/departments
   * Criar novo departamento
   */
  async create(body: any): Promise<{ data: any; error: string | null }> {
    try {
      const dto = body as CreateDepartmentDto;
      const department = await this.service.create(dto);
      return { data: department, error: null };
    } catch (error) {
      console.error('[DepartmentAPI] Error creating department:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * GET /api/departments/:id
   * Buscar departamento por ID
   */
  async findById(id: string): Promise<{ data: any; error: string | null }> {
    try {
      const department = await this.service.findById(id);
      if (!department) {
        return { data: null, error: 'Department not found' };
      }
      return { data: department, error: null };
    } catch (error) {
      console.error('[DepartmentAPI] Error finding department:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * GET /api/departments/slug/:slug
   * Buscar departamento por slug
   */
  async findBySlug(slug: string): Promise<{ data: any; error: string | null }> {
    try {
      const department = await this.service.findBySlug(slug);
      if (!department) {
        return { data: null, error: 'Department not found' };
      }
      return { data: department, error: null };
    } catch (error) {
      console.error('[DepartmentAPI] Error finding department by slug:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * GET /api/departments
   * Buscar todos os departamentos
   */
  async findAll(): Promise<{ data: any; error: string | null }> {
    try {
      const departments = await this.service.findAll();
      return { data: departments, error: null };
    } catch (error) {
      console.error('[DepartmentAPI] Error finding departments:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * GET /api/departments/parent/:parentId
   * Buscar departamentos por parent_id
   */
  async findByParentId(parentId: string): Promise<{ data: any; error: string | null }> {
    try {
      const departments = await this.service.findByParentId(parentId);
      return { data: departments, error: null };
    } catch (error) {
      console.error('[DepartmentAPI] Error finding departments by parent:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * GET /api/departments/active
   * Buscar departamentos ativos
   */
  async findActive(): Promise<{ data: any; error: string | null }> {
    try {
      const departments = await this.service.findActive();
      return { data: departments, error: null };
    } catch (error) {
      console.error('[DepartmentAPI] Error finding active departments:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * GET /api/departments/root
   * Buscar departamentos raiz
   */
  async findRootDepartments(): Promise<{ data: any; error: string | null }> {
    try {
      const departments = await this.service.findRootDepartments();
      return { data: departments, error: null };
    } catch (error) {
      console.error('[DepartmentAPI] Error finding root departments:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * PUT /api/departments/:id
   * Atualizar departamento
   */
  async update(id: string, body: any): Promise<{ data: any; error: string | null }> {
    try {
      const dto = body as UpdateDepartmentDto;
      const department = await this.service.update(id, dto);
      return { data: department, error: null };
    } catch (error) {
      console.error('[DepartmentAPI] Error updating department:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * DELETE /api/departments/:id
   * Deletar departamento
   */
  async delete(id: string): Promise<{ data: any; error: string | null }> {
    try {
      await this.service.delete(id);
      return { data: { success: true }, error: null };
    } catch (error) {
      console.error('[DepartmentAPI] Error deleting department:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * POST /api/departments/:id/activate
   * Ativar departamento
   */
  async activate(id: string): Promise<{ data: any; error: string | null }> {
    try {
      await this.service.activate(id);
      return { data: { success: true }, error: null };
    } catch (error) {
      console.error('[DepartmentAPI] Error activating department:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * POST /api/departments/:id/deactivate
   * Desativar departamento
   */
  async deactivate(id: string): Promise<{ data: any; error: string | null }> {
    try {
      await this.service.deactivate(id);
      return { data: { success: true }, error: null };
    } catch (error) {
      console.error('[DepartmentAPI] Error deactivating department:', error);
      return { data: null, error: (error as Error).message };
    }
  }
}
