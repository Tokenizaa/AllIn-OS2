/**
 * Website Repository
 * 
 * Repository para operações de database relacionadas a website/CMS.
 */

import { BaseRepository, BaseEntity } from '../../../shared/infrastructure/repository/base.repository';

export interface Page extends BaseEntity {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featured_image?: string;
  status: 'draft' | 'published' | 'archived';
  author_id: string;
  author_name: string;
  published_at?: Date;
  seo?: {
    meta_title?: string;
    meta_description?: string;
    meta_keywords?: string;
    og_title?: string;
    og_description?: string;
    og_image?: string;
  };
}

export class PageRepository extends BaseRepository<Page> {
  constructor() {
    super('pages', 'cms');
  }

  /**
   * Busca páginas publicadas
   */
  async findPublished(): Promise<Page[]> {
    return this.findAll({
      filters: { status: 'published' },
    });
  }

  /**
   * Busca páginas por status
   */
  async findByStatus(status: string): Promise<Page[]> {
    return this.findAll({
      filters: { status },
    });
  }

  /**
   * Busca por slug
   */
  async findBySlug(slug: string): Promise<Page[]> {
    return this.findAll({
      filters: { slug },
    });
  }

  /**
   * Busca por autor
   */
  async findByAuthor(authorId: string): Promise<Page[]> {
    return this.findAll({
      filters: { author_id: authorId },
    });
  }

  /**
   * Publica página
   */
  async publish(id: string): Promise<Page> {
    return this.update(id, {
      status: 'published',
      published_at: new Date(),
    });
  }

  /**
   * Arquiva página
   */
  async archive(id: string): Promise<Page> {
    return this.update(id, { status: 'archived' });
  }

  /**
   * Desarquiva página
   */
  async unarchive(id: string): Promise<Page> {
    return this.update(id, { status: 'draft' });
  }
}

export interface Menu extends BaseEntity {
  name: string;
  slug: string;
  items: MenuItem[];
  active: boolean;
}

export interface MenuItem {
  id: string;
  label: string;
  url?: string;
  page_id?: string;
  parent_id?: string;
  order: number;
  active: boolean;
}

export class MenuRepository extends BaseRepository<Menu> {
  constructor() {
    super('menus', 'cms');
  }

  /**
   * Busca menus ativos
   */
  async findActive(): Promise<Menu[]> {
    return this.findAll({
      filters: { active: true },
    });
  }

  /**
   * Busca por slug
   */
  async findBySlug(slug: string): Promise<Menu[]> {
    return this.findAll({
      filters: { slug },
    });
  }

  /**
   * Ativa menu
   */
  async activate(id: string): Promise<Menu> {
    return this.update(id, { active: true });
  }

  /**
   * Desativa menu
   */
  async deactivate(id: string): Promise<Menu> {
    return this.update(id, { active: false });
  }
}

export interface WebsiteSettings extends BaseEntity {
  site_name: string;
  site_tagline?: string;
  site_logo?: string;
  site_favicon?: string;
  site_description?: string;
  contact_email?: string;
  contact_phone?: string;
  contact_address?: string;
  social_links?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
  };
  seo?: {
    default_meta_title?: string;
    default_meta_description?: string;
    default_meta_keywords?: string;
  };
  analytics?: {
    google_analytics_id?: string;
    facebook_pixel_id?: string;
  };
}

export class WebsiteSettingsRepository extends BaseRepository<WebsiteSettings> {
  constructor() {
    super('website_settings', 'cms');
  }

  /**
   * Busca configurações atuais (assume apenas um registro)
   */
  async getCurrent(): Promise<WebsiteSettings | null> {
    const settings = await this.findAll({ limit: 1 });
    return settings[0] || null;
  }

  /**
   * Atualiza configurações
   */
  async updateSettings(id: string, settings: Partial<WebsiteSettings>): Promise<WebsiteSettings> {
    return this.update(id, settings);
  }
}
