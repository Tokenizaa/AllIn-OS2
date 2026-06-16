import { AttributeRepository, ProductAttributeValueRepository } from "../repositories/attribute.repository";
import { Attribute, CreateAttributeDto, UpdateAttributeDto, ProductAttributeValue, CreateProductAttributeValueDto, UpdateProductAttributeValueDto } from "../dto/attribute.dto";

export class AttributeService {
  private repository: AttributeRepository;

  constructor() {
    this.repository = new AttributeRepository();
  }

  async create(dto: CreateAttributeDto): Promise<Attribute> {
    // Check if slug already exists
    const existing = await this.repository.findBySlug(dto.slug);
    if (existing) {
      throw new Error('Attribute with this slug already exists');
    }

    const attribute = await this.repository.create({
      ...dto,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    return attribute;
  }

  async findById(id: string): Promise<Attribute | null> {
    return await this.repository.findById(id);
  }

  async findBySlug(slug: string): Promise<Attribute | null> {
    return await this.repository.findBySlug(slug);
  }

  async findAll(): Promise<Attribute[]> {
    return await this.repository.findAll({});
  }

  async findByType(type: string): Promise<Attribute[]> {
    return await this.repository.findByType(type);
  }

  async findFilterable(): Promise<Attribute[]> {
    return await this.repository.findFilterable();
  }

  async findSearchable(): Promise<Attribute[]> {
    return await this.repository.findSearchable();
  }

  async findRequired(): Promise<Attribute[]> {
    return await this.repository.findRequired();
  }

  async update(id: string, dto: UpdateAttributeDto): Promise<Attribute> {
    const attribute = await this.findById(id);
    if (!attribute) {
      throw new Error('Attribute not found');
    }

    // Check if new slug already exists (if slug is being changed)
    if (dto.slug && dto.slug !== attribute.slug) {
      const existing = await this.repository.findBySlug(dto.slug);
      if (existing) {
        throw new Error('Attribute with this slug already exists');
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
}

export class ProductAttributeValueService {
  private repository: ProductAttributeValueRepository;

  constructor() {
    this.repository = new ProductAttributeValueRepository();
  }

  async create(dto: CreateProductAttributeValueDto): Promise<ProductAttributeValue> {
    const value = await this.repository.create({
      ...dto,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    return value;
  }

  async findById(id: string): Promise<ProductAttributeValue | null> {
    return await this.repository.findById(id);
  }

  async findByProductId(productId: string): Promise<ProductAttributeValue[]> {
    return await this.repository.findByProductId(productId);
  }

  async findByAttributeId(attributeId: string): Promise<ProductAttributeValue[]> {
    return await this.repository.findByAttributeId(attributeId);
  }

  async findByProductAndAttribute(productId: string, attributeId: string): Promise<ProductAttributeValue | null> {
    return await this.repository.findByProductAndAttribute(productId, attributeId);
  }

  async update(id: string, dto: UpdateProductAttributeValueDto): Promise<ProductAttributeValue> {
    return await this.repository.update(id, {
      ...dto,
      updated_at: new Date().toISOString(),
    });
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async upsert(productId: string, attributeId: string, value: any): Promise<ProductAttributeValue> {
    return await this.repository.upsert(productId, attributeId, value);
  }

  async deleteByProductId(productId: string): Promise<void> {
    await this.repository.deleteByProductId(productId);
  }
}
