/**
 * Website API
 * 
 * API endpoints para website/CMS.
 */

import { WebsiteService } from '../services/website.service';
import { Request, Response } from 'express';

export class WebsiteAPI {
  private service: WebsiteService;

  constructor() {
    this.service = new WebsiteService();
  }

  // Páginas

  /**
   * POST /api/cms/pages
   * Cria nova página
   */
  async createPage(req: Request, res: Response): Promise<void> {
    try {
      const page = await this.service.createPage(req.body);
      res.json(page);
    } catch (error) {
      console.error('Error creating page:', error);
      res.status(500).json({ error: 'Failed to create page' });
    }
  }

  /**
   * GET /api/cms/pages/:id
   * Busca página por ID
   */
  async getPageById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const idValue = Array.isArray(id) ? id[0] : id;
      const page = await this.service.findPageById(idValue);
      if (!page) {
        res.status(404).json({ error: 'Page not found' });
        return;
      }
      res.json(page);
    } catch (error) {
      console.error('Error fetching page:', error);
      res.status(500).json({ error: 'Failed to fetch page' });
    }
  }

  /**
   * GET /api/cms/pages/slug/:slug
   * Busca página por slug
   */
  async getPageBySlug(req: Request, res: Response): Promise<void> {
    try {
      const { slug } = req.params;
      const slugValue = Array.isArray(slug) ? slug[0] : slug;
      const page = await this.service.findPageBySlug(slugValue);
      if (!page) {
        res.status(404).json({ error: 'Page not found' });
        return;
      }
      res.json(page);
    } catch (error) {
      console.error('Error fetching page by slug:', error);
      res.status(500).json({ error: 'Failed to fetch page by slug' });
    }
  }

  /**
   * GET /api/cms/pages
   * Busca todas as páginas
   */
  async getAllPages(req: Request, res: Response): Promise<void> {
    try {
      const status = req.query.status as string;
      const pages = await this.service.findAllPages(status);
      res.json(pages);
    } catch (error) {
      console.error('Error fetching pages:', error);
      res.status(500).json({ error: 'Failed to fetch pages' });
    }
  }

  /**
   * PUT /api/cms/pages/:id
   * Atualiza página
   */
  async updatePage(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const idValue = Array.isArray(id) ? id[0] : id;
      const page = await this.service.updatePage(idValue, req.body);
      res.json(page);
    } catch (error) {
      console.error('Error updating page:', error);
      res.status(500).json({ error: 'Failed to update page' });
    }
  }

  /**
   * DELETE /api/cms/pages/:id
   * Deleta página
   */
  async deletePage(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const idValue = Array.isArray(id) ? id[0] : id;
      await this.service.deletePage(idValue);
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting page:', error);
      res.status(500).json({ error: 'Failed to delete page' });
    }
  }

  /**
   * POST /api/cms/pages/:id/publish
   * Publica página
   */
  async publishPage(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const idValue = Array.isArray(id) ? id[0] : id;
      const page = await this.service.publishPage(idValue);
      res.json(page);
    } catch (error) {
      console.error('Error publishing page:', error);
      res.status(500).json({ error: 'Failed to publish page' });
    }
  }

  /**
   * POST /api/cms/pages/:id/archive
   * Arquiva página
   */
  async archivePage(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const idValue = Array.isArray(id) ? id[0] : id;
      const page = await this.service.archivePage(idValue);
      res.json(page);
    } catch (error) {
      console.error('Error archiving page:', error);
      res.status(500).json({ error: 'Failed to archive page' });
    }
  }

  /**
   * POST /api/cms/pages/:id/unarchive
   * Desarquiva página
   */
  async unarchivePage(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const idValue = Array.isArray(id) ? id[0] : id;
      const page = await this.service.unarchivePage(idValue);
      res.json(page);
    } catch (error) {
      console.error('Error unarchiving page:', error);
      res.status(500).json({ error: 'Failed to unarchive page' });
    }
  }

  // Menus

  /**
   * POST /api/cms/menus
   * Cria novo menu
   */
  async createMenu(req: Request, res: Response): Promise<void> {
    try {
      const menu = await this.service.createMenu(req.body);
      res.json(menu);
    } catch (error) {
      console.error('Error creating menu:', error);
      res.status(500).json({ error: 'Failed to create menu' });
    }
  }

  /**
   * GET /api/cms/menus/:id
   * Busca menu por ID
   */
  async getMenuById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const idValue = Array.isArray(id) ? id[0] : id;
      const menu = await this.service.findMenuById(idValue);
      if (!menu) {
        res.status(404).json({ error: 'Menu not found' });
        return;
      }
      res.json(menu);
    } catch (error) {
      console.error('Error fetching menu:', error);
      res.status(500).json({ error: 'Failed to fetch menu' });
    }
  }

  /**
   * GET /api/cms/menus/slug/:slug
   * Busca menu por slug
   */
  async getMenuBySlug(req: Request, res: Response): Promise<void> {
    try {
      const { slug } = req.params;
      const slugValue = Array.isArray(slug) ? slug[0] : slug;
      const menu = await this.service.findMenuBySlug(slugValue);
      if (!menu) {
        res.status(404).json({ error: 'Menu not found' });
        return;
      }
      res.json(menu);
    } catch (error) {
      console.error('Error fetching menu by slug:', error);
      res.status(500).json({ error: 'Failed to fetch menu by slug' });
    }
  }

  /**
   * GET /api/cms/menus
   * Busca todos os menus
   */
  async getAllMenus(req: Request, res: Response): Promise<void> {
    try {
      const activeOnly = req.query.activeOnly === 'true';
      const menus = await this.service.findAllMenus(activeOnly);
      res.json(menus);
    } catch (error) {
      console.error('Error fetching menus:', error);
      res.status(500).json({ error: 'Failed to fetch menus' });
    }
  }

  /**
   * PUT /api/cms/menus/:id
   * Atualiza menu
   */
  async updateMenu(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const idValue = Array.isArray(id) ? id[0] : id;
      const menu = await this.service.updateMenu(idValue, req.body);
      res.json(menu);
    } catch (error) {
      console.error('Error updating menu:', error);
      res.status(500).json({ error: 'Failed to update menu' });
    }
  }

  /**
   * DELETE /api/cms/menus/:id
   * Deleta menu
   */
  async deleteMenu(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const idValue = Array.isArray(id) ? id[0] : id;
      await this.service.deleteMenu(idValue);
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting menu:', error);
      res.status(500).json({ error: 'Failed to delete menu' });
    }
  }

  /**
   * POST /api/cms/menus/:id/activate
   * Ativa menu
   */
  async activateMenu(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const idValue = Array.isArray(id) ? id[0] : id;
      const menu = await this.service.activateMenu(idValue);
      res.json(menu);
    } catch (error) {
      console.error('Error activating menu:', error);
      res.status(500).json({ error: 'Failed to activate menu' });
    }
  }

  /**
   * POST /api/cms/menus/:id/deactivate
   * Desativa menu
   */
  async deactivateMenu(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const idValue = Array.isArray(id) ? id[0] : id;
      const menu = await this.service.deactivateMenu(idValue);
      res.json(menu);
    } catch (error) {
      console.error('Error deactivating menu:', error);
      res.status(500).json({ error: 'Failed to deactivate menu' });
    }
  }

  // Configurações do Website

  /**
   * GET /api/cms/settings
   * Busca configurações atuais
   */
  async getSettings(req: Request, res: Response): Promise<void> {
    try {
      const settings = await this.service.getSettings();
      res.json(settings);
    } catch (error) {
      console.error('Error fetching website settings:', error);
      res.status(500).json({ error: 'Failed to fetch website settings' });
    }
  }

  /**
   * PUT /api/cms/settings
   * Atualiza configurações
   */
  async updateSettings(req: Request, res: Response): Promise<void> {
    try {
      const settings = await this.service.updateSettings(req.body);
      res.json(settings);
    } catch (error) {
      console.error('Error updating website settings:', error);
      res.status(500).json({ error: 'Failed to update website settings' });
    }
  }
}
