import { InfoPageService } from "../services/info-page.service";
import { CreateInfoPageDto, UpdateInfoPageDto } from "../dto/info-page.dto";

export class InfoPageAPI {
  private service: InfoPageService;

  constructor() {
    this.service = new InfoPageService();
  }

  /**
   * POST /api/info-pages
   * Criar nova página de informação
   */
  async create(body: any): Promise<{ data: any; error: string | null }> {
    try {
      const dto = body as CreateInfoPageDto;
      const infoPage = await this.service.create(dto);
      return { data: infoPage, error: null };
    } catch (error) {
      console.error('[InfoPageAPI] Error creating info page:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * GET /api/info-pages/:id
   * Buscar página de informação por ID
   */
  async findById(id: string): Promise<{ data: any; error: string | null }> {
    try {
      const infoPage = await this.service.findById(id);
      if (!infoPage) {
        return { data: null, error: 'Info page not found' };
      }
      return { data: infoPage, error: null };
    } catch (error) {
      console.error('[InfoPageAPI] Error finding info page:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * GET /api/info-pages/slug/:slug
   * Buscar página de informação por slug
   */
  async findBySlug(slug: string): Promise<{ data: any; error: string | null }> {
    try {
      const infoPage = await this.service.findBySlug(slug);
      if (!infoPage) {
        return { data: null, error: 'Info page not found' };
      }
      return { data: infoPage, error: null };
    } catch (error) {
      console.error('[InfoPageAPI] Error finding info page by slug:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * GET /api/info-pages
   * Buscar todas as páginas de informação
   */
  async findAll(): Promise<{ data: any; error: string | null }> {
    try {
      const infoPages = await this.service.findAll();
      return { data: infoPages, error: null };
    } catch (error) {
      console.error('[InfoPageAPI] Error finding info pages:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * GET /api/info-pages/published
   * Buscar páginas de informação publicadas
   */
  async findPublished(): Promise<{ data: any; error: string | null }> {
    try {
      const infoPages = await this.service.findPublished();
      return { data: infoPages, error: null };
    } catch (error) {
      console.error('[InfoPageAPI] Error finding published info pages:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * GET /api/info-pages/category/:category
   * Buscar páginas de informação por categoria
   */
  async findByCategory(category: string): Promise<{ data: any; error: string | null }> {
    try {
      const infoPages = await this.service.findByCategory(category);
      return { data: infoPages, error: null };
    } catch (error) {
      console.error('[InfoPageAPI] Error finding info pages by category:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * GET /api/info-pages/tag/:tag
   * Buscar páginas de informação por tag
   */
  async findByTag(tag: string): Promise<{ data: any; error: string | null }> {
    try {
      const infoPages = await this.service.findByTag(tag);
      return { data: infoPages, error: null };
    } catch (error) {
      console.error('[InfoPageAPI] Error finding info pages by tag:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * GET /api/info-pages/author/:authorId
   * Buscar páginas de informação por autor
   */
  async findByAuthor(authorId: string): Promise<{ data: any; error: string | null }> {
    try {
      const infoPages = await this.service.findByAuthor(authorId);
      return { data: infoPages, error: null };
    } catch (error) {
      console.error('[InfoPageAPI] Error finding info pages by author:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * PUT /api/info-pages/:id
   * Atualizar página de informação
   */
  async update(id: string, body: any): Promise<{ data: any; error: string | null }> {
    try {
      const dto = body as UpdateInfoPageDto;
      const infoPage = await this.service.update(id, dto);
      return { data: infoPage, error: null };
    } catch (error) {
      console.error('[InfoPageAPI] Error updating info page:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * DELETE /api/info-pages/:id
   * Deletar página de informação
   */
  async delete(id: string): Promise<{ data: any; error: string | null }> {
    try {
      await this.service.delete(id);
      return { data: { success: true }, error: null };
    } catch (error) {
      console.error('[InfoPageAPI] Error deleting info page:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * POST /api/info-pages/:id/publish
   * Publicar página de informação
   */
  async publish(id: string): Promise<{ data: any; error: string | null }> {
    try {
      await this.service.publish(id);
      return { data: { success: true }, error: null };
    } catch (error) {
      console.error('[InfoPageAPI] Error publishing info page:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * POST /api/info-pages/:id/unpublish
   * Despublicar página de informação
   */
  async unpublish(id: string): Promise<{ data: any; error: string | null }> {
    try {
      await this.service.unpublish(id);
      return { data: { success: true }, error: null };
    } catch (error) {
      console.error('[InfoPageAPI] Error unpublishing info page:', error);
      return { data: null, error: (error as Error).message };
    }
  }
}
