import { BaseRepository } from "../../../infra/database/base.repository";
import { InfoPage, CreateInfoPageDto, UpdateInfoPageDto } from "../dto/info-page.dto";

export class InfoPageRepository extends BaseRepository<InfoPage> {
  constructor() {
    super("info_pages");
  }

  async findBySlug(slug: string): Promise<InfoPage | null> {
    const { data, error } = await this.getClient()
      .from(this.tableName)
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) throw error;
    return data;
  }

  async findPublished(): Promise<InfoPage[]> {
    const { data, error } = await this.getClient()
      .from(this.tableName)
      .select("*")
      .eq("is_published", true)
      .order("published_at", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async findByCategory(category: string): Promise<InfoPage[]> {
    const { data, error } = await this.getClient()
      .from(this.tableName)
      .select("*")
      .eq("category", category)
      .eq("is_published", true)
      .order("published_at", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async findByTag(tag: string): Promise<InfoPage[]> {
    const { data, error } = await this.getClient()
      .from(this.tableName)
      .select("*")
      .contains("tags", [tag])
      .eq("is_published", true)
      .order("published_at", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async findByAuthor(authorId: string): Promise<InfoPage[]> {
    const { data, error } = await this.getClient()
      .from(this.tableName)
      .select("*")
      .eq("author_id", authorId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async publish(id: string): Promise<void> {
    const { error } = await this.getClient()
      .from(this.tableName)
      .update({
        is_published: true,
        published_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) throw error;
  }

  async unpublish(id: string): Promise<void> {
    const { error } = await this.getClient()
      .from(this.tableName)
      .update({
        is_published: false,
        published_at: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) throw error;
  }
}
