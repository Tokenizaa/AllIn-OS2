import { BaseRepository } from "../../../infra/database/base.repository";
import { Manufacturer, CreateManufacturerDto, UpdateManufacturerDto } from "../dto/manufacturer.dto";

export class ManufacturerRepository extends BaseRepository<Manufacturer> {
  constructor() {
    super("fabricantes", "system");
  }

  async findBySlug(slug: string): Promise<Manufacturer | null> {
    const { data, error } = await this.getClient()
      .schema("system")
      .from(this.tableName)
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) throw error;
    return data;
  }

  async findActive(): Promise<Manufacturer[]> {
    const { data, error } = await this.getClient()
      .schema("system")
      .from(this.tableName)
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async findFeatured(): Promise<Manufacturer[]> {
    const { data, error } = await this.getClient()
      .schema("system")
      .from(this.tableName)
      .select("*")
      .eq("is_featured", true)
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async findByCountry(country: string): Promise<Manufacturer[]> {
    const { data, error } = await this.getClient()
      .schema("system")
      .from(this.tableName)
      .select("*")
      .eq("country", country)
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async activate(id: string): Promise<void> {
    const { error } = await this.getClient()
      .schema("system")
      .from(this.tableName)
      .update({ is_active: true, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) throw error;
  }

  async deactivate(id: string): Promise<void> {
    const { error } = await this.getClient()
      .schema("system")
      .from(this.tableName)
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) throw error;
  }

  async setFeatured(id: string, featured: boolean): Promise<void> {
    const { error } = await this.getClient()
      .schema("system")
      .from(this.tableName)
      .update({ is_featured: featured, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) throw error;
  }
}
