import { ProductKitRepository } from "../repositories/product-kit.repository";
import { ProductKit, CreateProductKitDto, UpdateProductKitDto } from "../dto/product-kit.dto";

export class ProductKitService {
  private repository: ProductKitRepository;

  constructor() {
    this.repository = new ProductKitRepository();
  }

  async create(dto: CreateProductKitDto): Promise<ProductKit> {
    // Check if slug already exists
    const existing = await this.repository.findBySlug(dto.slug);
    if (existing) {
      throw new Error('Product kit with this slug already exists');
    }

    // Calculate total price and discounted price
    const totalPrice = dto.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discountAmount = totalPrice * (dto.discount_percentage / 100);
    const discountedPrice = totalPrice - discountAmount;

    const productKit = await this.repository.create({
      ...dto,
      total_price: totalPrice,
      discounted_price: discountedPrice,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    return productKit;
  }

  async findById(id: string): Promise<ProductKit | null> {
    return await this.repository.findById(id);
  }

  async findBySlug(slug: string): Promise<ProductKit | null> {
    return await this.repository.findBySlug(slug);
  }

  async findAll(): Promise<ProductKit[]> {
    return await this.repository.findAll({});
  }

  async findActive(): Promise<ProductKit[]> {
    return await this.repository.findActive();
  }

  async findFeatured(): Promise<ProductKit[]> {
    return await this.repository.findFeatured();
  }

  async findInStock(): Promise<ProductKit[]> {
    return await this.repository.findInStock();
  }

  async update(id: string, dto: UpdateProductKitDto): Promise<ProductKit> {
    const productKit = await this.findById(id);
    if (!productKit) {
      throw new Error('Product kit not found');
    }

    // Check if new slug already exists (if slug is being changed)
    if (dto.slug && dto.slug !== productKit.slug) {
      const existing = await this.repository.findBySlug(dto.slug);
      if (existing) {
        throw new Error('Product kit with this slug already exists');
      }
    }

    // Recalculate prices if items or discount changed
    let totalPrice = productKit.total_price;
    let discountedPrice = productKit.discounted_price;

    if (dto.items) {
      totalPrice = dto.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    const discountPercentage = dto.discount_percentage !== undefined ? dto.discount_percentage : productKit.discount_percentage;
    const discountAmount = totalPrice * (discountPercentage / 100);
    discountedPrice = totalPrice - discountAmount;

    return await this.repository.update(id, {
      ...dto,
      total_price: totalPrice,
      discounted_price: discountedPrice,
      updated_at: new Date().toISOString(),
    });
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async updateStock(id: string, quantity: number): Promise<void> {
    await this.repository.updateStock(id, quantity);
  }

  async decrementStock(id: string, quantity: number): Promise<void> {
    await this.repository.decrementStock(id, quantity);
  }

  async incrementStock(id: string, quantity: number): Promise<void> {
    await this.repository.incrementStock(id, quantity);
  }

  async activate(id: string): Promise<void> {
    await this.repository.activate(id);
  }

  async deactivate(id: string): Promise<void> {
    await this.repository.deactivate(id);
  }

  async setFeatured(id: string, featured: boolean): Promise<void> {
    await this.repository.setFeatured(id, featured);
  }
}
