import { ManufacturerRepository } from "../repositories/manufacturer.repository";
import { Manufacturer, CreateManufacturerDto, UpdateManufacturerDto } from "../dto/manufacturer.dto";

export class ManufacturerService {
  private repository: ManufacturerRepository;

  constructor() {
    this.repository = new ManufacturerRepository();
  }

  async create(dto: CreateManufacturerDto): Promise<Manufacturer> {
    // Check if slug already exists
    const existing = await this.repository.findBySlug(dto.slug);
    if (existing) {
      throw new Error('Manufacturer with this slug already exists');
    }

    const manufacturer = await this.repository.create({
      ...dto,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    return manufacturer;
  }

  async findById(id: string): Promise<Manufacturer | null> {
    return await this.repository.findById(id);
  }

  async findBySlug(slug: string): Promise<Manufacturer | null> {
    return await this.repository.findBySlug(slug);
  }

  async findAll(): Promise<Manufacturer[]> {
    return await this.repository.findAll({});
  }

  async findActive(): Promise<Manufacturer[]> {
    return await this.repository.findActive();
  }

  async findFeatured(): Promise<Manufacturer[]> {
    return await this.repository.findFeatured();
  }

  async findByCountry(country: string): Promise<Manufacturer[]> {
    return await this.repository.findByCountry(country);
  }

  async update(id: string, dto: UpdateManufacturerDto): Promise<Manufacturer> {
    const manufacturer = await this.findById(id);
    if (!manufacturer) {
      throw new Error('Manufacturer not found');
    }

    // Check if new slug already exists (if slug is being changed)
    if (dto.slug && dto.slug !== manufacturer.slug) {
      const existing = await this.repository.findBySlug(dto.slug);
      if (existing) {
        throw new Error('Manufacturer with this slug already exists');
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

  async setFeatured(id: string, featured: boolean): Promise<void> {
    await this.repository.setFeatured(id, featured);
  }
}
