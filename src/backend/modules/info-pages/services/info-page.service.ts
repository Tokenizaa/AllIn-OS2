import { InfoPageRepository } from "../repositories/info-page.repository";
import { InfoPage, CreateInfoPageDto, UpdateInfoPageDto } from "../dto/info-page.dto";

export class InfoPageService {
  private repository: InfoPageRepository;

  constructor() {
    this.repository = new InfoPageRepository();
  }

  async create(dto: CreateInfoPageDto): Promise<InfoPage> {
    // Check if slug already exists
    const existing = await this.repository.findBySlug(dto.slug);
    if (existing) {
      throw new Error('Info page with this slug already exists');
    }

    const infoPage = await this.repository.create({
      ...dto,
      published_at: dto.is_published ? new Date().toISOString() : null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    return infoPage;
  }

  async findById(id: string): Promise<InfoPage | null> {
    return await this.repository.findById(id);
  }

  async findBySlug(slug: string): Promise<InfoPage | null> {
    return await this.repository.findBySlug(slug);
  }

  async findAll(): Promise<InfoPage[]> {
    return await this.repository.findAll({});
  }

  async findPublished(): Promise<InfoPage[]> {
    return await this.repository.findPublished();
  }

  async findByCategory(category: string): Promise<InfoPage[]> {
    return await this.repository.findByCategory(category);
  }

  async findByTag(tag: string): Promise<InfoPage[]> {
    return await this.repository.findByTag(tag);
  }

  async findByAuthor(authorId: string): Promise<InfoPage[]> {
    return await this.repository.findByAuthor(authorId);
  }

  async update(id: string, dto: UpdateInfoPageDto): Promise<InfoPage> {
    const infoPage = await this.findById(id);
    if (!infoPage) {
      throw new Error('Info page not found');
    }

    // Check if new slug already exists (if slug is being changed)
    if (dto.slug && dto.slug !== infoPage.slug) {
      const existing = await this.repository.findBySlug(dto.slug);
      if (existing) {
        throw new Error('Info page with this slug already exists');
      }
    }

    // Handle publish/unpublish
    let publishedAt = infoPage.published_at;
    if (dto.is_published !== undefined) {
      if (dto.is_published && !infoPage.is_published) {
        publishedAt = new Date().toISOString();
      } else if (!dto.is_published) {
        publishedAt = null;
      }
    }

    return await this.repository.update(id, {
      ...dto,
      published_at: publishedAt,
      updated_at: new Date().toISOString(),
    });
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async publish(id: string): Promise<void> {
    await this.repository.publish(id);
  }

  async unpublish(id: string): Promise<void> {
    await this.repository.unpublish(id);
  }
}
