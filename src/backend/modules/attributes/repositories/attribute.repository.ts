import { BaseRepository } from "../../../infra/database/base.repository";
import { Attribute, CreateAttributeDto, UpdateAttributeDto, ProductAttributeValue, CreateProductAttributeValueDto, UpdateProductAttributeValueDto } from "../dto/attribute.dto";

export class AttributeRepository extends BaseRepository<Attribute> {
  constructor() {
    super("attributes");
  }

  async findBySlug(slug: string): Promise<Attribute | null> {
    const { data, error } = await this.getClient()
      .from(this.tableName)
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) throw error;
    return data;
  }

  async findByType(type: string): Promise<Attribute[]> {
    const { data, error } = await this.getClient()
      .from(this.tableName)
      .select("*")
      .eq("type", type)
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async findFilterable(): Promise<Attribute[]> {
    const { data, error } = await this.getClient()
      .from(this.tableName)
      .select("*")
      .eq("is_filterable", true)
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async findSearchable(): Promise<Attribute[]> {
    const { data, error } = await this.getClient()
      .from(this.tableName)
      .select("*")
      .eq("is_searchable", true)
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async findRequired(): Promise<Attribute[]> {
    const { data, error } = await this.getClient()
      .from(this.tableName)
      .select("*")
      .eq("is_required", true)
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return data || [];
  }
}

export class ProductAttributeValueRepository extends BaseRepository<ProductAttributeValue> {
  constructor() {
    super("product_attribute_values");
  }

  async findByProductId(productId: string): Promise<ProductAttributeValue[]> {
    const { data, error } = await this.getClient()
      .from(this.tableName)
      .select("*")
      .eq("product_id", productId);

    if (error) throw error;
    return data || [];
  }

  async findByAttributeId(attributeId: string): Promise<ProductAttributeValue[]> {
    const { data, error } = await this.getClient()
      .from(this.tableName)
      .select("*")
      .eq("attribute_id", attributeId);

    if (error) throw error;
    return data || [];
  }

  async findByProductAndAttribute(productId: string, attributeId: string): Promise<ProductAttributeValue | null> {
    const { data, error } = await this.getClient()
      .from(this.tableName)
      .select("*")
      .eq("product_id", productId)
      .eq("attribute_id", attributeId)
      .single();

    if (error) throw error;
    return data;
  }

  async upsert(productId: string, attributeId: string, value: any): Promise<ProductAttributeValue> {
    const existing = await this.findByProductAndAttribute(productId, attributeId);

    if (existing) {
      return await this.update(existing.id, {
        value,
        updated_at: new Date().toISOString(),
      });
    } else {
      return await this.create({
        product_id: productId,
        attribute_id: attributeId,
        value,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }
  }

  async deleteByProductId(productId: string): Promise<void> {
    const { error } = await this.getClient()
      .from(this.tableName)
      .delete()
      .eq("product_id", productId);

    if (error) throw error;
  }
}
