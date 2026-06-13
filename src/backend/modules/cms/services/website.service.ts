/**
 * Website Service
 * 
 * Service para gerenciar website/CMS.
 */

import { PageRepository, MenuRepository, WebsiteSettingsRepository } from '../repositories/website.repository';
import {
  Page,
  CreatePageDTO,
  UpdatePageDTO,
  PageResponseDTO,
  Menu,
  CreateMenuDTO,
  UpdateMenuDTO,
  WebsiteSettings,
  UpdateWebsiteSettingsDTO,
} from '../dto/website.dto';

export class WebsiteService {
  private pageRepository: PageRepository;
  private menuRepository: MenuRepository;
  private settingsRepository: WebsiteSettingsRepository;

  constructor() {
    this.pageRepository = new PageRepository();
    this.menuRepository = new MenuRepository();
    this.settingsRepository = new WebsiteSettingsRepository();
  }

  // Páginas

  /**
   * Cria nova página
   */
  async createPage(dto: CreatePageDTO): Promise<Page> {
    // Verifica se o slug já existe
    const existingBySlug = await this.pageRepository.findBySlug(dto.slug);
    if (existingBySlug.length > 0) {
      throw new Error('Slug already in use');
    }

    return this.pageRepository.create({
      ...dto,
      status: dto.status ?? 'draft',
    });
  }

  /**
   * Busca página por ID
   */
  async findPageById(id: string): Promise<Page | null> {
    return this.pageRepository.findById(id);
  }

  /**
   * Busca página por slug
   */
  async findPageBySlug(slug: string): Promise<Page | null> {
    const pages = await this.pageRepository.findBySlug(slug);
    return pages[0] || null;
  }

  /**
   * Busca todas as páginas
   */
  async findAllPages(status?: string): Promise<Page[]> {
    if (status) {
      return this.pageRepository.findByStatus(status);
    }
    return this.pageRepository.findAll();
  }

  /**
   * Atualiza página
   */
  async updatePage(id: string, dto: UpdatePageDTO): Promise<Page> {
    const existing = await this.pageRepository.findById(id);
    if (!existing) {
      throw new Error('Page not found');
    }

    // Verifica se o novo slug já existe (se estiver sendo alterado)
    if (dto.slug && dto.slug !== existing.slug) {
      const existingBySlug = await this.pageRepository.findBySlug(dto.slug);
      if (existingBySlug.length > 0) {
        throw new Error('Slug already in use');
      }
    }

    return this.pageRepository.update(id, dto);
  }

  /**
   * Deleta página
   */
  async deletePage(id: string): Promise<void> {
    const existing = await this.pageRepository.findById(id);
    if (!existing) {
      throw new Error('Page not found');
    }

    await this.pageRepository.delete(id);
  }

  /**
   * Publica página
   */
  async publishPage(id: string): Promise<Page> {
    return this.pageRepository.publish(id);
  }

  /**
   * Arquiva página
   */
  async archivePage(id: string): Promise<Page> {
    return this.pageRepository.archive(id);
  }

  /**
   * Desarquiva página
   */
  async unarchivePage(id: string): Promise<Page> {
    return this.pageRepository.unarchive(id);
  }

  // Menus

  /**
   * Cria novo menu
   */
  async createMenu(dto: CreateMenuDTO): Promise<Menu> {
    // Verifica se o slug já existe
    const existingBySlug = await this.menuRepository.findBySlug(dto.slug);
    if (existingBySlug.length > 0) {
      throw new Error('Slug already in use');
    }

    return this.menuRepository.create({
      ...dto,
      active: dto.active ?? true,
    });
  }

  /**
   * Busca menu por ID
   */
  async findMenuById(id: string): Promise<Menu | null> {
    return this.menuRepository.findById(id);
  }

  /**
   * Busca menu por slug
   */
  async findMenuBySlug(slug: string): Promise<Menu | null> {
    const menus = await this.menuRepository.findBySlug(slug);
    return menus[0] || null;
  }

  /**
   * Busca todos os menus
   */
  async findAllMenus(activeOnly: boolean = true): Promise<Menu[]> {
    if (activeOnly) {
      return this.menuRepository.findActive();
    }
    return this.menuRepository.findAll();
  }

  /**
   * Atualiza menu
   */
  async updateMenu(id: string, dto: UpdateMenuDTO): Promise<Menu> {
    const existing = await this.menuRepository.findById(id);
    if (!existing) {
      throw new Error('Menu not found');
    }

    // Verifica se o novo slug já existe (se estiver sendo alterado)
    if (dto.slug && dto.slug !== existing.slug) {
      const existingBySlug = await this.menuRepository.findBySlug(dto.slug);
      if (existingBySlug.length > 0) {
        throw new Error('Slug already in use');
      }
    }

    return this.menuRepository.update(id, dto);
  }

  /**
   * Deleta menu
   */
  async deleteMenu(id: string): Promise<void> {
    const existing = await this.menuRepository.findById(id);
    if (!existing) {
      throw new Error('Menu not found');
    }

    await this.menuRepository.delete(id);
  }

  /**
   * Ativa menu
   */
  async activateMenu(id: string): Promise<Menu> {
    return this.menuRepository.activate(id);
  }

  /**
   * Desativa menu
   */
  async deactivateMenu(id: string): Promise<Menu> {
    return this.menuRepository.deactivate(id);
  }

  // Configurações do Website

  /**
   * Busca configurações atuais
   */
  async getSettings(): Promise<WebsiteSettings | null> {
    return this.settingsRepository.getCurrent();
  }

  /**
   * Atualiza configurações
   */
  async updateSettings(dto: UpdateWebsiteSettingsDTO): Promise<WebsiteSettings> {
    const current = await this.settingsRepository.getCurrent();
    
    if (!current) {
      // Cria configurações se não existirem
      return this.settingsRepository.create({
        site_name: dto.site_name || '',
        ...dto,
      });
    }

    return this.settingsRepository.updateSettings(current.id, dto);
  }

  /**
   * Converte página para DTO de resposta
   */
  toPageResponseDTO(page: Page): PageResponseDTO {
    return {
      id: page.id,
      title: page.title,
      slug: page.slug,
      content: page.content,
      excerpt: page.excerpt,
      featured_image: page.featured_image,
      status: page.status,
      author_id: page.author_id,
      author_name: page.author_name,
      published_at: page.published_at,
      seo: page.seo,
      created_at: page.created_at,
      updated_at: page.updated_at,
    };
  }
}
