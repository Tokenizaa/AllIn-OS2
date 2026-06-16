import { BaseRepository } from "../../../infra/database/base.repository";
import { ProductKit, CreateProductKitDto, UpdateProductKitDto } from "../dto/product-kit.dto";

export class ProductKitRepository extends BaseRepository<ProductKit> {
  constructor() {
    super("product_kits");
  }

  async findBySlug(slug: string): Promise<ProductKit | null> {
    const { data, error } = await this.getClient()
      .from(this.tableName)
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) throw error;
    return data;
  }

  async findActive(): Promise<ProductKit[]> {
    const { data, error } = await this.getClient()
      .from(this.tableName)
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async findFeatured(): Promise<ProductKit[]> {
    const { data, error } = await this.getClient()
      .from(this.tableName)
      .select("*")
      .eq("is_featured", true)
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async findInStock(): Promise<ProductKit[]> {
    const { data, error } = await this.getClient()
      .from(this.tableName)
      .select("*")
      .gt("stock_quantity", 0)
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async updateStock(id: string, quantity: number): Promise<void> {
    const { error } = await this.getClient()
      .from(this.tableName)
      .update({ stock_quantity: quantity, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) throw error;
  }

  async decrementStock(id: string, quantity: number): Promise<void> {
    const kit = await this.findById(id);
    if (!kit) {
      throw new Error('Product kit not found');
    }

    const newStock = Math.max(0, kit.stock_quantity - quantity);
    await this.updateStock(id, newStock);
  }

  async incrementStock(id: string, quantity: number): Promise<void> {
    const kit = await this.findById(id);
    if (!kit) {
      throw new Error('Product kit not found');
    }

    const newStock = kit.stock_quantity + quantity;
    await this.updateStock(id, newStock);
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

  async setFeatured(id: string, featured: boolean): Promise<void> {
    const { error } = await this.getClient()
      .from(this.tableName)
      .update({ is_featured: featured, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) throw error;
  }
}
