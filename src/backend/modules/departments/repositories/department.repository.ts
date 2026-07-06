import { BaseRepository } from "../../../infra/database/base.repository";
import { Department, CreateDepartmentDto, UpdateDepartmentDto } from "../dto/department.dto";

export class DepartmentRepository extends BaseRepository<Department> {
  constructor() {
    super("departments");
  }

  async findBySlug(slug: string): Promise<Department | null> {
    const { data, error } = await this.getClient()
      .from(this.tableName)
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) throw error;
    return data;
  }

  async findByParentId(parentId: string): Promise<Department[]> {
    const { data, error } = await this.getClient()
      .from(this.tableName)
      .select("*")
      .eq("parent_id", parentId)
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async findActive(): Promise<Department[]> {
    const { data, error } = await this.getClient()
      .from(this.tableName)
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async findRootDepartments(): Promise<Department[]> {
    const { data, error } = await this.getClient()
      .from(this.tableName)
      .select("*")
      .is("parent_id", null)
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async activate(id: string): Promise<void> {
    const { error } = await this.getClient()
      .from(this.tableName)
      .update({ is_active: true, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) throw error;
  }

  async deactivate(id: string): Promise<void> {
    const { error } = await this.getClient()
      .from(this.tableName)
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) throw error;
  }
}
