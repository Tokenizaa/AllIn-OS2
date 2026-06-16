import { DepartmentRepository } from "../repositories/department.repository";
import { Department, CreateDepartmentDto, UpdateDepartmentDto } from "../dto/department.dto";

export class DepartmentService {
  private repository: DepartmentRepository;

  constructor() {
    this.repository = new DepartmentRepository();
  }

  async create(dto: CreateDepartmentDto): Promise<Department> {
    // Check if slug already exists
    const existing = await this.repository.findBySlug(dto.slug);
    if (existing) {
      throw new Error('Department with this slug already exists');
    }

    const department = await this.repository.create({
      ...dto,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    return department;
  }

  async findById(id: string): Promise<Department | null> {
    return await this.repository.findById(id);
  }

  async findBySlug(slug: string): Promise<Department | null> {
    return await this.repository.findBySlug(slug);
  }

  async findAll(): Promise<Department[]> {
    return await this.repository.findAll({});
  }

  async findByParentId(parentId: string): Promise<Department[]> {
    return await this.repository.findByParentId(parentId);
  }

  async findActive(): Promise<Department[]> {
    return await this.repository.findActive();
  }

  async findRootDepartments(): Promise<Department[]> {
    return await this.repository.findRootDepartments();
  }

  async update(id: string, dto: UpdateDepartmentDto): Promise<Department> {
    const department = await this.findById(id);
    if (!department) {
      throw new Error('Department not found');
    }

    // Check if new slug already exists (if slug is being changed)
    if (dto.slug && dto.slug !== department.slug) {
      const existing = await this.repository.findBySlug(dto.slug);
      if (existing) {
        throw new Error('Department with this slug already exists');
      }
    }

    return await this.repository.update(id, {
      ...dto,
      updated_at: new Date().toISOString(),
    });
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async activate(id: string): Promise<void> {
    await this.repository.activate(id);
  }

  async deactivate(id: string): Promise<void> {
    await this.repository.deactivate(id);
  }
}
