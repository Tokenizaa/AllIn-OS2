import { OptionRepository, ProductOptionValueRepository } from "../repositories/option.repository";
import { Option, CreateOptionDto, UpdateOptionDto, ProductOptionValue, CreateProductOptionValueDto } from "../dto/option.dto";

export class OptionService {
  private repository: OptionRepository;

  constructor() {
    this.repository = new OptionRepository();
  }

  async create(dto: CreateOptionDto): Promise<Option> {
    // Check if slug already exists
    const existing = await this.repository.findBySlug(dto.slug);
    if (existing) {
      throw new Error('Option with this slug already exists');
    }

    // Add IDs to option values
    const valuesWithIds = dto.values.map(v => ({
      ...v,
      id: crypto.randomUUID(),
    }));

    const option = await this.repository.create({
      ...dto,
      values: valuesWithIds,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    return option;
  }

  async findById(id: string): Promise<Option | null> {
    return await this.repository.findById(id);
  }

  async findBySlug(slug: string): Promise<Option | null> {
    return await this.repository.findBySlug(slug);
  }

  async findAll(): Promise<Option[]> {
    return await this.repository.findAll({});
  }

  async findByType(type: string): Promise<Option[]> {
    return await this.repository.findByType(type);
  }

  async findRequired(): Promise<Option[]> {
    return await this.repository.findRequired();
  }

  async update(id: string, dto: UpdateOptionDto): Promise<Option> {
    const option = await this.findById(id);
    if (!option) {
      throw new Error('Option not found');
    }

    // Check if new slug already exists (if slug is being changed)
    if (dto.slug && dto.slug !== option.slug) {
      const existing = await this.repository.findBySlug(dto.slug);
      if (existing) {
        throw new Error('Option with this slug already exists');
      }
    }

    // Preserve existing IDs for values if not provided
    let values = option.values;
    if (dto.values) {
      values = dto.values.map(v => ({
        ...v,
        id: v.id || crypto.randomUUID(),
      }));
    }

    return await this.repository.update(id, {
      ...dto,
      values,
      updated_at: new Date().toISOString(),
    });
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}

export class ProductOptionValueService {
  private repository: ProductOptionValueRepository;

  constructor() {
    this.repository = new ProductOptionValueRepository();
  }

  async create(dto: CreateProductOptionValueDto): Promise<ProductOptionValue> {
    const value = await this.repository.create({
      ...dto,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    return value;
  }

  async findById(id: string): Promise<ProductOptionValue | null> {
    return await this.repository.findById(id);
  }

  async findByProductId(productId: string): Promise<ProductOptionValue[]> {
    return await this.repository.findByProductId(productId);
  }

  async findByOptionId(optionId: string): Promise<ProductOptionValue[]> {
    return await this.repository.findByOptionId(optionId);
  }

  async findByProductAndOption(productId: string, optionId: string): Promise<ProductOptionValue[]> {
    return await this.repository.findByProductAndOption(productId, optionId);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async deleteByProductId(productId: string): Promise<void> {
    await this.repository.deleteByProductId(productId);
  }
}
