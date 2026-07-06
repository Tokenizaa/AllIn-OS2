import { BaseRepository } from "../../../infra/database/base.repository";
import { Option, CreateOptionDto, UpdateOptionDto, ProductOptionValue, CreateProductOptionValueDto } from "../dto/option.dto";

export class OptionRepository extends BaseRepository<Option> {
  constructor() {
    super("options");
  }

  async findBySlug(slug: string): Promise<Option | null> {
    const { data, error } = await this.getClient()
      .from(this.tableName)
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) throw error;
    return data;
  }

  async findByType(type: string): Promise<Option[]> {
    const { data, error } = await this.getClient()
      .from(this.tableName)
      .select("*")
      .eq("type", type)
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async findRequired(): Promise<Option[]> {
    const { data, error } = await this.getClient()
      .from(this.tableName)
      .select("*")
      .eq("is_required", true)
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return data || [];
  }
}

export class ProductOptionValueRepository extends BaseRepository<ProductOptionValue> {
  constructor() {
    super("product_option_values");
  }

  async findByProductId(productId: string): Promise<ProductOptionValue[]> {
    const { data, error } = await this.getClient()
      .from(this.tableName)
      .select("*")
      .eq("product_id", productId);

    if (error) throw error;
    return data || [];
  }

  async findByOptionId(optionId: string): Promise<ProductOptionValue[]> {
    const { data, error } = await this.getClient()
      .from(this.tableName)
      .select("*")
      .eq("option_id", optionId);

    if (error) throw error;
    return data || [];
  }

  async findByProductAndOption(productId: string, optionId: string): Promise<ProductOptionValue[]> {
    const { data, error } = await this.getClient()
      .from(this.tableName)
      .select("*")
      .eq("product_id", productId)
      .eq("option_id", optionId);

    if (error) throw error;
    return data || [];
  }

  async deleteByProductId(productId: string): Promise<void> {
    const { error } = await this.getClient()
      .from(this.tableName)
      .delete()
      .eq("product_id", productId);

    if (error) throw error;
  }
}
